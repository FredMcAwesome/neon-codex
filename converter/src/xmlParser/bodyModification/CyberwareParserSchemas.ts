import { type } from "arktype";
import {
  BonusXmlSchema,
  type BonusXmlType,
} from "../common/BonusParserSchemas.js";
import {
  IncludedGearXmlSchema,
  limbSlotXmlEnum,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  augmentationXmlGradeEnum,
  AugmentationXmlLimitSchema,
  xmlAllowGearSchema,
} from "../common/ParserCommonDefines.js";
import type { IncludedGearXmlType } from "../common/ParserCommonDefines.js";
import {
  RequiredXmlSchema,
  type RequiredXmlType,
} from "../common/RequiredParserSchemas.js";

export enum cyberwareXmlCategoryEnum {
  AutoInjectorMods = "Auto Injector Mods",
  Bodyware = "Bodyware",
  CosmeticEnhancement = "Cosmetic Enhancement",
  Cyberlimb = "Cyberlimb",
  CyberlimbAccessory = "Cyberlimb Accessory",
  CyberlimbEnhancement = "Cyberlimb Enhancement",
  Cybersuite = "Cybersuite",
  CyberImplantWeapon = "Cyber Implant Weapon",
  CyberImplantWeaponAccessory = "Cyber Implant Weapon Accessory",
  Earware = "Earware",
  Eyeware = "Eyeware",
  HardNanoware = "Hard Nanoware",
  Headware = "Headware",
  Nanocybernetics = "Nanocybernetics",
  SoftNanoware = "Soft Nanoware",
  SpecialBiodroneCyberware = "Special Biodrone Cyberware",
}

export enum mountLocationXmlEnum {
  Wrist = "wrist",
  Ankle = "ankle",
  Elbow = "elbow",
  Knee = "knee",
  Shoulder = "shoulder",
  Hip = "hip",
}

export type CyberwareSubsystemsRecursiveType = {
  name: string;
  forced?: string | undefined;
  rating?: number | undefined;
  gears?: IncludedGearXmlType | undefined;
  subsystems?: CyberwareSubsystemsXmlType | undefined;
};
const { CyberwareSubsystemsXmlSchema } = type.module({
  SubsystemInternalSchema: {
    name: "string",
    "forced?": "string",
    "rating?": "number",
    "gears?": IncludedGearXmlSchema,
    "subsystems?": "CyberwareSubsystemsXmlSchema",
    // No grade as all accessories and add-ons must be of the same
    // grade as the implant to which they are added
  },
  CyberwareSubsystemsXmlSchema: {
    "cyberware?": ["SubsystemInternalSchema", "|", "SubsystemInternalSchema[]"],
    "bioware?": ["SubsystemInternalSchema", "|", "SubsystemInternalSchema[]"],
  },
});
export type CyberwareSubsystemsXmlType =
  typeof CyberwareSubsystemsXmlSchema.infer;

const cyberwareRatingSchema = type.or(
  "number",
  "'{STRMaximum}'",
  "'{AGIMaximum}'",
  "'{STRMinimum}+1'",
  "'{AGIMinimum}+1'"
);
export type cyberwareRatingType = typeof cyberwareRatingSchema.infer;

const CyberwareSubBonusXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // How many times can this bioware be taken
  "limit?": AugmentationXmlLimitSchema,
  // Category of bioware
  category: type.valueOf(cyberwareXmlCategoryEnum),
  // All cultured Bioware has banned Used and Used (Adapsin)
  // as it has to be specifically made for a person
  // There are limited other cases where it is reserved for
  // certain clinic types
  "bannedgrades?": {
    grade: type.valueOf(augmentationXmlGradeEnum).array(),
  },

  // Essense cost
  ess: StringOrNumberSchema,
  // Needs to be added to a parent
  "requireparent?": "''",
  // This is a modification of a parent essence cost
  "addtoparentess?": "''",
  // Max rating
  "rating?": cyberwareRatingSchema,
  // Minimum rating
  "minrating?": cyberwareRatingSchema,
  // Label linked to what rating does for this cyberware
  "ratinglabel?": type.or("'Rating_LengthInCmBy10'", "'Rating_Meters'"),
  // Programs that can be run + come preloaded
  "programs?": "'Rating'",
  // Capacity for installing cyberware/cyberware accessories
  "capacity?": StringOrNumberSchema,
  // This is a modification of a parent capacity cost
  "addtoparentcapacity?": "''",
  // Add modification to parent weapon, this should match name
  "addparentweaponaccessory?": "string",
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  "cost?": StringOrNumberSchema,
  // Cost to remove (only used for Busted Ware)
  "removalcost?": "number",
  // Do not replace attributes
  "inheritattributes?": "''",
  // Add Weapon (different name than name)
  "addweapon?": "string",
  // Takes up a limb slot
  "limbslot?": type.valueOf(limbSlotXmlEnum),
  // This uses all limb slots of that type e.g. 2 legs
  "limbslotcount?": "'all'",
  // Mount location
  "mountsto?": type.valueOf(mountLocationXmlEnum),
  // This enables cyberlimbs to be easily switched out for the mount location
  "modularmount?": type.valueOf(mountLocationXmlEnum),
  // Cannot install mounts at these mount locations (comma separated)
  // Mutually exclusive with mountsto (but not modularmount)
  "blocksmounts?": "string",
  // Select which side it is installed on
  "selectside?": "''",
  // pairbonus applies when there is 2 of this or 1 of this and 1 of
  // the cyberware here
  "pairinclude?": {
    name: StringArrayOrStringSchema,
  },

  // Additional bonus when wireless enabled
  "wirelessbonus?": BonusXmlSchema,
  // Additional pair bonus when wireless enabled
  "wirelesspairbonus?": BonusXmlSchema,
  // Additional pair include bonus when wireless enabled
  "wirelesspairinclude?": {
    name: "string",
    _includeself: "'False'",
  },

  // Included gear
  "gears?": IncludedGearXmlSchema,
  // Allow certain gear categories
  // used for example, to allow sensors included
  "allowgear?": xmlAllowGearSchema,
  // Included subsystems (cyberware and/or bioware)
  "subsystems?": CyberwareSubsystemsXmlSchema,
  // Allow subsystems outside the "Basic" category
  "allowsubsystems?": {
    category: StringArrayOrStringSchema,
  },

  // Specific notes for chummer 5 client use, these can be ignored
  "notes?": "string",
  // Not selectable
  "hide?": "''",
  // Grade is not applicable to this cyberware i.e. there is only 1 grade
  "forcegrade?": type.or("'None'", "'Standard'"),
  // Only used for Data Lock, this is the device rating in terms of hacking
  "devicerating?": "'{Rating}'",
  // Cyberware is also a drone e.g. remote controlled cyberhand
  // Normally same as name
  "addvehicle?": "string",
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
type CyberwareSubBonusXmlType = typeof CyberwareSubBonusXmlSchema.infer;

// Need to split up type/annotate schema to avoid TS7056 error
export type CyberwareXmlType = CyberwareSubBonusXmlType & {
  bonus?: BonusXmlType | undefined;
  pairbonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
  forbidden?: RequiredXmlType | undefined;
};
const CyberwareXmlSchema = CyberwareSubBonusXmlSchema.merge({
  // Bonus applied by Cyberware
  "bonus?": BonusXmlSchema,
  // // Bonus applied when 2 are equipped e.g. 2 feet = different run speed
  "pairbonus?": BonusXmlSchema,
  // Required
  "required?": RequiredXmlSchema,
  // Forbidden
  "forbidden?": RequiredXmlSchema,
});
export const CyberwareListXmlSchema = type(CyberwareXmlSchema.array());
export type CyberwareListXmlType = typeof CyberwareListXmlSchema.infer;
