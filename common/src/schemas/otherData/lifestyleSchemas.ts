import { z as zod } from "zod";
import {
  GridCategoryEnum,
  LifestyleCostIncrementEnum,
  LifestyleQualityCategoryEnum,
  sourceBookEnum,
} from "../../enums.js";
import { BonusSchema } from "../shared/bonusSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";

export const LifestyleCostSchema = zod
  .object({
    cost: zod.number(),
    increment: zod.nativeEnum(LifestyleCostIncrementEnum),
  })
  .strict();
export type LifestyleCostType = zod.infer<typeof LifestyleCostSchema>;
const LifestyleCategoryIncreaseCostSchema = zod
  .object({
    comfort: zod.number(),
    neighborhood: zod.number(),
    security: zod.number(),
  })
  .strict();
export type LifestyleCategoryIncreaseCostType = zod.infer<
  typeof LifestyleCategoryIncreaseCostSchema
>;
const LifestyleCategoryDefaults = zod
  .object({
    comfortInfo: zod
      .object({ minimum: zod.number(), limit: zod.number() })
      .strict(),
    neighborhoodInfo: zod
      .object({ minimum: zod.number(), limit: zod.number() })
      .strict(),
    securityInfo: zod
      .object({ minimum: zod.number(), limit: zod.number() })
      .strict(),
  })
  .strict();
export type LifestyleCategoryType = zod.infer<typeof LifestyleCategoryDefaults>;
export const LifestyleSchema = zod
  .object({
    name: zod.string(),
    cost: LifestyleCostSchema,
    lifestylePoints: zod.number(),
    allowBonusLifestylePoints: zod.optional(zod.literal(true)),
    freegridList: zod.array(zod.nativeEnum(GridCategoryEnum)),
    dice: zod.number(),
    startingNuyenMultiplier: zod.number(),
    costIncreasePerCategoryLevelIncrease: zod.optional(
      LifestyleCategoryIncreaseCostSchema
    ),
    lifestyleCategoryDefaults: zod.optional(LifestyleCategoryDefaults),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
    description: zod.string(),
  })
  .strict();
export type LifestyleType = zod.infer<typeof LifestyleSchema>;
export const LifestyleListSchema = zod.array(LifestyleSchema);
export type LifestyleListType = zod.infer<typeof LifestyleListSchema>;

export const LifestyleQualitySchema = zod
  .object({
    name: zod.string(),
    category: zod.nativeEnum(LifestyleQualityCategoryEnum),
    monthlyCost: zod.number(),
    lifestylePointCost: zod.number(),
    lifestyleCostMultiplier: zod.optional(zod.number()),
    requiredLifestyleList: zod.optional(zod.array(zod.string())),
    multipleAllowed: zod.optional(zod.literal(true)),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
    description: zod.string(),
  })
  .strict();
export type LifestyleQualityType = zod.infer<typeof LifestyleQualitySchema>;
export const LifestyleQualityListSchema = zod.array(LifestyleQualitySchema);
export type LifestyleQualityListType = zod.infer<
  typeof LifestyleQualityListSchema
>;
