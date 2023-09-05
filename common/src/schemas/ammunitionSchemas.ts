import { z as zod } from "zod";
import {
  restrictionEnum,
  mathOperatorEnum,
  costAmmunitionEnum,
} from "../enums.js";
import { AvailabilityRatingSchema } from "./commonSchemas.js";

export const AvailabilityAmmunitionSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityAmmunitionType = zod.infer<
  typeof AvailabilityAmmunitionSchema
>;

const InnerCostAmmunitionSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costAmmunitionEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostAmmunitionType = Array<
  | zod.infer<typeof InnerCostAmmunitionSchema>
  | { subnumbers: CostAmmunitionType }
>;
export const CostAmmunitionSchema: zod.ZodType<CostAmmunitionType> = zod.array(
  zod.union([
    InnerCostAmmunitionSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostAmmunitionSchema),
      })
      .strict(),
  ])
);
