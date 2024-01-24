import { z as zod } from "zod";
import {
  restrictionEnum,
  mathOperatorEnum,
  costArmourEnum,
  armourCategoryEnum,
  availabilityEnum,
  sourceBookEnum,
  armourModCategoryEnum,
} from "../enums.js";
import {
  AvailabilityRatingSchema,
  UseGearListSchema,
} from "./commonSchemas.js";
import { BonusSchema } from "./shared/bonusSchemas.js";
import { GenericModListSchema } from "./shared/modSchemas.js";

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

const RangeCostArmourSchema = zod
  .object({
    range: zod
      .object({
        min: zod.number(),
        max: zod.number(),
      })
      .strict(),
  })
  .strict();

type PartialCostArmourType = Array<
  | zod.infer<typeof InnerCostArmourSchema>
  | { subnumbers: PartialCostArmourType }
  | zod.infer<typeof RangeCostArmourSchema>
>;
const PartialCostArmourSchema: zod.ZodType<PartialCostArmourType> = zod.array(
  zod.union([
    InnerCostArmourSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => PartialCostArmourSchema),
      })
      .strict(),
  ])
);

export const CostArmourSchema = zod.union([
  RangeCostArmourSchema,
  PartialCostArmourSchema,
]);

export type CostArmourType = zod.infer<typeof CostArmourSchema>;

export const DamageReductionArmourSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(availabilityEnum),
    })
    .strict(),
]);
export type DamageReductionArmourType = zod.infer<
  typeof DamageReductionArmourSchema
>;

const CapacityArmourSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(availabilityEnum),
    })
    .strict(),
]);
export type CapacityArmourType = zod.infer<typeof CapacityArmourSchema>;

export const ArmourSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(armourCategoryEnum),
    maxRating: zod.optional(zod.number()),
    damageReduction: DamageReductionArmourSchema,
    customFitStackDamageReduction: zod.optional(zod.number()),
    capacity: CapacityArmourSchema,
    isWeapon: zod.optional(zod.literal(true)),
    includedGearList: zod.optional(UseGearListSchema),
    bonus: zod.optional(BonusSchema),
    wirelessBonus: zod.optional(BonusSchema),
    includedMods: zod.optional(GenericModListSchema),
    allowModCategory: zod.optional(zod.nativeEnum(armourModCategoryEnum)),
    includeModFromCategory: zod.optional(zod.nativeEnum(armourModCategoryEnum)),
    availability: AvailabilityArmourSchema,
    cost: CostArmourSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type ArmourType = zod.infer<typeof ArmourSchema>;

export const ArmourListSchema = zod.array(ArmourSchema);
export type ArmourListType = zod.infer<typeof ArmourListSchema>;
