import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  GearXmlSchema,
  GearXmlType,
  limbSlotXmlEnum,
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
  augmentationXmlGradeEnum,
  AugmentationXmlLimitSchema,
  xmlAllowGearSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

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
  WRIST = "wrist",
  ANKLE = "ankle",
  ELBOW = "elbow",
  KNEE = "knee",
  SHOULDER = "shoulder",
  HIP = "hip",
}

export type CyberwareSubsystemsRecursiveType = {
  name: string;
  forced?: string | undefined;
  rating?: number | undefined;
  gears?: GearXmlType | undefined;
  subsystems?: CyberwareSubsystemsXmlType | undefined;
};

const SubsystemInternalSchema: zod.ZodType<CyberwareSubsystemsRecursiveType> =
  zod
    .object({
      name: zod.string(),
      forced: zod.optional(zod.string()),
      rating: zod.optional(zod.number()),
      gears: zod.optional(GearXmlSchema),
      subsystems: zod.optional(zod.lazy(() => CyberwareSubsystemsXmlSchema)),
    })
    .strict();

const CyberwareSubsystemsXmlSchema = zod
  .object({
    cyberware: zod.optional(
      zod.union([SubsystemInternalSchema, zod.array(SubsystemInternalSchema)])
    ),
    bioware: zod.optional(
      zod.union([SubsystemInternalSchema, zod.array(SubsystemInternalSchema)])
    ),
  })
  .strict();

export type CyberwareSubsystemsXmlType = zod.infer<
  typeof CyberwareSubsystemsXmlSchema
>;

const cyberwareRatingSchema = zod.union([
  zod.number(),
  zod.literal("MaximumSTR"),
  zod.literal("MaximumAGI"),
  zod.literal("MinimumSTR+1"),
  zod.literal("MinimumAGI+1"),
]);
export type cyberwareRatingType = zod.infer<typeof cyberwareRatingSchema>;

const CyberwareXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // How many times can this bioware be taken
    limit: zod.optional(AugmentationXmlLimitSchema),
    // Category of bioware
    category: zod.nativeEnum(cyberwareXmlCategoryEnum),
    // All cultured Bioware has banned Used and Used (Adapsin)
    // as it has to be specifically made for a person
    // There are limited other cases where it is reserved for
    // certain clinic types
    bannedgrades: zod.optional(
      zod
        .object({
          grade: zod.array(zod.nativeEnum(augmentationXmlGradeEnum)),
        })
        .strict()
    ),
    // Essense cost
    ess: StringOrNumberSchema,
    // Needs to be added to a parent
    requireparent: zod.optional(zod.literal("")),
    // This is a modification of a parent essence cost
    addtoparentess: zod.optional(zod.literal("")),
    // Max rating
    rating: zod.optional(cyberwareRatingSchema),
    // Minimum rating
    minrating: zod.optional(cyberwareRatingSchema),
    // Label linked to what rating does for this cyberware
    ratinglabel: zod.optional(
      zod.union([
        zod.literal("Rating_LengthInCmBy10"),
        zod.literal("Rating_Meters"),
      ])
    ),
    // Programs that can be run + come preloaded
    programs: zod.optional(zod.literal("Rating")),
    // Capacity for installing cyberware/cyberware accessories
    capacity: zod.optional(StringOrNumberSchema),
    // This is a modification of a parent capacity cost
    addtoparentcapacity: zod.optional(zod.literal("")),
    // Add modification to parent weapon, this should match name
    addparentweaponaccessory: zod.optional(zod.string()),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: zod.optional(StringOrNumberSchema),
    // Cost to remove (only used for Busted Ware)
    removalcost: zod.optional(zod.number()),
    // Do not replace attributes
    inheritattributes: zod.optional(zod.literal("")),
    // Add Weapon (different name than name)
    addweapon: zod.optional(zod.string()),
    // Takes up a limb slot
    limbslot: zod.optional(zod.nativeEnum(limbSlotXmlEnum)),
    // This uses all limb slots of that type e.g. 2 legs
    limbslotcount: zod.optional(zod.literal("all")),
    // Mount location
    mountsto: zod.optional(zod.nativeEnum(mountLocationXmlEnum)),
    // This enables cyberlimbs to be easily switched out for the mount location
    modularmount: zod.optional(zod.nativeEnum(mountLocationXmlEnum)),
    // Cannot install mounts at these mount locations (comma separated)
    // Mutually exclusive with mountsto (but not modularmount)
    blocksmounts: zod.optional(zod.string()),
    // Select which side it is installed on
    selectside: zod.optional(zod.literal("")),
    // Bonus applied by Cyberware
    bonus: zod.optional(BonusXmlSchema),
    // Bonus applied when 2 are equipped e.g. 2 feet = different run speed
    pairbonus: zod.optional(BonusXmlSchema),
    // pairbonus applies when there is 2 of this or 1 of this and 1 of
    // the cyberware here
    pairinclude: zod.optional(
      zod
        .object({
          name: StringArrayOrStringSchema,
        })
        .strict()
    ),
    // Additional bonus when wireless enabled
    wirelessbonus: zod.optional(BonusXmlSchema),
    // Additional pair bonus when wireless enabled
    wirelesspairbonus: zod.optional(BonusXmlSchema),
    // Additional pair include bonus when wireless enabled
    wirelesspairinclude: zod.optional(
      zod
        .object({
          name: zod.string(),
          _includeself: zod.literal("False"),
        })
        .strict()
    ),
    // Required
    required: zod.optional(RequiredXmlSchema),
    // Forbidden
    forbidden: zod.optional(RequiredXmlSchema),
    // Included gear
    gears: zod.optional(GearXmlSchema),
    // Allow certain gear categories
    // used for example, to allow sensors included
    allowgear: zod.optional(xmlAllowGearSchema),
    // Included subsystems (cyberware and/or bioware)
    subsystems: zod.optional(CyberwareSubsystemsXmlSchema),
    // Allow subsystems outside the "Basic" category
    allowsubsystems: zod.optional(
      zod
        .object({
          category: StringArrayOrStringSchema,
        })
        .strict()
    ),
    // Specific notes for chummer 5 client use, these can be ignored
    notes: zod.optional(zod.string()),
    // Not selectable
    hide: zod.optional(zod.literal("")),
    // Grade is not applicable to this cyberware i.e. there is only 1 grade
    forcegrade: zod.optional(
      zod.union([zod.literal("None"), zod.literal("Standard")])
    ),
    // Only used for Data Lock, this is the device rating in terms of hacking
    devicerating: zod.optional(zod.literal("{Rating}")),
    // Cyberware is also a drone e.g. remote controlled cyberhand
    // Normally same as name
    addvehicle: zod.optional(zod.string()),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type CyberwareXmlType = zod.infer<typeof CyberwareXmlSchema>;
export const CyberwareListXmlSchema = zod.array(CyberwareXmlSchema);
export type CyberwareListXmlType = zod.infer<typeof CyberwareListXmlSchema>;
