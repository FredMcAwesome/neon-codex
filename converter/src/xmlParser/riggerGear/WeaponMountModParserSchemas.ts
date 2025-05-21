import { z as zod } from "zod";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { vehicleModXmlCategoryEnum } from "./VehicleModParserSchemas.js";

const WeaponMountModXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of vehicle mod
    category: zod.nativeEnum(vehicleModXmlCategoryEnum),
    // Max Rating, unused for weapon mounts
    rating: zod.literal(0),
    // This mod is only available for a drone
    optionaldrone: zod.optional(zod.literal("")),
    // Additional ammunition for one of the vehicle's weapon mounts
    ammobonus: zod.optional(zod.number()),
    // Additional ammunition (as percentage increase) for one of the
    // vehicle's weapon mounts
    ammobonuspercent: zod.optional(zod.number()),
    // Replace current ammunition
    ammoreplace: zod.optional(zod.string()),
    //
    required: zod.optional(RequiredXmlSchema),
    // Mod slots taken by this mod
    slots: StringOrNumberSchema,
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.union([zod.number(), zod.literal("?")]),
  })
  .strict();
export type WeaponMountModXmlType = zod.infer<typeof WeaponMountModXmlSchema>;
export const WeaponMountModListXmlSchema = zod.array(WeaponMountModXmlSchema);
export type WeaponMountModListXmlType = zod.infer<
  typeof WeaponMountModListXmlSchema
>;
