import { z as zod } from "zod";

export enum sourceBookXmlEnum {
  AssassinPrimer = "AP",
  GunHeaven3 = "GH3",
  RunAndGun = "RG",
  Shadowrun5 = "SR5",
  StreetGrimoire = "SG",
  StreetGrimoireErrata = "SGE",
  BulletsAndBandages = "BB",
  SailAwaySweetSister = "SASS",
  StolenSouls = "SS",
  RunFaster = "RF",
  ShadowSpells = "SSP",
  NothingPersonal = "NP",
  DataTrails = "DT",
  DataTrailsDissonantEchoes = "DTD",
  ChromeFlesh = "CF",
  HardTargets = "HT",
  BloodyBusiness = "BLB",
  Schattenhandbuch = "SHB",
  Schattenhandbuch2 = "SHB2",
  Schattenhandbuch3 = "SHB3",
  Rigger5 = "R5",
  HowlingShadows = "HS",
  TheVladivostokGauntlet = "TVG",
  SplinteredState = "SPS",
  ShadowsInFocus_Butte = "SFB",
  HongKongSourcebook = "HKS",
  Lockdown = "LCD",
  ShadowsInFocus_SanFranciscoMetroplex = "SFM",
  ShadowsInFocus_Metropole = "SFME",
  CuttingAces = "CA",
  Shadowrun2050 = "2050",
  BookOfTheLost = "BOTL",
  ForbiddenArcana = "FA",
  StateOfTheArtADL = "SAG",
  TheCompleteTrog = "TCT",
  ShadowsInFocus_SiouxNation_CountingCoup = "SFCC",
  DarkTerrors = "DTR",
  TheSeattleGambit = "TSG",
  StreetLethal = "SL",
  KillCode = "KC",
  Hamburg = "HAMG",
  BetterThanBad = "BTB",
  Aetherology = "AET",
  NoFuture = "NF",
  DatapulsSOTA2080 = "SOTG",
  DatapulsVerschlusssache = "DPVG",
  KrimeKatalog = "KK",
  ShadowrunMissions0803_10BlockTango = "SRM0803",
  ShadowrunMissions0804_DirtyLaundry = "SRM0804",
  ShadowrunQuickStartRules = "QSR",
  GrimmesErwachen = "GE",
  SprawlWilds = "SW",
}
export const SourceXmlSchema = zod.nativeEnum(sourceBookXmlEnum);

export enum GearXmlCategoryEnum {
  AlchemicalTools = "Alchemical Tools",
  Ammunition = "Ammunition",
  ArmorEnhancements = "Armor Enhancements",
  AudioDevices = "Audio Devices",
  AudioEnhancements = "Audio Enhancements",
  Autosofts = "Autosofts",
  Biotech = "Biotech",
  BreakingAndEnteringGear = "Breaking and Entering Gear",
  BTLs = "BTLs",
  Chemicals = "Chemicals",
  Commlinks = "Commlinks",
  Commlink_CyberdeckFormFactors = "Commlink/Cyberdeck Form Factors",
  CommlinkAccessories = "Commlink Accessories",
  CommlinkApps = "Commlink Apps",
  CommonPrograms = "Common Programs",
  CommunicationsAndCountermeasures = "Communications and Countermeasures",
  Contracts_Upkeep = "Contracts/Upkeep",
  CritterGear = "Critter Gear",
  Currency = "Currency",
  Custom = "Custom",
  CustomCyberdeckAttributes = "Custom Cyberdeck Attributes",
  CustomDrug = "Custom Drug",
  CyberdeckModules = "Cyberdeck Modules",
  Cyberdecks = "Cyberdecks",
  Cyberterminals = "Cyberterminals",
  Disguises = "Disguises",
  Drugs = "Drugs",
  ElectronicsAccessories = "Electronics Accessories",
  ElectronicModification = "Electronic Modification",
  ElectronicParts = "Electronic Parts",
  Entertainment = "Entertainment",
  Explosives = "Explosives",
  ExtractionDevices = "Extraction Devices",
  Foci = "Foci",
  Food = "Food",
  Formulae = "Formulae",
  GrappleGun = "Grapple Gun",
  HackingPrograms = "Hacking Programs",
  Housewares = "Housewares",
  ID_Credsticks = "ID/Credsticks",
  MagicalCompounds = "Magical Compounds",
  MagicalSupplies = "Magical Supplies",
  Metatype_Specific = "Metatype-Specific",
  Miscellany = "Miscellany",
  MusicalInstruments = "Musical Instruments",
  Nanogear = "Nanogear",
  Paydata = "Paydata",
  PI_Tac = "PI-Tac",
  Printing = "Printing",
  ReporterGear = "Reporter Gear",
  RFIDTags = "RFID Tags",
  RiggerCommandConsoles = "Rigger Command Consoles",
  SecurityDevices = "Security Devices",
  Sensors = "Sensors",
  SensorFunctions = "Sensor Functions",
  SensorHousings = "Sensor Housings",
  Services = "Services",
  Skillsofts = "Skillsofts",
  Software = "Software",
  SoftwareTweaks = "Software Tweaks",
  SurvivalGear = "Survival Gear",
  TailoredPerfume_Cologne = "Tailored Perfume/Cologne",
  Tools = "Tools",
  ToolsOfTheTrade = "Tools of the Trade",
  Toxins = "Toxins",
  VisionDevices = "Vision Devices",
  VisionEnhancements = "Vision Enhancements",
  MatrixAccessories = "Matrix Accessories",
  BoosterChips = "Booster Chips",
  AppearanceModification = "Appearance Modification",
  DrugGrades = "Drug Grades",
  Pi_TacPrograms = "Pi-Tac Programs",
  HardNanoware = "Hard Nanoware",
}

// Gear Shenanigans
const UseGearBaseXmlSchema = zod.union([
  zod.string(),
  zod
    .object({
      xmltext: zod.string(),
      // this gear has some specific option that it needs to select
      // e.g. Tutorsoft selects the "Automotive Mechanic" skill
      _select: zod.optional(zod.string()),
      _rating: zod.optional(zod.string()),
      _consumecapacity: zod.optional(zod.string()),
      _costfor: zod.optional(zod.string()),
    })
    .strict(),
]);
type UseGearBaseXmlType = zod.infer<typeof UseGearBaseXmlSchema>;

type InnerGearType = {
  gear:
    | Array<InnerUseGearsXmlType>
    | InnerUseGearsXmlType
    | Array<UseGearBaseXmlType>
    | UseGearBaseXmlType;
};
const InnerGearSchema: zod.ZodType<InnerGearType> = zod.lazy(() =>
  zod
    .object({
      gear: zod.union([
        zod.array(InnerUseGearXmlSchema),
        InnerUseGearXmlSchema,
        zod.array(UseGearBaseXmlSchema),
        UseGearBaseXmlSchema,
      ]),
    })
    .strict()
);

const PartialInnerUseGearXmlSchema = zod
  .object({
    name: UseGearBaseXmlSchema,
    // I think this is redundant as we are always have a name anyway
    // edit: actually not redundant as some gear has the same name across
    // different categories
    category: zod.optional(zod.nativeEnum(GearXmlCategoryEnum)),
    rating: zod.optional(zod.number()),
    maxrating: zod.optional(zod.number()),
    capacity: zod.optional(zod.string()),
    qty: zod.optional(zod.number()),
  })
  .strict();
type PartialInnerUseGearXmlType = zod.infer<
  typeof PartialInnerUseGearXmlSchema
>;

export type InnerUseGearsXmlType = PartialInnerUseGearXmlType & {
  gears?: zod.infer<typeof GearXmlSchema> | InnerGearType | undefined;
};

const InnerUseGearXmlSchema: zod.ZodType<InnerUseGearsXmlType> =
  PartialInnerUseGearXmlSchema.extend({
    gears: zod.optional(
      zod.union([
        zod.lazy(() => GearXmlSchema),
        zod.lazy(() => InnerGearSchema),
      ])
    ),
  }).strict();

// split into its own schema for ease of reading
export const UseGearXmlSchema = zod.union([
  UseGearBaseXmlSchema,
  InnerUseGearXmlSchema,
  zod.array(zod.union([UseGearBaseXmlSchema, InnerUseGearXmlSchema])),
]);
export const GearXmlSchema = zod
  .object({
    usegear: UseGearXmlSchema,
  })
  .strict();
export type GearXmlType = zod.infer<typeof GearXmlSchema>;

export enum attributeXMLEnum {
  BOD = "BOD",
  AGI = "AGI",
  REA = "REA",
  STR = "STR",
  WIL = "WIL",
  LOG = "LOG",
  INT = "INT",
  CHA = "CHA",
  MAG = "MAG",
  RES = "RES",
  INI = "INI",
  DEP = "DEP", // Depth
  EDG = "EDG",
}

export enum lockedAttributeXmlEnum {
  MAG = "MAG",
  RES = "RES",
  DEP = "DEP",
}

export enum limbSlotXmlEnum {
  ARM = "arm",
  LEG = "leg",
  TORSO = "torso",
  SKULL = "skull",
  ALL = "all",
}

export const StringOrNumberSchema = zod.union([zod.number(), zod.string()]);
export const StringArrayOrStringSchema = zod.union([
  zod.array(zod.string()),
  zod.string(),
]);
export const NumberOrRatingSchema = zod.union([
  zod.number(),
  zod.literal("Rating"),
]);
export const NumberOrAnyRatingSchema = zod.union([
  zod.number(),
  zod.literal("Rating"),
  zod.literal("-Rating"),
]);
export type NumberOrAnyRatingType = zod.infer<typeof NumberOrAnyRatingSchema>;

export const LimitModifierSchema = zod
  .object({
    limit: zod.union([
      zod.literal("Physical"),
      zod.literal("Social"),
      zod.literal("Mental"),
    ]),
    value: NumberOrRatingSchema,
    // these are keys for strings listed in en-us.xml
    condition: zod.optional(
      zod.union([
        zod.literal("LimitCondition_AttribSkillINT"),
        zod.literal("LimitCondition_AttribSkillLOG"),
        zod.literal("LimitCondition_ShieldPhysicalPenalty"),
        zod.literal("LimitCondition_Visible"),
        zod.literal("LimitCondition_BunkerGearVisible"),
        zod.literal("LimitCondition_CorporationVisible"),
        zod.literal("LimitCondition_IntimidationVisible"),
        zod.literal("LimitCondition_ExcludeIntimidationVisible"),
        zod.literal("LimitCondition_PublicVisible"),
        zod.literal("LimitCondition_GangVisible"),
        zod.literal("LimitCondition_ClimbingTests"),
        zod.literal("LimitCondition_SkillGroupStealth"),
        zod.literal("LimitCondition_SkillGroupStealthNaked"),
        zod.literal("LimitCondition_SkillsKnowledgeAcademic"),
        zod.literal("LimitCondition_SkillsKnowledgeScientificTechnical"),
        zod.literal("LimitCondition_SkillsActiveDisguiseImpersonation"),
        zod.literal("LimitCondition_SkillsActiveEscapeArtist"),
        zod.literal("LimitCondition_SkillsActiveEscapeArtistGrappleLoose"),
        zod.literal("LimitCondition_SkillsActiveFirstAidMedicine"),
        zod.literal("LimitCondition_SkillsActiveGymnasticsClimbing"),
        zod.literal("LimitCondition_SkillsActiveLeadership"),
        zod.literal("LimitCondition_SkillsActiveNavigation"),
        zod.literal("LimitCondition_SkillsActivePerception"),
        zod.literal("LimitCondition_SkillsActivePerceptionHearing"),
        zod.literal("LimitCondition_SkillsActivePerceptionSpatialRecognizer"),
        zod.literal("LimitCondition_SkillsActivePerceptionVisual"),
        zod.literal("LimitCondition_SkillsActivePerformance"),
        zod.literal("LimitCondition_SkillsActivePerformanceSinging"),
        zod.literal("LimitCondition_SkillsActivePerformanceSynthtrument"),
        zod.literal("LimitCondition_SkillsActiveSneakingVisible"),
        zod.literal("LimitCondition_SkillsActiveSneakingNaked"),
        zod.literal("LimitCondition_SkillsActiveSwimming"),
        zod.literal("LimitCondition_SportsFans"),
        zod.literal("LimitCondition_SportsRivals"),
        zod.literal("LimitCondition_Sprawl"),
        zod.literal("LimitCondition_ExcludeFansGangers"),
        zod.literal("LimitCondition_TestSneakingThermal"),
        zod.literal("LimitCondition_TestSpeech"),
        zod.literal("LimitCondition_TestsEndurance"),
        zod.literal("LimitCondition_Skillwires"),
        zod.literal("LimitCondition_CyberwareHydraulicJacks"),
        zod.literal("LimitCondition_CyberwareBalanceTail"),
        zod.literal("LimitCondition_CyberwareCyberfins"),
        zod.literal("LimitCondition_CyberwareFootAnchor"),
        zod.literal("LimitCondition_CyberwareMonkeyFoot"),
        zod.literal("LimitCondition_CyberwareRaptorFoot"),
        zod.literal("LimitCondition_CyberwareSnakeFingers"),
        zod.literal("LimitCondition_InUse"),
        zod.literal("LimitCondition_ExcludeIntimidation"),
        zod.literal("LimitCondition_Intimidation"),
        zod.literal("LimitCondition_GearAutopicker"),
        zod.literal("LimitCondition_NationalLanguageRanks"),
        zod.literal("LimitCondition_Megacorp"),
        zod.literal("LimitCondition_QualityTrustworthy"),
        zod.literal("LimitCondition_QualityChatty"),
      ])
    ),
  })
  .strict();

export const SkillSchema = zod
  .object({
    name: zod.string(),
    // bonus dice
    val: zod.optional(zod.number()),
    // check bonus or bonus dice?
    bonus: zod.optional(NumberOrAnyRatingSchema),
    _precedence: zod.optional(zod.literal("0")),
    condition: zod.optional(zod.string()),
    exclude: zod.optional(zod.string()),
    applytorating: zod.optional(zod.literal("True")),
  })
  .strict();

const SkillListSchema = zod.union([zod.array(SkillSchema), SkillSchema]);
export type SkillListType = zod.infer<typeof SkillListSchema>;

export const SpiritSchema = zod.union([
  zod
    .object({
      spirit: StringArrayOrStringSchema,
      addtoselected: zod.optional(
        zod.union([zod.literal("False"), zod.literal("True")])
      ),
    })
    .strict(),
  zod.literal(""),
]);

export const GenericNameValueSchema = zod
  .object({
    id: zod.optional(zod.string()),
    name: zod.optional(zod.string()),
    _name: zod.optional(zod.string()),
    value: zod.optional(zod.number()),
    val: zod.optional(StringOrNumberSchema),
    min: zod.optional(StringOrNumberSchema),
    max: zod.optional(StringOrNumberSchema),
    aug: zod.optional(StringOrNumberSchema),
    _precedence: zod.optional(zod.string()),
    xmltext: zod.optional(StringOrNumberSchema),
  })
  .strict();

export type GenericNameValueType = zod.infer<typeof GenericNameValueSchema>;

const GenericNameValueListSchema = zod.union([
  zod.array(GenericNameValueSchema),
  GenericNameValueSchema,
]);

export type GenericNameValueListType = zod.infer<
  typeof GenericNameValueListSchema
>;

const ModXmlSchema = zod.union([
  zod.string(),
  zod
    .object({
      xmltext: zod.string(),
      // select="Driver">Searchlight
      _select: zod.optional(zod.string()),
      _rating: zod.optional(zod.string()),
      // used when the mod rating exceeds the item rating
      _maxrating: zod.optional(zod.string()),
      // This is only used to override a mod cost
      // I won't use this...
      _cost: zod.optional(zod.string()),
    })
    .strict(),
]);
export type ModXmlType = zod.infer<typeof ModXmlSchema>;

export const ModListXmlSchema = zod
  .object({
    name: zod.union([zod.array(ModXmlSchema), ModXmlSchema]),
  })
  .strict();
export type ModListXmlType = zod.infer<typeof ModListXmlSchema>;

const VehicleModListXmlSchema = ModListXmlSchema.extend({
  subsystems: zod.optional(
    zod
      .object({
        cyberware: zod
          .object({
            name: zod.string(),
          })
          .strict(),
      })
      .strict()
  ),
}).strict();
export type VehicleModListXmlType = zod.infer<typeof VehicleModListXmlSchema>;

export const ModRecursiveXmlSchema = VehicleModListXmlSchema.extend({
  mod: zod.optional(
    zod.union([VehicleModListXmlSchema, zod.array(VehicleModListXmlSchema)])
  ),
}).strict();

export type ModRecursiveXmlType = zod.infer<typeof ModRecursiveXmlSchema>;

export const CategoryXmlListSchema = zod.array(
  zod
    .object({
      _blackmarket: zod.string(),
      xmltext: zod.string(),
    })
    .strict()
);
export type CategoryXmlListType = zod.infer<typeof CategoryXmlListSchema>;

export const AugmentationXmlLimitSchema = zod.union([
  // Unlimited times
  zod.literal("False"),
  // Replaces arm
  zod.literal("{arm}"),
  // Replaces leg
  zod.literal("{leg}"),
  // Replaces torso
  zod.literal("{torso}"),
  // Replaces skull
  zod.literal("{skull}"),
  // Replaces finger
  zod.literal("{arm} * 5"),
  // Up to Unaugmented Body Score
  zod.literal("{BODUnaug}"),
  // This augmentation can be taken up to this number
  zod.number(),
]);

export type AugmentationXmlLimitType = zod.infer<
  typeof AugmentationXmlLimitSchema
>;

export enum augmentationXmlGradeEnum {
  None = "None",
  Used = "Used",
  UsedAdapsin = "Used (Adapsin)",
  Standard = "Standard",
  // Standard augmentations after taking Burnout's Way quality
  StandardBurnout = "Standard (Burnout's Way)",
  Alphaware = "Alphaware",
  AlphawareAdapsin = "Alphaware (Adapsin)",
  Betaware = "Betaware",
  BetawareAdapsin = "Betaware (Adapsin)",
  Deltaware = "Deltaware",
  DeltawareAdapsin = "Deltaware (Adapsin)",
  Gammaware = "Gammaware",
  GammawareAdapsin = "Gammaware (Adapsin)",
  Omegaware = "Omegaware",
  OmegawareAdapsin = "Omegaware (Adapsin)",
  Greyware = "Greyware",
  GreywareAdapsin = "Greyware (Adapsin)",
}

export const xmlAllowGearSchema = zod.union([
  zod
    .object({
      gearcategory: zod.optional(
        zod.union([
          zod.array(zod.nativeEnum(GearXmlCategoryEnum)),
          zod.nativeEnum(GearXmlCategoryEnum),
        ])
      ),
      gearname: zod.optional(zod.array(zod.string())),
    })
    .strict(),
  zod.string(),
]);

export type xmlAllowGearType = zod.infer<typeof xmlAllowGearSchema>;

const XmlQualitySingleSchema = zod.union([
  zod
    .object({
      // At least one of these optional must be implemented for xmltext to be valid
      _removable: zod.optional(zod.literal("True")),
      _select: zod.optional(zod.string()),
      xmltext: zod.string(),
    })
    .strict(),
  zod.string(),
]);

const XmlQualityListSingularSchema = zod
  .object({
    quality: zod.union([
      zod.array(XmlQualitySingleSchema),
      XmlQualitySingleSchema,
    ]),
  })
  .strict();
export type XmlQualityListSingularType = zod.infer<
  typeof XmlQualityListSingularSchema
>;

export const XmlQualityListSchema = zod
  .object({
    // one of either positive or negative must be defined
    positive: zod.optional(XmlQualityListSingularSchema),
    negative: zod.optional(XmlQualityListSingularSchema),
  })
  .strict();
export type XmlQualityListType = zod.infer<typeof XmlQualityListSchema>;

export const XmlPowerSchema = zod.union([
  zod
    .object({
      _select: zod.optional(zod.string()),
      _rating: zod.optional(zod.string()),
      xmltext: zod.string(),
    })
    .strict(),
  zod.string(),
]);
const XmlPowerListSchema = zod.array(XmlPowerSchema);
export type XmlPowerListType = zod.infer<typeof XmlPowerListSchema>;

export const XmlDurationSchema = zod.union([
  zod.literal("I"),
  zod.literal("Instant"),
  zod.literal("S"),
  zod.literal("Sustained"),
  // Permanent
  zod.literal("P"),
  zod.literal("Permanent"),
  zod.literal("Always"),
  zod.literal("Special"),
  // Extended Test
  zod.literal("E"),
]);
export type XmlDurationType = zod.infer<typeof XmlDurationSchema>;

export const SpellPowerXmlRangeSchema = zod.union([
  zod.literal("LOS"), // Line Of Sight
  zod.literal("LOS (A)"), // LOS (Area)
  zod.literal("T"), // Touch
  zod.literal("Touch"),
  zod.literal("T (A)"), // Touch (Area)? How does this work?
  zod.literal("S"), // Self
  zod.literal("Self"),
  zod.literal("S (A)"), // Self (Area) - originate from self
  zod.literal("Special"),
  // This only applies to critter powers
  // TODO: in chummer make linkable to one of them
  zod.literal("Touch or LOS"), // Line Of Sight or Touch
]);

export type SpellPowerXmlRangeType = zod.infer<typeof SpellPowerXmlRangeSchema>;

export const NaturalWeaponSchema = zod
  .object({
    name: zod.string(),
    reach: zod.number(),
    damage: zod.string(),
    ap: zod.number(),
    useskill: zod.string(),
    useskillspec: zod.optional(zod.string()),
    accuracy: zod.string(),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();
