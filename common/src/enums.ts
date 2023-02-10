export enum skillsEnum {
  // Active Combat Skills
  Archery,
  Automatics,
  Blades,
  Clubs,
  ExoticMeleeWeapon,
  ExoticRangedWeapon,
  HeavyWeapons,
  Longarms,
  Pistols,
  ThrowingWeapons,
  UnarmedCombat,
  // Active Physical Skills
  Disguise,
  Diving,
  EscapeArtist,
  FreeFall,
  Gymnastics,
  Palming,
  Perception,
  Running,
  Sneaking,
  Survival,
  Swimming,
  Tracking,
  // Social Skills
  Con,
  Etiquette,
  Impersonation,
  Instruction,
  Intimidation,
  Leadership,
  Negotiation,
  Performance,
  // Magical Skills
  Alchemy,
  Arcana,
  Artificing,
  Assensing,
  AstralCombat,
  Banishing,
  Binding,
  Counterspelling,
  Disenchanting,
  RitualSpellcasting,
  Spellcasting,
  Summoning,
  // Resonance Skills
  Compiling,
  Decompiling,
  Registering,
  // Technical Skills
  AeronauticsMechanic,
  AnimalHandling,
  Armourer,
  Artisan,
  AutomotiveMechanic,
  Biotechnology,
  Chemistry,
  Computer,
  Cybercombat,
  Cybertechnology,
  Demolitions,
  ElectronicWarfare,
  FirstAid,
  Forgery,
  Hacking,
  Hardware,
  IndustrialMechanic,
  Locksmith,
  Medicine,
  NauticalMechanic,
  Navigation,
  Software,
  // Vehicle Skills
  Gunnery,
  PilotAerospace,
  PilotAircraft,
  PilotWalker,
  PilotExoticVehicle,
  PilotGroundCraft,
  PilotWatercraft,
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
  Laser = "Laser",
  SportingRifles = "Sporting Rifles",
  WeaponAttachment = "Weapon Attachment",
  BioWeapon = "Bio-Weapon",
  Carbines = "Carbines",
}

export enum explosiveTypeEnum {
  Grenade = "Grenade",
  Standard = "Standard",
}

export enum accuracyTypeEnum {
  Physical = "Physical",
  Missile = "Missile",
}

export enum damageTypeEnum {
  Physical,
  Stun,
  Chemical,
  None,
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
}

export enum armourPenetrationEnum {
  Rating = "Rating",
  Grenade = "Grenade",
  DrugToxin = "Drug/Toxin",
  Missile = "Missile",
  Special = "Special",
  Magic = "Magic",
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
}

export enum reloadMethodEnum {
  BreakAction = "Break Action",
  Clip = "Clip",
  Drum = "Drum",
  MuzzleLoader = "Muzzle Loader",
  InternalMagazine = "Internal Magazine",
  Cylinder = "Cylinder",
  BeltFed = "Belt Fed",
  Tank = "Tank",
  External = "External",
  Special = "Special",
  None = "N/A",
}

export enum firearmAccessoryMountLocationEnum {
  Underbarrel = "Under",
  Barrel = "Barrel",
  Top = "Top",
  Side = "Side",
  Stock = "Stock",
  None = "None",
}

export enum ammunitionTypeEnum {
  Ammo,
  Grenades,
  RocketsMissiles,
  ProjectileAmmo,
}

export enum availabilityTypeEnum {
  Rating = "Rating",
}

export enum blastTypeEnum {
  Radius,
  Reducing,
  Special,
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
  CulturedBioware = "Cultured Bioware",
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
