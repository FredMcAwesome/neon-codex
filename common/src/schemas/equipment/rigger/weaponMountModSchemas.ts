import {
  ammoSourceEnum,
  mathOperatorEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModTypeEnum,
  vehicleModRatingEnum,
  sourceBookEnum,
} from "../../../enums.js";

import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { RangeCostSchema } from "../../shared/commonSchemas.js";
import { type } from "arktype";

const WeaponMountModRatingSchema = type(
  type.or(
    {
      option: type.valueOf(vehicleModRatingEnum),
    },
    { operator: type.valueOf(mathOperatorEnum) },
    "number"
  )
).array();
export type WeaponMountModRatingType = typeof WeaponMountModRatingSchema.infer;

const ReplaceAmmoSchema = type({
  reloadMethod: type.valueOf(ammoSourceEnum),
  "capacity?": "number",
  "numberOfAmmunitionHolders?": "number",
}).array();
export type ReplaceAmmoType = typeof ReplaceAmmoSchema.infer;

const InnerSlotCostSchema = type.or(
  {
    option: type.valueOf(vehicleModAttributeEnum),
  },
  { operator: type.valueOf(mathOperatorEnum) },
  "number"
);

export type PartialSlotCostType = Array<
  typeof InnerSlotCostSchema.infer | { subnumbers: PartialSlotCostType }
>;
const { PartialSlotCostSchema } = type.module({
  PartialSlotCostSchema: [
    [
      InnerSlotCostSchema,
      "|",
      {
        subnumbers: "PartialSlotCostSchema",
      },
    ],
    "[]",
  ],
});

const WeaponMountSlotCostSchema = type.or(PartialSlotCostSchema, {
  ratingLinked: PartialSlotCostSchema.array(),
});
export type WeaponMountSlotCostType = typeof WeaponMountSlotCostSchema.infer;

const AvailabilityWeaponMountModSchema = type({
  rating: "number",
  restriction: type.valueOf(restrictionEnum),
});
export type AvailabilityWeaponMountModType =
  typeof AvailabilityWeaponMountModSchema.infer;

const InnerCostVehicleModSchema = type.or(
  { option: type.valueOf(vehicleModAttributeEnum) },
  "number",
  { operator: type.valueOf(mathOperatorEnum) }
);

const { PartialCostWeaponMountModSchema } = type.module({
  PartialCostWeaponMountModSchema: [
    [
      InnerCostVehicleModSchema,
      "|",
      {
        subnumbers: "PartialCostWeaponMountModSchema ",
      },
    ],
    "[]",
  ],
});
const CostWeaponMountModSchema = type.or(
  RangeCostSchema,
  PartialCostWeaponMountModSchema,
  {
    ratingLinked: PartialCostWeaponMountModSchema.array(),
  }
);
export type CostWeaponMountModType = typeof CostWeaponMountModSchema.infer;

export const WeaponMountModSchema = type({
  name: "string",
  description: "string",
  type: type.valueOf(vehicleModTypeEnum),
  slotCost: WeaponMountSlotCostSchema,
  "additionalAmmo?": "number",
  "percentageAmmoIncrease?": "number",
  "replaceAmmo?": ReplaceAmmoSchema,
  "requirements?": RequirementsSchema,
  "userSelectable?": "false",
  availability: AvailabilityWeaponMountModSchema,
  cost: CostWeaponMountModSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});

export type WeaponMountModType = typeof WeaponMountModSchema.infer;
export const WeaponMountModListSchema = type(WeaponMountModSchema.array());
export type WeaponMountModListType = typeof WeaponMountModListSchema.infer;
