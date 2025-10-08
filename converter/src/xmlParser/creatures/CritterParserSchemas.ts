// import { standardCalculationEnum } from "@neon-codex/common/build/enums.js";

import { type } from "arktype";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
  XmlPowerSchema,
  XmlQualityListSchema,
  attributeXMLEnum,
} from "../common/ParserCommonDefines.js";
import {
  critterTypeEnum,
  matrixAttributeEnum,
  skillCategoryEnum,
} from "@neon-codex/common/build/enums.js";

const SkillSchema = type({
  "+": "reject",
  "_spec?": "string",
  _rating: "string",
  "_select?": "string",
  xmltext: "string",
});
const GroupSchema = type({
  "+": "reject",
  _rating: "string",
  xmltext: "string",
});
const SkillListSchema = type({
  "+": "reject",
  skill: SkillSchema.array(),
  "group?": type.or(GroupSchema, GroupSchema.array()),
  "knowledge?": type({
    "+": "reject",
    _rating: "string",
    _category: type.valueOf(skillCategoryEnum),
    _attribute: type.valueOf(attributeXMLEnum),
    xmltext: "string",
  }),
});
const CritterIncludedBiowareSchema = type.or(
  "string",
  type({
    "+": "reject",
    _rating: "string",
    xmltext: "string",
  })
);
const CritterIncludedBiowareListSchema = type(
  CritterIncludedBiowareSchema.array()
);
export type CritterIncludedBiowareListType =
  typeof CritterIncludedBiowareListSchema.infer;

const CritterIncludedComplexFormSchema = type.or(
  "string",
  type({
    "+": "reject",
    _select: type.valueOf(matrixAttributeEnum),
    xmltext: "string",
  })
);
const CritterIncludedComplexFormListSchema = type(
  CritterIncludedComplexFormSchema.array()
);
export type CritterIncludedComplexFormType =
  typeof CritterIncludedComplexFormListSchema.infer;

const SubCritterXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  "karma?": "0",
  // Attributes, critter have min, max, aug as physical critters
  // can have a range of min +/-3 (for some reason only +3 is given for max
  // there is no -3, min is just the standard)
  // Body
  bodmin: StringOrNumberSchema,
  bodmax: StringOrNumberSchema,
  bodaug: StringOrNumberSchema,
  // Agility
  agimin: StringOrNumberSchema,
  agimax: StringOrNumberSchema,
  agiaug: StringOrNumberSchema,
  // Reaction
  reamin: StringOrNumberSchema,
  reamax: StringOrNumberSchema,
  reaaug: StringOrNumberSchema,
  // Strength
  strmin: StringOrNumberSchema,
  strmax: StringOrNumberSchema,
  straug: StringOrNumberSchema,
  // Charisma
  chamin: StringOrNumberSchema,
  chamax: StringOrNumberSchema,
  chaaug: StringOrNumberSchema,
  // Intuition
  intmin: StringOrNumberSchema,
  intmax: StringOrNumberSchema,
  intaug: StringOrNumberSchema,
  // Logic
  logmin: StringOrNumberSchema,
  logmax: StringOrNumberSchema,
  logaug: StringOrNumberSchema,
  // Willpower
  wilmin: StringOrNumberSchema,
  wilmax: StringOrNumberSchema,
  wilaug: StringOrNumberSchema,
  // Initiative
  "inimin?": StringOrNumberSchema,
  "inimax?": StringOrNumberSchema,
  "iniaug?": StringOrNumberSchema,
  // Edge
  edgmin: StringOrNumberSchema,
  edgmax: StringOrNumberSchema,
  edgaug: StringOrNumberSchema,
  // Magic
  "magmin?": StringOrNumberSchema,
  "magmax?": StringOrNumberSchema,
  "magaug?": StringOrNumberSchema,
  // Resonance
  "resmin?": StringOrNumberSchema,
  "resmax?": StringOrNumberSchema,
  "resaug?": StringOrNumberSchema,
  // Depth
  "depmin?": StringOrNumberSchema,
  "depmax?": StringOrNumberSchema,
  "depaug?": StringOrNumberSchema,
  // Essence
  essmin: StringOrNumberSchema,
  essmax: StringOrNumberSchema,
  essaug: StringOrNumberSchema,
  // Doesn't have normal movement e.g. An AI program doesn't have a physical body
  "movement?": "'Special'",
  // Movement speeds
  // Formatted like: Ground/Water/Air speed
  "walk?": "string",
  "run?": "string",
  "sprint?": "string",
  // Sprite or Spirit that uses force to determine attributes
  "forcecreature?": "''",
  // Creature is Sprite, force means level for this purpose
  "forceislevels?": "''",
  // Included qualities
  "qualities?": XmlQualityListSchema,
  // Included Powers
  "powers?": type({
    "+": "reject",
    power: type.or(XmlPowerSchema, XmlPowerSchema.array()),
  }),

  // Choose one optional power per every 3 points of force in summoning
  "optionalpowers?": type({
    "+": "reject",
    optionalpower: type.or(XmlPowerSchema, XmlPowerSchema.array()),
    "_count?": "string",
  }),

  // Included Biowares
  "biowares?": type({
    "+": "reject",
    bioware: type.or(
      CritterIncludedBiowareSchema,
      CritterIncludedBiowareSchema.array()
    ),
  }),

  // Technocritters have complex forms
  "complexforms?": type({
    "+": "reject",
    complexform: type.or(
      CritterIncludedComplexFormSchema,
      CritterIncludedComplexFormSchema.array()
    ),
  }),
  // Non-defaulting skills
  skills: SkillListSchema,
  // Armour from armour power, H means hardened armour
  "armor?": StringOrNumberSchema,
  // Bonuses
  "bonus?": BonusXmlSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
const CritterXmlSchema = SubCritterXmlSchema.merge({
  category: type.valueOf(critterTypeEnum),
  // subcritter types (used for insect spirits)
  "metavariants?": type({
    "+": "reject",
    metavariant: SubCritterXmlSchema.array(),
  }),
});
export type CritterXmlType = typeof CritterXmlSchema.infer;

export const CritterListXmlSchema = type(CritterXmlSchema.array());
export type CritterListXmlType = typeof CritterListXmlSchema.infer;
