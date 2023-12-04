import { z as zod } from "zod";
import {
  armourModCategoryEnum,
  availabilityEnum,
  capcityArmourModEnum,
  costArmourModEnum,
  mathOperatorEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../enums.js";
import {
  AvailabilityRatingSchema,
  UseGearListSchema,
} from "./commonSchemas.js";
import { BonusSchema } from "./shared/bonusSchemas.js";
import { ModListSchema } from "./shared/modSchemas.js";

const InnerAvailabilityArmourModSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
const AvailabilityArmourModSchema = zod.union([
  InnerAvailabilityArmourModSchema,
  zod
    .object({ ratingLinked: zod.array(InnerAvailabilityArmourModSchema) })
    .strict(),
]);
export type AvailabilityArmourModType = zod.infer<
  typeof AvailabilityArmourModSchema
>;

const InnerCostArmourModSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costArmourModEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type RecursiveCostArmourModType = Array<
  | zod.infer<typeof InnerCostArmourModSchema>
  | { subnumbers: RecursiveCostArmourModType }
>;
export const RecursiveCostArmourModSchema: zod.ZodType<RecursiveCostArmourModType> =
  zod.array(
    zod.union([
      InnerCostArmourModSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => RecursiveCostArmourModSchema),
        })
        .strict(),
    ])
  );
export const CostArmourModSchema = zod.union([
  RecursiveCostArmourModSchema,
  zod.object({ ratingLinked: RecursiveCostArmourModSchema }).strict(),
]);
export type CostArmourModType = zod.infer<typeof CostArmourModSchema>;

const InnerCapacityArmourModSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(capcityArmourModEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type SingleCapacityArmourModType = Array<
  | zod.infer<typeof InnerCapacityArmourModSchema>
  | { subnumbers: SingleCapacityArmourModType }
>;
export const SingleCapacityArmourModSchema: zod.ZodType<SingleCapacityArmourModType> =
  zod.array(
    zod.union([
      InnerCapacityArmourModSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => SingleCapacityArmourModSchema),
        })
        .strict(),
    ])
  );
export const CapacityArmourModSchema = zod.union([
  SingleCapacityArmourModSchema,
  zod
    .object({
      ratingLinked: SingleCapacityArmourModSchema,
    })
    .strict(),
]);
export type CapacityArmourModType = zod.infer<typeof CapacityArmourModSchema>;

export const ArmourModSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(armourModCategoryEnum),
    maxRating: zod.number(),
    damageReduction: zod.union([
      zod.number(),
      zod.object({
        option: zod.nativeEnum(availabilityEnum),
      }),
    ]),
    capacity: CapacityArmourModSchema,
    hostArmourRequirements: zod.optional(
      zod
        .object({
          requiredMod: zod.optional(zod.string()),
          hostArmour: zod.optional(zod.string()),
        })
        .strict()
    ),
    includedGear: zod.optional(UseGearListSchema),
    bonus: zod.optional(BonusSchema),
    wirelessBonus: zod.optional(BonusSchema),
    mods: zod.optional(ModListSchema),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityArmourModSchema,
    cost: CostArmourModSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export const ArmourModListSchema = zod.array(ArmourModSchema);
