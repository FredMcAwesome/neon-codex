import { z as zod } from "zod";
import {
  armourModCategoryEnum,
  capacityEnum,
  costEnum,
  mathOperatorEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  DamageReductionArmourSchema,
} from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { CustomisedGearListSchema } from "../other/gearSchemas.js";

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
      option: zod.nativeEnum(costEnum),
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
  zod
    .object({ ratingLinked: zod.array(RecursiveCostArmourModSchema) })
    .strict(),
]);
export type CostArmourModType = zod.infer<typeof CostArmourModSchema>;

const InnerCapacityArmourModSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(capacityEnum),
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

const HostArmourRequirementSchema = zod
  .object({
    requiredMod: zod.optional(zod.string()),
    hostArmour: zod.optional(zod.string()),
  })
  .strict();
export type HostArmourRequirementType = zod.infer<
  typeof HostArmourRequirementSchema
>;

export const ArmourModSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(armourModCategoryEnum),
    maxRating: zod.number(),
    damageReduction: DamageReductionArmourSchema,
    capacityCost: CapacityArmourModSchema,
    hostArmourRequirements: zod.optional(HostArmourRequirementSchema),
    includedGearList: zod.optional(CustomisedGearListSchema),
    bonus: zod.optional(BonusSchema),
    wirelessBonus: zod.optional(BonusSchema),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityArmourModSchema,
    cost: CostArmourModSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type ArmourModType = zod.infer<typeof ArmourModSchema>;

export const ArmourModListSchema = zod.array(ArmourModSchema);
export type ArmourModListType = zod.infer<typeof ArmourModListSchema>;

export const CustomisedArmourModSchema = zod
  .object({
    baseMod: zod.string(),
    gearList: zod.optional(CustomisedGearListSchema),
    rating: zod.optional(zod.number()),
  })
  .strict();
export type CustomisedArmourModType = zod.infer<
  typeof CustomisedArmourModSchema
>;

export const CustomisedArmourModListSchema = zod.array(
  CustomisedArmourModSchema
);
export type CustomisedArmourModListType = zod.infer<
  typeof CustomisedArmourModListSchema
>;
