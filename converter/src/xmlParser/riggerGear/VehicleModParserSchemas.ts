import { z as zod } from "zod";
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

const SubsystemXmlSchema = zod
  .object({
    subsystem: zod.union([zod.string(), zod.array(zod.string())]),
  })
  .strict();
export type SubsystemXmlType = zod.infer<typeof SubsystemXmlSchema>;

const VehicleModMaxRatingSchema = zod.union([
  zod.number(),
  zod.literal("qty"),
  zod.literal("body"),
  zod.literal("Seats"),
]);
export type VehicleModMaxRatingType = zod.infer<
  typeof VehicleModMaxRatingSchema
>;

const VehicleModXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of vehicle mod
    category: zod.nativeEnum(vehicleModXmlCategoryEnum),
    // Max Rating
    rating: VehicleModMaxRatingSchema,
    // Min Rating
    minrating: zod.optional(zod.string()),
    // Label linked to what rating does for this cyberware
    ratinglabel: zod.optional(
      zod.union([
        zod.literal("String_Hours"),
        zod.literal("String_UpgradedRating"),
      ])
    ),
    // Bonus
    bonus: zod.optional(BonusXmlSchema),
    // Additional ammunition for one of the vehicle's weapon mounts
    ammobonus: zod.optional(zod.number()),
    // Additional ammunition (as percentage increase) for one of the
    // vehicle's weapon mounts
    ammobonuspercent: zod.optional(zod.number()),
    // Replace current ammunition
    ammoreplace: zod.optional(zod.string()),
    // Capacity for mods/subsystems
    capacity: zod.optional(zod.number()),
    // Add boxes to physical condition track
    conditionmonitor: zod.optional(zod.number()),
    // Mod is a downgrade
    // Downgrades give a mod point when installed
    // idea is you are removing things to make room
    downgrade: zod.optional(zod.literal("")),
    // This mod is only available for a drone
    optionaldrone: zod.optional(zod.literal("")),
    // pilot: zod.optional(zod.string()),
    required: zod.optional(RequiredXmlSchema),
    // Mod slots taken by this mod
    slots: StringOrNumberSchema,
    // Allowed augmentation subsystems (cyberware) that can be installed
    subsystems: zod.optional(SubsystemXmlSchema),
    // This is mod adds a weapon mount and lists the categories
    // of weapon that can be mounted in it
    // Importantly this is NOT a weapon mount mod, just a mount
    weaponmountcategories: zod.optional(zod.string()),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.union([zod.number(), zod.literal("?")]),
  })
  .strict();
export type VehicleModXmlType = zod.infer<typeof VehicleModXmlSchema>;
export const VehicleModListXmlSchema = zod.array(VehicleModXmlSchema);
export type VehicleModListXmlType = zod.infer<typeof VehicleModListXmlSchema>;
