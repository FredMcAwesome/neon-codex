import {
  damageTypeEnum,
  mathOperatorEnum,
  standardCalculationEnum,
  sourceBookEnum,
  ammoOptionEnum,
  costEnum,
  restrictionEnum,
  gearCategoryEnum,
} from "../../../enums.js";
import { AvailabilityRatingSchema } from "../../shared/commonSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { CustomisedGearListSchema } from "../other/gearSchemas.js";
import {
  AccessoryMountSchema,
  AmmunitionSingleSchema,
} from "../../shared/weaponSharedSchemas.js";
import { type } from "arktype";

export const AvailabilityWeaponAccessorySchema = type({
  "+": "reject",
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
export type AvailabilityWeaponAccessoryType =
  typeof AvailabilityWeaponAccessorySchema.infer;

const InnerCostWeaponAccessorySchema = type.or(
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

export type CostWeaponAccessoryType = Array<
  | typeof InnerCostWeaponAccessorySchema.infer
  | { subnumbers: CostWeaponAccessoryType }
>;
export const { CostWeaponAccessorySchema } = type.module({
  CostWeaponAccessorySchema: [
    [
      InnerCostWeaponAccessorySchema,
      "|",
      {
        subnumbers: "CostWeaponAccessorySchema",
      },
    ],
    "[]",
  ],
});

export const AmmoCapacityCalculationSubnumberSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(ammoOptionEnum),
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

export type AmmoCapacityCalculationType = Array<
  | typeof AmmoCapacityCalculationSubnumberSchema.infer
  | {
      subnumbers: AmmoCapacityCalculationType;
    }
>;
export const { AmmoCapacityCalculationSchema } = type.module({
  AmmoCapacityCalculationSchema: [
    [
      AmmoCapacityCalculationSubnumberSchema,
      "|",
      {
        subnumbers: "AmmoCapacityCalculationSchema ",
      },
    ],
    "[]",
  ],
});

const ConcealabilityModificationSchema = type.or(
  "number",
  type.valueOf(standardCalculationEnum)
);
export type ConcealabilityModificationType =
  typeof ConcealabilityModificationSchema.infer;

export const WeaponAccessorySchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  "wireless?": "string",
  maxRating: "number",
  "isWeapon?": "true",
  "accuracyIncrease?": "number",
  "damageIncrease?": "number",
  "newDamageType?": type.valueOf(damageTypeEnum),
  "reachIncrease?": "number",
  "armourPiercingIncrease?": "number",
  "recoilCompensationIncrease?": "number",
  "recoilCompensationType?": "number", // items from the same recoilCompensationType are incompatible with each other
  "deploymentRequired?": "true",
  "accessoryCostMultiplier?": "number",
  "allowedGearList?": "string[]",
  "allowedGearCategories?": type.valueOf(gearCategoryEnum).array(),
  "includedGearList?": CustomisedGearListSchema,
  "specialModification?": "true",
  "extraAmmoSlots?": "number",
  "ammoCapacityCalculation?": AmmoCapacityCalculationSchema,
  "newAmmoType?": AmmunitionSingleSchema,
  "hostWeaponMountsRequired?": AccessoryMountSchema,
  "hostWeaponRequirements?": RequirementsSchema,
  "hostWeaponRestrictions?": RequirementsSchema,
  "rangePenaltyDecrease?": "number",
  "concealabilityModification?": ConcealabilityModificationSchema,
  "userSelectable?": "false",
  availability: AvailabilityWeaponAccessorySchema,
  cost: CostWeaponAccessorySchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type WeaponAccessoryType = typeof WeaponAccessorySchema.infer;
export const WeaponAccessoryListSchema = type(WeaponAccessorySchema.array());
export type WeaponAccessoryListType = typeof WeaponAccessoryListSchema.infer;

export const CustomisedWeaponAccessorySchema = type({
  "+": "reject",
  baseAccessory: "string",
  gearList: CustomisedGearListSchema,
  mountList: AccessoryMountSchema,
  "rating?": "number",
});
export type CustomisedWeaponAccessoryType =
  typeof CustomisedWeaponAccessorySchema.infer;

export const CustomisedWeaponAccessoryListSchema = type(
  CustomisedWeaponAccessorySchema.array()
);
export type CustomisedWeaponAccessoryListType =
  typeof CustomisedWeaponAccessoryListSchema.infer;
