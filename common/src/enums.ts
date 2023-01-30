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

export enum weaponTypeEnum {
  Melee,
  Projectile,
  Firearm,
  Explosive,
}

export enum meleeWeaponTypeEnum {
  Blades,
  Clubs,
  Other,
  Cyber,
}

export enum projectileWeaponTypeEnum {
  Bows,
  Crossbows,
  ThrowingWeapons,
}

export enum firearmWeaponTypeEnum {
  Tasers,
  HoldOuts,
  LightPistol,
  HeavyPistol,
  MachinePistol,
  SubmachineGun,
  AssaultRifle,
  Shotgun,
  SniperRifle,
  LightMachinegun,
  MediumHeavyMachinegun,
  AssaultCannon,
  GrenadeLauncher,
  MissileLauncher,
  Bow,
  LightCrossbow,
  MediumCrossbow,
  HeavyCrossbow,
  ThrownKnife,
  Shuriken,
  StandardGrenade,
  AerodynamicGrenade,
  Special,
  Cybergun,
}

export enum explosiveTypeEnum {
  Standard,
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
  Standard,
  Firearm,
}

export enum armourAccessoryTypeEnum {
  Standard,
  Modification,
}

export enum matrixWareTypeEnum {
  Commlink,
  Cyberdeck,
  RFIDTag,
  CommunicationCountermeasure,
  Software,
  Skillsoft,
}

export enum matrixWareAccessoryTypeEnum {
  CredStick,
  Identification,
  Tool,
  OpticalDevice,
  VisionEnhancement,
  AudioDevice,
  AudioEnhancement,
  Sensor,
  SecurityDevice,
  BreakingAndEnteringDevice,
}

export enum otherWareTypeEnum {
  IndustrialChemicals,
  SurvivalGear,
  GrappleGun,
  Biotech,
  DocWagonContract,
  SlapPatches,
}

export enum augmentationTypeEnum {
  Headware,
  Eyeware,
  Earware,
  Bodyware,
  Cyberlimbs,
  Bioware,
  CulturedBioware,
}

export enum augmentationAccessoryTypeEnum {
  CyberlimbAccessories,
  ImplantWeapons,
}

export enum magicalGearTypeEnum {
  Focus,
  Formula,
  Supply,
}

export enum focusTypeEnum {
  Enchanting,
  Metamagic,
  Power,
  Qi,
  Spell,
  Spirit,
  Weapon,
}

export enum spellCategoryEnum {
  Combat,
  Detection,
  Illusion,
  Healing,
  Manipulation,
}

export enum formulaTypeEnum {
  Focus,
  Spell,
}

export enum vehicleDroneTypeEnum {
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
}

export enum groundcraftSubtypeEnum {
  Bikes,
  Cars,
  TrucksAndVans,
}

export enum watercraftSubtypeEnum {
  Boats,
  Submarines,
}

export enum aircraftSubtypeEnum {
  FixedWingAircrafts,
  Rotorcrafts,
  VTOL_VSTOLs,
}

export enum droneSubtypeEnum {
  Microdrones,
  Minidrones,
  SmallDrones,
  MediumDrones,
  LargeDrones,
}
