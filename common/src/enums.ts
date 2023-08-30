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
  Edge = "Edge",
}

export enum gearTypeEnum {
  Weapons = "Weapons",
  Electronics = "Electronics",
  ElectronicAccessories = "Electronic Accessories",
  OtherGear = "Other Gear",
  Augmentations = "Augmentations",
  MagicalEquipment = "Magical Equipment",
  VehiclesAndDrones = "Vehicles and Drones",
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
  LightCrossbows = "Light Crossbows",
  MediumCrossbows = "Medium Crossbows",
  HeavyCrossbows = "Heavy Crossbows",
  Exotic = "Exotic",
  Cyberguns = "Cyberguns",
  Flamethrowers = "Flamethrowers",
  Lasers = "Lasers",
  SportingRifles = "Sporting Rifles",
  WeaponAttachments = "Weapon Attachments",
  BioWeapons = "Bio-Weapons",
  Carbines = "Carbines",
}

export enum explosiveTypeEnum {
  Grenade = "Grenade",
  Standard = "Standard",
}

export enum accuracyEnum {
  Physical = "Physical",
  Missile = "Missile",
}

export enum damageTypeEnum {
  Physical = "Physical",
  Stun = "Stun",
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
  Legal = "Legal",
  Restricted = "Restricted",
  Forbidden = "Forbidden",
}

export enum firearmModeEnum {
  SingleShot = "Single Shot",
  SemiAutomatic = "Semi Automatic",
  BurstFire = "Burst Fire",
  FullAutomatic = "Full Automatic",
  None = "N/A",
}

export enum ammoSourceEnum {
  BreakAction = "Break Action",
  Clip = "Clip",
  Drum = "Drum",
  MuzzleLoader = "Muzzle Loader",
  InternalMagazine = "Internal Magazine",
  Cylinder = "Cylinder",
  BeltFed = "Belt Fed",
  Tank = "Tank",
  External = "External",
  Energy = "Energy",
  CapAndBall = "Cap and Ball",
  Special = "Special",
  None = "N/A",
}

export enum firearmAccessoryMountLocationEnum {
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

export enum armourEnum {
  Rating = "Rating",
}

export enum availabilityEnum {
  Rating = "Rating",
}

export enum costEnum {
  Rating = "Rating",
  Weapon = "Weapon",
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
  GreaterThan = ">=",
}

export enum weaponAccessoryTypeEnum {
  Standard = "Standard",
  Firearm = "Firearm",
}

export enum armourAccessoryTypeEnum {
  Standard = "Standard",
  Modification = "Modification",
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

export enum otherWareTypeEnum {
  IndustrialChemical = "Industrial Chemical",
  SurvivalGear = "Survival Gear",
  GrappleGun = "Grapple Gun",
  Biotech = "Biotech",
  DocWagonContract = "DocWagon Contract",
  SlapPatch = "Slap Patch",
}

export enum augmentationTypeEnum {
  Headware = "Headware",
  Eyeware = "Eyeware",
  Earware = "Earware",
  Bodyware = "Bodyware",
  Cyberlimbs = "Cyberlimbs",
  Bioware = "Bioware",
  CulturedBioware = "Cultured Bioware",
}
export enum augmentationClassificationEnum {
  None = "N/A",
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
  Healing = "Healing",
  Manipulation = "Manipulation",
}

export enum formulaTypeEnum {
  Focus = "Focus",
  Spell = "Spell",
}

export enum vehicleDroneTypeEnum {
  Groundcrafts = "Groundcrafts",
  Watercrafts = "Watercrafts",
  Aircrafts = "Aircrafts",
  Drones = "Drones",
}

export enum groundcraftSubtypeEnum {
  Bikes = "Bikes",
  Cars = "Cars",
  TrucksAndVans = "Trucks And Vans",
}

export enum watercraftSubtypeEnum {
  Boats = "Boats",
  Submarines = "Submarines",
}

export enum aircraftSubtypeEnum {
  FixedWingAircrafts = "Fixed-Wing Aircrafts",
  Rotorcrafts = "Rotorcrafts",
  VTOL_VSTOLs = "VTOL/VSTOLs",
}

export enum droneSubtypeEnum {
  Microdrones = "Microdrones",
  Minidrones = "Mini drones",
  SmallDrones = "Small Drones",
  MediumDrones = "Medium Drones",
  LargeDrones = "Large Drones",
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
}
