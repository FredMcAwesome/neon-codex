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
import { type } from "arktype";

export const AvailabilityWeaponSchema = type({
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
export type AvailabilityWeaponType = typeof AvailabilityWeaponSchema.infer;

const InnerCostWeaponSchema = type.or(
  "number",
  {
    option: type.valueOf(costEnum),
  },
  { operator: type.valueOf(mathOperatorEnum) }
);

export type CostWeaponType = Array<
  typeof InnerCostWeaponSchema.infer | { subnumbers: CostWeaponType }
>;
export const { CostWeaponSchema } = type.module({
  CostWeaponSchema: [
    [
      InnerCostWeaponSchema,
      "|",
      {
        subnumbers: "CostWeaponSchema",
      },
    ],
    "[]",
  ],
});

export const RangeIncrementSchema = type(
  type.or(
    "number",
    { operator: type.valueOf(mathOperatorEnum) },
    { option: type.valueOf(rangeEnum) }
  )
).array();
export type RangeIncrementType = typeof RangeIncrementSchema.infer;
export const RangeSchema = type({
  name: "string",
  min: RangeIncrementSchema,
  short: RangeIncrementSchema,
  medium: RangeIncrementSchema,
  long: RangeIncrementSchema,
  extreme: RangeIncrementSchema,
});
export type RangeType = typeof RangeSchema.infer;

export const RangeListSchema = type(RangeSchema.array());
export type RangeListType = typeof RangeListSchema.infer;

export const AccuracySubnumberSchema = type.or(
  "number",
  { option: type.valueOf(accuracyEnum) },
  { operator: type.valueOf(mathOperatorEnum) }
);

export type AccuracyType = Array<
  | typeof AccuracySubnumberSchema.infer
  | {
      subnumbers: AccuracyType;
    }
>;
export const { AccuracySchema } = type.module({
  AccuracySchema: [
    [
      AccuracySubnumberSchema,
      "|",
      {
        subnumbers: "AccuracySchema",
      },
    ],
    "[]",
  ],
});

export const RecoilCompensationSchema = type("number");
export type RecoilCompensationType = typeof RecoilCompensationSchema.infer;

export const FirearmAmmoSchema = type({
  amount: "number",
  reloadMethod: type.valueOf(ammoSourceEnum),
});
export type FirearmAmmoType = typeof FirearmAmmoSchema.infer;

export const MeleeOptionsSchema = type({
  reach: "number",
});
export type MeleeOptionsType = typeof MeleeOptionsSchema.infer;

export const FirearmOptionsSchema = type({
  mode: type.valueOf(firearmModeEnum).array(),
  recoilCompensation: RecoilCompensationSchema,
  "ammoCategory?": WeaponXmlSubtypeSchema,
  ammoSlots: "number",
  "underbarrelWeapons?": "string[]",
  "accessoryMounts?": AccessoryMountSchema,
  "doubleCostAccessoryMounts?": AccessoryMountSchema,
});
export type FirearmOptionsType = typeof FirearmOptionsSchema.infer;

export const Mode = type(type.valueOf(firearmModeEnum).array());
export type ModeType = typeof Mode.infer;

// outer array is different ap values, inner is calculation for one ap value
export const ArmourPenetrationSubnumberSchema = type.or(
  { option: type.valueOf(armourPenetrationEnum) },
  { operator: type.valueOf(mathOperatorEnum) },
  "number"
);
export type SingleArmourPenetrationType = Array<
  | typeof ArmourPenetrationSubnumberSchema.infer
  | {
      subnumbers: SingleArmourPenetrationType;
    }
>;
export const { SingleArmourPenetrationSchema } = type.module({
  SingleArmourPenetrationSchema: [
    [
      ArmourPenetrationSubnumberSchema,
      "|",
      {
        subnumbers: "SingleArmourPenetrationSchema",
      },
    ],
    "[]",
  ],
});
export const ArmourPenetrationSchema = type(
  SingleArmourPenetrationSchema.array()
);
export type ArmourPenetrationType = typeof ArmourPenetrationSchema.infer;

const WeaponPartialSchema = type({
  // id: "string",
  name: "string",
  description: "string",
  "wireless?": "string",
  concealability: "number",
  accuracy: AccuracySchema,
  damage: DamageSchema,
  armourPenetration: ArmourPenetrationSchema,
  "ammunition?": AmmunitionSchema,
  "allowedGearList?": "string[]",
  "allowedGearCategories?": type.valueOf(gearCategoryEnum).array(),
  "includedAccessoryList?": CustomisedWeaponAccessoryListSchema,
  allowAccessories: "boolean",
  "userSelectable?": "false",
  "augmentationType?": type.valueOf(augmentationTypeEnum),
  "alternativeWeaponForms?": "string[]",
  "hostWeaponRequirements?": {
    "weaponRequirements?": RequirementsSchema,
    "hostWeaponMountsRequired?": AccessoryMountSchema,
  },
  relatedSkill: "string",
  "relatedSkillSpecialisations?": "string[]",
  availability: AvailabilityWeaponSchema,
  cost: CostWeaponSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export const MeleeWeaponSchema = WeaponPartialSchema.and({
  type: type.unit(weaponTypeEnum.Melee),
  subtype: type.valueOf(meleeWeaponTypeEnum),
  meleeOptions: MeleeOptionsSchema,
});
export type MeleeWeaponType = typeof MeleeWeaponSchema.infer;
export const ProjectileWeaponSchema = WeaponPartialSchema.and({
  type: type.unit(weaponTypeEnum.Projectile),
  subtype: type.valueOf(projectileWeaponTypeEnum),
  "extraClassification?": type.valueOf(weaponExtraClassificationEnum),
  rangeList: "string[]",
});
export type ProjectileWeaponType = typeof ProjectileWeaponSchema.infer;
export const FirearmWeaponSchema = WeaponPartialSchema.and({
  type: type.unit(weaponTypeEnum.Firearm),
  subtype: type.valueOf(firearmWeaponTypeEnum),
  "extraClassification?": type.valueOf(weaponExtraClassificationEnum),
  firearmOptions: FirearmOptionsSchema,
  rangeList: "string[]",
});
export type FirearmWeaponType = typeof FirearmWeaponSchema.infer;

export const ExplosiveWeaponSchema = WeaponPartialSchema.and({
  type: type.unit(weaponTypeEnum.Explosive),
  subtype: type.valueOf(explosiveTypeEnum),
  rangeList: "string[]",
});
export type ExplosiveWeaponType = typeof ExplosiveWeaponSchema.infer;

export const WeaponSchema = type.or(
  FirearmWeaponSchema,
  MeleeWeaponSchema,
  ProjectileWeaponSchema,
  ExplosiveWeaponSchema
);

export type WeaponType = typeof WeaponSchema.infer;
export const WeaponListSchema = type(WeaponSchema.array());
export type WeaponListType = typeof WeaponListSchema.infer;

export const CustomisedWeaponSchema = type({
  baseWeapon: "string",
  // This overrides baseWeapon accessories
  "accessoryList?": CustomisedWeaponAccessoryListSchema,
  "rating?": "number",
  "customName?": "string",
});
export type CustomisedWeaponType = typeof CustomisedWeaponSchema.infer;
export const CustomisedWeaponListSchema = type(CustomisedWeaponSchema.array());
export type CustomisedWeaponListType = typeof CustomisedWeaponListSchema.infer;
