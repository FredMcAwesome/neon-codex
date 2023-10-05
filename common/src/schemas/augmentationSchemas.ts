import { z as zod } from "zod";
import {
  augmentationTypeEnum,
  costAugmentationEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "../enums.js";
import {
  AvailabilityRatingSchema,
  BaseOrSpecialSchema,
  CapacitySchema,
  GearCalculation,
  RatingSchema,
} from "./commonSchemas.js";

export const AvailabilityAugmentationSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityAugmentationType = zod.infer<
  typeof AvailabilityAugmentationSchema
>;

const InnerCostAugmentationSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costAugmentationEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostAugmentationType = Array<
  | zod.infer<typeof InnerCostAugmentationSchema>
  | { subnumbers: CostAugmentationType }
>;
export const CostAugmentationSchema: zod.ZodType<CostAugmentationType> =
  zod.array(
    zod.union([
      InnerCostAugmentationSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => CostAugmentationSchema),
        })
        .strict(),
    ])
  );

export const EssenceSchema = zod
  .object({
    base: BaseOrSpecialSchema,
    specialCalculation: GearCalculation,
  })
  .strict();
export type EssenceType = zod.infer<typeof EssenceSchema>;

export const CyberlimbOptionsSchema = zod
  .object({
    syntheticCapacity: CapacitySchema,
    syntheticCost: CostAugmentationSchema,
  })
  .strict();

const TypeInformationAugmentationSchema = zod.discriminatedUnion("type", [
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
      syntheticCost: CostAugmentationSchema,
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
    name: zod.string(),
    description: zod.string(),
    typeInformation: TypeInformationAugmentationSchema,
    rating: zod.optional(RatingSchema),
    essense: EssenceSchema,
    capacity: zod.optional(CapacitySchema),
    capacityCost: zod.optional(CostAugmentationSchema),
    availability: AvailabilityAugmentationSchema,
    cost: CostAugmentationSchema,
    cyberlimbOptions: zod.optional(CyberlimbOptionsSchema),
    wireless: zod.optional(zod.string()),
  })
  .strict();
export type AugmentationType = zod.infer<typeof AugmentationSchema>;
