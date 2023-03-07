import { z as zod } from "zod";
import {
  damageAnnotationEnum,
  damageTypeEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  ammoSourceEnum,
  weaponTypeEnum,
  blastTypeEnum,
  explosiveTypeEnum,
  accuracyTypeEnum,
  mathOperatorEnum,
  damageCalculationOptionEnum,
  armourPenetrationEnum,
  standardCalculationEnum,
  gearCategoryEnum,
  firearmAccessoryMountLocationEnum,
  sourceBookEnum,
  ammoOptionEnum,
} from "../enums.js";
import {
  AvailabilitySchema,
  CostSchema,
  WeaponSubtypeSchema,
} from "./commonSchema.js";

export const GenericCalculationSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    zod.object({ option: zod.nativeEnum(standardCalculationEnum) }),
  ])
);
export type GenericCalculationType = zod.infer<typeof GenericCalculationSchema>;

export const AccuracySchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ option: zod.nativeEnum(accuracyTypeEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
  ])
);
export type AccuracyType = zod.infer<typeof AccuracySchema>;

export const BlastSchema = zod.object({
  type: zod.nativeEnum(blastTypeEnum),
  value: zod.number(),
});
export type BlastType = zod.infer<typeof BlastSchema>;

export const DamageSubnumberSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
]);
export type DamageSubnumberType = zod.infer<typeof DamageSubnumberSchema>;
export const DamageSubnumberArraySchema = zod.array(DamageSubnumberSchema);
export type DamageSubnumberArrayType = zod.infer<
  typeof DamageSubnumberArraySchema
>;

export const DamageAmountSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    zod.object({
      subnumbers: DamageSubnumberArraySchema,
    }),
  ])
);
export type DamageAmountType = zod.infer<typeof DamageAmountSchema>;
export const DamageSchema = zod.array(
  zod.object({
    damageAmount: DamageAmountSchema,
    type: zod.nativeEnum(damageTypeEnum),
    annotation: zod.optional(zod.nativeEnum(damageAnnotationEnum)),
    blast: zod.optional(BlastSchema),
  })
);
export type DamageType = zod.infer<typeof DamageSchema>;

export const RecoilCompensationSchema = zod.number();
export type RecoilCompensationType = zod.infer<typeof RecoilCompensationSchema>;

export const FirearmAmmoSchema = zod.object({
  amount: zod.number(),
  reloadMethod: zod.nativeEnum(ammoSourceEnum),
});
export type FirearmAmmoType = zod.infer<typeof FirearmAmmoSchema>;

export const MountSchema = zod.nativeEnum(firearmAccessoryMountLocationEnum);
export type MountType = zod.infer<typeof MountSchema>;
export const AccessoryMountSchema = zod.array(MountSchema);
export type AccessoryMountType = zod.infer<typeof AccessoryMountSchema>;

export const MeleeOptionsSchema = zod.object({
  reach: zod.number(),
});
export type MeleeOptionsType = zod.infer<typeof MeleeOptionsSchema>;

export const weaponRequirementsSchema = zod.object({
  weaponAllowed: zod.optional(zod.string()),
  minimumHostConcealment: zod.optional(zod.number()),
  maximumHostConcealment: zod.optional(zod.number()),
  categories: zod.optional(zod.array(zod.string())),
  skills: zod.optional(zod.array(zod.string())),
  requireAccessories: zod.optional(zod.array(zod.string())),
  specialModificationLimit: zod.optional(zod.number()),
});
export type weaponRequirementsType = zod.infer<typeof weaponRequirementsSchema>;

export const weaponRestrictionsSchema = zod.object({
  weaponsForbidden: zod.optional(zod.array(zod.string())),
  minimumHostConcealment: zod.optional(zod.number()),
  maximumHostConcealment: zod.optional(zod.number()),
  categories: zod.optional(zod.array(zod.string())),
  skills: zod.optional(zod.array(zod.string())),
  requireAccessories: zod.optional(zod.array(zod.string())),
});
export type weaponRestrictionsType = zod.infer<typeof weaponRestrictionsSchema>;

export const FirearmOptionsSchema = zod.object({
  mode: zod.array(zod.nativeEnum(firearmModeEnum)),
  recoilCompensation: RecoilCompensationSchema,
  ammoCategory: zod.optional(WeaponSubtypeSchema),
  ammoSlots: zod.number(),
  hostWeaponRequirements: zod.optional(
    zod.object({
      weaponRequirements: zod.optional(weaponRequirementsSchema),
      hostWeaponMountsRequired: zod.optional(AccessoryMountSchema),
    })
  ),
  underbarrelWeapons: zod.optional(zod.array(zod.string())),
  addWeapons: zod.optional(zod.array(zod.string())),
  accessoryMounts: zod.optional(AccessoryMountSchema),
  doubleCostAccessoryMounts: zod.optional(AccessoryMountSchema),
});
export type FirearmOptionsType = zod.infer<typeof FirearmOptionsSchema>;

export const Mode = zod.array(zod.nativeEnum(firearmModeEnum));
export type ModeType = zod.infer<typeof Mode>;

// outer array is different ap values, inner is ap calculation for one ap value
export const ArmourPenetrationSchema = zod.array(
  zod.array(
    zod.union([
      zod.object({ option: zod.nativeEnum(armourPenetrationEnum) }),
      zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
      zod.number(),
    ])
  )
);
export type ArmourPenetrationType = zod.infer<typeof ArmourPenetrationSchema>;

const typeInformationSchema = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal(weaponTypeEnum.Melee),
    subtype: zod.nativeEnum(meleeWeaponTypeEnum),
    meleeOptions: MeleeOptionsSchema,
  }),
  zod.object({
    type: zod.literal(weaponTypeEnum.Projectile),
    subtype: zod.nativeEnum(projectileWeaponTypeEnum),
    range: zod.array(zod.string()),
  }),
  zod.object({
    type: zod.literal(weaponTypeEnum.Firearm),
    subtype: zod.nativeEnum(firearmWeaponTypeEnum),
    firearmOptions: FirearmOptionsSchema,
    range: zod.array(zod.string()),
  }),
  zod.object({
    type: zod.literal(weaponTypeEnum.Explosive),
    subtype: zod.nativeEnum(explosiveTypeEnum),
    range: zod.array(zod.string()),
  }),
]);
export type typeInformationType = zod.infer<typeof typeInformationSchema>;

const UseGearSchema = zod.object({
  name: zod.string(),
  category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
  rating: zod.optional(zod.number()),
});

const AccessorySchema = zod.object({
  name: zod.string(),
  mount: zod.optional(zod.array(MountSchema)),
  rating: zod.optional(zod.number()),
  gears: zod.optional(zod.array(UseGearSchema)),
});
export type AccessoryType = zod.infer<typeof AccessorySchema>;
const AccessoriesSchema = zod.array(AccessorySchema);
export type AccessoriesType = zod.infer<typeof AccessoriesSchema>;

const AmmoInformationSchema = zod.object({
  ammoCount: zod.optional(zod.number()),
  ammoSource: zod.optional(zod.nativeEnum(ammoSourceEnum)),
});
export type AmmoInformationType = zod.infer<typeof AmmoInformationSchema>;

export const WeaponAccessorySummarySchema = zod.object({
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
  preinstalledGear: zod.optional(zod.array(UseGearSchema)),
  specialModification: zod.boolean(),
  extraAmmoSlots: zod.optional(zod.number()),
  ammoCapacityCalculation: zod.optional(
    zod.array(
      zod.union([
        zod.number(),
        zod.object({ option: zod.nativeEnum(ammoOptionEnum) }),
        zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
      ])
    )
  ),
  newAmmoType: zod.optional(AmmoInformationSchema),
  hostWeaponMountsRequired: zod.optional(
    zod.array(zod.nativeEnum(firearmAccessoryMountLocationEnum))
  ),
  hostWeaponRequirements: zod.optional(weaponRequirementsSchema),
  hostWeaponRestrictions: zod.optional(weaponRestrictionsSchema),
  rangePenaltyDecrease: zod.optional(zod.number()),
  concealabilityModification: zod.optional(
    zod.union([zod.number(), zod.nativeEnum(standardCalculationEnum)])
  ),
});
export type WeaponAccessorySummaryType = zod.infer<
  typeof WeaponAccessorySummarySchema
>;
const WeaponAccessorySummaryListSchema = zod.array(
  WeaponAccessorySummarySchema
);
export type WeaponAccessorySummaryListType = zod.infer<
  typeof WeaponAccessorySummaryListSchema
>;
