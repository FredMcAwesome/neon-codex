import { z as zod } from "zod";
import {
  damageAnnotationEnum,
  damageTypeEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  reloadMethodEnum,
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
  augmentationClassificationEnum,
  sourceBookEnum,
} from "../enums.js";
import {
  AvailabilitySchema,
  CostSchema,
  WeaponSubtypeXmlSchema,
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

export const DamageSubnumberSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
  ])
);
export type DamageSubtypeType = zod.infer<typeof DamageSubnumberSchema>;

export const DamageAmountSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    DamageSubnumberSchema,
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
  reloadMethod: zod.nativeEnum(reloadMethodEnum),
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
});

export const FirearmOptionsSchema = zod.object({
  mode: zod.array(zod.nativeEnum(firearmModeEnum)),
  recoilCompensation: RecoilCompensationSchema,
  ammoCategory: zod.optional(WeaponSubtypeXmlSchema),
  ammoSlots: zod.number(),
  range: zod.array(zod.string()),
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

export const ArmourPenetrationSchema = zod.array(
  zod.union([
    zod.object({ option: zod.nativeEnum(armourPenetrationEnum) }),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }),
    zod.number(),
  ])
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
  }),
  zod.object({
    type: zod.literal(weaponTypeEnum.Firearm),
    subtype: zod.nativeEnum(firearmWeaponTypeEnum),
    firearmOptions: FirearmOptionsSchema,
  }),
  zod.object({
    type: zod.literal(weaponTypeEnum.Explosive),
    subtype: zod.nativeEnum(explosiveTypeEnum),
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

export const AmmunitionSchema = zod.array(
  zod.object({
    capacity: zod.optional(zod.number()),
    numberOfAmmunitionHolders: zod.optional(zod.number()),
    reloadMethod: zod.nativeEnum(reloadMethodEnum),
  })
);
export type AmmunitionType = zod.infer<typeof AmmunitionSchema>;

export const WeaponSummarySchema = zod.object({
  name: zod.string(),
  description: zod.string(),
  typeInformation: typeInformationSchema,
  concealability: zod.number(),
  accuracy: AccuracySchema,
  damage: DamageSchema,
  armourPenetration: ArmourPenetrationSchema,
  ammo: zod.optional(zod.array(FirearmAmmoSchema)),
  availability: AvailabilitySchema,
  cost: CostSchema,
  allowGear: zod.optional(zod.array(zod.nativeEnum(gearCategoryEnum))),
  accessories: zod.optional(AccessoriesSchema),
  allowAccessories: zod.boolean(),
  isCyberware: zod.boolean(),
  augmentationType: zod.nativeEnum(augmentationClassificationEnum),
  wireless: zod.optional(zod.string()),
  relatedSkill: zod.string(),
  relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
  source: zod.nativeEnum(sourceBookEnum),
  page: zod.number(),
});
export type WeaponSummaryType = zod.infer<typeof WeaponSummarySchema>;
const WeaponSummaryListSchema = zod.array(WeaponSummarySchema);
export type WeaponSummaryListType = zod.infer<typeof WeaponSummaryListSchema>;
