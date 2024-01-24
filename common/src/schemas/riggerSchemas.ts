import { z as zod } from "zod";
import {
  aircraftSubtypeEnum,
  costRiggerEnum,
  droneSubtypeEnum,
  groundcraftSubtypeEnum,
  mathOperatorEnum,
  restrictionEnum,
  // vehicleCategoryEnum,
  vehicleTypeEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
  watercraftSubtypeEnum,
  sourceBookEnum,
} from "../enums.js";
import {
  AvailabilityRatingSchema,
  UseGearListSchema,
} from "./commonSchemas.js";
import { GenericVehicleModListSchema } from "./shared/modSchemas.js";

export const AvailabilityRiggerSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityRiggerType = zod.infer<typeof AvailabilityRiggerSchema>;

const InnerCostRiggerSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costRiggerEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CostRiggerType =
  | Array<
      zod.infer<typeof InnerCostRiggerSchema> | { subnumbers: CostRiggerType }
    >
  | { range: { min: number; max: number } };
export const CostRiggerSchema: zod.ZodType<CostRiggerType> = zod.union([
  zod.array(
    zod.union([
      InnerCostRiggerSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => CostRiggerSchema),
        })
        .strict(),
    ])
  ),
  zod
    .object({
      range: zod
        .object({
          min: zod.number(),
          max: zod.number(),
        })
        .strict(),
    })
    .strict(),
]);

const WeaponMountSchema = zod
  .object({
    control: zod.nativeEnum(weaponMountControlEnum),
    flexibility: zod.nativeEnum(weaponMountFlexibilityEnum),
    size: zod.nativeEnum(weaponMountSizeEnum),
    visibility: zod.nativeEnum(weaponMountVisibilityEnum),
    includedWeapon: zod.optional(zod.string()),
    includedMountMod: zod.optional(zod.string()),
  })
  .strict();
export type WeaponMountType = zod.infer<typeof WeaponMountSchema>;

export const WeaponMountListSchema = zod.array(WeaponMountSchema);
export type WeaponMountListType = zod.infer<typeof WeaponMountListSchema>;

const RiggerOnOffRoadSchema = zod.union([
  zod.number(),
  zod.object({ onRoad: zod.number(), offRoad: zod.number() }).strict(),
]);

const VehicleSeatsSchema = zod.union([
  zod.number(),
  zod.object({ min: zod.number(), max: zod.number() }).strict(),
]);
export type VehicleSeatsType = zod.infer<typeof VehicleSeatsSchema>;

export type RiggerOnOffRoadType = zod.infer<typeof RiggerOnOffRoadSchema>;

const VehiclePartialSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    handling: RiggerOnOffRoadSchema,
    speed: zod.optional(RiggerOnOffRoadSchema),
    acceleration: zod.optional(RiggerOnOffRoadSchema),
    body: zod.number(),
    armour: zod.number(),
    pilot: zod.number(),
    sensor: zod.number(),
    includedGearList: zod.optional(UseGearListSchema),
    includedMods: zod.optional(GenericVehicleModListSchema),
    modSlots: zod.optional(zod.number()),
    powerTrainModSlots: zod.optional(zod.number()),
    protectionModSlots: zod.optional(zod.number()),
    weaponModSlots: zod.optional(zod.number()),
    bodyModSlots: zod.optional(zod.number()),
    electromagneticModSlots: zod.optional(zod.number()),
    cosmeticModSlots: zod.optional(zod.number()),
    weaponList: zod.optional(zod.array(zod.string())),
    weaponMountList: zod.optional(zod.array(WeaponMountSchema)),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityRiggerSchema,
    cost: CostRiggerSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

const MannedVehiclePartialSchema = VehiclePartialSchema.extend({
  seats: VehicleSeatsSchema,
}).strict();

const GroundcraftVehicleSchema = MannedVehiclePartialSchema.extend({
  type: zod.literal(vehicleTypeEnum.Groundcraft),
  subtype: zod.nativeEnum(groundcraftSubtypeEnum),
}).strict();
export type GroundcraftVehicleType = zod.infer<typeof GroundcraftVehicleSchema>;
const WatercraftVehicleSchema = MannedVehiclePartialSchema.extend({
  type: zod.literal(vehicleTypeEnum.Watercraft),
  subtype: zod.nativeEnum(watercraftSubtypeEnum),
}).strict();
export type WatercraftVehicleType = zod.infer<typeof WatercraftVehicleSchema>;
const AircraftVehicleSchema = MannedVehiclePartialSchema.extend({
  type: zod.literal(vehicleTypeEnum.Aircraft),
  subtype: zod.nativeEnum(aircraftSubtypeEnum),
}).strict();
export type AircraftVehicleType = zod.infer<typeof AircraftVehicleSchema>;
const DroneVehicleSchema = VehiclePartialSchema.extend({
  type: zod.literal(vehicleTypeEnum.Drone),
  subtype: zod.nativeEnum(droneSubtypeEnum),
}).strict();
export type DroneVehicleType = zod.infer<typeof DroneVehicleSchema>;

export const VehicleSchema = zod.discriminatedUnion("type", [
  GroundcraftVehicleSchema,
  WatercraftVehicleSchema,
  AircraftVehicleSchema,
  DroneVehicleSchema,
]);

export type VehicleType = zod.infer<typeof VehicleSchema>;
export const VehicleListSchema = zod.array(VehicleSchema);
export type VehicleListType = zod.infer<typeof VehicleListSchema>;
