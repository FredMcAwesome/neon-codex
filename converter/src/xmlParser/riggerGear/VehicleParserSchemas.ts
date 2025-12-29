import {
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "@neon-codex/common";

import {
  ModRecursiveXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
} from "../common/ParserCommonDefines.js";
import { type } from "arktype";

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

const IncludedWeaponMountXmlSchema = type({
  "+": "reject",
  // Mount Control type - how it is fired
  control: type.valueOf(weaponMountControlEnum),
  // Mount Flexibility - how moveable a weapon on this mount is
  flexibility: type.valueOf(weaponMountFlexibilityEnum),
  // Mount Size - each category can hold a set of weapon types
  size: type.valueOf(weaponMountSizeEnum),
  // Mount Visibility - how visible mounted weapons are
  visibility: type.valueOf(weaponMountVisibilityEnum),
  // Only this weapon can be mounted to this mount
  "allowedweapons?": "string",
  // included mods only apply to one (German book) mount
  "mods?": { mod: "string" },
});
export type IncludedWeaponMountXmlType =
  typeof IncludedWeaponMountXmlSchema.infer;

const VehicleXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Acceleration - Range categories a vehicle can move in a turn
  accel: StringOrNumberSchema,
  // Max speed - Base limit for tests that emphasize speed
  speed: StringOrNumberSchema,
  // Armour - Toughness (used with body for resist damage tests)
  armor: "number",
  // Body - Structual integrity (used with armour for resist damage tests)
  body: "number",
  // Category of vehicle
  category: type.valueOf(vehicleXmlCategoryEnum),
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  // Handling
  handling: StringOrNumberSchema,
  // Built-in computer piloting system (used when not actively piloted)
  pilot: "number",
  // Limit for perception and other detection tests with vehicle systems
  sensor: "number",
  // Included gear
  "gears?": type({ "+": "reject", gear: UseGearXmlSchema }),
  // Vehicle Mods included
  "mods?": ModRecursiveXmlSchema,
  // Number of mod slots of each category
  // This can be overriden for any specific slot type
  "modslots?": "number",
  // Mod slot category modification
  // Power Train mod slots modification
  "powertrainmodslots?": "number",
  // Protection mod slots modification
  "protectionmodslots?": "number",
  // Weapon mod slots modification
  "weaponmodslots?": "number",
  // Body mod slots modification
  "bodymodslots?": "number",
  // Electromagnetic mod slots modification
  "electromagneticmodslots?": "number",
  // Cosmetic mod slots modification
  "cosmeticmodslots?": "number",
  // Number of seats, only for vehicles I assume?
  "seats?": StringOrNumberSchema,
  // Included weapons
  // These weapons use a weapon mount
  "weapons?": type({
    "+": "reject",
    weapon: type.or(
      type({ "+": "reject", name: "string" }),
      type({ "+": "reject", name: "string" }).array()
    ),
  }),

  // Included weapon mounts
  // Generally (currently always) included weapons
  // are the only weapon/s useable in the included weapon mounts
  "weaponmounts?": type({
    "+": "reject",
    weaponmount: type.or(
      IncludedWeaponMountXmlSchema,
      IncludedWeaponMountXmlSchema.array()
    ),
  }),

  // Not selectable
  "hide?": "''",
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type VehicleXmlType = typeof VehicleXmlSchema.infer;
export const VehicleListXmlSchema = VehicleXmlSchema.array();
export type VehicleListXmlType = typeof VehicleListXmlSchema.infer;
