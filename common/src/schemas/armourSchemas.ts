import { z as zod } from "zod";
import { restrictionEnum, mathOperatorEnum, costArmourEnum } from "../enums.js";
import { AvailabilityRatingSchema } from "./commonSchemas.js";

export const AvailabilityArmourSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityArmourType = zod.infer<typeof AvailabilityArmourSchema>;

const InnerCostArmourSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costArmourEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostArmourType = Array<
  zod.infer<typeof InnerCostArmourSchema> | { subnumbers: CostArmourType }
>;
export const CostArmourSchema: zod.ZodType<CostArmourType> = zod.array(
  zod.union([
    InnerCostArmourSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostArmourSchema),
      })
      .strict(),
  ])
);

export const AvailabilityArmourAccessorySchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityArmourAccessoryType = zod.infer<
  typeof AvailabilityArmourSchema
>;

const InnerCostArmourAccessorySchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costArmourEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostArmourAccessoryType = Array<
  | zod.infer<typeof InnerCostArmourAccessorySchema>
  | { subnumbers: CostArmourAccessoryType }
>;
export const CostArmourAccessorySchema: zod.ZodType<CostArmourAccessoryType> =
  zod.array(
    zod.union([
      InnerCostArmourAccessorySchema,
      zod
        .object({
          subnumbers: zod.lazy(() => CostArmourAccessorySchema),
        })
        .strict(),
    ])
  );
