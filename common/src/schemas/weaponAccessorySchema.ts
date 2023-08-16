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
} from "../enums.js";
import { AvailabilitySchema, CostSchema } from "./commonSchema.js";
import { UseGearListSchema } from "./weaponSchemas.js";

export const weaponDamageRequirementsSchema = zod.object({
  type: zod.nativeEnum(damageTypeEnum),
  annotation: zod.optional(zod.nativeEnum(damageAnnotationEnum)),
});
export type weaponDamageRequirementsType = zod.infer<
  typeof weaponDamageRequirementsSchema
>;

export const accessoryWeaponRequirementsSchema = zod.object({
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
  requiredDamage: zod.optional(weaponDamageRequirementsSchema),
});
export type accessoryWeaponRequirementsType = zod.infer<
  typeof accessoryWeaponRequirementsSchema
>;

const AmmoInformationSchema = zod.object({
  ammoCount: zod.optional(zod.number()),
  ammoSource: zod.optional(zod.nativeEnum(ammoSourceEnum)),
});
export type AmmoInformationType = zod.infer<typeof AmmoInformationSchema>;

export const AmmoCapacityCalculationSubnumberSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(ammoOptionEnum) }),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
]);

export type AmmoCapacityCalculationType = Array<
  | zod.infer<typeof AmmoCapacityCalculationSubnumberSchema>
  | {
      subnumbers?: AmmoCapacityCalculationType;
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

export const hostWeaponMountsRequiredSchema = zod.array(
  zod.array(zod.nativeEnum(firearmAccessoryMountLocationEnum))
);
export type hostWeaponMountsRequiredType = zod.infer<
  typeof hostWeaponMountsRequiredSchema
>;

const concealabilityModificationSchema = zod.union([
  zod.number(),
  zod.nativeEnum(standardCalculationEnum),
]);
export type concealabilityModificationType = zod.infer<
  typeof concealabilityModificationSchema
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
    availability: AvailabilitySchema,
    cost: CostSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
    accessoryCostMultiplier: zod.optional(zod.number()),
    allowGear: zod.optional(zod.array(zod.nativeEnum(gearCategoryEnum))),
    preinstalledGear: zod.optional(UseGearListSchema),
    specialModification: zod.boolean(),
    extraAmmoSlots: zod.optional(zod.number()),
    ammoCapacityCalculation: zod.optional(AmmoCapacityCalculationSchema),
    newAmmoType: zod.optional(AmmoInformationSchema),
    hostWeaponMountsRequired: zod.optional(hostWeaponMountsRequiredSchema),
    hostWeaponRequirements: zod.optional(accessoryWeaponRequirementsSchema),
    hostWeaponRestrictions: zod.optional(accessoryWeaponRequirementsSchema),
    rangePenaltyDecrease: zod.optional(zod.number()),
    concealabilityModification: zod.optional(concealabilityModificationSchema),
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
