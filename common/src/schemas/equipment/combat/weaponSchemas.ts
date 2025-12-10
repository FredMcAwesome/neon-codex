import {
  firearmModeEnum,
  firearmWeaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  ammoSourceEnum,
  weaponCategoryEnum,
  explosiveTypeEnum,
  mathOperatorEnum,
  augmentationCategoryEnum,
  sourceBookEnum,
  rangeEnum,
  costEnum,
  restrictionEnum,
  weaponExtraClassificationEnum,
  gearCategoryEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  WeaponSubtypeSchema,
} from "../../shared/commonSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import {
  AccessoryMountSchema,
  AccuracySchema,
  AmmunitionSchema,
  ArmourPenetrationSchema,
  DamageSchema,
} from "../../shared/weaponSharedSchemas.js";
import {
  CustomisedWeaponAccessoryListSchema,
  CustomisedWeaponAccessoryLoadedListSchema,
} from "./weaponAccessorySchemas.js";
import { type } from "arktype";

export const AvailabilityWeaponSchema = type({
  "+": "reject",
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
export type AvailabilityWeaponType = typeof AvailabilityWeaponSchema.infer;

const InnerCostWeaponSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(costEnum),
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
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
        "+": "reject",
        subnumbers: "CostWeaponSchema",
      },
    ],
    "[]",
  ],
});

export const RangeIncrementSchema = type(
  type.or(
    "number",
    type({
      "+": "reject",
      operator: type.valueOf(mathOperatorEnum),
    }),
    type({
      "+": "reject",
      option: type.valueOf(rangeEnum),
    })
  )
).array();
export type RangeIncrementType = typeof RangeIncrementSchema.infer;
export const RangeSchema = type({
  "+": "reject",
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

export const RecoilCompensationSchema = type("number");
export type RecoilCompensationType = typeof RecoilCompensationSchema.infer;

export const FirearmAmmoSchema = type({
  "+": "reject",
  amount: "number",
  reloadMethod: type.valueOf(ammoSourceEnum),
});
export type FirearmAmmoType = typeof FirearmAmmoSchema.infer;

export const MeleeOptionsSchema = type({ "+": "reject", reach: "number" });
export type MeleeOptionsType = typeof MeleeOptionsSchema.infer;

export const FirearmOptionsSchema = type({
  "+": "reject",
  mode: type.valueOf(firearmModeEnum).array(),
  recoilCompensation: RecoilCompensationSchema,
  "ammoCategory?": WeaponSubtypeSchema,
  ammoSlots: "number",
  "underbarrelWeapons?": "string[]",
  "accessoryMounts?": AccessoryMountSchema,
  "doubleCostAccessoryMounts?": AccessoryMountSchema,
});
export type FirearmOptionsType = typeof FirearmOptionsSchema.infer;

export const Mode = type(type.valueOf(firearmModeEnum).array());
export type ModeType = typeof Mode.infer;
const WeaponPartialSchema = type({
  "+": "reject",
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
  "augmentationCategory?": type.valueOf(augmentationCategoryEnum),
  "alternativeWeaponForms?": "string[]",
  "hostWeaponRequirements?": {
    "weaponRequirements?": RequirementsSchema,
    "hostWeaponMountsRequired?": AccessoryMountSchema,
  },
  relatedSkill: "string",
  "relatedSkillSpecialisationList?": "string[]",
  availability: AvailabilityWeaponSchema,
  cost: CostWeaponSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export const MeleeWeaponSchema = WeaponPartialSchema.merge({
  category: type.unit(weaponCategoryEnum.Melee),
  subtype: type.valueOf(meleeWeaponTypeEnum),
  meleeOptions: MeleeOptionsSchema,
});
export type MeleeWeaponType = typeof MeleeWeaponSchema.infer;
export const ProjectileWeaponSchema = WeaponPartialSchema.merge({
  category: type.unit(weaponCategoryEnum.Projectile),
  subtype: type.valueOf(projectileWeaponTypeEnum),
  "extraClassification?": type.valueOf(weaponExtraClassificationEnum),
  rangeList: "string[]",
});
export type ProjectileWeaponType = typeof ProjectileWeaponSchema.infer;
export const FirearmWeaponSchema = WeaponPartialSchema.merge({
  category: type.unit(weaponCategoryEnum.Firearm),
  subtype: type.valueOf(firearmWeaponTypeEnum),
  "extraClassification?": type.valueOf(weaponExtraClassificationEnum),
  firearmOptions: FirearmOptionsSchema,
  rangeList: "string[]",
});
export type FirearmWeaponType = typeof FirearmWeaponSchema.infer;

export const ExplosiveWeaponSchema = WeaponPartialSchema.merge({
  category: type.unit(weaponCategoryEnum.Explosive),
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
  "+": "reject",
  baseWeapon: "string",
  // This overrides baseWeapon accessories
  "accessoryList?": CustomisedWeaponAccessoryListSchema,
  "rating?": "number",
  "customName?": "string",
});
export type CustomisedWeaponType = typeof CustomisedWeaponSchema.infer;
export const CustomisedWeaponListSchema = type(CustomisedWeaponSchema.array());
export type CustomisedWeaponListType = typeof CustomisedWeaponListSchema.infer;

export const CustomisedWeaponLoadedSchema = type({
  "+": "reject",
  baseWeapon: WeaponSchema,
  // This overrides baseWeapon accessories
  "accessoryList?": CustomisedWeaponAccessoryLoadedListSchema,
  "rating?": "number",
  "customName?": "string",
});
export type CustomisedWeaponLoadedType =
  typeof CustomisedWeaponLoadedSchema.infer;
export const CustomisedWeaponLoadedListSchema = type(
  CustomisedWeaponLoadedSchema.array()
);
export type CustomisedWeaponLoadedListType =
  typeof CustomisedWeaponLoadedListSchema.infer;
