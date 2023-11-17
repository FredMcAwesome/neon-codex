import { z as zod } from "zod";
import {
  drugComponentCategoryEnum,
  gearCategoryEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../enums.js";
import { BonusSchema } from "./shared/bonusSchemas.js";

export const AvailabilityDrugSchema = zod
  .object({
    rating: zod.number(),
    restriction: zod.nativeEnum(restrictionEnum),
  })
  .strict();

export const DrugSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(gearCategoryEnum),
    availability: AvailabilityDrugSchema,
    cost: zod.number(),
    speed: zod.optional(zod.number()),
    bonus: zod.optional(BonusSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export const DrugListSchema = zod.array(DrugSchema);

export const DrugComponentSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(drugComponentCategoryEnum),
    availability: AvailabilityDrugSchema,
    cost: zod.number(),
    appliedLimit: zod.optional(zod.number()),
    addictionRating: zod.optional(zod.number()),
    addictionThreshold: zod.optional(zod.number()),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export const DrugComponentListSchema = zod.array(DrugComponentSchema);
