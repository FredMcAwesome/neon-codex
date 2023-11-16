import { costArmourEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  GearXmlSchema,
  ModListXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { armourModXmlCategoryEnum } from "./ArmourModParserSchemas.js";

export enum armourXmlCategoryEnum {
  Armor = "Armor",
  Clothing = "Clothing",
  Cloaks = "Cloaks",
  FashionableArmor = "High-Fashion Armor Clothing",
  SpecialtyArmor = "Specialty Armor",
}

const ModCategoryXmlSchema = zod
  .object({
    category: zod.nativeEnum(armourModXmlCategoryEnum),
  })
  .strict();

export const ModCategoryListXmlSchema = zod.union([
  zod.array(ModCategoryXmlSchema),
  ModCategoryXmlSchema,
]);

const ArmourXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of clothing
    category: zod.nativeEnum(armourXmlCategoryEnum),
    // Maximum rating of armour
    rating: zod.optional(zod.number()),
    // Damage reduction of armour
    armor: zod.union([zod.number(), zod.nativeEnum(costArmourEnum)]),
    // This item has the Custom Fit (Stack) feature which gives the option of
    // allowing it to increase other Custom Fit armour by this amount instead
    // of uses its own armour value
    armoroverride: zod.optional(zod.number()),
    // Capacity of the armour
    armorcapacity: zod.union([zod.number(), zod.nativeEnum(costArmourEnum)]),
    // This item is a weapon, this should always match the name
    addweapon: zod.optional(zod.string()),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // Included gear
    gears: zod.optional(GearXmlSchema),
    // Applies some form of bonus
    bonus: zod.optional(BonusXmlSchema),
    // Bonus that is applied when wireless
    wirelessbonus: zod.optional(BonusXmlSchema),
    // Included mods
    mods: zod.optional(ModListXmlSchema),
    // Allow mods outside the "General" category
    addmodcategory: zod.optional(zod.nativeEnum(armourModXmlCategoryEnum)),
    // Select one mod from this category to be preinstalled
    selectmodsfromcategory: zod.optional(ModCategoryListXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type ArmourXmlType = zod.infer<typeof ArmourXmlSchema>;
export const ArmourListXmlSchema = zod.array(ArmourXmlSchema);
export type ArmourListXmlType = zod.infer<typeof ArmourListXmlSchema>;
