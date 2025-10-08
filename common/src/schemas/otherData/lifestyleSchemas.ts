import { type } from "arktype";
import {
  gridCategoryEnum,
  lifestyleCostIncrementEnum,
  lifestyleQualityCategoryEnum,
  sourceBookEnum,
} from "../../enums.js";
import { BonusSchema } from "../shared/bonusSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";

export const LifestyleCostSchema = type({
  "+": "reject",
  cost: "number",
  increment: type.valueOf(lifestyleCostIncrementEnum),
});
export type LifestyleCostType = typeof LifestyleCostSchema.infer;
const LifestyleCategoryIncreaseCostSchema = type({
  "+": "reject",
  comfort: "number",
  neighborhood: "number",
  security: "number",
});
export type LifestyleCategoryIncreaseCostType =
  typeof LifestyleCategoryIncreaseCostSchema.infer;
const LifestyleCategoryDefaults = type({
  "+": "reject",
  comfortInfo: { minimum: "number", limit: "number" },
  neighborhoodInfo: { minimum: "number", limit: "number" },
  securityInfo: { minimum: "number", limit: "number" },
});
export type LifestyleCategoryType = typeof LifestyleCategoryDefaults.infer;
export const LifestyleSchema = type({
  "+": "reject",
  name: "string",
  cost: LifestyleCostSchema,
  lifestylePoints: "number",
  "allowBonusLifestylePoints?": "true",
  freegridList: type.valueOf(gridCategoryEnum).array(),
  dice: "number",
  startingNuyenMultiplier: "number",
  "costIncreasePerCategoryLevelIncrease?": LifestyleCategoryIncreaseCostSchema,
  "lifestyleCategoryDefaults?": LifestyleCategoryDefaults,
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
  description: "string",
});
export type LifestyleType = typeof LifestyleSchema.infer;
export const LifestyleListSchema = type(LifestyleSchema.array());
export type LifestyleListType = typeof LifestyleListSchema.infer;

export const CustomisedLifestyleSchema = type({
  "+": "reject",
  baseLifestyle: "string",
  purchasedDuration: "number",
});
export type CustomisedLifestyleType = typeof CustomisedLifestyleSchema.infer;
export const CustomisedLifestyleListSchema = type(
  CustomisedLifestyleSchema.array()
);
export type CustomisedLifestyleListType =
  typeof CustomisedLifestyleListSchema.infer;

export const LifestyleQualitySchema = type({
  "+": "reject",
  name: "string",
  category: type.valueOf(lifestyleQualityCategoryEnum),
  monthlyCost: "number",
  lifestylePointCost: "number",
  "lifestyleCostMultiplier?": "number",
  "requiredLifestyleList?": "string[]",
  "multipleAllowed?": "true",
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
  description: "string",
});
export type LifestyleQualityType = typeof LifestyleQualitySchema.infer;
export const LifestyleQualityListSchema = type(LifestyleQualitySchema.array());
export type LifestyleQualityListType = typeof LifestyleQualityListSchema.infer;
