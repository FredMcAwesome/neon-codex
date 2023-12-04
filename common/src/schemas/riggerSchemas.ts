import { z as zod } from "zod";
import {
  // aircraftSubtypeEnum,
  costRiggerEnum,
  // droneSubtypeEnum,
  // groundcraftSubtypeEnum,
  mathOperatorEnum,
  restrictionEnum,
  vehicleCategoryEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
  // vehicleDroneTypeEnum,
  // watercraftSubtypeEnum,
} from "../enums.js";
import {
  AvailabilityRatingSchema,
  UseGearListSchema,
} from "./commonSchemas.js";
import { ModListSchema } from "./shared/modSchemas.js";

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
    allowedWeapon: zod.optional(zod.string()),
  })
  .strict();

export const Vehicle_DroneSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(vehicleCategoryEnum),
    // type: zod.nativeEnum(vehicleDroneTypeEnum),
    // subtype: zod.union([
    //   zod.nativeEnum(groundcraftSubtypeEnum),
    //   zod.nativeEnum(watercraftSubtypeEnum),
    //   zod.nativeEnum(aircraftSubtypeEnum),
    //   zod.nativeEnum(droneSubtypeEnum),
    // ]),
    handling: zod.optional(
      zod.union([
        zod.number(),
        zod.object({ onRoad: zod.number(), offRoad: zod.number() }).strict(),
      ])
    ),
    speed: zod.optional(
      zod.union([
        zod.number(),
        zod.object({ onRoad: zod.number(), offRoad: zod.number() }).strict(),
      ])
    ),
    acceleration: zod.optional(
      zod.union([
        zod.number(),
        zod.object({ onRoad: zod.number(), offRoad: zod.number() }).strict(),
      ])
    ),
    body: zod.number(),
    armour: zod.number(),
    pilot: zod.number(),
    sensor: zod.number(),
    includedGear: zod.optional(UseGearListSchema),
    includedMods: zod.optional(ModListSchema),
    modSlots: zod.optional(zod.number()),
    powerTrainModSlots: zod.optional(zod.number()),
    protectionModSlots: zod.optional(zod.number()),
    weaponModSlots: zod.optional(zod.number()),
    bodyModSlots: zod.optional(zod.number()),
    electromagneticModSlots: zod.optional(zod.number()),
    cosmeticModSlots: zod.optional(zod.number()),
    seats: zod.optional(
      zod.union([
        zod.number(),
        zod.object({ min: zod.number(), max: zod.number() }).strict(),
      ])
    ),
    weaponList: zod.optional(zod.array(zod.string())),
    weaponMountList: zod.optional(zod.array(WeaponMountSchema)),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityRiggerSchema,
    cost: CostRiggerSchema,
    source: zod.string(),
    page: zod.number(),
  })
  .strict();

export type Vehicle_DroneType = zod.infer<typeof Vehicle_DroneSchema>;
export const Vehicle_DroneListSchema = zod.array(Vehicle_DroneSchema);
