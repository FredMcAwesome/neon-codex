import { z as zod } from "zod";
import {
  costGearEnum,
  mathOperatorEnum,
  otherWareTypeEnum,
  restrictionEnum,
} from "../enums.js";
import { AvailabilityRatingSchema, RatingSchema } from "./commonSchemas.js";

export const AvailabilityGearSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityGearType = zod.infer<typeof AvailabilityGearSchema>;

const InnerCostGearSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costGearEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostGearType = Array<
  zod.infer<typeof InnerCostGearSchema> | { subnumbers: CostGearType }
>;
export const CostGearSchema: zod.ZodType<CostGearType> = zod.array(
  zod.union([
    InnerCostGearSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostGearSchema),
      })
      .strict(),
  ])
);

const TypeInformationGearSchema = zod.discriminatedUnion("type", [
  zod
    .object({
      type: zod.literal(otherWareTypeEnum.IndustrialChemical),
    })
    .strict(),
  zod.object({ type: zod.literal(otherWareTypeEnum.SurvivalGear) }).strict(),
  zod
    .object({
      type: zod.literal(otherWareTypeEnum.GrappleGun),
      accessory: zod.boolean(),
      lengthForCost: zod.optional(zod.number()),
    })
    .strict(),
  zod.object({ type: zod.literal(otherWareTypeEnum.Biotech) }).strict(),
  zod
    .object({ type: zod.literal(otherWareTypeEnum.DocWagonContract) })
    .strict(),
  zod.object({ type: zod.literal(otherWareTypeEnum.SlapPatch) }).strict(),
]);

export const OtherGearSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    typeInformation: TypeInformationGearSchema,
    rating: zod.optional(RatingSchema),
    availability: AvailabilityGearSchema,
    cost: CostGearSchema,
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type OtherGearType = zod.infer<typeof OtherGearSchema>;
