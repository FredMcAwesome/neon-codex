import {
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import {
  ModRecursiveXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../common/ParserCommonDefines.js";

export enum vehicleXmlCategoryEnum {
  Bikes = "Bikes",
  Cars = "Cars",
  Trucks = "Trucks",
  Municipal = "Municipal/Construction",
  Corpsec = "Corpsec/Police/Military",
  Boats = "Boats",
  Submarines = "Submarines",
  FixedWing_Aircraft = "Fixed-Wing Aircraft",
  LTAV = "LTAV",
  Rotorcraft = "Rotorcraft",
  VTOL_VSTOL = "VTOL/VSTOL",
  Drones_Micro = "Drones: Micro",
  Drones_Mini = "Drones: Mini",
  Drones_Small = "Drones: Small",
  Drones_Medium = "Drones: Medium",
  Drones_Anthro = "Drones: Anthro",
  Drones_Large = "Drones: Large",
  Drones_Huge = "Drones: Huge",
  Drones_Missile = "Drones: Missile",
  Hovercraft = "Hovercraft",
}

const IncludedWeaponMountXmlSchema = zod
  .object({
    // Mount Control type - how it is fired
    control: zod.nativeEnum(weaponMountControlEnum),
    // Mount Flexibility - how moveable a weapon on this mount is
    flexibility: zod.nativeEnum(weaponMountFlexibilityEnum),
    // Mount Size - each category can hold a set of weapon types
    size: zod.nativeEnum(weaponMountSizeEnum),
    // Mount Visibility - how visible mounted weapons are
    visibility: zod.nativeEnum(weaponMountVisibilityEnum),
    // Only this weapon can be mounted to this mount
    allowedweapons: zod.optional(zod.string()),
    // included mods only apply to one (German book) mount
    mods: zod.optional(zod.object({ mod: zod.string() }).strict()),
  })
  .strict();

export type IncludedWeaponMountXmlType = zod.infer<
  typeof IncludedWeaponMountXmlSchema
>;

const VehicleXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Acceleration - Range categories a vehicle can move in a turn
    accel: StringOrNumberSchema,
    // Max speed - Base limit for tests that emphasize speed
    speed: StringOrNumberSchema,
    // Armour - Toughness (used with body for resist damage tests)
    armor: zod.number(),
    // Body - Structual integrity (used with armour for resist damage tests)
    body: zod.number(),
    // Category of vehicle
    category: zod.nativeEnum(vehicleXmlCategoryEnum),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // Handling
    handling: StringOrNumberSchema,
    // Built-in computer piloting system (used when not actively piloted)
    pilot: zod.number(),
    // Limit for perception and other detection tests with vehicle systems
    sensor: zod.number(),
    // Included gear
    gears: zod.optional(
      zod
        .object({
          gear: zod.union([zod.array(UseGearXmlSchema), UseGearXmlSchema]),
        })
        .strict()
    ),
    // Vehicle Mods included
    mods: zod.optional(ModRecursiveXmlSchema),
    // Number of mod slots of each category
    // This can be overriden for any specific slot type
    modslots: zod.optional(zod.number()),
    // Mod slot category modification
    // Power Train mod slots modification
    powertrainmodslots: zod.optional(zod.number()),
    // Protection mod slots modification
    protectionmodslots: zod.optional(zod.number()),
    // Weapon mod slots modification
    weaponmodslots: zod.optional(zod.number()),
    // Body mod slots modification
    bodymodslots: zod.optional(zod.number()),
    // Electromagnetic mod slots modification
    electromagneticmodslots: zod.optional(zod.number()),
    // Cosmetic mod slots modification
    cosmeticmodslots: zod.optional(zod.number()),
    // Number of seats, only for vehicles I assume?
    seats: zod.optional(StringOrNumberSchema),
    // Included weapons
    // These weapons use a weapon mount
    weapons: zod.optional(
      zod
        .object({
          weapon: zod.union([
            zod.array(
              zod
                .object({
                  name: zod.string(),
                })
                .strict()
            ),
            zod
              .object({
                name: zod.string(),
              })
              .strict(),
          ]),
        })
        .strict()
    ),
    // Included weapon mounts
    // Generally (currently always) included weapons
    // are the only weapon/s useable in the included weapon mounts
    weaponmounts: zod.optional(
      zod
        .object({
          weaponmount: zod.union([
            zod.array(IncludedWeaponMountXmlSchema),
            IncludedWeaponMountXmlSchema,
          ]),
        })
        .strict()
    ),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type VehicleXmlType = zod.infer<typeof VehicleXmlSchema>;
export const VehicleListXmlSchema = zod.array(VehicleXmlSchema);
export type VehicleListXmlType = zod.infer<typeof VehicleListXmlSchema>;
