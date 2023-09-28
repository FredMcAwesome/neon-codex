import { costArmourEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import {
  BonusXmlSchema,
  GearXmlSchema,
  ModCategoryListXmlSchema,
  ModListXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";

export enum armourXmlCategoryEnum {
  Armor = "Armor",
  Clothing = "Clothing",
  Cloaks = "Cloaks",
  FashionableArmor = "High-Fashion Armor Clothing",
  SpecialtyArmor = "Specialty Armor",
}

const ArmourXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.nativeEnum(armourXmlCategoryEnum),
    rating: zod.optional(zod.number()),
    armor: zod.union([zod.number(), zod.nativeEnum(costArmourEnum)]),
    armoroverride: zod.optional(zod.number()),
    armorcapacity: zod.union([zod.number(), zod.nativeEnum(costArmourEnum)]),
    addweapon: zod.optional(zod.string()),
    avail: StringOrNumberSchema,
    cost: StringOrNumberSchema,
    gears: zod.optional(GearXmlSchema),
    bonus: zod.optional(BonusXmlSchema),
    wirelessbonus: zod.optional(BonusXmlSchema),
    mods: zod.optional(ModListXmlSchema),
    // add category to any mods this weapon uses
    // needed for "black market pipelines" quality
    // however, I think this is just redundant as mods have
    // a category anyway which will always include armour...
    addmodcategory: zod.optional(zod.string()),
    selectmodsfromcategory: zod.optional(ModCategoryListXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type ArmourXmlType = zod.infer<typeof ArmourXmlSchema>;
export const ArmourListXmlSchema = zod.array(ArmourXmlSchema);
export type ArmourListXmlType = zod.infer<typeof ArmourListXmlSchema>;
