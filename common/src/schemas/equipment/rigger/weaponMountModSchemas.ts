import {
  ammoSourceEnum,
  mathOperatorEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModCategoryEnum,
  vehicleModRatingEnum,
  sourceBookEnum,
} from "../../../enums.js";

import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { RangeCostSchema } from "../../shared/commonSchemas.js";
import { type } from "arktype";
import {
  PartialSlotCostSchema,
  ReplaceAmmoSchema,
} from "./vehicleModSchemas.js";

const WeaponMountModRatingSchema = type(
  type.or(
    type({
      "+": "reject",
      option: type.valueOf(vehicleModRatingEnum),
    }),
    type({
      "+": "reject",
      operator: type.valueOf(mathOperatorEnum),
    }),
    "number"
  )
).array();
export type WeaponMountModRatingType = typeof WeaponMountModRatingSchema.infer;

const WeaponMountSlotCostSchema = type.or(
  PartialSlotCostSchema,
  type({
    "+": "reject",
    ratingLinked: PartialSlotCostSchema.array(),
  })
);
export type WeaponMountSlotCostType = typeof WeaponMountSlotCostSchema.infer;

const AvailabilityWeaponMountModSchema = type({
  "+": "reject",
  rating: "number",
  restriction: type.valueOf(restrictionEnum),
});
export type AvailabilityWeaponMountModType =
  typeof AvailabilityWeaponMountModSchema.infer;

const InnerCostVehicleModSchema = type.or(
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

const { PartialCostWeaponMountModSchema } = type.module({
  PartialCostWeaponMountModSchema: [
    [
      InnerCostVehicleModSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "PartialCostWeaponMountModSchema ",
      },
    ],
    "[]",
  ],
});
const CostWeaponMountModSchema = type.or(
  RangeCostSchema,
  PartialCostWeaponMountModSchema,
  type({
    "+": "reject",
    ratingLinked: PartialCostWeaponMountModSchema.array(),
  })
);
export type CostWeaponMountModType = typeof CostWeaponMountModSchema.infer;

export const WeaponMountModSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(vehicleModCategoryEnum),
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
