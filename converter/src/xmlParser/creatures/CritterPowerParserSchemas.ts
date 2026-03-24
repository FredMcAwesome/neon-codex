// import { standardCalculationEnum } from "@neon-codex/common";

import {
  SourceXmlSchema,
  SpellPowerXmlRangeSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { actionEnum, critterPowerCategoryEnum } from "@neon-codex/common";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { type } from "arktype";

const CritterPowerXmlSchema = type({
  "+": "reject",
  id: "string",
  name: type.or(
    "string",
    type({
      xmltext: "string",
      _select: "string",
    })
  ),
  category: type.valueOf(critterPowerCategoryEnum),
  // unused field - was used for tracking powers for toxic critters
  "toxic?": "'True'",
  // karma cost for adding this power
  "karma?": type.or("number", "''"),
  "rating?": type.or(
    // Rating has to be passed in from Critter
    "'True'",
    // Max Rating
    "number"
  ),
  // Physical or Mana
  type: type.or(
    "'P'",
    "'M'",
    "'As Spell'",
    "'As ritual'",
    "'Device'",
    "'Host'",
    "'File'",
    "'Persona'",
    "'Persona or Device'",
    "'Icon'",
    "''"
  ),
  action: type.or(
    type.valueOf(actionEnum),
    // In the book but should have been auto
    "'None'",
    "'As ritual'",
    "''"
  ),
  // Spell targets + states if AOE
  range: type.or(
    SpellPowerXmlRangeSchema,
    "'Per Spell'",
    "'As ritual'",
    "'MAG'",
    "'MAG x 50'",
    "'MAG x 25 m'",
    "''"
  ),
  // Duration spell lasts/casting time
  duration: type.or(
    XmlDurationSchema,
    "'Per Spell'",
    "'As ritual'",
    "'Predetermined by Sprite'",
    "'F x 10 Combat Turns'",
    "''"
  ),
  "hide?": "''",
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
  // Bonus (these are specific choices to select when adding when)
  // e.g. summoning spell chooses what you summon
  "bonus?": BonusXmlSchema,
  // Requirements e.g. type of spellcaster
  "required?": RequiredXmlSchema,
  "forbidden?": RequiredXmlSchema,
  // Pretty much just the description... We will ignore this one
  "notes?": "string",
});
export type CritterPowerXmlType = typeof CritterPowerXmlSchema.infer;

export const CritterPowerListXmlSchema = type(CritterPowerXmlSchema.array());
export type CritterPowerListXmlType = typeof CritterPowerListXmlSchema;
