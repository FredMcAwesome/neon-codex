// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { z as zod } from "zod";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

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
const WeaponMountSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of weapon mount
    category: zod.nativeEnum(weaponMountAttributeCategoryXmlEnum),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // This weapon mount is only available for a drone
    optionaldrone: zod.optional(zod.string()),
    // Mod slots available for this weapon mount
    slots: StringOrNumberSchema,
    // Required
    required: zod.optional(RequiredXmlSchema),
    // Forbidden
    forbidden: zod.optional(RequiredXmlSchema),
    // List of weapon categories that
    weaponcategories: zod.optional(zod.string()),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
