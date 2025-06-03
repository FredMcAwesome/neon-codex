import {
  ammoSourceEnum,
  mathOperatorEnum,
  ratingMeaningEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModTypeEnum,
  vehicleModRatingEnum,
  cyberwareCategoryEnum,
  sourceBookEnum,
  firearmWeaponTypeEnum,
} from "../../../enums.js";

import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { RangeCostSchema } from "../../shared/commonSchemas.js";
import { type } from "arktype";

const VehicleModRatingSchema = type
  .or(
    {
      option: type.valueOf(vehicleModRatingEnum),
    },
    {
      operator: type.valueOf(mathOperatorEnum),
    },
    "number"
  )
  .array();
export type VehicleModRatingType = typeof VehicleModRatingSchema.infer;

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

const SlotCostSchema = type.or(PartialSlotCostSchema, {
  ratingLinked: PartialSlotCostSchema.array(),
});
export type SlotCostType = typeof SlotCostSchema.infer;

const InnerAvailabilityRatingVehicleModSchema = type.or(
  { option: type.valueOf(vehicleModAttributeEnum) },
  "number",
  { operator: type.valueOf(mathOperatorEnum) }
);

export type AvailabilityRatingVehicleModType = Array<
  | typeof InnerAvailabilityRatingVehicleModSchema.infer
  | { subnumbers: AvailabilityRatingVehicleModType }
>;
const { AvailabilityRatingVehicleModSchema } = type.module({
  AvailabilityRatingVehicleModSchema: [
    [
      InnerAvailabilityRatingVehicleModSchema,
      "|",
      {
        subnumbers: "AvailabilityRatingVehicleModSchema ",
      },
    ],
    "[]",
  ],
});
const PartialAvailabilityVehicleModSchema = type({
  rating: AvailabilityRatingVehicleModSchema,
  restriction: type.valueOf(restrictionEnum),
});
const AvailabilityVehicleModSchema = type.or(
  PartialAvailabilityVehicleModSchema,
  {
    ratingLinked: PartialAvailabilityVehicleModSchema.array(),
  }
);
export type AvailabilityVehicleModType =
  typeof AvailabilityVehicleModSchema.infer;

const InnerCostVehicleModSchema = type.or(
  { option: type.valueOf(vehicleModAttributeEnum) },
  "number",
  { operator: type.valueOf(mathOperatorEnum) }
);

export type PartialCostVehicleModType = Array<
  | typeof InnerCostVehicleModSchema.infer
  | { subnumbers: PartialCostVehicleModType }
>;
const { PartialCostVehicleModSchema } = type.module({
  PartialCostVehicleModSchema: [
    [
      InnerCostVehicleModSchema,
      "|",
      {
        subnumbers: "PartialCostVehicleModSchema",
      },
    ],
    "[]",
  ],
});

const CostVehicleModSchema = type.or(
  RangeCostSchema,
  PartialCostVehicleModSchema,
  {
    ratingLinked: PartialCostVehicleModSchema.array(),
  }
);
export type CostVehicleModType = typeof CostVehicleModSchema.infer;

export const VehicleModSchema = type({
  name: "string",
  description: "string",
  type: type.valueOf(vehicleModTypeEnum),
  maxRating: VehicleModRatingSchema,
  "minRating?": VehicleModRatingSchema,
  "ratingMeaning?": type.valueOf(ratingMeaningEnum),
  "capacity?": "number",
  "isDowngrade?": "true",
  // TODO: Make this a child of vehicleModSchema
  // combine with allowedSubsystemList, addPhysicalBoxes
  "requiresDroneParent?": "true",
  "allowedSubsystemList?": type.valueOf(cyberwareCategoryEnum).array(),
  "addPhysicalBoxes?": "number",
  slotCost: SlotCostSchema,
  "weaponMountValidCategoryList?": type.valueOf(firearmWeaponTypeEnum).array(),
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  "userSelectable?": "false",
  availability: AvailabilityVehicleModSchema,
  cost: CostVehicleModSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});

export type VehicleModType = typeof VehicleModSchema.infer;
export const VehicleModListSchema = type(VehicleModSchema.array());
export type VehicleModListType = typeof VehicleModListSchema.infer;

export const CustomisedVehicleModSchema = type({
  baseMod: "string",
  "rating?": "number",
  // display this like 'name (specificOption)'
  "specificOption?": "string",
  "subsystemList?": "string[]",
});
export type CustomisedVehicleModType = typeof CustomisedVehicleModSchema.infer;

export const CustomisedVehicleModListSchema = type(
  CustomisedVehicleModSchema.array()
);
export type CustomisedVehicleModListType =
  typeof CustomisedVehicleModListSchema.infer;
