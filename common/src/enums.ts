export enum skillCategoryEnum {
  Combat = "Combat Active",
  Physical = "Physical Active",
  Social = "Social Active",
  Magical = "Magical Active",
  PseudoMagical = "Pseudo-Magical Active",
  Resonance = "Resonance Active",
  Technical = "Technical Active",
  Vehicle = "Vehicle Active",
  Academic = "Academic",
  Interest = "Interest",
  Language = "Language",
  Professional = "Professional",
  Street = "Street",
}

export enum skillTalentSourceEnum {
  Resonance = "Resonance",
  Matrix = "Matrix",
  Magic = "Magic",
  Adept = "Adept",
}

export enum qualityCategoryEnum {
  Positive = "Positive",
  Negative = "Negative",
}

export enum heritageCategoryEnum {
  Metahuman = "Metahuman",
  Metavariant = "Metavariant",
  Metasapient = "Metasapient",
  Shapeshifter = "Shapeshifter",
}

export enum priorityCategoryEnum {
  Heritage = "Heritage",
  Talent = "Talent",
  Attributes = "Attributes",
  Skills = "Skills",
  Resources = "Resources",
}

export enum talentCategoryEnum {
  Magic = "Magic",
  Resonance = "Resonance",
  Depth = "Depth",
  Mundane = "Mundane",
}

export enum priorityTableRunnerLevelEnum {
  StreetLevel = "Street Level",
  Standard = "Standard",
  PrimeRunner = "Prime Runner",
}

export enum priorityLetterEnum {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
}

export enum baseAttributeTypeEnum {
  Body = "Body",
  Agility = "Agility",
  Reaction = "Reaction",
  Strength = "Strength",
  Willpower = "Willpower",
  Logic = "Logic",
  Intuition = "Intuition",
  Charisma = "Charisma",
}

export enum specialAttributeTypeEnum {
  Magic = "Magic",
  Resonance = "Resonance",
  Depth = "Depth",
  Edge = "Edge",
}

export enum attributeTypeEnum {
  Body = "Body",
  Agility = "Agility",
  Reaction = "Reaction",
  Strength = "Strength",
  Willpower = "Willpower",
  Logic = "Logic",
  Intuition = "Intuition",
  Charisma = "Charisma",
  Magic = "Magic",
  Resonance = "Resonance",
  Depth = "Depth",
  Edge = "Edge",
}

export enum weaponTypeEnum {
  Melee = "Melee",
  Projectile = "Projectile",
  Firearm = "Firearm",
  Explosive = "Explosive",
}

export enum meleeWeaponTypeEnum {
  Blades = "Blades",
  Clubs = "Clubs",
  Improvised = "Improvised",
  Exotic = "Exotic",
  Unarmed = "Unarmed",
  MetagenicQuality = "Mutagenic Quality",
  BioWeapons = "Bio-Weapons",
  WeaponAttachments = "Weapon Attachments",
}

export enum projectileWeaponTypeEnum {
  Bows = "Bows",
  Crossbows = "Crossbows",
  ThrowingWeapons = "Throwing Weapons",
}

export enum firearmWeaponTypeEnum {
  Tasers = "Tasers",
  HoldOuts = "Hold Outs",
  LightPistols = "Light Pistols",
  HeavyPistols = "Heavy Pistols",
  MachinePistols = "Machine Pistols",
  SubmachineGuns = "Submachine Guns",
  AssaultRifles = "Assault Rifles",
  Shotguns = "Shotguns",
  SniperRifles = "Sniper Rifles",
  LightMachineguns = "Light Machineguns",
  MediumHeavyMachineguns = "Medium Heavy Machineguns",
  AssaultCannons = "Assault Cannons",
  GrenadeLaunchers = "Grenade Launchers",
  MissileLaunchers = "Missile Launchers",
  Exotic = "Exotic",
  Cyberguns = "Cyberguns",
  Flamethrowers = "Flamethrowers",
  Lasers = "Lasers",
  SportingRifles = "Sporting Rifles",
  WeaponAttachments = "Weapon Attachments",
  Carbines = "Carbines",
  MicroDroneWeapons = "Micro-Drone Weapons",
}

export enum weaponExtraClassificationEnum {
  SquirtGun = "Squirt gun",
  GasGun = "Gas gun",
  Trackstopper = "Trackstopper",
  HarpoonGun = "Harpoongun",
  NetGun = "Net Gun",
  NetGunLarge = "Net Gun Large",
  Gyrojet = "Gyrojet",
  Bola = "Bola",
  TorpedoGrenadeLauncher = "Torpedo Grenade Launcher",
  Microtorpedo = "Microtorpedo",
  Flaregun = "Flaregun",
  Supermach = "Supermach",
  FirefightingCannons = "Firefighting Cannons",
  PepperPunch = "Pepper Punch",
  Spraypen = "Spraypen",
  Slingshot = "Slingshot",
  GrappleGun = "Grapple Gun",
  DartGun = "Dart Gun",
  Man_Catcher = "Man-Catcher",
  Spinstorm = "Spinstorm",
}

export enum explosiveTypeEnum {
  Grenade = "Grenade",
  // Rocket includes Rockets, Missiles, and Torpedos
  Rocket = "Rocket",
  Standard = "Standard",
}

export enum accuracyEnum {
  Physical = "Physical",
  Missile = "Missile",
  Strength = "Strength",
}

export enum damageTypeEnum {
  Physical = "Physical",
  Stun = "Stun",
  Special = "Special",
  None = "N/A",
}

export enum damageAnnotationEnum {
  Flechette = "Flechette",
  Electrical = "Electrical",
  Fire = "Fire",
}

export enum damageCalculationOptionEnum {
  Strength = "Strength",
  DrugToxin = "Drug/Toxin",
  Grenade = "Grenade",
  Missile = "Missile",
  PepperPunch = "Pepper Punch",
  Magic = "Magic",
  Chemical = "Chemical",
  Rating = "Rating",
  Torpedo = "Torpedo",
  Narcoject = "Narcoject",
  Special = "Special",
}

export enum armourPenetrationEnum {
  Rating = "Rating",
  Grenade = "Grenade",
  DrugToxin = "Drug/Toxin",
  Missile = "Missile",
  Special = "Special",
  Magic = "Magic",
}

export enum standardCalculationEnum {
  Strength = "Strength",
  Magic = "Magic",
  Rating = "Rating",
  Grenade = "Grenade",
  DrugToxin = "Drug/Toxin",
  Missile = "Missile",
  Special = "Special",
  Chemical = "Chemical",
  Torpedo = "Torpedo",
  Narcoject = "Narcoject",
}

export enum restrictionEnum {
  Legal = "",
  Restricted = "R",
  Forbidden = "F",
}

export enum firearmModeEnum {
  SingleShot = "SS",
  SemiAutomatic = "SA",
  BurstFire = "BF",
  FullAutomatic = "FA",
  None = "",
}

export enum ammoSourceEnum {
  BreakAction = "(b)",
  Clip = "(c)",
  Drum = "(d)",
  MuzzleLoader = "(ml)",
  InternalMagazine = "(m)",
  Cylinder = "(cy)",
  BeltFed = "(belt)",
  Tank = "(tank)",
  External = "External Source",
  Energy = "Energy",
  CapAndBall = "(cb)",
  Special = "Special",
}

export enum weaponAccessoryMountLocationEnum {
  Underbarrel = "Under",
  Barrel = "Barrel",
  Top = "Top",
  Side = "Side",
  Stock = "Stock",
  Internal = "Internal",
  None = "None",
}

export enum ammunitionTypeEnum {
  Ammo = "Ammo",
  GrenadesTorpedoes = "GrenadesTorpedoes",
  RocketsMissiles = "Rockets/Missiles",
  ProjectileAmmo = "Projectile",
}

export enum rangeEnum {
  Strength = "Strength",
}

export enum availabilityEnum {
  MinimumRating = "Minimum Rating",
  Rating = "Rating",
  Gear = "Gear",
}

export enum capacityEnum {
  Rating = "Rating",
  ParentCapacity = "Capacity",
  IncludedInParent = "Included",
}

export enum costEnum {
  Rating = "Rating",
  ParentCost = "Parent Cost",
  ChildrenCost = "Children Cost",
  GearCost = "Gear Cost",
  WeaponCost = "Weapon Cost",
  MinimumRating = "Minimum Rating",
}

export enum ratingAugmentationEnum {
  MinimumStrength = "Minimum Strength",
  MinimumAgility = "Minimum Agility",
  MaximumStrength = "Maximum Strength",
  MaximumAgility = "Maximum Agility",
}

export enum gearCategoryEnum {
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
  HardNanoware = "Hard Nanoware",
  Housewares = "Housewares",
  ID_Credsticks = "ID/Credsticks",
  MagicalCompounds = "Magical Compounds",
  MagicalSupplies = "Magical Supplies",
  MetatypeSpecific = "Metatype-Specific",
  Miscellany = "Miscellany",
  MusicalInstruments = "Musical Instruments",
  Nanogear = "Nanogear",
  Paydata = "Paydata",
  PiTac = "PI-Tac",
  PiTacPrograms = "Pi_TacPrograms",
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
}

export enum blastTypeEnum {
  Radius = "Radius",
  Reducing = "Reducing",
}

export enum mathOperatorEnum {
  Add = "+",
  Subtract = "-",
  Divide = "/",
  Multiply = "*",
  GreaterThan = ">",
  GreaterThanOrEqual = ">=",
  Equals = "==",
}

export enum weaponAccessoryTypeEnum {
  Standard = "Standard",
  Firearm = "Firearm",
}

export enum matrixWareTypeEnum {
  Commlink = "Commlink",
  Cyberdeck = "Cyberdeck",
  RFIDTag = "RFIDTag",
  CommunicationCountermeasure = "Communication and Countermeasures",
  Software = "Software",
  Skillsoft = "Skillsoft",
}

export enum matrixWareAccessoryTypeEnum {
  CredStick = "CredStick",
  Identification = "Identification",
  Tool = "Tool",
  OpticalDevice = "Optical Device",
  VisionEnhancement = "Vision Enhancement",
  AudioDevice = "Audio Device",
  AudioEnhancement = "Audio Enhancement",
  Sensor = "Sensor",
  SecurityDevice = "Security Device",
  BreakingAndEnteringDevice = "Breaking And Entering Device",
}

export enum augmentationTypeEnum {
  Cyberware = "Cyberware",
  Bioware = "Bioware",
}

export enum augmentationAccessoryTypeEnum {
  CyberlimbAccessories = "Cyberlimb Accessories",
  ImplantWeapons = "Implant Weapons",
}

export enum magicalGearTypeEnum {
  Focus = "Focus",
  Formula = "Formula",
  Supply = "Supply",
}

export enum focusTypeEnum {
  Enchanting = "Enchanting",
  Metamagic = "Metamagic",
  Power = "Power",
  Qi = "Qi",
  Spell = "Spell",
  Spirit = "Spirit",
  Weapon = "Weapon",
}

export enum spellCategoryEnum {
  Combat = "Combat",
  Detection = "Detection",
  Illusion = "Illusion",
  Health = "Health",
  Manipulation = "Manipulation",
  // TODO: these aren't true spell categories
  // is there a way to split them off?
  Enchantment = "Enchantment",
  Ritual = "Ritual",
}

export enum magicalFormulaeCategoryEnum {
  Spell = "Spell",
  Ritual = "Ritual",
  AlchemicalPreparation = "Alchemical Preparation",
}

export enum spellTypeEnum {
  Mana = "Mana",
  Physical = "Physical",
}

export enum spellPowerRangeEnum {
  LineOfSight = "Line Of Sight",
  Touch = "Touch",
  Self = "Self",
  Special = "Special",
}

export enum spellPowerTargetEnum {
  Area = "Area",
  Target = "Single Target",
}

export enum spellDescriptorEnum {
  Direct = "Direct",
  Indirect = "Indirect",
  Active = "Active",
  Passive = "Passive",
  Area = "Area",
  ExtendedArea = "Extended Area",
  Directional = "Directional",
  Psychic = "Psychic",
  Essence = "Essence",
  Negative = "Negative",
  Physical = "Physical",
  Mental = "Mental",
  Environmental = "Environmental",
  MaterialLink = "Material Link",
  Spotter = "Spotter",
  Anchored = "Anchored",
  Blood = "Blood",
  Elemental = "Elemental",
  Realistic = "Realistic",
  SingleSense = "Single-Sense",
  MultiSense = "Multi-Sense",
  Obvious = "Obvious",
  Damaging = "Damaging",
  Spell = "Spell",
  Minion = "Minion",
  Mana = "Mana",
  Contractual = "Contractual",
  Adept = "Adept",
  OrganicLink = "Organic Link",
  Geomancy = "Geomancy",
  Object = "Object",
}

export enum metamagicArtEnum {
  AdvancedAlchemy = "Advanced Alchemy",
  AdvancedRitualCasting = "Advanced Ritual Casting",
  AdvancedSpellcasting = "Advanced Spellcasting",
  ApotropaicMagic = "Apotropaic Magic",
  BloodMagic = "Blood Magic",
  Centering = "Centering",
  Channeling = "Channeling",
  Cleansing = "Cleansing",
  Divination = "Divination",
  Exorcism = "Exorcism",
  FlexibleSignature = "Flexible Signature",
  Geomancy = "Geomancy",
  Invocation = "Invocation",
  Masking = "Masking",
  Necromancy = "Necromancy",
  Psychometry = "Psychometry",
  Quickening = "Quickening",
  Sensing = "Sensing",
}

export enum durationEnum {
  Instantaneous = "Instantaneous",
  Sustained = "Sustained",
  Permanent = "Permanent",
  Always = "Always",
  Special = "Special",
}

export enum vehicleTypeEnum {
  Groundcraft = "Groundcraft",
  Watercraft = "Watercraft",
  Aircraft = "Aircraft",
  Drone = "Drone",
}

export enum groundcraftSubtypeEnum {
  Bike = "Bike",
  Car = "Car",
  Truck_Van = "Truck/Van",
  Municipal = "Municipal/Construction",
  Corpsec = "Corpsec/Police/Military",
}

export enum watercraftSubtypeEnum {
  Boat = "Boat",
  Submarine = "Submarine",
  Hovercraft = "Hovercraft",
}

export enum aircraftSubtypeEnum {
  FixedWing_Aircraft = "Fixed-Wing Aircraft",
  LTAV = "LTAV",
  Rotorcraft = "Rotorcraft",
  VTOL_VSTOL = "VTOL/VSTOL",
}

export enum droneSubtypeEnum {
  Drones_Micro = "Drones: Micro",
  Drones_Mini = "Drones: Mini",
  Drones_Small = "Drones: Small",
  Drones_Medium = "Drones: Medium",
  Drones_Anthro = "Drones: Anthro",
  Drones_Large = "Drones: Large",
  Drones_Huge = "Drones: Huge",
  Drones_Missile = "Drones: Missile",
}

export enum ammoOptionEnum {
  Weapon = "Weapon",
}

export enum sourceBookEnum {
  AssassinPrimer = "Assassin Primer",
  GunHeaven3 = "GunHeaven 3",
  RunAndGun = "Run And Gun",
  Shadowrun5 = "Shadowrun 5 Core Rulebook",
  StreetGrimoire = "Street Grimoire",
  StreetGrimoireErrata = "Street Grimoire Errata",
  BulletsAndBandages = "Bullets And Bandages",
  SailAwaySweetSister = "Sail Away Sweet Sister",
  StolenSouls = "Stolen Souls",
  RunFaster = "Run Faster",
  ShadowSpells = "Shadow Spells",
  NothingPersonal = "Nothing Personal",
  DataTrails = "Data Trails",
  DataTrailsDissonantEchoes = "Data Trails - Dissonant Echoes",
  ChromeFlesh = "Chrome Flesh",
  HardTargets = "Hard Targets",
  BloodyBusiness = "Bloody Business",
  Rigger5 = "Rigger 5",
  HowlingShadows = "Howling Shadows",
  TheVladivostokGauntlet = "The Vladivostok Gauntlet",
  SplinteredState = "Splintered State",
  ShadowsInFocus_Butte = "Shadows In Focus: Butte",
  HongKongSourcebook = "Hong Kong Sourcebook",
  Lockdown = "Lockdown",
  ShadowsInFocus_SanFranciscoMetroplex = "Shadows In Focus: San Francisco Metroplex",
  ShadowsInFocus_Metropole = "Shadows In Focus: Metropole",
  CuttingAces = "Cutting Aces",
  BookOfTheLost = "Book Of The Lost",
  ForbiddenArcana = "Forbidden Arcana",
  TheCompleteTrog = "The Complete Trog",
  ShadowsInFocus_SiouxNation_CountingCoup = "Shadows In Focus: Sioux Nation: Counting Coup",
  DarkTerrors = "Dark Terrors",
  TheSeattleGambit = "The Seattle Gambit",
  StreetLethal = "Street Lethal",
  KillCode = "Kill Code",
  BetterThanBad = "Better Than Bad",
  Aetherology = "Aetherology",
  NoFuture = "No Future",
  KrimeKatalog = "Krime Katalog",
  ShadowrunMissions0803_10BlockTango = "Shadowrun Missions 0803: 10 Block Tango",
  ShadowrunMissions0804_DirtyLaundry = "Shadowrun Missions 0804: Dirty Laundry",
  ShadowrunQuickStartRules = "Shadowrun Quick Start Rules",
  SprawlWilds = "Sprawl Wilds",
  // Not in English
  StateOfTheArtADL = "State Of The Art - ADL",
  Schattenhandbuch = "Schattenhandbuch",
  Schattenhandbuch2 = "Schattenhandbuch 2",
  Schattenhandbuch3 = "Schattenhandbuch 3",
  Hamburg = "Hamburg",
  DatapulsSOTA2080 = "Datapuls SOTA 2080",
  DatapulsVerschlusssache = "Datapuls Verschlusssache",
  Shadowrun2050 = "Shadowrun 2050",
  GrimmesErwachen = "Grimmes Erwachen",
}

export enum armourCategoryEnum {
  Armour = "Armour",
  Clothing = "Clothing",
  Cloaks = "Cloaks",
  FashionableArmour = "High-Fashion Armour",
  SpecialtyArmour = "Specialty Armour",
}

export enum armourModCategoryEnum {
  FullBodyArmourMods = "Full Body Armour Mods",
  CustomisedBallisticMask = "Customized Ballistic Mask",
  General = "General",
  GlobetrotterClothingLiners = "Globetrotter Clothing Liners",
  GlobetrotterJacketLiners = "Globetrotter Jacket Liners",
  GlobetrotterVestLiners = "Globetrotter Vest Liners",
  NightshadeIR = "Nightshade IR",
  RapidTransitDetailing = "Rapid Transit Detailing",
  UrbanExplorerJumpsuitAccessories = "Urban Explorer Jumpsuit Accessories",
  VictoryLiners = "Victory Liners",
}

export enum biowareCategoryEnum {
  Basic = "Basic",
  Biosculpting = "Biosculpting",
  BioWeapons = "Bio-Weapons",
  ChemicalGlandModifications = "Chemical Gland Modifications",
  CosmeticBioware = "Cosmetic Bioware",
  Cultured = "Cultured",
  OrthoskinUpgrades = "Orthoskin Upgrades",
  Symbionts = "Symbionts",
  GeneticRestoration = "Genetic Restoration",
  PhenotypeAdjustment = "Phenotype Adjustment",
  ExoticMetagenetics = "Exotic Metagenetics",
  Transgenics = "Transgenics",
  EnvironmentalMicroadaptation = "Environmental Microadaptation",
  Immunisation = "Immunisation",
  TransgenicAlteration = "Transgenic Alteration",
  ComplimentaryGenetics = "Complimentary Genetics",
}

export enum cyberwareCategoryEnum {
  Bodyware = "Bodyware",
  AutoInjectorMods = "Auto Injector Mods",
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

export enum augmentationGradeEnum {
  None = "None",
  Used = "Used",
  Standard = "Standard",
  Alphaware = "Alphaware",
  Betaware = "Betaware",
  Deltaware = "Deltaware",
  Gammaware = "Gammaware",
  Omegaware = "Omegaware",
  Greyware = "Greyware",
}

export enum limitCategoryEnum {
  Physical = "Physical",
  Mental = "Mental",
  Social = "Social",
}

export enum limbSlotEnum {
  Arm = "Arm",
  Leg = "Leg",
  Skull = "Skull",
  Torso = "Torso",
  All = "All",
}

// Maximum number of cyberware/bioware that can be used
// if they require a certain limit type
export enum augmentationLimitEnum {
  Arm = "Arm",
  Leg = "Leg",
  Torso = "Torso",
  Skull = "Skull",
  Finger = "Finger",
  UnaugmentedBody = "Unaugmented Body Score",
  None = "N/A",
}

export enum augmentationMountSlotEnum {
  Wrist = "Wrist",
  Elbow = "Elbow",
  Shoulder = "Shoulder",
  Ankle = "Ankle",
  Knee = "Knee",
  Hip = "Hip",
}

export enum drugComponentCategoryEnum {
  Foundation = "Foundation",
  Block = "Block",
  Enhancer = "Enhancer",
}

export enum weaponMountSizeEnum {
  Built_In = "Built-In",
  Light = "Light",
  Standard = "Standard",
  Heavy = "Heavy",
  Heavy_SR5 = "Heavy [SR5]",
  Standard_Drone = "Standard (Drone)",
  Mini_Drone = "Mini (Drone)",
  Small_Drone = "Small (Drone)",
  Large_Drone = "Large (Drone)",
  Heavy_Drone = "Heavy (Drone)",
  Huge_Drone = "Huge (Drone)",
}

export enum weaponMountVisibilityEnum {
  External_SR5 = "External [SR5]",
  External = "External",
  Internal = "Internal",
  Concealed = "Concealed",
}

export enum weaponMountFlexibilityEnum {
  Flexible_SR5 = "Flexible [SR5]",
  Fixed = "Fixed",
  Flexible = "Flexible",
  Turret = "Turret",
}

export enum weaponMountControlEnum {
  Remote = "Remote",
  Remote_SR5 = "Remote [SR5]",
  Manual = "Manual",
  Manual_SR5 = "Manual [SR5]",
  ArmoredManual = "Armored Manual",
}

export enum vehicleModTypeEnum {
  Vehicle = "Vehicle",
  WeaponMount = "Weapon Mount",
}

export enum vehicleModSubtypeEnum {
  Body = "Body",
  Cosmetic = "Cosmetic",
  Electromagnetic = "Electromagnetic",
  ModelSpecific = "Model-Specific",
  PowerTrain = "Power Train",
  Protection = "Protection",
  Weapons = "Weapons",
  All = "All",
  Handling = "Handling",
  Speed = "Speed",
  Acceleration = "Acceleration",
  Armour = "Armour",
  Sensor = "Sensor",
}

export enum vehicleModRatingEnum {
  Handling = "Handling",
  Speed = "Speed",
  Acceleration = "Acceleration",
  Body = "Body",
  Armour = "Armour",
  Pilot = "Pilot",
  Sensor = "Sensor",
  Seats = "Seats",
  Quantity = "Quantity of Mod",
}

export enum vehicleModAttributeEnum {
  Handling = "Handling",
  Speed = "Speed",
  Acceleration = "Acceleration",
  Body = "Body",
  Armour = "Armour",
  Pilot = "Pilot",
  Sensor = "Sensor",
  Seats = "Seats",
  Rating = "Rating",
  VehicleCost = "Vehicle Cost",
  WeaponMountSlots = "Weapon Mount Slots",
}

export enum ratingMeaningEnum {
  HourPerRating = "1 Hour per Rating Level",
  UpgradedRating = "Rating of parent is upgraded",
  MeterPerRating = "1 Meter per Rating Level",
  SquareMeterPerRating = "1 Square Meter per Rating Level",
  TenCmPerRating = "10 Centimeter per Rating Level",
}

export enum gearRatingEnum {
  ParentRating = "Parent Rating",
}

export enum gearDeviceRatingEnum {
  Rating = "Rating",
  Resonance = "Resonance",
}

export enum parentGearEnum {
  Rating = "Rating",
}

export enum personaFormEnum {
  Self = "Self",
  Parent = "Parent",
}

export enum qualityLimitEnum {
  ArmCountSubOne = "Number of arms - 1",
  False = "False",
}

export enum actionEnum {
  // No Action Required
  Auto = "Auto",
  Simple = "Simple",
  Free = "Free",
  Complex = "Complex",
  Interrupt = "Interrupt",
  Special = "Special",
}

export enum traditionDrainAttributeEnum {
  WillpowerAndCharisma = "Willpower + Charisma",
  WillpowerAndIntuition = "Willpower + Intuition",
  WillpowerAndLogic = "Willpower + Logic",
  WillpowerAndMagic = "Willpower + Magic",
  WillpowerAndWillpower = "Willpower + Willpower",
  WillpowerAndSelect = "Willpower + Select Attribute",
}

export enum traditionSpiritFormEnum {
  Possession = "Possession",
  Inhabitation = "Inhabitation",
}

export enum critterTypeEnum {
  AIs = "A.I.s",
  Dracoforms = "Dracoforms",
  EntropicSprites = "Entropic Sprites",
  Fey = "Fey",
  Ghost_Haunt = "Ghosts and Haunts",
  Harbingers = "Harbingers",
  Imps = "Imps",
  Infected = "Infected",
  InsectSpirits = "Insect Spirits",
  MundaneCritters = "Mundane Critters",
  MutantCritters = "Mutant Critters",
  ParanormalCritters = "Paranormal Critters",
  PrimordialSpirits = "Primordial Spirits",
  Protosapients = "Protosapients",
  // Generally critters created from/with mana (rather than summoned)
  Ritual = "Ritual",
  ShadowSpirits = "Shadow Spirits",
  // Shedim are a type of spirit
  Shedim = "Shedim",
  Spirits = "Spirits",
  Sprites = "Sprites",
  Technocritters = "Technocritters",
  ToxicCritters = "Toxic Critters",
  ToxicSpirits = "Toxic Spirits",
  Warforms = "Warforms",
  // Sort of like Fey Spirits
  ExtraplanarTravelers = "Extraplanar Travelers",
  NecroSpirits = "Necro Spirits",
}

export enum critterAttributePowerEnum {
  Force = "Force",
  Level = "Level",
  Variable = "Variable",
}

export enum critterPowerEnum {
  Drake = "Drake",
  Echoes = "Echoes",
  Emergent = "Emergent",
  FreeSpirit = "Free Spirit",
  Paranormal = "Paranormal",
  Infected = "Infected",
  Mundane = "Mundane",
  ToxicCritterPowers = "Toxic Critter Powers",
  Weakness = "Weakness",
  ChimericModification = "Chimeric Modification",
  Shapeshifter = "Shapeshifter",
}

export enum complexFormTargetEnum {
  Persona = "Persona",
  Device = "Device",
  File = "File",
  Sprite = "Sprite",
  Self = "Self",
  Host = "Host",
  Icon = "Icon",
  // Intrusion Countermeasures
  IC = "IC",
  Cyberware = "Cyberware",
}

export enum traditionSpiritEnum {
  Linked = "Linked",
  Custom = "Custom",
  // Unrestricted
  All = "All",
}

export enum matrixAttributeEnum {
  Attack = "Attack",
  DataProcessing = "Data Processing",
  Firewall = "Firewall",
  Sleaze = "Sleaze",
}

export enum programCategoryEnum {
  Autosofts = "Autosofts",
  AdvancedPrograms = "Advanced Programs",
  CommonPrograms = "Common Programs",
  HackingPrograms = "Hacking Programs",
  Software = "Software",
}

export enum mentorCategoryEnum {
  MentorSpirit = "Mentor Spirit",
  Paragon = "Paragon",
}

export enum BonusSourceEnum {
  Quality = "Quality",
  Tradition = "Tradition",
}

export enum LifestyleCostIncrementEnum {
  Daily = "Daily",
  Monthly = "Monthly",
}

export enum LifestyleQualityCategoryEnum {
  Entertainment_Asset = "Entertainment - Asset",
  Entertainment_Service = "Entertainment - Service",
  Entertainment_Outing = "Entertainment - Outing",
  Positive = "Positive",
  Negative = "Negative",
  Contracts = "Contracts",
}

export enum GridCategoryEnum {
  LocalGrid = "Local Grid",
  PublicGrid = "Public Grid",
  GlobalGrid = "Global Grid",
}
