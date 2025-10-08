import { costEnum, gearCategoryEnum } from "@neon-codex/common/build/enums.js";

import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { type } from "arktype";

export enum armourModXmlCategoryEnum {
  FullBodyArmorMods = "Full Body Armor Mods",
  CustomizedBallisticMask = "Customized Ballistic Mask",
  General = "General",
  GlobetrotterClothingLiners = "Globetrotter Clothing Liners",
  GlobetrotterJacketLiners = "Globetrotter Jacket Liners",
  GlobetrotterVestLiners = "Globetrotter Vest Liners",
  NightshadeIR = "Nightshade IR",
  RapidTransitDetailing = "Rapid Transit Detailing",
  UrbanExplorerJumpsuitAccessories = "Urban Explorer Jumpsuit Accessories",
  VictoryLiners = "Victory Liners",
}

const ArmourModXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Category of mod, if not "General" then the host armour must have the
  // matching addmodcategory in order to use this
  category: type.valueOf(armourModXmlCategoryEnum),
  armor: type.or("number", type.valueOf(costEnum)),
  // Maximum rating for armour mod
  // this should be 1 for items without rating variable effects
  maxrating: "number",
  // Capacity taken up by this mod
  armorcapacity: "string",
  // Armour requirements
  "required?": RequiredXmlSchema,
  // This item is not selectable i.e. only used when armour includes it
  "hide?": "''",
  // Allows gear to be added from these gear categories
  "addoncategory?": type.or(
    type.valueOf(gearCategoryEnum),
    type.valueOf(gearCategoryEnum).array()
  ),
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: StringOrNumberSchema,
  // Number of gear that can be added to armour mod
  // currently this seems to crash chummer if more than this is added
  // rather than preventing more from being added...
  "gearcapacity?": "number",
  // Bonus from mod
  "bonus?": BonusXmlSchema,
  // Bonus when mod is wirelessly enabled
  "wirelessbonus?": BonusXmlSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type ArmourModXmlType = typeof ArmourModXmlSchema.infer;
export const ArmourModListXmlSchema = type(ArmourModXmlSchema.array());
export type ArmourModListXmlType = typeof ArmourModListXmlSchema.infer;
