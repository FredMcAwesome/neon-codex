import {
  aircraftSubtypeEnum,
  costEnum as costEnum,
  droneSubtypeEnum,
  groundcraftSubtypeEnum,
  mathOperatorEnum,
  restrictionEnum,
  // vehicleCategoryEnum,
  vehicleCategoryEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
  watercraftSubtypeEnum,
  sourceBookEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  RangeCostSchema,
} from "../../shared/commonSchemas.js";
import {
  CustomisedVehicleModListSchema,
  CustomisedVehicleModLoadedListSchema,
} from "./vehicleModSchemas.js";
import {
  CustomisedGearListSchema,
  CustomisedGearLoadedListSchema,
} from "../other/gearSchemas.js";
import {
  CustomisedWeaponMountListSchema,
  CustomisedWeaponMountLoadedListSchema,
} from "./weaponMountSchemas.js";
import { type } from "arktype";

export const AvailabilityVehicleSchema = type({
  "+": "reject",
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
export type AvailabilityVehicleType = typeof AvailabilityVehicleSchema.infer;

const InnerCostVehicleSchema = type.or(
  "number",
  type({
    option: type.valueOf(costEnum),
    "+": "reject",
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

const { PartialCostVehicleSchema } = type.module({
  PartialCostVehicleSchema: [
    [
      InnerCostVehicleSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "PartialCostVehicleSchema",
      },
    ],
    "[]",
  ],
});
export const CostVehicleSchema = type.or(
  RangeCostSchema,
  PartialCostVehicleSchema
);
export type CostVehicleType = typeof CostVehicleSchema.infer;

const WeaponMountSchema = type({
  "+": "reject",
  control: type.valueOf(weaponMountControlEnum),
  flexibility: type.valueOf(weaponMountFlexibilityEnum),
  size: type.valueOf(weaponMountSizeEnum),
  visibility: type.valueOf(weaponMountVisibilityEnum),
});
export type WeaponMountType = typeof WeaponMountSchema.infer;

export const WeaponMountListSchema = type(WeaponMountSchema.array());
export type WeaponMountListType = typeof WeaponMountListSchema.infer;

const VehicleOnOffRoadSchema = type.or(
  "number",
  type({
    "+": "reject",
    onRoad: "number",
    offRoad: "number",
  })
);

const VehicleSeatsSchema = type.or(
  "number",
  type({
    "+": "reject",
    min: "number",
    max: "number",
  })
);
export type VehicleSeatsType = typeof VehicleSeatsSchema.infer;

export type VehicleOnOffRoadType = typeof VehicleOnOffRoadSchema.infer;

const VehiclePartialSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  handling: VehicleOnOffRoadSchema,
  "speed?": VehicleOnOffRoadSchema,
  "acceleration?": VehicleOnOffRoadSchema,
  body: "number",
  armour: "number",
  pilot: "number",
  sensor: "number",
  "includedGearList?": CustomisedGearListSchema,
  "includedModList?": CustomisedVehicleModListSchema,
  "modSlots?": "number",
  "powerTrainModSlots?": "number",
  "protectionModSlots?": "number",
  "weaponModSlots?": "number",
  "bodyModSlots?": "number",
  "electromagneticModSlots?": "number",
  "cosmeticModSlots?": "number",
  "includedWeaponMountList?": CustomisedWeaponMountListSchema,
  "userSelectable?": "false",
  availability: AvailabilityVehicleSchema,
  cost: CostVehicleSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
const MannedVehiclePartialSchema = VehiclePartialSchema.merge({
  "+": "reject",
  seats: VehicleSeatsSchema,
});

const GroundcraftVehicleSchema = MannedVehiclePartialSchema.merge({
  "+": "reject",

  category: type.unit(vehicleCategoryEnum.Groundcraft),
  subtype: type.valueOf(groundcraftSubtypeEnum),
});
export type GroundcraftVehicleType = typeof GroundcraftVehicleSchema.infer;
const WatercraftVehicleSchema = MannedVehiclePartialSchema.merge({
  "+": "reject",
  category: type.unit(vehicleCategoryEnum.Watercraft),
  subtype: type.valueOf(watercraftSubtypeEnum),
});
export type WatercraftVehicleType = typeof WatercraftVehicleSchema.infer;
const AircraftVehicleSchema = MannedVehiclePartialSchema.merge({
  "+": "reject",
  category: type.unit(vehicleCategoryEnum.Aircraft),
  subtype: type.valueOf(aircraftSubtypeEnum),
});
export type AircraftVehicleType = typeof AircraftVehicleSchema.infer;
const DroneVehicleSchema = VehiclePartialSchema.merge({
  "+": "reject",
  category: type.unit(vehicleCategoryEnum.Drone),
  subtype: type.valueOf(droneSubtypeEnum),
});
export type DroneVehicleType = typeof DroneVehicleSchema.infer;

export const VehicleSchema = type.or(
  GroundcraftVehicleSchema,
  WatercraftVehicleSchema,
  AircraftVehicleSchema,
  DroneVehicleSchema
);

export type VehicleType = typeof VehicleSchema.infer;
export const VehicleListSchema = type(VehicleSchema.array());
export type VehicleListType = typeof VehicleListSchema.infer;

export const CustomisedVehicleSchema = type({
  "+": "reject",
  baseVehicle: "string",
  // This overrides baseVehicle modifications
  "modList?": CustomisedVehicleModListSchema,
  // This overrides baseVehicle included gear
  "gearList?": CustomisedGearListSchema,
  "weaponMountList?": CustomisedWeaponMountListSchema,
  // TODO: is rating a thing for vehicles?
  // rating?":"number",
  "customName?": "string",
});
export type CustomisedVehicleType = typeof CustomisedVehicleSchema.infer;
export const CustomisedVehicleListSchema = type(
  CustomisedVehicleSchema.array()
);
export type CustomisedVehicleListType =
  typeof CustomisedVehicleListSchema.infer;

export const CustomisedVehicleLoadedSchema = type({
  "+": "reject",
  baseVehicle: VehicleSchema,
  // This overrides baseVehicle modifications
  "modList?": CustomisedVehicleModLoadedListSchema,
  // This overrides baseVehicle included gear
  "gearList?": CustomisedGearLoadedListSchema,
  "weaponMountList?": CustomisedWeaponMountLoadedListSchema,
  // TODO: is rating a thing for vehicles?
  // rating?":"number",
  "customName?": "string",
});
export type CustomisedVehicleLoadedType =
  typeof CustomisedVehicleLoadedSchema.infer;
export const CustomisedVehicleLoadedListSchema = type(
  CustomisedVehicleLoadedSchema.array()
);
export type CustomisedVehicleLoadedListType =
  typeof CustomisedVehicleLoadedListSchema.infer;
