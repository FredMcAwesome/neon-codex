import { z as zod } from "zod";
import {
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  ammoSourceEnum,
  weaponTypeEnum,
  explosiveTypeEnum,
  accuracyEnum,
  mathOperatorEnum,
  armourPenetrationEnum,
  augmentationTypeEnum,
  sourceBookEnum,
  rangeEnum,
  costEnum,
  restrictionEnum,
  weaponExtraClassificationEnum,
  gearCategoryEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  WeaponXmlSubtypeSchema,
} from "../../shared/commonSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import {
  AccessoryMountSchema,
  AmmunitionSchema,
  DamageSchema,
} from "../../shared/weaponSharedSchemas.js";
import { CustomisedWeaponAccessoryListSchema } from "./weaponAccessorySchemas.js";

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
      option: zod.nativeEnum(costEnum),
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
export type RangeType = zod.infer<typeof RangeSchema>;

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

export const RecoilCompensationSchema = zod.number();
export type RecoilCompensationType = zod.infer<typeof RecoilCompensationSchema>;

export const FirearmAmmoSchema = zod
  .object({
    amount: zod.number(),
    reloadMethod: zod.nativeEnum(ammoSourceEnum),
  })
  .strict();
export type FirearmAmmoType = zod.infer<typeof FirearmAmmoSchema>;

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

const WeaponPartialSchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
    concealability: zod.number(),
    accuracy: AccuracySchema,
    damage: DamageSchema,
    armourPenetration: ArmourPenetrationSchema,
    ammunition: zod.optional(AmmunitionSchema),
    allowedGearList: zod.optional(zod.array(zod.string())),
    allowedGearCategories: zod.optional(
      zod.array(zod.nativeEnum(gearCategoryEnum))
    ),
    includedAccessoryList: zod.optional(CustomisedWeaponAccessoryListSchema),
    allowAccessories: zod.boolean(),
    userSelectable: zod.optional(zod.literal(false)),
    augmentationType: zod.optional(zod.nativeEnum(augmentationTypeEnum)),
    alternativeWeaponForms: zod.optional(zod.array(zod.string())),
    hostWeaponRequirements: zod.optional(
      zod
        .object({
          weaponRequirements: zod.optional(RequirementsSchema),
          hostWeaponMountsRequired: zod.optional(AccessoryMountSchema),
        })
        .strict()
    ),
    relatedSkill: zod.string(),
    relatedSkillSpecialisations: zod.optional(zod.array(zod.string())),
    availability: AvailabilityWeaponSchema,
    cost: CostWeaponSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export const MeleeWeaponSchema = WeaponPartialSchema.extend({
  type: zod.literal(weaponTypeEnum.Melee),
  subtype: zod.nativeEnum(meleeWeaponTypeEnum),
  meleeOptions: MeleeOptionsSchema,
}).strict();
export type MeleeWeaponType = zod.infer<typeof MeleeWeaponSchema>;
export const ProjectileWeaponSchema = WeaponPartialSchema.extend({
  type: zod.literal(weaponTypeEnum.Projectile),
  subtype: zod.nativeEnum(projectileWeaponTypeEnum),
  extraClassification: zod.optional(
    zod.nativeEnum(weaponExtraClassificationEnum)
  ),
  rangeList: zod.array(zod.string()),
}).strict();
export type ProjectileWeaponType = zod.infer<typeof ProjectileWeaponSchema>;
export const FirearmWeaponSchema = WeaponPartialSchema.extend({
  type: zod.literal(weaponTypeEnum.Firearm),
  subtype: zod.nativeEnum(firearmWeaponTypeEnum),
  extraClassification: zod.optional(
    zod.nativeEnum(weaponExtraClassificationEnum)
  ),
  firearmOptions: FirearmOptionsSchema,
  rangeList: zod.array(zod.string()),
}).strict();
export type FirearmWeaponType = zod.infer<typeof FirearmWeaponSchema>;

export const ExplosiveWeaponSchema = WeaponPartialSchema.extend({
  type: zod.literal(weaponTypeEnum.Explosive),
  subtype: zod.nativeEnum(explosiveTypeEnum),
  rangeList: zod.array(zod.string()),
}).strict();
export type ExplosiveWeaponType = zod.infer<typeof ExplosiveWeaponSchema>;

export const WeaponSchema = zod.discriminatedUnion("type", [
  FirearmWeaponSchema,
  MeleeWeaponSchema,
  ProjectileWeaponSchema,
  ExplosiveWeaponSchema,
]);

export type WeaponType = zod.infer<typeof WeaponSchema>;
export const WeaponListSchema = zod.array(WeaponSchema);
export type WeaponListType = zod.infer<typeof WeaponListSchema>;

export const CustomisedWeaponSchema = zod
  .object({
    baseWeapon: zod.string(),
    // This overrides baseWeapon accessories
    accessoryList: zod.optional(CustomisedWeaponAccessoryListSchema),
    rating: zod.optional(zod.number()),
    customName: zod.optional(zod.string()),
  })
  .strict();
export type CustomisedWeaponType = zod.infer<typeof CustomisedWeaponSchema>;
export const CustomisedWeaponListSchema = zod.array(CustomisedWeaponSchema);
export type CustomisedWeaponListType = zod.infer<
  typeof CustomisedWeaponListSchema
>;
