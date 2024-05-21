// import { standardCalculationEnum } from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import {
  SourceXmlSchema,
  SpellPowerXmlRangeSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import {
  actionEnum,
  critterPowerEnum,
} from "@neon-codex/common/build/enums.js";
import {
  RequiredXmlSchema,
  type RequiredXmlType,
} from "../common/RequiredParserSchemas.js";
import {
  BonusXmlSchema,
  type BonusXmlType,
} from "../common/BonusParserSchemas.js";

const CritterPowerSubXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.nativeEnum(critterPowerEnum),
    karma: zod.optional(zod.union([zod.number(), zod.literal("")])),
    rating: zod.optional(
      zod.union([
        // Rating has to be passed in from Critter
        zod.literal("True"),
        // Max Rating
        zod.number(),
      ])
    ),
    // Physical or Mana
    type: zod.union([
      zod.literal("P"),
      zod.literal("M"),
      zod.literal("As Spell"),
      zod.literal("As ritual"),
      zod.literal("Device"),
      zod.literal("Host"),
      zod.literal("File"),
      zod.literal("Persona"),
      zod.literal("Persona or Device"),
      zod.literal("Icon"),
      zod.literal(""),
    ]),
    action: zod.union([
      zod.nativeEnum(actionEnum),
      // In the book but should have been auto
      zod.literal("None"),
      zod.literal("As ritual"),
      zod.literal(""),
    ]),
    // Spell targets + states if AOE
    range: zod.union([
      SpellPowerXmlRangeSchema,
      zod.literal("Per Spell"),
      zod.literal("As ritual"),
      zod.literal("MAG"),
      zod.literal("MAG x 50"),
      zod.literal("MAG x 25 m"),
      zod.literal(""),
    ]),
    // Duration spell lasts/casting time
    duration: zod.union([
      XmlDurationSchema,
      zod.literal("Per Spell"),
      zod.literal("As ritual"),
      zod.literal("Predetermined by Sprite"),
      zod.literal("F x 10 Combat Turns"),
      zod.literal(""),
    ]),
    hide: zod.optional(zod.literal("")),
    required: zod.optional(RequiredXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
type CritterPowerSubXmlType = zod.infer<typeof CritterPowerSubXmlSchema>;

// Need to split up type/annotate schema to avoid TS7056 error
export type CritterPowerXmlType = CritterPowerSubXmlType & {
  bonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
  forbidden?: RequiredXmlType | undefined;
};
const CritterPowerXmlSchema: zod.ZodSchema<CritterPowerXmlType> =
  CritterPowerSubXmlSchema.extend({
    // Bonus (these are specific choices to select when adding when)
    // e.g. summoning spell chooses what you summon
    bonus: zod.optional(BonusXmlSchema),
    // Requirements e.g. type of spellcaster
    required: zod.optional(RequiredXmlSchema),
    forbidden: zod.optional(RequiredXmlSchema),
  });

export const CritterPowerListXmlSchema = zod.array(CritterPowerXmlSchema);
export type CritterPowerListXmlType = zod.infer<
  typeof CritterPowerListXmlSchema
>;
