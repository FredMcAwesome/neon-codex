// import { standardCalculationEnum } from "@shadowrun/common/build/enums.js";
import { metamagicArtEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import {
  BonusXmlSchema,
  SourceXmlSchema,
  StringArrayOrStringSchema,
} from "../common/ParserCommonDefines.js";

export enum spellXmlCategoryEnum {
  Combat = "Combat",
  Detection = "Detection",
  Health = "Health",
  Illusion = "Illusion",
  Manipulation = "Manipulation",
  Enchantments = "Enchantments",
  Rituals = "Rituals",
}

const RequiredSubtypeSchema = zod
  .object({
    quality: zod.optional(StringArrayOrStringSchema),
    group: zod.optional(
      zod
        .object({
          initiategrade: zod.number(),
          tradition: zod.string(),
        })
        .strict()
    ),
    metamagic: zod.optional(zod.string()),
    metamagicart: zod.optional(zod.nativeEnum(metamagicArtEnum)),
    spell: zod.optional(zod.string()),
  })
  .strict();

export type RequiredSubtypeType = zod.infer<typeof RequiredSubtypeSchema>;

const SpellXmlDamageSchema = zod.union([
  zod.literal("P"), // Physical
  zod.literal("S"), // Stun
  zod.literal(0),
  zod.literal("Special"),
]);
export type SpellXmlDamageType = zod.infer<typeof SpellXmlDamageSchema>;

const SpellXmlRangeSchema = zod.union([
  zod.literal("LOS"), // Line Of Sight
  zod.literal("LOS (A)"), // LOS (Area)
  zod.literal("T"), // Touch
  zod.literal("T (A)"), // Touch (Area)? How does this work?
  zod.literal("S"), // Self
  zod.literal("S (A)"), // Self (Area) - originate from self
  zod.literal("Special"),
]);

export type SpellXmlRangeType = zod.infer<typeof SpellXmlRangeSchema>;

const SpellXmlDurationSchema = zod.union([
  zod.literal("I"),
  zod.literal("S"),
  zod.literal("P"),
  zod.literal("Special"),
]);
export type SpellXmlDurationType = zod.infer<typeof SpellXmlDurationSchema>;

const SpellXmlRequiredSchema = zod
  .object({
    allof: zod.optional(RequiredSubtypeSchema),
    oneof: zod.optional(RequiredSubtypeSchema),
  })
  .strict();
export type SpellXmlRequiredType = zod.infer<typeof SpellXmlRequiredSchema>;

const SpellXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.nativeEnum(spellXmlCategoryEnum),
    // damageType
    damage: SpellXmlDamageSchema,
    // list of descriptors (don't think these are used for anything?)
    descriptor: zod.string(),
    // duration spell lasts/casting time
    duration: SpellXmlDurationSchema,
    // damage value
    dv: zod.string(),
    // spell targets + if AOE
    range: SpellXmlRangeSchema,
    // Physical or Mana
    type: zod.union([zod.literal("P"), zod.literal("M")]),
    bonus: zod.optional(BonusXmlSchema),
    required: zod.optional(SpellXmlRequiredSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type SpellXmlType = zod.infer<typeof SpellXmlSchema>;
export const SpellListXmlSchema = zod.array(SpellXmlSchema);
export type SpellListXmlType = zod.infer<typeof SpellListXmlSchema>;
