import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { type } from "arktype";

enum weaponMountAttributeCategoryXmlEnum {
  Size = "Size",
  Visibility = "Visibility",
  Flexibility = "Flexibility",
  Control = "Control",
}

// Importantly this schema is NOT a schema of a weapon mount
// it is a schema for one of the 4 weapon mount attributes
// e.g. if category is size then this describes what weapons
// can be mounted here

// This is never actually used, this information will just be
// in code, e.g. what size categories there are will be in code
const WeaponMountSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Category of weapon mount
  category: type.valueOf(weaponMountAttributeCategoryXmlEnum),
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  // This weapon mount is only available for a drone
  "optionaldrone?": "string",
  // Mod slots available for this weapon mount
  slots: StringOrNumberSchema,
  // Required
  "required?": RequiredXmlSchema,
  // Forbidden
  "forbidden?": RequiredXmlSchema,
  // List of weapon categories that
  "weaponcategories?": "string",
  // Not selectable
  "hide?": "''",
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
