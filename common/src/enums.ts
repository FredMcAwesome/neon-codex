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
  Vehicles = "Vehicles",
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

export enum capcityArmourModEnum {
  Rating = "Rating",
  Capacity = "Capacity",
}

export enum capcityAugmentationEnum {
  Rating = "Rating",
  Capacity = "Capacity",
  IncludedInParent = "Included",
}

export enum costAmmunitionEnum {
  Rating = "Rating",
}

export enum costArmourEnum {
  Rating = "Rating",
}

export enum costArmourModEnum {
  Rating = "Rating",
  Armour = "Armour",
}

export enum costGearEnum {
  Rating = "Rating",
  ParentCost = "Parent Cost",
  ChildrenCost = "Children Cost",
  GearCost = "Gear Cost",
}

export enum costWeaponEnum {
  Rating = "Rating",
}

export enum costWeaponAccessoryEnum {
  Rating = "Rating",
  Weapon = "Weapon",
}

export enum costAugmentationEnum {
  Rating = "Rating",
  MinimumRating = "Minimum Rating",
  Parent = "Parent",
  Gear = "Gear",
}

export enum costVehicleEnum {
  Rating = "Rating",
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
  Enchantment = "Enchantment",
  Ritual = "Ritual",
}

export enum spellTypeEnum {
  Mana = "Mana",
  Physical = "Physical",
}

export enum spellRangeEnum {
  LineOfSight = "Line Of Sight",
  Touch = "Touch",
  Self = "Self",
  Special = "Special",
}

export enum spellTargetEnum {
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
  Special = "Special",
}

export enum formulaTypeEnum {
  Focus = "Focus",
  Spell = "Spell",
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

export enum mountSlotEnum {
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
