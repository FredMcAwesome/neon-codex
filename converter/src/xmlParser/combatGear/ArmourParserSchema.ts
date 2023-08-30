import { armourEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import {
  BonusXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
  UseGearXmlSchema,
  WirelessXmlSchema,
} from "../ParserCommonDefines.js";

const ModXmlSchema = zod.union([
  zod.string(),
  zod
    .object({
      xmltext: zod.string(),
      _rating: zod.optional(zod.string()),
      _select: zod.optional(zod.string()),
    })
    .strict(),
]);

export const ModListXmlSchema = zod
  .object({
    name: zod.union([zod.array(ModXmlSchema), ModXmlSchema]),
  })
  .strict();

const ModCategoryXmlSchema = zod
  .object({
    category: zod.string(),
  })
  .strict();

const ModCategoryListXmlSchema = zod.union([
  zod.array(ModCategoryXmlSchema),
  ModCategoryXmlSchema,
]);

const ArmorGearXmlSchema = zod.union([
  zod.string(),
  zod.object({ xmltext: zod.string(), _rating: zod.string() }).strict(),
  UseGearXmlSchema,
]);

const ArmourXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.string(),
    rating: zod.optional(zod.number()),
    armor: zod.union([zod.number(), zod.nativeEnum(armourEnum)]),
    armoroverride: zod.optional(zod.number()),
    armorcapacity: zod.union([zod.number(), zod.nativeEnum(armourEnum)]),
    addweapon: zod.optional(zod.string()),
    avail: StringOrNumberSchema,
    cost: StringOrNumberSchema,
    gears: zod.optional(
      zod
        .object({
          usegear: zod.union([
            zod.array(ArmorGearXmlSchema),
            ArmorGearXmlSchema,
          ]),
        })
        .strict()
    ),
    bonus: zod.optional(BonusXmlSchema),
    wirelessbonus: zod.optional(WirelessXmlSchema),
    mods: zod.optional(ModListXmlSchema),
    addmodcategory: zod.optional(zod.string()),
    selectmodsfromcategory: zod.optional(ModCategoryListXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type ArmourXmlType = zod.infer<typeof ArmourXmlSchema>;
export const ArmourListXmlSchema = zod.array(ArmourXmlSchema);
export type ArmourListXmlType = zod.infer<typeof ArmourListXmlSchema>;
