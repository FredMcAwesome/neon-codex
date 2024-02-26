import { z as zod } from "zod";
import {
  drugComponentCategoryEnum,
  gearCategoryEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";

export const AvailabilityDrugSchema = zod
  .object({
    rating: zod.number(),
    restriction: zod.nativeEnum(restrictionEnum),
  })
  .strict();
export type AvailabilityDrugType = zod.infer<typeof AvailabilityDrugSchema>;

export const DrugSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(gearCategoryEnum),
    speed: zod.optional(zod.number()),
    bonus: zod.optional(BonusSchema),
    availability: AvailabilityDrugSchema,
    cost: zod.number(),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type DrugType = zod.infer<typeof DrugSchema>;
export const DrugListSchema = zod.array(DrugSchema);
export type DrugListType = zod.infer<typeof DrugListSchema>;

export const DrugComponentSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(drugComponentCategoryEnum),
    appliedLimit: zod.optional(zod.number()),
    addictionRating: zod.optional(zod.number()),
    addictionThreshold: zod.optional(zod.number()),
    availability: AvailabilityDrugSchema,
    cost: zod.number(),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type DrugComponentType = zod.infer<typeof DrugComponentSchema>;
export const DrugComponentListSchema = zod.array(DrugComponentSchema);
export type DrugComponentListType = zod.infer<typeof DrugComponentListSchema>;
