import { type } from "arktype";

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
  Schattenhandbuch4 = "SHB4",
  Schattenload2 = "SLG2",
  Schattenload3 = "SLG3",
  Schattenload7 = "SLG7",
  Rigger5 = "R5",
  HowlingShadows = "HS",
  TheVladivostokGauntlet = "TVG",
  SplinteredState = "SPS",
  ShadowsInFocus_Butte = "SFB",
  HongKongSourcebook = "HKS",
  Lockdown = "LCD",
  ShadowsInFocus_Casablanca_Rabat = "SFCR",
  ShadowsInFocus_Metropole = "SFME",
  ShadowsInFocus_SanFranciscoMetroplex = "SFM",
  ShadowsInFocus_SiouxNation_CountingCoup = "SFCC",
  CuttingAces = "CA",
  Shadowrun2050 = "2050",
  BookOfTheLost = "BOTL",
  ForbiddenArcana = "FA",
  StateOfTheArtADL = "SAG",
  TheCompleteTrog = "TCT",
  DarkTerrors = "DTR",
  TheSeattleGambit = "TSG",
  StreetLethal = "SL",
  KillCode = "KC",
  Hamburg = "HAMG",
  BetterThanBad = "BTB",
  Aetherology = "AET",
  NoFuture = "NF",
  DatapulsOsterreich = "DATG",
  DatapulsSOTA2080 = "SOTG",
  DatapulsSOX2080 = "SOXG",
  DatapulsVerschlusssache = "DPVG",
  DerAlmanach_Gratisrollenspieltag2019 = "GRST2019",
  KrimeKatalog = "KK",
  ShadowrunMissions0803_10BlockTango = "SRM0803",
  ShadowrunMissions0804_DirtyLaundry = "SRM0804",
  ShadowrunQuickStartRules = "QSR",
  GrimmesErwachen = "GE",
  SprawlWilds = "SW",
  Parabotany = "PBG",
  Parageology = "PGG",
  Parazoology = "PZG",
}
export const SourceXmlSchema = type.valueOf(sourceBookXmlEnum);

export enum gearXmlCategoryEnum {
  AlchemicalTools = "Alchemical Tools",
  AlchemicalPreperations = "Alchemical Preperations",
  Ammunition = "Ammunition",
  Animals = "Animals",
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
  MagicalPlants = "Magical Plants",
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
  PI_TacPrograms = "PI-Tac Programs",
  HardNanoware = "Hard Nanoware",
  TirTairngireBeverages = "Tir Tairngire Beverages",
}

export enum armourXmlCategoryEnum {
  Armor = "Armor",
  Clothing = "Clothing",
  Cloaks = "Cloaks",
  FashionableArmor = "High-Fashion Armor Clothing",
  SpecialtyArmor = "Specialty Armor",
}

// Gear Shenanigans
const UseGearBaseXmlSchema = type.or(
  "string",
  type({
    "+": "reject",
    xmltext: "string",
    // this gear has some specific option that it needs to select
    // e.g. Tutorsoft selects the "Automotive Mechanic" skill
    "_select?": "string",
    "_rating?": "string",
    "_consumecapacity?": "string",
    "_costfor?": "string",
  })
);
const NameOrIdSchema = type.or(
  {
    "+": "reject",
    name: UseGearBaseXmlSchema,
  },
  {
    "+": "reject",
    id: "string",
  }
);
const PartialInnerUseGearXmlSchema = NameOrIdSchema.merge({
  "+": "reject",
  // this is not redundant as some gear has the
  // same name across different categories
  "category?": type.valueOf(gearXmlCategoryEnum),
  "rating?": "number",
  "maxrating?": "number",
  "capacity?": "string",
  "qty?": "number",
});

export const {
  IncludedGearXmlSchema,
  UseGearXmlSchema,
  InnerGearSchema,
  InnerUseGearXmlSchema,
} = type.module({
  IncludedGearXmlSchema: {
    usegear: "UseGearXmlSchema",
  },
  UseGearXmlSchema:
    // Obviously not the best syntax but can't use thunks for recursive types
    // https://github.com/arktypeio/arktype/issues/813#issuecomment-2870553938
    // Union of these 3 schemas
    [
      UseGearBaseXmlSchema,
      "|",
      [
        "InnerUseGearXmlSchema",
        "|",
        [[UseGearBaseXmlSchema, "|", "InnerUseGearXmlSchema"], "[]"],
      ],
    ],
  InnerUseGearXmlSchema: "Merge<Partial,InnerGearsSchema>",
  InnerGearSchema: {
    "+": "reject",
    gear: "UseGearXmlSchema",
  },
  // These are used as intermediatary for InnerUseGearXmlSchema Merge<>
  // they are not exported
  Partial: PartialInnerUseGearXmlSchema,
  InnerGearsSchema: {
    "+": "reject",
    "gears?": ["IncludedGearXmlSchema", "|", "InnerGearSchema"],
  },
});
export type IncludedGearXmlType = typeof IncludedGearXmlSchema.infer;

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

export const StringOrNumberSchema = type.or("number", "string");
export type StringOrNumberType = typeof StringOrNumberSchema.infer;
export const StringArrayOrStringSchema = type.or("string[]", "string");
export const NumberOrRatingSchema = type.or("number", "'Rating'");
export const NumberOrAnyRatingSchema = type.or(
  "number",
  "'Rating'",
  "'-Rating'"
);
export type NumberOrAnyRatingType = typeof NumberOrAnyRatingSchema.infer;
export const NumberOrRatingOrAttributeSchema = type.or(
  type.valueOf(attributeXMLEnum),
  "number",
  "'Rating'",
  "'-Rating'"
);
export type NumberOrRatingOrAttributeType =
  typeof NumberOrRatingOrAttributeSchema.infer;

export const LimitModifierSchema = type({
  "+": "reject",
  limit: type.or("'Physical'", "'Social'", "'Mental'"),
  value: NumberOrRatingSchema,
  // these are keys for strings listed in en-us.xml
  "condition?": type.or(
    "'LimitCondition_AttribSkillINT'",
    "'LimitCondition_AttribSkillLOG'",
    "'LimitCondition_ShieldPhysicalPenalty'",
    "'LimitCondition_Visible'",
    "'LimitCondition_BunkerGearVisible'",
    "'LimitCondition_CorporationVisible'",
    "'LimitCondition_IntimidationVisible'",
    "'LimitCondition_ExcludeIntimidationVisible'",
    "'LimitCondition_PublicVisible'",
    "'LimitCondition_GangVisible'",
    "'LimitCondition_ClimbingTests'",
    "'LimitCondition_SkillGroupStealth'",
    "'LimitCondition_SkillGroupStealthNaked'",
    "'LimitCondition_SkillsKnowledgeAcademic'",
    "'LimitCondition_SkillsKnowledgeScientificTechnical'",
    "'LimitCondition_SkillsActiveDisguiseImpersonation'",
    "'LimitCondition_SkillsActiveEscapeArtist'",
    "'LimitCondition_SkillsActiveEscapeArtistGrappleLoose'",
    "'LimitCondition_SkillsActiveFirstAidMedicine'",
    "'LimitCondition_SkillsActiveGymnasticsClimbing'",
    "'LimitCondition_SkillsActiveLeadership'",
    "'LimitCondition_SkillsActiveNavigation'",
    "'LimitCondition_SkillsActivePerception'",
    "'LimitCondition_SkillsActivePerceptionHearing'",
    "'LimitCondition_SkillsActivePerceptionSpatialRecognizer'",
    "'LimitCondition_SkillsActivePerceptionVisual'",
    "'LimitCondition_SkillsActivePerformance'",
    "'LimitCondition_SkillsActivePerformanceSinging'",
    "'LimitCondition_SkillsActivePerformanceSynthtrument'",
    "'LimitCondition_SkillsActiveSneakingVisible'",
    "'LimitCondition_SkillsActiveSneakingNaked'",
    "'LimitCondition_SkillsActiveSwimming'",
    "'LimitCondition_SportsFans'",
    "'LimitCondition_SportsRivals'",
    "'LimitCondition_Sprawl'",
    "'LimitCondition_ExcludeFansGangers'",
    "'LimitCondition_TestSneakingThermal'",
    "'LimitCondition_TestSpeech'",
    "'LimitCondition_TestsEndurance'",
    "'LimitCondition_Skillwires'",
    "'LimitCondition_CyberwareHydraulicJacks'",
    "'LimitCondition_CyberwareBalanceTail'",
    "'LimitCondition_CyberwareCyberfins'",
    "'LimitCondition_CyberwareFootAnchor'",
    "'LimitCondition_CyberwareMonkeyFoot'",
    "'LimitCondition_CyberwareRaptorFoot'",
    "'LimitCondition_CyberwareSnakeFingers'",
    "'LimitCondition_InUse'",
    "'LimitCondition_ExcludeIntimidation'",
    "'LimitCondition_Intimidation'",
    "'LimitCondition_GearAutopicker'",
    "'LimitCondition_NationalLanguageRanks'",
    "'LimitCondition_Megacorp'",
    "'LimitCondition_QualityTrustworthy'",
    "'LimitCondition_QualityChatty'"
  ),
});

export const EnglishTranslationsXMLSchema = type({
  string: type({
    key: "string",
    text: type.or(
      "string",
      type({
        "xmltext?": "string",
        "_xml:space": "'preserve'",
      })
    ),
  }).array(),
});
export type EnglishTranslationsXMLType =
  typeof EnglishTranslationsXMLSchema.infer;

export const SkillImprovementXMLSchema = type({
  "+": "reject",
  name: "string",
  // bonus dice
  "val?": "number",
  // check bonus or bonus dice? Answered, see applytorating
  "bonus?": NumberOrAnyRatingSchema,
  // A precedence of 1 ignore all other Improvements and uses the COMBINED value of all other precedence 1 items (Wired Reflexes, Move-by-Wire, and Reaction Enhancers).
  // A precedence of 0 ignore all other Improvements and uses the single highest precedence 0 Improvement the character has (Synaptic Booster).
  // A precedence of -1 ignore the standard behavior of precedence 0 improvements that would normally ignore other sources
  // When values of improvements are fetched, precedence0 and precedence1 items will now check the total value of items without precedence, and if they are less than the latter, they will not override it.
  "_precedence?": "'0'",
  // String or en-us.xml mapped condition of getting this bonus e.g. Only applicable to people who can smell you
  "condition?": "string",
  // Single skill to exclude
  "exclude?": "string",
  // If 'True' then directly increase rating, otherwise add as a dice pool modifier
  "applytorating?": "'True'",
});
export type SkillImprovementXMLType = typeof SkillImprovementXMLSchema.infer;

const SkillImprovementXMLListSchema = type.or(
  SkillImprovementXMLSchema.array(),
  SkillImprovementXMLSchema
);
export type SkillImprovementXMLListType =
  typeof SkillImprovementXMLListSchema.infer;

export const SpiritSchema = type.or(
  type({
    "+": "reject",
    spirit: StringArrayOrStringSchema,
    // Unused... So we won't implement it
    "addtoselected?": type.or("'False'", "'True'"),
  }),
  "''"
);

export const GenericNameValueSchema = type({
  "+": "reject",
  "id?": "string",
  "name?": "string",
  "_name?": "string",
  "value?": "number",
  "val?": StringOrNumberSchema,
  "min?": StringOrNumberSchema,
  "max?": StringOrNumberSchema,
  "aug?": StringOrNumberSchema,
  "_precedence?": "string",
  "xmltext?": StringOrNumberSchema,
});

export type GenericNameValueType = typeof GenericNameValueSchema.infer;

const GenericNameValueListSchema = type.or(
  GenericNameValueSchema.array(),
  GenericNameValueSchema
);

export type GenericNameValueListType = typeof GenericNameValueListSchema.infer;

const ModXmlSchema = type.or(
  "string",
  type({
    "+": "reject",
    xmltext: "string",
    // select="Driver">Searchlight
    "_select?": "string",
    "_rating?": "string",
    // used when the mod rating exceeds the item rating
    "_maxrating?": "string",
    // This is only used to override a mod cost
    // I won't use this...
    "_cost?": "string",
  })
);
export type ModXmlType = typeof ModXmlSchema.infer;

export const ModListXmlSchema = type({
  "+": "reject",
  name: type.or(ModXmlSchema.array(), ModXmlSchema),
  "addslots?": "number",
});
export type ModListXmlType = typeof ModListXmlSchema.infer;

const VehicleModListXmlSchema = ModListXmlSchema.merge({
  "+": "reject",
  "subsystems?": type({
    "+": "reject",
    cyberware: type({
      "+": "reject",
      name: "string",
    }),
  }),
});
export type VehicleModListXmlType = typeof VehicleModListXmlSchema.infer;

export const ModRecursiveXmlSchema = VehicleModListXmlSchema.merge({
  "+": "reject",
  "mod?": type.or(VehicleModListXmlSchema, VehicleModListXmlSchema.array()),
});

export type ModRecursiveXmlType = typeof ModRecursiveXmlSchema.infer;

export const CategoryXmlListSchema = type({
  "+": "reject",
  _blackmarket: "string",
  xmltext: "string",
}).array();
export type CategoryXmlListType = typeof CategoryXmlListSchema.infer;

export const AugmentationXmlLimitSchema = type.or(
  // Unlimited times
  "'False'",
  // Replaces arm
  "'{arm}'",
  // Replaces leg
  "'{leg}'",
  // Replaces torso
  "'{torso}'",
  // Replaces skull
  "'{skull}'",
  // Replaces finger
  "'{arm} * 5'",
  // Up to Unaugmented Body Score
  "'{BODUnaug}'",
  // This augmentation can be taken up to this number
  "number"
);

export type AugmentationXmlLimitType = typeof AugmentationXmlLimitSchema.infer;

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

export const xmlAllowGearSchema = type.or(
  type({
    "+": "reject",
    "gearcategory?": type.or(
      type.valueOf(gearXmlCategoryEnum).array(),
      type.valueOf(gearXmlCategoryEnum)
    ),
    "gearname?": "string[]",
  }),
  "string"
);

export type xmlAllowGearType = typeof xmlAllowGearSchema.infer;

const XmlQualitySingleSchema = type.or(
  type({
    // At least one of these optional must be implemented for xmltext to be valid
    "_removable?": "'True'",
    "_select?": "string",
    xmltext: "string",
  }),
  "string"
);

const XmlQualityListSingularSchema = type({
  "+": "reject",
  quality: type.or(XmlQualitySingleSchema.array(), XmlQualitySingleSchema),
});
export type XmlQualityListSingularType =
  typeof XmlQualityListSingularSchema.infer;

export const XmlQualityListSchema = type({
  "+": "reject",
  // one of either positive or negative must be defined
  "positive?": XmlQualityListSingularSchema,
  "negative?": XmlQualityListSingularSchema,
});
export type XmlQualityListType = typeof XmlQualityListSchema.infer;

export const XmlPowerSchema = type.or(
  type({
    "+": "reject",
    "_select?": "string",
    "_rating?": "string",
    xmltext: "string",
  }),
  "string"
);
const XmlPowerListSchema = type(XmlPowerSchema.array());
export type XmlPowerListType = typeof XmlPowerListSchema.infer;

export const XmlDurationSchema = type.or(
  "'I'",
  "'Instant'",
  "'S'",
  "'Sustained'",
  // Permanent
  "'P'",
  "'Permanent'",
  "'Always'",
  "'Special'",
  // Extended Test
  "'E'"
);
export type XmlDurationType = typeof XmlDurationSchema.infer;

export const SpellPowerXmlRangeSchema = type.or(
  "'LOS'", // Line Of Sight
  "'LOS (A)'", // LOS (Area)
  "'T'", // Touch
  "'Touch'",
  "'T (A)'", // Touch (Area)? How does this work?
  "'S'", // Self
  "'Self'",
  "'S (A)'", // Self (Area) - originate from self
  "'Special'",
  // This only applies to critter powers
  // TODO: in chummer make linkable to one of them
  "'Touch or LOS'" // Line Of Sight or Touch
);

export type SpellPowerXmlRangeType = typeof SpellPowerXmlRangeSchema.infer;

export const NaturalWeaponXmlSchema = type({
  "+": "reject",
  name: "string",
  accuracy: "string",
  damage: "string",
  ap: type.or("number", "string"),
  reach: "number",
  useskill: "string",
  "useskillspec?": "string",
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
});
export type NaturalWeaponXmlType = typeof NaturalWeaponXmlSchema.infer;

export enum MatrixAttributeXmlSchema {
  Attack = "String_Attack",
  DataProcessing = "String_DataProcessing",
  Firewall = "String_Firewall",
  Sleaze = "String_Sleaze",
}

export enum spellXmlCategoryEnum {
  Combat = "Combat",
  Detection = "Detection",
  Health = "Health",
  Illusion = "Illusion",
  Manipulation = "Manipulation",
  Enchantments = "Enchantments",
  Rituals = "Rituals",
}

export enum weaponSubtypeEnum {
  Blades = "Blades",
  Clubs = "Clubs",
  Gear = "Gear",
  ExoticMeleeWeapons = "Exotic Melee Weapons",
  ExoticRangedWeapons = "Exotic Ranged Weapons",
  Flamethrowers = "Flamethrowers",
  Cyberweapon = "Cyberweapon",
  Bows = "Bows",
  Crossbows = "Crossbows",
  Tasers = "Tasers",
  Holdouts = "Holdouts",
  LightPistols = "Light Pistols",
  HeavyPistols = "Heavy Pistols",
  MachinePistols = "Machine Pistols",
  SubmachineGuns = "Submachine Guns",
  AssaultRifles = "Assault Rifles",
  SportingRifles = "Sporting Rifles",
  Shotguns = "Shotguns",
  SniperRifles = "Sniper Rifles",
  LightMachineguns = "Light Machine Guns",
  MediumMachineguns = "Medium Machine Guns",
  HeavyMachineguns = "Heavy Machine Guns",
  AssaultCannons = "Assault Cannons",
  GrenadeLaunchers = "Grenade Launchers",
  MissileLaunchers = "Missile Launchers",
  ImprovisedWeapons = "Improvised Weapons",
  LaserWeapons = "Laser Weapons",
  Unarmed = "Unarmed",
  Quality = "Quality",
  // Underbarrel weapons includes top mounted weapons e.g. Mounted Crossbow
  UnderbarrelWeapons = "Underbarrel Weapons",
  BioWeapon = "Bio-Weapon",
  Carbines = "Carbines",
  Rifles = "Rifles",
  Pistol = "Pistol",
}
