import { z as zod } from "zod";
import { augmentationTypeEnum } from "../enums.js";
import {
  AvailabilitySchema,
  BaseOrSpecial,
  CapacitySchema,
  CostSchema,
  GearCalculation,
  RatingSchema,
} from "./commonSchema.js";

export const EssenceSchema = zod
  .object({
    base: BaseOrSpecial,
    specialCalculation: GearCalculation,
  })
  .strict();
export type EssenceType = zod.infer<typeof EssenceSchema>;

export const CyberlimbOptionsSchema = zod
  .object({
    syntheticCapacity: CapacitySchema,
    syntheticCost: CostSchema,
  })
  .strict();

const typeInformation = zod.discriminatedUnion("type", [
  zod
    .object({
      type: zod.literal(augmentationTypeEnum.Headware),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(augmentationTypeEnum.Eyeware),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(augmentationTypeEnum.Earware),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(augmentationTypeEnum.Bodyware),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(augmentationTypeEnum.Cyberlimbs),
      syntheticCapacity: CapacitySchema,
      syntheticCost: CostSchema,
    })
    .strict(),
  zod
    .object({
      type: zod.literal(augmentationTypeEnum.Bioware),
    })
    .strict(),
  zod
    .object({
      type: zod.literal(augmentationTypeEnum.CulturedBioware),
    })
    .strict(),
]);

export const AugmentationSchema = zod
  .object({
    typeInformation: typeInformation,
    name: zod.string(),
    rating: zod.optional(RatingSchema),
    essense: EssenceSchema,
    capacity: zod.optional(CapacitySchema),
    capacityCost: zod.optional(CostSchema),
    availability: AvailabilitySchema,
    cost: CostSchema,
    cyberlimbOptions: zod.optional(CyberlimbOptionsSchema),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type AugmentationType = zod.infer<typeof AugmentationSchema>;
