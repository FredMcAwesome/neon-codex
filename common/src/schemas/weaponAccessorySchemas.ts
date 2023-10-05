import { z as zod } from "zod";
import {
  damageAnnotationEnum,
  damageTypeEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  ammoSourceEnum,
  weaponTypeEnum,
  mathOperatorEnum,
  standardCalculationEnum,
  gearCategoryEnum,
  firearmAccessoryMountLocationEnum,
  sourceBookEnum,
  ammoOptionEnum,
  costWeaponAccessoryEnum,
  restrictionEnum,
} from "../enums.js";
import { AvailabilityRatingSchema } from "./commonSchemas.js";
import { AmmunitionSingleSchema, UseGearListSchema } from "./weaponSchemas.js";

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

export const WeaponDamageRequirementsSchema = zod
  .object({
    type: zod.nativeEnum(damageTypeEnum),
    annotation: zod.optional(zod.nativeEnum(damageAnnotationEnum)),
  })
  .strict();
export type WeaponDamageRequirementsType = zod.infer<
  typeof WeaponDamageRequirementsSchema
>;

export const AccessoryWeaponRequirementsSchema = zod
  .object({
    weapons: zod.optional(zod.array(zod.string())),
    minimumHostConcealment: zod.optional(zod.number()),
    maximumHostConcealment: zod.optional(zod.number()),
    skills: zod.optional(zod.array(zod.string())),
    accessories: zod.optional(zod.array(zod.string())),
    specialModificationLimit: zod.optional(zod.number()),
    mode: zod.optional(zod.nativeEnum(firearmModeEnum)),
    weaponNames: zod.optional(zod.array(zod.string())),
    ammunitionDetails: zod.optional(
      zod.array(
        zod.union([
          zod.nativeEnum(ammoSourceEnum),
          zod.nativeEnum(firearmWeaponTypeEnum),
          zod.nativeEnum(projectileWeaponTypeEnum),
        ])
      )
    ),
    categories: zod.optional(
      zod.array(
        zod.union([
          zod.literal(weaponTypeEnum.Melee),
          zod.nativeEnum(firearmWeaponTypeEnum),
          zod.nativeEnum(projectileWeaponTypeEnum),
        ])
      )
    ),
    accessoryMounts: zod.optional(
      zod.array(zod.nativeEnum(firearmAccessoryMountLocationEnum))
    ),
    requiredDamage: zod.optional(WeaponDamageRequirementsSchema),
  })
  .strict();
export type AccessoryWeaponRequirementsType = zod.infer<
  typeof AccessoryWeaponRequirementsSchema
>;

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

export const HostWeaponMountsRequiredSchema = zod.array(
  zod.array(zod.nativeEnum(firearmAccessoryMountLocationEnum))
);
export type HostWeaponMountsRequiredType = zod.infer<
  typeof HostWeaponMountsRequiredSchema
>;

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
    availability: AvailabilityWeaponAccessorySchema,
    cost: CostWeaponAccessorySchema,
    accessoryCostMultiplier: zod.optional(zod.number()),
    allowGear: zod.optional(zod.array(zod.nativeEnum(gearCategoryEnum))),
    preinstalledGear: zod.optional(UseGearListSchema),
    specialModification: zod.boolean(),
    extraAmmoSlots: zod.optional(zod.number()),
    ammoCapacityCalculation: zod.optional(AmmoCapacityCalculationSchema),
    newAmmoType: zod.optional(AmmunitionSingleSchema),
    hostWeaponMountsRequired: zod.optional(HostWeaponMountsRequiredSchema),
    hostWeaponRequirements: zod.optional(AccessoryWeaponRequirementsSchema),
    hostWeaponRestrictions: zod.optional(AccessoryWeaponRequirementsSchema),
    rangePenaltyDecrease: zod.optional(zod.number()),
    concealabilityModification: zod.optional(ConcealabilityModificationSchema),
    userSelectable: zod.optional(zod.literal(false)),
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
