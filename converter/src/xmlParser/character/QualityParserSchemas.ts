import {
  mathOperatorEnum,
  qualityCategoryEnum,
  standardCalculationEnum,
} from "@neon-codex/common/build/enums.js";
import {
  BonusXmlSchema,
  type BonusXmlType,
} from "../common/BonusParserSchemas.js";
import {
  RequiredXmlSchema,
  type RequiredXmlType,
} from "../common/RequiredParserSchemas.js";
import {
  NaturalWeaponSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { type } from "arktype";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const QualitySubBonusXmlSchema = type({
  id: "string",
  name: "string",
  // Category of quality
  category: type.valueOf(qualityCategoryEnum),
  // Karma cost to aquire (negative for negative qualities)
  karma: "number",
  // Only able to gain this quality at character creation
  "chargenonly?": "''",
  // How many times can be taken at chargen
  "chargenlimit?": "number",
  // Does not contribute to the Positive/Negative Karma limit
  // at Character Creation, these only have a karma cost
  // when using the point buy chargen system
  "contributetolimit?": "'False'",
  // Can't be taken at chargen
  "careeronly?": "''",
  // prevents quality costing double if bought after chargen
  "doublecareer?": "'False'",
  // The limit (or lackthere of) to the number of times
  // this quality can be taken
  "limit?": StringOrNumberSchema,
  // Other qualities that count to this quality's limit
  "includeinlimit?": {
    name: StringArrayOrStringSchema,
  },
  // The number of times the quality can be taken when
  // including all includeinlimit qualities, the limit
  // in this case only refers to the current quality
  // This requires includeinlimit to be defined
  "limitwithinclusions?": "number",
  // If using priority/sum to ten these can only be selected
  // through the table, not as a quality later
  "onlyprioritygiven?": "''",
  // Different name on the book page
  "nameonpage?": "string",
  // If requirement is met get the set value discoutt
  "costdiscount?": {
    required: RequiredXmlSchema,
    value: "number",
  },
  // Each time this quality is selected it gives a non-stacking
  // bonus, e.g. restrictedgear allows a different gear to be
  // selected each time
  "nolevels?": "''",
  // Bonus is only applied the first time this quality is taken
  "firstlevelbonus?": type.or(
    {
      // Increase to Notoriety level
      notoriety: "number",
    },
    {
      // prevents attribute maximum/s from being increased
      attributemaxclamp: StringArrayOrStringSchema,
    }
  ),
  // Add custom natural weapons
  // Chummer doesn't want them as weapons, I do
  "naturalweapons?": {
    naturalweapon: type.or(NaturalWeaponSchema, NaturalWeaponSchema.array()),
  },
  // Add weapon
  "addweapon?": StringArrayOrStringSchema,
  // This is a metagenic quality, only matters if another
  // quality gives a metageniclimit (in bonus)
  "metagenic?": "'True'",
  // Presumably this is not fully implemented in chummer?
  // TODO: implement these in chummer
  "implemented?": "string",
  // Unsure if this is needed, don't we always refund?
  // Only used for Latent Dracomorphosis
  "refundkarmaonremove?": "''",
  // Unsure what this does, only used for dracoforms
  "stagedpurchase?": "'True'",
  // Spell points are described in FA pg 31, it essentially
  // allows spells to be transferred to karma, chummer calls
  // this karma spell points
  "canbuywithspellpoints?": "'True'",
  // Karma used to be called Build Points (BP) in previous editions
  // In this case it means you don't get the karma bonus if
  // bought during chargen, in career mode you still get it though
  "contributetobp?": "'False'",
  // Not selectable
  "hide?": "''",
  source: "string",
  page: "number",
});
type QualitySubBonusXmlType = typeof QualitySubBonusXmlSchema.infer;

// Need to split up type/annotate schema to avoid TS7056 error
export type QualityXmlType = QualitySubBonusXmlType & {
  bonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
  forbidden?: RequiredXmlType | undefined;
};
const QualityXmlSchema = QualitySubBonusXmlSchema.and({
  // Bonus applied by Cyberware
  "bonus?": BonusXmlSchema,
  // Required
  "required?": RequiredXmlSchema,
  // Forbidden
  "forbidden?": RequiredXmlSchema,
});

export const QualityListXmlSchema = type(QualityXmlSchema.array());
