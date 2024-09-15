// import { standardCalculationEnum } from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  SpellPowerXmlRangeSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

export enum spellXmlCategoryEnum {
  Combat = "Combat",
  Detection = "Detection",
  Health = "Health",
  Illusion = "Illusion",
  Manipulation = "Manipulation",
  Enchantments = "Enchantments",
  Rituals = "Rituals",
}

const SpellXmlDamageSchema = zod.union([
  zod.literal("P"), // Physical
  zod.literal("S"), // Stun
  zod.literal(0),
  zod.literal("Special"),
]);
export type SpellXmlDamageType = zod.infer<typeof SpellXmlDamageSchema>;

const SpellXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category
    category: zod.nativeEnum(spellXmlCategoryEnum),
    // Damage Type
    damage: SpellXmlDamageSchema,
    // List of descriptors (don't think these are used for anything?)
    descriptor: zod.string(),
    // Duration spell lasts/casting time
    duration: XmlDurationSchema,
    // Damage value
    dv: zod.string(),
    // Spell targets + states if AOE
    range: SpellPowerXmlRangeSchema,
    // Physical or Mana
    type: zod.union([zod.literal("P"), zod.literal("M")]),
    // Bonus (these are specific choices to select when adding when)
    // e.g. summoning spell chooses what you summon
    bonus: zod.optional(BonusXmlSchema),
    // Requirements e.g. type of spellcaster
    required: zod.optional(RequiredXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type SpellXmlType = zod.infer<typeof SpellXmlSchema>;
export const SpellListXmlSchema = zod.array(SpellXmlSchema);
export type SpellListXmlType = zod.infer<typeof SpellListXmlSchema>;
