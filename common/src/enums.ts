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
