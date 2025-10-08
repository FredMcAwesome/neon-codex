import { type } from "arktype";
import {
  drugComponentCategoryEnum,
  gearCategoryEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";

export const AvailabilityDrugSchema = type({
  "+": "reject",
  rating: "number",
  restriction: type.valueOf(restrictionEnum),
});
export type AvailabilityDrugType = typeof AvailabilityDrugSchema.infer;

export const DrugSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(gearCategoryEnum),
  "speed?": "number",
  "bonus?": BonusSchema,
  availability: AvailabilityDrugSchema,
  cost: "number",
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type DrugType = typeof DrugSchema.infer;
export const DrugListSchema = type(DrugSchema.array());
export type DrugListType = typeof DrugListSchema.infer;

export const DrugComponentSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(drugComponentCategoryEnum),
  "appliedLimit?": "number",
  "addictionRating?": "number",
  "addictionThreshold?": "number",
  availability: AvailabilityDrugSchema,
  cost: "number",
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type DrugComponentType = typeof DrugComponentSchema.infer;
export const DrugComponentListSchema = type(DrugComponentSchema.array());
export type DrugComponentListType = typeof DrugComponentListSchema.infer;
