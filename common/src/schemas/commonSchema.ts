import { z as zod } from "zod";
import { mathOperatorEnum, restrictionEnum } from "../enums.js";
export const GearCalculation = zod.optional(
  zod.array(
    zod.union([
      zod.number(),
      zod.enum(["Rating", "Weapon", "Chemical", "Sensor", "Capacity", "Force"]),
      zod.nativeEnum(mathOperatorEnum),
    ])
  )
);

export const BaseOrSpecial = zod.union([
  zod.number(),
  zod.enum(["Calculation"]),
]);

export const AvailabilitySchema = zod.object({
  rating: BaseOrSpecial,
  specialCalculation: GearCalculation,
  restriction: zod.nativeEnum(restrictionEnum),
});
export type AvailabilityType = zod.infer<typeof AvailabilitySchema>;

export const ValueRangeSchema = zod.union([
  zod.object({
    minimum: zod.optional(zod.number()),
    maximum: zod.optional(zod.number()),
  }),
  zod.object({
    base: BaseOrSpecial,
    specialCalculation: GearCalculation,
  }),
]);
export const RatingSchema = ValueRangeSchema;
export type RatingType = zod.infer<typeof RatingSchema>;

export const CostSchema = zod.object({
  base: BaseOrSpecial,
  specialCalculation: GearCalculation,
});
export type CostType = zod.infer<typeof CostSchema>;

export const CapacitySchema = ValueRangeSchema;
export type CapacityType = zod.infer<typeof CapacitySchema>;
