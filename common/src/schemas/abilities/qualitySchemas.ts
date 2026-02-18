import { type } from "arktype";
import { qualityCategoryEnum, qualityLimitEnum } from "../../enums.js";
import { BonusSchema } from "../shared/bonusSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";

const QualityLimitSchema = type.or(
  type({
    "+": "reject",
    option: type.valueOf(qualityLimitEnum),
  }),
  "number"
);
export type QualityLimitType = typeof QualityLimitSchema.infer;

const QualityKarmaDiscountSchema = type({
  "+": "reject",
  requirements: RequirementsSchema,
  value: "number",
});
export type QualityKarmaDiscountType = typeof QualityKarmaDiscountSchema.infer;

const QualityFirstLevelBonusSchema = type.or(
  type({
    "+": "reject",
    // Increase to Notoriety level
    notoriety: "number",
  }),
  type({
    "+": "reject",
    // prevents attribute maximum/s from being increased
    attributeMaxClamp: "string[]",
  })
);
export type QualityFirstLevelBonusType =
  typeof QualityFirstLevelBonusSchema.infer;

export const QualitySchema = type({
  "+": "reject",
  // id: "string",
  name: "string",
  description: "string",
  category: type.valueOf(qualityCategoryEnum),
  karma: "number",
  "charGenOnly?": "true",
  "charGenLimit?": "number",
  "charGenDoNotContributeToKarmaLimit?": "true",
  "charGenNoKarma?": "true",
  "chargenQualityOnly_NotSelectableIfPriorityChargen?": "true",
  "careerOnly?": "true",
  "charGenCostInCareer?": "true",
  "limit?": QualityLimitSchema,
  "sharedLimitQualityList?": "string[]",
  "karmaDiscount?": QualityKarmaDiscountSchema,
  "noLevels?": "true",
  "firstLevelBonus?": QualityFirstLevelBonusSchema,
  "addWeapons?": "string[]",
  "isMetagenic?": "true",
  "canBuyWithSpellPoints?": "true",
  "userSelectable?": "false",
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
  source: "string",
  page: "number",
});
export type QualityType = typeof QualitySchema.infer;
export const QualityListSchema = QualitySchema.array();
export type QualityListType = typeof QualityListSchema.infer;

export const CustomQualitySchema = QualitySchema.merge({
  "+": "reject",
  rating: "number",
});
export type CustomQualityType = typeof CustomQualitySchema.infer;
export const CustomQualityListSchema = CustomQualitySchema.array();
export type CustomQualityListType = typeof CustomQualityListSchema.infer;
