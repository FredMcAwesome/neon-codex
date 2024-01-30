import {
  costArmourEnum,
  gearCategoryEnum,
} from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

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

const ArmourModXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of mod, if not "General" then the host armour must have the
    // matching addmodcategory in order to use this
    category: zod.nativeEnum(armourModXmlCategoryEnum),
    armor: zod.union([zod.number(), zod.nativeEnum(costArmourEnum)]),
    // Maximum rating for armour mod
    // this should be 1 for items without rating variable effects
    maxrating: zod.number(),
    // Capacity taken up by this mod
    armorcapacity: zod.string(),
    // Armour requirements
    required: zod.optional(RequiredXmlSchema),
    // This item is not selectable i.e. only used when armour includes it
    hide: zod.optional(zod.literal("")),
    // Allows gear to be added from these gear categories
    addoncategory: zod.optional(
      zod.union([
        zod.array(zod.nativeEnum(gearCategoryEnum)),
        zod.nativeEnum(gearCategoryEnum),
      ])
    ),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: StringOrNumberSchema,
    // Number of gear that can be added to armour mod
    // currently this seems to crash chummer if more than this is added
    // rather than preventing more from being added...
    gearcapacity: zod.optional(zod.number()),
    // Bonus from mod
    bonus: zod.optional(BonusXmlSchema),
    // Bonus when mod is wirelessly enabled
    wirelessbonus: zod.optional(BonusXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type ArmourModXmlType = zod.infer<typeof ArmourModXmlSchema>;
export const ArmourModListXmlSchema = zod.array(ArmourModXmlSchema);
export type ArmourModListXmlType = zod.infer<typeof ArmourModListXmlSchema>;
