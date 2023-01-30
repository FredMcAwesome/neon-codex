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

export const EssenceSchema = zod.object({
  base: BaseOrSpecial,
  specialCalculation: GearCalculation,
});
export type EssenceType = zod.infer<typeof EssenceSchema>;

export const CyberlimbOptionsSchema = zod.object({
  syntheticCapacity: CapacitySchema,
  syntheticCost: CostSchema,
});

const typeInformation = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal(augmentationTypeEnum.Headware),
  }),
  zod.object({
    type: zod.literal(augmentationTypeEnum.Eyeware),
  }),
  zod.object({
    type: zod.literal(augmentationTypeEnum.Earware),
  }),
  zod.object({
    type: zod.literal(augmentationTypeEnum.Bodyware),
  }),
  zod.object({
    type: zod.literal(augmentationTypeEnum.Cyberlimbs),
    syntheticCapacity: CapacitySchema,
    syntheticCost: CostSchema,
  }),
  zod.object({
    type: zod.literal(augmentationTypeEnum.Bioware),
  }),
  zod.object({
    type: zod.literal(augmentationTypeEnum.CulturedBioware),
  }),
]);

export const AugmentationSchema = zod.object({
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
});
