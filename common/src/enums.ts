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
  Blade = "Blade",
  Club = "Club",
  Other = "Other",
  Cyber = "Cyber",
}

export enum projectileWeaponTypeEnum {
  Bows = "Bows",
  Crossbows = "Crossbows",
  ThrowingWeapons = "Throwing Weapons",
}

export enum firearmWeaponTypeEnum {
  Tasers = "Tasers",
  HoldOuts = "Hold Outs",
  LightPistol = "Light Pistol",
  HeavyPistol = "Heavy Pistol",
  MachinePistol = "Machine Pistol",
  SubmachineGun = "Submachine Gun",
  AssaultRifle = "Assault Rifle",
  Shotgun = "Shotgun",
  SniperRifle = "Sniper Rifle",
  LightMachinegun = "Light Machinegun",
  MediumHeavyMachinegun = "Medium Heavy Machinegun",
  AssaultCannon = "Assault Cannon",
  GrenadeLauncher = "Grenade Launcher",
  MissileLauncher = "Missile Launcher",
  Bow = "Bow",
  LightCrossbow = "Light Crossbow",
  MediumCrossbow = "Medium Crossbow",
  HeavyCrossbow = "Heavy Crossbow",
  ThrownKnife = "Thrown Knife",
  Shuriken = "Shuriken",
  StandardGrenade = "Standard Grenade",
  AerodynamicGrenade = "Aerodynamic Grenade",
  Special = "Special",
  Cybergun = "Cybergun",
}

export enum explosiveTypeEnum {
  Standard = "Standard",
}

export enum damageTypeEnum {
  Physical,
  Stun,
  Special,
  Chemical,
}

export enum damageAnnoationEnum {
  Flechette,
  Electrical,
}

export enum damageCalculationMethodEnum {
  Normal,
  Strength,
  Rating,
  Chemical,
  Special,
  DrugToxin,
  Grenade,
  Missile,
  Explosive,
  Fire,
}

export enum restrictionEnum {
  Legal,
  Restricted,
  Forbidden,
}

export enum firearmModeEnum {
  SingleShot,
  SemiAutomatic,
  BurstFire,
  FullAutomatic,
}

export enum reloadMethodEnum {
  BreakAction,
  Clip,
  Drum,
  MuzzleLoader,
  InternalMagazine,
  Cylinder,
  BeltFed,
  Special,
}

export enum firearmAccessoryMountLocationEnum {
  Underbarrel,
  Barrel,
  Top,
  None,
}

export enum ammunitionTypeEnum {
  Ammo,
  Grenades,
  RocketsMissiles,
  ProjectileAmmo,
}

export enum blastTypeEnum {
  Radius,
  Reducing,
  Special,
}

export enum mathOperatorEnum {
  Add,
  Subtract,
  Divide,
  Multiply,
  RangeTo,
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
