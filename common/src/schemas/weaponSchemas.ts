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
  augmentationClassificationEnum,
  sourceBookEnum,
} from "../enums.js";
import {
  AvailabilitySchema,
  CostSchema,
  WeaponXmlSubtypeSchema,
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
});
export type weaponRequirementsType = zod.infer<typeof weaponRequirementsSchema>;

export const FirearmOptionsSchema = zod.object({
  mode: zod.array(zod.nativeEnum(firearmModeEnum)),
  recoilCompensation: RecoilCompensationSchema,
  ammoCategory: zod.optional(WeaponXmlSubtypeSchema),
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

export const typeInformationSchema = zod.discriminatedUnion("type", [
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
export type useGearType = zod.infer<typeof UseGearSchema>;

export const UseGearListSchema = zod.array(UseGearSchema);
export type UseGearListType = zod.infer<typeof UseGearListSchema>;

const PreDbAccessorySchema = zod.object({
  name: zod.string(),
  mount: zod.optional(zod.array(MountSchema)),
  rating: zod.optional(zod.number()),
  gears: zod.optional(UseGearListSchema),
});
export type PreDbAccessoryType = zod.infer<typeof PreDbAccessorySchema>;
export const PreDbAccessoriesSchema = zod.array(PreDbAccessorySchema);
export type PredbAccessoriesType = zod.infer<typeof PreDbAccessoriesSchema>;

const AmmunitionSingleSchema = zod.object({
  capacity: zod.optional(zod.number()),
  numberOfAmmunitionHolders: zod.optional(zod.number()),
  reloadMethodList: zod.array(zod.nativeEnum(ammoSourceEnum)),
});
export const AmmunitionSchema = zod.array(AmmunitionSingleSchema);
export type AmmunitionType = zod.infer<typeof AmmunitionSchema>;

export const WeaponPreDBSummarySchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    typeInformation: typeInformationSchema,
    concealability: zod.number(),
    accuracy: AccuracySchema,
    damage: DamageSchema,
    armourPenetration: ArmourPenetrationSchema,
    ammunition: zod.optional(AmmunitionSchema),
    availability: AvailabilitySchema,
    cost: CostSchema,
    allowedGear: zod.optional(zod.array(zod.nativeEnum(gearCategoryEnum))),
    accessories: zod.optional(PreDbAccessoriesSchema),
    allowAccessories: zod.boolean(),
    isCyberware: zod.boolean(),
    augmentationType: zod.nativeEnum(augmentationClassificationEnum),
    wireless: zod.optional(zod.string()),
    relatedSkill: zod.string(),
    relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type WeaponPreDBSummaryType = zod.infer<typeof WeaponPreDBSummarySchema>;
export const WeaponPreDBSummaryListSchema = zod.array(WeaponPreDBSummarySchema);
export type WeaponPreDBSummaryListType = zod.infer<
  typeof WeaponPreDBSummaryListSchema
>;
