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
  accuracyEnum,
  mathOperatorEnum,
  damageCalculationOptionEnum,
  armourPenetrationEnum,
  gearCategoryEnum,
  firearmAccessoryMountLocationEnum,
  augmentationClassificationEnum,
  sourceBookEnum,
  rangeEnum,
  costWeaponEnum,
  restrictionEnum,
} from "../enums.js";
import {
  AvailabilityRatingSchema,
  WeaponXmlSubtypeSchema,
} from "./commonSchemas.js";
import { RequirementsSchema } from "./shared/requiredSchemas.js";

export const AvailabilityWeaponSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityWeaponType = zod.infer<typeof AvailabilityWeaponSchema>;

const InnerCostWeaponSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costWeaponEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostWeaponType = Array<
  zod.infer<typeof InnerCostWeaponSchema> | { subnumbers: CostWeaponType }
>;
export const CostWeaponSchema: zod.ZodType<CostWeaponType> = zod.array(
  zod.union([
    InnerCostWeaponSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostWeaponSchema),
      })
      .strict(),
  ])
);

export const RangeIncrementSchema = zod.array(
  zod.union([
    zod.number(),
    zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
    zod.object({ option: zod.nativeEnum(rangeEnum) }).strict(),
  ])
);
export type RangeIncrementType = zod.infer<typeof RangeIncrementSchema>;
export const RangeSchema = zod
  .object({
    name: zod.string(),
    min: RangeIncrementSchema,
    short: RangeIncrementSchema,
    medium: RangeIncrementSchema,
    long: RangeIncrementSchema,
    extreme: RangeIncrementSchema,
  })
  .strict();

export const RangeListSchema = zod.array(RangeSchema);
export type RangeListType = zod.infer<typeof RangeListSchema>;

export const AccuracySubnumberSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(accuracyEnum) }).strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type AccuracyType = Array<
  | zod.infer<typeof AccuracySubnumberSchema>
  | {
      subnumbers: AccuracyType;
    }
>;
export const AccuracySchema: zod.ZodType<AccuracyType> = zod.array(
  zod.union([
    AccuracySubnumberSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => AccuracySchema),
      })
      .strict(),
  ])
);

export const BlastSchema = zod
  .object({
    type: zod.nativeEnum(blastTypeEnum),
    value: zod.number(),
  })
  .strict();
export type BlastType = zod.infer<typeof BlastSchema>;

// damage is a recursive type
export const DamageSubnumberSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(damageCalculationOptionEnum) }).strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);
export type DamageAmountType = Array<
  | zod.infer<typeof DamageSubnumberSchema>
  | {
      subnumbers: DamageAmountType;
    }
>;
export const DamageAmountSchema: zod.ZodType<DamageAmountType> = zod.array(
  zod.union([
    DamageSubnumberSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => DamageAmountSchema),
      })
      .strict(),
  ])
);

export const DamageSchema = zod.array(
  zod
    .object({
      damageAmount: DamageAmountSchema,
      type: zod.nativeEnum(damageTypeEnum),
      annotation: zod.optional(zod.nativeEnum(damageAnnotationEnum)),
      blast: zod.optional(BlastSchema),
    })
    .strict()
);
export type DamageType = zod.infer<typeof DamageSchema>;

export const RecoilCompensationSchema = zod.number();
export type RecoilCompensationType = zod.infer<typeof RecoilCompensationSchema>;

export const FirearmAmmoSchema = zod
  .object({
    amount: zod.number(),
    reloadMethod: zod.nativeEnum(ammoSourceEnum),
  })
  .strict();
export type FirearmAmmoType = zod.infer<typeof FirearmAmmoSchema>;

export const MountSchema = zod.nativeEnum(firearmAccessoryMountLocationEnum);
export type MountType = zod.infer<typeof MountSchema>;
export const AccessoryMountSchema = zod.array(MountSchema);
export type AccessoryMountType = zod.infer<typeof AccessoryMountSchema>;

export const MeleeOptionsSchema = zod
  .object({
    reach: zod.number(),
  })
  .strict();
export type MeleeOptionsType = zod.infer<typeof MeleeOptionsSchema>;

export const FirearmOptionsSchema = zod
  .object({
    mode: zod.array(zod.nativeEnum(firearmModeEnum)),
    recoilCompensation: RecoilCompensationSchema,
    ammoCategory: zod.optional(WeaponXmlSubtypeSchema),
    ammoSlots: zod.number(),
    underbarrelWeapons: zod.optional(zod.array(zod.string())),
    accessoryMounts: zod.optional(AccessoryMountSchema),
    doubleCostAccessoryMounts: zod.optional(AccessoryMountSchema),
  })
  .strict();
export type FirearmOptionsType = zod.infer<typeof FirearmOptionsSchema>;

export const Mode = zod.array(zod.nativeEnum(firearmModeEnum));
export type ModeType = zod.infer<typeof Mode>;

// outer array is different ap values, inner is calculation for one ap value
export const ArmourPenetrationSubnumberSchema = zod.union([
  zod.object({ option: zod.nativeEnum(armourPenetrationEnum) }).strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
  zod.number(),
]);
export type SingleArmourPenetrationType = Array<
  | zod.infer<typeof ArmourPenetrationSubnumberSchema>
  | {
      subnumbers: SingleArmourPenetrationType;
    }
>;
export const SingleArmourPenetrationSchema: zod.ZodType<SingleArmourPenetrationType> =
  zod.array(
    zod.union([
      ArmourPenetrationSubnumberSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => SingleArmourPenetrationSchema),
        })
        .strict(),
    ])
  );
export const ArmourPenetrationSchema = zod.array(SingleArmourPenetrationSchema);
export type ArmourPenetrationType = zod.infer<typeof ArmourPenetrationSchema>;

export const UnlinkedWeaponTypeInformationSchema = zod.discriminatedUnion(
  "type",
  [
    zod
      .object({
        type: zod.literal(weaponTypeEnum.Melee),
        subtype: zod.nativeEnum(meleeWeaponTypeEnum),
        meleeOptions: MeleeOptionsSchema,
      })
      .strict(),
    zod
      .object({
        type: zod.literal(weaponTypeEnum.Projectile),
        subtype: zod.nativeEnum(projectileWeaponTypeEnum),
        rangeList: zod.array(zod.string()),
      })
      .strict(),
    zod
      .object({
        type: zod.literal(weaponTypeEnum.Firearm),
        subtype: zod.nativeEnum(firearmWeaponTypeEnum),
        firearmOptions: FirearmOptionsSchema,
        rangeList: zod.array(zod.string()),
      })
      .strict(),
    zod
      .object({
        type: zod.literal(weaponTypeEnum.Explosive),
        subtype: zod.nativeEnum(explosiveTypeEnum),
        rangeList: zod.array(zod.string()),
      })
      .strict(),
  ]
);
export type UnlinkedWeaponTypeInformationType = zod.infer<
  typeof UnlinkedWeaponTypeInformationSchema
>;

const FirearmTypeInformationSchema = zod
  .object({
    type: zod.literal(weaponTypeEnum.Firearm),
    subtype: zod.nativeEnum(firearmWeaponTypeEnum),
    firearmOptions: FirearmOptionsSchema,
    rangeList: RangeListSchema,
  })
  .strict();
export type FirearmTypeInformationType = zod.infer<
  typeof FirearmTypeInformationSchema
>;
const MeleeTypeInformationSchema = zod
  .object({
    type: zod.literal(weaponTypeEnum.Melee),
    subtype: zod.nativeEnum(meleeWeaponTypeEnum),
    meleeOptions: MeleeOptionsSchema,
  })
  .strict();
export type MeleeTypeInformationType = zod.infer<
  typeof MeleeTypeInformationSchema
>;
const ProjectileTypeInformationSchema = zod
  .object({
    type: zod.literal(weaponTypeEnum.Projectile),
    subtype: zod.nativeEnum(projectileWeaponTypeEnum),
    rangeList: RangeListSchema,
  })
  .strict();
export type ProjectileTypeInformationType = zod.infer<
  typeof ProjectileTypeInformationSchema
>;
const ExplosiveTypeInformationSchema = zod
  .object({
    type: zod.literal(weaponTypeEnum.Explosive),
    subtype: zod.nativeEnum(explosiveTypeEnum),
    rangeList: RangeListSchema,
  })
  .strict();
export type ExplosiveTypeInformationType = zod.infer<
  typeof ExplosiveTypeInformationSchema
>;

export const WeaponTypeInformationSchema = zod.discriminatedUnion("type", [
  FirearmTypeInformationSchema,
  MeleeTypeInformationSchema,
  ProjectileTypeInformationSchema,
  ExplosiveTypeInformationSchema,
]);
export type WeaponTypeInformationType = zod.infer<
  typeof WeaponTypeInformationSchema
>;

const UseGearSchema = zod
  .object({
    name: zod.string(),
    category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
    rating: zod.optional(zod.number()),
  })
  .strict();
export type useGearType = zod.infer<typeof UseGearSchema>;

export const UseGearListSchema = zod.array(UseGearSchema);
export type UseGearListType = zod.infer<typeof UseGearListSchema>;

const UnlinkedAccessorySchema = zod
  .object({
    name: zod.string(),
    mount: zod.optional(zod.array(MountSchema)),
    rating: zod.optional(zod.number()),
    gears: zod.optional(UseGearListSchema),
  })
  .strict();
export type UnlinkedAccessoryType = zod.infer<typeof UnlinkedAccessorySchema>;
export const UnlinkedAccessoryListSchema = zod.array(UnlinkedAccessorySchema);
export type UnlinkedAccessoryListType = zod.infer<
  typeof UnlinkedAccessoryListSchema
>;

export const AmmunitionSingleSchema = zod
  .object({
    capacity: zod.optional(zod.number()),
    numberOfAmmunitionHolders: zod.optional(zod.number()),
    reloadMethod: zod.nativeEnum(ammoSourceEnum),
  })
  .strict();
export type AmmunitionSingleType = zod.infer<typeof AmmunitionSingleSchema>;
export const AmmunitionSchema = zod.array(AmmunitionSingleSchema);
export type AmmunitionType = zod.infer<typeof AmmunitionSchema>;

const AllowedGearSchema = zod.array(zod.nativeEnum(gearCategoryEnum));

export const WeaponUnlinkedSummarySchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    typeInformation: UnlinkedWeaponTypeInformationSchema,
    concealability: zod.number(),
    accuracy: AccuracySchema,
    damage: DamageSchema,
    armourPenetration: ArmourPenetrationSchema,
    ammunition: zod.optional(AmmunitionSchema),
    availability: AvailabilityWeaponSchema,
    cost: CostWeaponSchema,
    allowedGear: zod.optional(AllowedGearSchema),
    accessories: zod.optional(UnlinkedAccessoryListSchema),
    allowAccessories: zod.boolean(),
    isCyberware: zod.boolean(),
    userSelectable: zod.optional(zod.literal(false)),
    augmentationType: zod.nativeEnum(augmentationClassificationEnum),
    addWeapons: zod.optional(zod.array(zod.string())),
    hostWeaponRequirements: zod.optional(
      zod
        .object({
          weaponRequirements: zod.optional(RequirementsSchema),
          hostWeaponMountsRequired: zod.optional(AccessoryMountSchema),
        })
        .strict()
    ),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
    relatedSkill: zod.string(),
    relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
    rating: zod.optional(zod.number()),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type WeaponUnlinkedSummaryType = zod.infer<
  typeof WeaponUnlinkedSummarySchema
>;
export const WeaponUnlinkedSummaryListSchema = zod.array(
  WeaponUnlinkedSummarySchema
);
export type WeaponUnlinkedSummaryListType = zod.infer<
  typeof WeaponUnlinkedSummaryListSchema
>;

export const WeaponLinkedSchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    typeInformation: WeaponTypeInformationSchema,
    concealability: zod.number(),
    accuracy: AccuracySchema,
    damage: DamageSchema,
    armourPenetration: ArmourPenetrationSchema,
    ammunition: zod.optional(AmmunitionSchema),
    availability: AvailabilityWeaponSchema,
    cost: CostWeaponSchema,
    allowedGear: zod.optional(AllowedGearSchema),
    accessories: zod.optional(UnlinkedAccessoryListSchema),
    allowAccessories: zod.boolean(),
    isCyberware: zod.boolean(),
    userSelectable: zod.optional(zod.literal(false)),
    augmentationType: zod.nativeEnum(augmentationClassificationEnum),
    addWeapons: zod.optional(zod.array(zod.string())),
    hostWeaponRequirements: zod.optional(
      zod
        .object({
          weaponRequirements: zod.optional(RequirementsSchema),
          hostWeaponMountsRequired: zod.optional(AccessoryMountSchema),
        })
        .strict()
    ),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
    relatedSkill: zod.string(),
    relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type WeaponLinkedType = zod.infer<typeof WeaponLinkedSchema>;
export const WeaponLinkedListSchema = zod.array(WeaponLinkedSchema);
export type WeaponLinkedListType = zod.infer<typeof WeaponLinkedListSchema>;
