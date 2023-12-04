import { AugmentationSubsystemListSchema } from "@shadowrun/common/build/schemas/augmentationSchemas.js";
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

const VehicleModXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of vehicle mod
    category: zod.nativeEnum(vehicleModXmlCategoryEnum),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // Max Rating
    rating: StringOrNumberSchema,
    // Min Rating
    minrating: zod.optional(zod.string()),
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
    conditionmonitor: zod.optional(StringOrNumberSchema),
    // Mod is a downgrade
    // Downgrades give a mod point when installed
    // idea is you are removing things to make room
    downgrade: zod.optional(zod.literal("")),
    // This mod is only available for a drone
    optionaldrone: zod.optional(zod.string()),
    // pilot: zod.optional(zod.string()),
    required: zod.optional(RequiredXmlSchema),
    // Mod slots taken by this mod
    slots: StringOrNumberSchema,
    // Allowed augmentation subsystems (cyberware) that can be installed
    subsystems: zod.optional(
      zod.union([AugmentationSubsystemListSchema, SubsystemXmlSchema])
    ),
    // This is a weapon mount mod and lists the categories
    // of weapon that can be mounted in it
    weaponmountcategories: zod.optional(zod.string()),
    // Label linked to what rating does for this cyberware
    ratinglabel: zod.optional(
      zod.union([
        zod.literal("String_Hours"),
        zod.literal("String_UpgradedRating"),
      ])
    ),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.union([zod.number(), zod.literal("?")]),

    // Non-xml tag, added to differentiate weapon mount mods and
    // vehicle mods
    modType: zod.optional(
      zod.union([zod.literal("Vehicle"), zod.literal("Weapon Mount")])
    ),
  })
  .strict();
export type VehicleModXmlType = zod.infer<typeof VehicleModXmlSchema>;
export const VehicleModListXmlSchema = zod.array(VehicleModXmlSchema);
export type VehicleModListXmlType = zod.infer<typeof VehicleModListXmlSchema>;
