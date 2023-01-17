export enum weaponTypeEnum {
  Melee,
  Projectile,
  Firearm,
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

export enum damageTypeEnum {
  Physical,
  Stun,
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
