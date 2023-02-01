import { z as zod } from "zod";
import { otherWareTypeEnum } from "../enums.js";
import {
  RatingSchema,
  AvailabilitySchema,
  CostSchema,
} from "./commonSchema.js";
const typeInformation = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal(otherWareTypeEnum.IndustrialChemical),
  }),
  zod.object({ type: zod.literal(otherWareTypeEnum.SurvivalGear) }),
  zod.object({
    type: zod.literal(otherWareTypeEnum.GrappleGun),
    accessory: zod.boolean(),
    lengthForCost: zod.optional(zod.number()),
  }),
  zod.object({ type: zod.literal(otherWareTypeEnum.Biotech) }),
  zod.object({ type: zod.literal(otherWareTypeEnum.DocWagonContract) }),
  zod.object({ type: zod.literal(otherWareTypeEnum.SlapPatch) }),
]);

export const otherGearSchema = zod.object({
  typeInformation: typeInformation,
  name: zod.string(),
  rating: zod.optional(RatingSchema),
  availability: AvailabilitySchema,
  cost: CostSchema,
  description: zod.string(),
  wireless: zod.optional(zod.string()),
});
export type OtherGearType = zod.infer<typeof otherGearSchema>;
