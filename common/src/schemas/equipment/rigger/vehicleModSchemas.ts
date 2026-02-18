import {
  ammoSourceEnum,
  mathOperatorEnum,
  ratingMeaningEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModCategoryEnum,
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

export const ReplaceAmmoSchema = type({
  "+": "reject",
  reloadMethod: type.valueOf(ammoSourceEnum),
  "capacity?": "number",
  "numberOfAmmunitionHolders?": "number",
}).array();
export type ReplaceAmmoType = typeof ReplaceAmmoSchema.infer;

const InnerSlotCostSchema = type.or(
  type({
    "+": "reject",
    option: type.valueOf(vehicleModAttributeEnum),
  }),
  type({ operator: type.valueOf(mathOperatorEnum) }),
  "number"
);

export type PartialSlotCostType = Array<
  typeof InnerSlotCostSchema.infer | { subnumbers: PartialSlotCostType }
>;
export const { PartialSlotCostSchema } = type.module({
  PartialSlotCostSchema: [
    [
      InnerSlotCostSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "PartialSlotCostSchema",
      },
    ],
    "[]",
  ],
});

const SlotCostSchema = type.or(
  PartialSlotCostSchema,
  type({
    "+": "reject",
    ratingLinked: PartialSlotCostSchema.array(),
  })
);
export type SlotCostType = typeof SlotCostSchema.infer;

const InnerAvailabilityRatingVehicleModSchema = type.or(
  type({
    "+": "reject",
    option: type.valueOf(vehicleModAttributeEnum),
  }),
  "number",
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
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
        "+": "reject",
        subnumbers: "AvailabilityRatingVehicleModSchema ",
      },
    ],
    "[]",
  ],
});
const PartialAvailabilityVehicleModSchema = type({
  "+": "reject",
  rating: AvailabilityRatingVehicleModSchema,
  restriction: type.valueOf(restrictionEnum),
});
const AvailabilityVehicleModSchema = type.or(
  PartialAvailabilityVehicleModSchema,
  type({
    "+": "reject",
    ratingLinked: PartialAvailabilityVehicleModSchema.array(),
  })
);
export type AvailabilityVehicleModType =
  typeof AvailabilityVehicleModSchema.infer;

const InnerCostVehicleModSchema = type.or(
  type({
    "+": "reject",
    option: type.valueOf(vehicleModAttributeEnum),
  }),
  "number",
  type({ operator: type.valueOf(mathOperatorEnum) })
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
        "+": "reject",
        subnumbers: "PartialCostVehicleModSchema",
      },
    ],
    "[]",
  ],
});

const CostVehicleModSchema = type.or(
  RangeCostSchema,
  PartialCostVehicleModSchema,
  type({
    "+": "reject",
    ratingLinked: PartialCostVehicleModSchema.array(),
  })
);
export type CostVehicleModType = typeof CostVehicleModSchema.infer;

export const VehicleModSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(vehicleModCategoryEnum),
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
  "useOwnWeaponAttributesNotParent?": "true",
  availability: AvailabilityVehicleModSchema,
  cost: CostVehicleModSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});

export type VehicleModType = typeof VehicleModSchema.infer;
export const VehicleModListSchema = type(VehicleModSchema.array());
export type VehicleModListType = typeof VehicleModListSchema.infer;

export const CustomisedVehicleModSchema = type({
  "+": "reject",
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

export const CustomisedVehicleModLoadedSchema = type({
  "+": "reject",
  baseMod: VehicleModSchema,
  "rating?": "number",
  // display this like 'name (specificOption)'
  "specificOption?": "string",
  "subsystemList?": "string[]",
});
export type CustomisedVehicleModLoadedType =
  typeof CustomisedVehicleModLoadedSchema.infer;

export const CustomisedVehicleModLoadedListSchema = type(
  CustomisedVehicleModLoadedSchema.array()
);
export type CustomisedVehicleModLoadedListType =
  typeof CustomisedVehicleModLoadedListSchema.infer;
