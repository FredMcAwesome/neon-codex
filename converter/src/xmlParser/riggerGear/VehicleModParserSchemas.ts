import { type } from "arktype";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

export enum vehicleModXmlCategoryEnum {
  Body = "Body",
  Cosmetic = "Cosmetic",
  Electromagnetic = "Electromagnetic",
  ModelSpecific = "Model-Specific",
  Powertrain = "Powertrain",
  Protection = "Protection",
  Weapons = "Weapons",
  // Don't really understand what all means here?
  All = "All",
  Handling = "Handling",
  Speed = "Speed",
  Acceleration = "Acceleration",
  Armor = "Armor",
  Sensor = "Sensor",
}

const SubsystemXmlSchema = type({
  subsystem: type.or("string", "string[]"),
});
export type SubsystemXmlType = typeof SubsystemXmlSchema.infer;

const VehicleModMaxRatingSchema = type.or(
  "number",
  "'qty'",
  "'body'",
  "'Seats'"
);
export type VehicleModMaxRatingType = typeof VehicleModMaxRatingSchema.infer;

const VehicleModXmlSchema = type({
  id: "string",
  name: "string",
  // Category of vehicle mod
  category: type.valueOf(vehicleModXmlCategoryEnum),
  // Max Rating
  rating: VehicleModMaxRatingSchema,
  // Min Rating
  "minrating?": "string",
  // Label linked to what rating does for this cyberware
  "ratinglabel?": type.or("'String_Hours'", "'String_UpgradedRating'"),
  // Bonus
  "bonus?": BonusXmlSchema,
  // Additional ammunition for one of the vehicle's weapon mounts
  "ammobonus?": "number",
  // Additional ammunition (as percentage increase) for one of the
  // vehicle's weapon mounts
  "ammobonuspercent?": "number",
  // Replace current ammunition
  "ammoreplace?": "string",
  // Capacity for mods/subsystems
  "capacity?": "number",
  // Add boxes to physical condition track
  "conditionmonitor?": "number",
  // Mod is a downgrade
  // Downgrades give a mod point when installed
  // idea is you are removing things to make room
  "downgrade?": "''",
  // This mod is only available for a drone
  "optionaldrone?": "''",
  // pilot?":"string",
  "required?": RequiredXmlSchema,
  // Mod slots taken by this mod
  slots: StringOrNumberSchema,
  // Allowed augmentation subsystems (cyberware) that can be installed
  "subsystems?": SubsystemXmlSchema,
  // This is mod adds a weapon mount and lists the categories
  // of weapon that can be mounted in it
  // Importantly this is NOT a weapon mount mod, just a mount
  "weaponmountcategories?": "string",
  // Not selectable
  "hide?": "''",
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: type.or("number", "'?'"),
});
export type VehicleModXmlType = typeof VehicleModXmlSchema.infer;
export const VehicleModListXmlSchema = type(VehicleModXmlSchema.array());
export type VehicleModListXmlType = typeof VehicleModListXmlSchema.infer;
