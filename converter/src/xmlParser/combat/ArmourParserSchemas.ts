import { costEnum } from "@neon-codex/common";

import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  IncludedGearXmlSchema,
  ModListXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { armourModXmlCategoryEnum } from "./ArmourModParserSchemas.js";
import { type } from "arktype";

export enum armourXmlCategoryEnum {
  Armor = "Armor",
  Clothing = "Clothing",
  Cloaks = "Cloaks",
  FashionableArmor = "High-Fashion Armor Clothing",
  SpecialtyArmor = "Specialty Armor",
}

const ModCategoryXmlSchema = type({
  "+": "reject",
  category: type.valueOf(armourModXmlCategoryEnum),
});
const ArmourXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Category of clothing
  category: type.valueOf(armourXmlCategoryEnum),
  // Maximum rating of armour
  "rating?": "number",
  // Damage reduction of armour
  armor: type.or("number", type.valueOf(costEnum)),
  // This item has the Custom Fit (Stack) feature which gives the option of
  // allowing it to increase other Custom Fit armour by this amount instead
  // of uses its own armour value
  "armoroverride?": "number",
  // Capacity of the armour
  armorcapacity: type.or("number", type.valueOf(costEnum)),
  // This item is a weapon, this should always match the name
  "addweapon?": "string",
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  // Included gear
  "gears?": IncludedGearXmlSchema,
  // Applies some form of bonus
  "bonus?": BonusXmlSchema,
  // Bonus that is applied when wireless
  "wirelessbonus?": BonusXmlSchema,
  // Included mods
  "mods?": ModListXmlSchema,
  // Allow mods outside the "General" category
  "addmodcategory?": type.valueOf(armourModXmlCategoryEnum),
  // Select one mod from this category to be included
  "selectmodsfromcategory?": ModCategoryXmlSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type ArmourXmlType = typeof ArmourXmlSchema.infer;
export const ArmourListXmlSchema = type(ArmourXmlSchema.array());
export type ArmourListXmlType = typeof ArmourListXmlSchema.infer;
