import { z as zod } from "zod";
import {
  costMagicalEnum,
  focusTypeEnum,
  formulaTypeEnum,
  magicalGearTypeEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "../enums.js";
import { AvailabilityRatingSchema } from "./commonSchemas.js";

export const AvailabilityMagicalSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityMagicalType = zod.infer<
  typeof AvailabilityMagicalSchema
>;

const InnerCostMagicalSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costMagicalEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostMagicalType = Array<
  zod.infer<typeof InnerCostMagicalSchema> | { subnumbers: CostMagicalType }
>;
export const CostMagicalSchema: zod.ZodType<CostMagicalType> = zod.array(
  zod.union([
    InnerCostMagicalSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostMagicalSchema),
      })
      .strict(),
  ])
);

export const MagicGearSchema = zod
  .object({
    name: zod.string(),
    type: zod.nativeEnum(magicalGearTypeEnum),
    subtype: zod.optional(
      zod.union([
        zod.nativeEnum(focusTypeEnum),
        zod.nativeEnum(formulaTypeEnum),
      ])
    ),
    availability: AvailabilityMagicalSchema,
    cost: CostMagicalSchema,
    description: zod.string(),
  })
  .strict();
export type MagicGearType = zod.infer<typeof MagicGearSchema>;
