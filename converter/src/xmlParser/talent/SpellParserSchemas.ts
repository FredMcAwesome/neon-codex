// import { standardCalculationEnum } from "@neon-codex/common";

import { type } from "arktype";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  SpellPowerXmlRangeSchema,
  spellXmlCategoryEnum,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

const SpellXmlDamageSchema = type.or(
  "'P'", // Physical
  "'S'", // Stun
  "0",
  "'Special'"
);
export type SpellXmlDamageType = typeof SpellXmlDamageSchema.infer;

const SpellXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Category
  category: type.valueOf(spellXmlCategoryEnum),
  // Damage Type
  damage: SpellXmlDamageSchema,
  // List of descriptors (don't think these are used for anything?)
  descriptor: "string",
  // Duration spell lasts/casting time
  duration: XmlDurationSchema,
  // Damage value
  dv: type.or("string", "number"),
  // Spell targets + states if AOE
  range: SpellPowerXmlRangeSchema,
  // Physical or Mana
  type: type.or("'P'", "'M'"),
  // Bonus (these are specific choices to select when adding when)
  // e.g. summoning spell chooses what you summon
  "bonus?": BonusXmlSchema,
  // Requirements e.g. type of spellcaster
  "required?": RequiredXmlSchema,
  // Use a skill instead of spellcasting attribute
  "useskill?": "string",
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type SpellXmlType = typeof SpellXmlSchema.infer;
export const SpellListXmlSchema = type(SpellXmlSchema.array());
export type SpellListXmlType = typeof SpellListXmlSchema.infer;
