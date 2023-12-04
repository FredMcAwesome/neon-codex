import { z as zod } from "zod";
import {
  damageTypeEnum,
  mathOperatorEnum,
  standardCalculationEnum,
  sourceBookEnum,
  ammoOptionEnum,
  costWeaponAccessoryEnum,
  restrictionEnum,
} from "../enums.js";
import {
  AllowedGearSchema,
  AvailabilityRatingSchema,
  UseGearListSchema,
} from "./commonSchemas.js";
import { RequirementsSchema } from "./shared/requiredSchemas.js";
import {
  AccessoryMountSchema,
  AmmunitionSingleSchema,
} from "./weaponSchemas.js";

export const AvailabilityWeaponAccessorySchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityWeaponAccessoryType = zod.infer<
  typeof AvailabilityWeaponAccessorySchema
>;

const InnerCostWeaponAccessorySchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costWeaponAccessoryEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostWeaponAccessoryType = Array<
  | zod.infer<typeof InnerCostWeaponAccessorySchema>
  | { subnumbers: CostWeaponAccessoryType }
>;
export const CostWeaponAccessorySchema: zod.ZodType<CostWeaponAccessoryType> =
  zod.array(
    zod.union([
      InnerCostWeaponAccessorySchema,
      zod
        .object({
          subnumbers: zod.lazy(() => CostWeaponAccessorySchema),
        })
        .strict(),
    ])
  );

export const AmmoCapacityCalculationSubnumberSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(ammoOptionEnum) }).strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type AmmoCapacityCalculationType = Array<
  | zod.infer<typeof AmmoCapacityCalculationSubnumberSchema>
  | {
      subnumbers: AmmoCapacityCalculationType;
    }
>;
export const AmmoCapacityCalculationSchema: zod.ZodType<AmmoCapacityCalculationType> =
  zod.array(
    zod.union([
      AmmoCapacityCalculationSubnumberSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => AmmoCapacityCalculationSchema),
        })
        .strict(),
    ])
  );

const ConcealabilityModificationSchema = zod.union([
  zod.number(),
  zod.nativeEnum(standardCalculationEnum),
]);
export type ConcealabilityModificationType = zod.infer<
  typeof ConcealabilityModificationSchema
>;

export const WeaponAccessorySummarySchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
    maxRating: zod.number(),
    isWeapon: zod.boolean(),
    accuracyIncrease: zod.optional(zod.number()),
    damageIncrease: zod.optional(zod.number()),
    newDamageType: zod.optional(zod.nativeEnum(damageTypeEnum)),
    reachIncrease: zod.optional(zod.number()),
    armourPiercingIncrease: zod.optional(zod.number()),
    recoilCompensationIncrease: zod.optional(zod.number()),
    recoilCompensationType: zod.optional(zod.number()), // items from the same recoilCompensationType are incompatible with each other
    deploymentRequired: zod.boolean(),
    accessoryCostMultiplier: zod.optional(zod.number()),
    allowGear: zod.optional(AllowedGearSchema),
    preinstalledGear: zod.optional(UseGearListSchema),
    specialModification: zod.boolean(),
    extraAmmoSlots: zod.optional(zod.number()),
    ammoCapacityCalculation: zod.optional(AmmoCapacityCalculationSchema),
    newAmmoType: zod.optional(AmmunitionSingleSchema),
    hostWeaponMountsRequired: zod.optional(AccessoryMountSchema),
    hostWeaponRequirements: zod.optional(RequirementsSchema),
    hostWeaponRestrictions: zod.optional(RequirementsSchema),
    rangePenaltyDecrease: zod.optional(zod.number()),
    concealabilityModification: zod.optional(ConcealabilityModificationSchema),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityWeaponAccessorySchema,
    cost: CostWeaponAccessorySchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type WeaponAccessorySummaryType = zod.infer<
  typeof WeaponAccessorySummarySchema
>;
export const WeaponAccessorySummaryListSchema = zod.array(
  WeaponAccessorySummarySchema
);
export type WeaponAccessorySummaryListType = zod.infer<
  typeof WeaponAccessorySummaryListSchema
>;
