import { z as zod } from "zod";
import {
  restrictionEnum,
  mathOperatorEnum,
  costEnum,
  armourCategoryEnum,
  availabilityEnum,
  sourceBookEnum,
  armourModCategoryEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  DamageReductionArmourSchema,
  RangeCostSchema,
} from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { GenericModListSchema } from "../../shared/modSchemas.js";
import { CustomisedArmourModListSchema } from "./armourModSchemas.js";
import { CustomisedGearListSchema } from "../other/gearSchemas.js";

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
      option: zod.nativeEnum(costEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

type PartialCostArmourType = Array<
  | zod.infer<typeof InnerCostArmourSchema>
  | { subnumbers: PartialCostArmourType }
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
  RangeCostSchema,
  PartialCostArmourSchema,
]);

export type CostArmourType = zod.infer<typeof CostArmourSchema>;

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
    includedGearList: zod.optional(CustomisedGearListSchema),
    bonus: zod.optional(BonusSchema),
    wirelessBonus: zod.optional(BonusSchema),
    includedModList: zod.optional(CustomisedArmourModListSchema),
    allowModsFromCategory: zod.optional(zod.nativeEnum(armourModCategoryEnum)),
    addModFromCategory: zod.optional(zod.nativeEnum(armourModCategoryEnum)),
    availability: AvailabilityArmourSchema,
    cost: CostArmourSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type ArmourType = zod.infer<typeof ArmourSchema>;

export const ArmourListSchema = zod.array(ArmourSchema);
export type ArmourListType = zod.infer<typeof ArmourListSchema>;

export const CustomisedArmourSchema = zod
  .object({
    baseArmour: zod.string(),
    // This overrides baseArmour modifications
    modList: zod.optional(CustomisedArmourModListSchema),
    // This overrides baseArmour gears
    gearList: zod.optional(CustomisedGearListSchema),
    customName: zod.optional(zod.string()),
  })
  .strict();
export type CustomisedArmourType = zod.infer<typeof CustomisedArmourSchema>;
export const CustomisedArmourListSchema = zod.array(CustomisedArmourSchema);
export type CustomisedArmourListType = zod.infer<
  typeof CustomisedArmourListSchema
>;
