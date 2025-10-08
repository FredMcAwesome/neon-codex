import { type } from "arktype";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { vehicleModXmlCategoryEnum } from "./VehicleModParserSchemas.js";

const WeaponMountModXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Category of vehicle mod
  category: type.valueOf(vehicleModXmlCategoryEnum),
  // Max Rating, unused for weapon mounts
  rating: "0",
  // This mod is only available for a drone
  "optionaldrone?": "''",
  // Additional ammunition for one of the vehicle's weapon mounts
  "ammobonus?": "number",
  // Additional ammunition (as percentage increase) for one of the
  // vehicle's weapon mounts
  "ammobonuspercent?": "number",
  // Replace current ammunition
  "ammoreplace?": "string",
  //
  "required?": RequiredXmlSchema,
  // Mod slots taken by this mod
  slots: StringOrNumberSchema,
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: type.or("number", "'?'"),
});
export type WeaponMountModXmlType = typeof WeaponMountModXmlSchema.infer;
export const WeaponMountModListXmlSchema = type(
  WeaponMountModXmlSchema.array()
);
export type WeaponMountModListXmlType = typeof WeaponMountModListXmlSchema;
