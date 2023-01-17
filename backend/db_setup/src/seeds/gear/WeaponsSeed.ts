import { RequiredEntityData } from "@mikro-orm/core";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
} from "../../../../src/models/gear/weaponModel.js";
import {
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  damageCalculationMethodEnum,
  damageTypeEnum,
  restrictionEnum,
  projectileWeaponTypeEnum,
  damageAnnoationEnum,
  firearmModeEnum,
  firearmWeaponTypeEnum,
  reloadMethodEnum,
} from "@shadowrun/common";

export const meleeWeaponsList: Array<RequiredEntityData<MeleeWeapons>> = [
  {
    name: "Combat Axe",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 4,
    },
    reach: 2,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 5,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -4 },
    availability: { rating: 12, restriction: restrictionEnum.Restricted },
    cost: { base: 4000 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Combat Knife",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -3 },
    availability: { rating: 4, restriction: restrictionEnum.Legal },
    cost: { base: 300 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Forearm Snap-Blades",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    availability: { rating: 7, restriction: restrictionEnum.Restricted },
    cost: { base: 200 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Katana",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 7,
    },
    reach: 1,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 3,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -3 },
    availability: { rating: 9, restriction: restrictionEnum.Restricted },
    cost: { base: 1000 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Knife",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 1,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    availability: { rating: 0, restriction: restrictionEnum.Legal },
    cost: { base: 10 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Pole Arm",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 5,
    },
    reach: 3,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 3,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 1000 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Survival Knife",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    availability: { rating: 0, restriction: restrictionEnum.Legal },
    cost: { base: 100 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Sword",
    subtype: meleeWeaponTypeEnum.Blades,
    accuracy: {
      base: 6,
    },
    reach: 1,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 3,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    availability: { rating: 5, restriction: restrictionEnum.Restricted },
    cost: { base: 500 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Club",
    subtype: meleeWeaponTypeEnum.Clubs,
    accuracy: {
      base: 4,
    },
    reach: 1,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 3,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    availability: { rating: 0, restriction: restrictionEnum.Legal },
    cost: { base: 30 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Extendable Baton",
    subtype: meleeWeaponTypeEnum.Clubs,
    accuracy: {
      base: 5,
    },
    reach: 1,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    availability: { rating: 4, restriction: restrictionEnum.Legal },
    cost: { base: 100 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Sap",
    subtype: meleeWeaponTypeEnum.Clubs,
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    availability: { rating: 2, restriction: restrictionEnum.Legal },
    cost: { base: 30 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Staff",
    subtype: meleeWeaponTypeEnum.Clubs,
    accuracy: {
      base: 6,
    },
    reach: 2,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 3,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    availability: { rating: 3, restriction: restrictionEnum.Legal },
    cost: { base: 100 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Stun Baton",
    subtype: meleeWeaponTypeEnum.Clubs,
    accuracy: {
      base: 4,
    },
    reach: 1,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 9,
      },
      type: damageTypeEnum.Stun,
      annotation: damageAnnoationEnum.Electrical,
    },
    armourPenetration: { base: -5 },
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 750 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Telescoping Staff",
    subtype: meleeWeaponTypeEnum.Clubs,
    accuracy: {
      base: 4,
    },
    reach: 2,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    availability: { rating: 4, restriction: restrictionEnum.Legal },
    cost: { base: 350 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Knucks",
    subtype: meleeWeaponTypeEnum.Other,
    accuracy: {
      base: "Inherent",
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 1,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    availability: { rating: 2, restriction: restrictionEnum.Restricted },
    cost: { base: 100 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Monofilament Whip",
    subtype: meleeWeaponTypeEnum.Other,
    accuracy: {
      base: 5,
      equipment: 7,
    },
    reach: 2,
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 12,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -8 },
    availability: { rating: 12, restriction: restrictionEnum.Forbidden },
    cost: { base: 10000 },
    type: weaponTypeEnum.Melee,
  },
  {
    name: "Shock Gloves",
    subtype: meleeWeaponTypeEnum.Other,
    accuracy: {
      base: "Inherent",
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 8,
      },
      type: damageTypeEnum.Stun,
      annotation: damageAnnoationEnum.Electrical,
    },
    armourPenetration: { base: -5 },
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 550 },
    type: weaponTypeEnum.Melee,
  },
];

export const projectileWeaponsList: Array<
  RequiredEntityData<ProjectileWeapons>
> = [
  {
    name: "Bow",
    subtype: projectileWeaponTypeEnum.Bows,
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Rating,
        base: 2,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0, special: "Rating" },
    availability: { rating: "Rating", restriction: restrictionEnum.Legal },
    cost: { base: 550 },
    type: weaponTypeEnum.Projectile,
  },
  {
    name: "Light Crossbow",
    subtype: projectileWeaponTypeEnum.Crossbows,
    accuracy: {
      base: 7,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 5,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    availability: { rating: 2, restriction: restrictionEnum.Legal },
    cost: { base: 300 },
    type: weaponTypeEnum.Projectile,
  },
  {
    name: "Medium Crossbow",
    subtype: projectileWeaponTypeEnum.Crossbows,
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 7,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 500 },
    type: weaponTypeEnum.Projectile,
  },
  {
    name: "Heavy Crossbow",
    subtype: projectileWeaponTypeEnum.Crossbows,
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Normal,
        base: 10,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -3 },
    availability: { rating: 8, restriction: restrictionEnum.Restricted },
    cost: { base: 1000 },
    type: weaponTypeEnum.Projectile,
  },
  {
    name: "Throwing knife",
    subtype: projectileWeaponTypeEnum.ThrowingWeapons,
    accuracy: {
      base: "Inherent",
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 1,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 25 },
    type: weaponTypeEnum.Projectile,
  },
  {
    name: "Shuriken",
    subtype: projectileWeaponTypeEnum.ThrowingWeapons,
    accuracy: {
      base: "Inherent",
    },
    damage: {
      damageAmount: {
        calculationType: damageCalculationMethodEnum.Strength,
        base: 1,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 25 },
    type: weaponTypeEnum.Projectile,
  },
];

export const firearmWeaponsList: Array<RequiredEntityData<FirearmWeapons>> = [
  {
    subtype: firearmWeaponTypeEnum.Tasers,
    name: "Defiance EX Shocker",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 9,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Stun,
      annotation: damageAnnoationEnum.Electrical,
    },
    armourPenetration: { base: -5 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 4,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 0, restriction: restrictionEnum.Legal },
    cost: { base: 250 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Tasers,
    name: "Yamaha Pulsar",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Stun,
      annotation: damageAnnoationEnum.Electrical,
    },
    armourPenetration: { base: -5 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 4,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 0, restriction: restrictionEnum.Legal },
    cost: { base: 180 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HoldOuts,
    name: "Fichetti Tiffani Needler",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 8,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
      annotation: damageAnnoationEnum.Flechette,
    },
    armourPenetration: { base: 5 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 4,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 5, restriction: restrictionEnum.Restricted },
    cost: { base: 1000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HoldOuts,
    name: "Streetline Special",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 6,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 6,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 120 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HoldOuts,
    name: "Walther Palm Pistol",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 4,
        reloadMethod: reloadMethodEnum.MuzzleLoader,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 180 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightPistol,
    name: "Ares Light Fire 75",
    accuracy: {
      base: 6,
      equipment: 8,
    },
    damage: {
      damageAmount: {
        base: 6,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 16,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Forbidden },
    cost: { base: 1250 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightPistol,
    name: "Ares Light Fire 70",
    accuracy: {
      base: 7,
    },
    damage: {
      damageAmount: {
        base: 6,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 16,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 3, restriction: restrictionEnum.Restricted },
    cost: { base: 200 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightPistol,
    name: "Beretta 201T",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 6,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 21,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 7, restriction: restrictionEnum.Restricted },
    cost: { base: 210 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightPistol,
    name: "Colt America L36",
    accuracy: {
      base: 7,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 11,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 320 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightPistol,
    name: "Fichetti Security 600",
    accuracy: {
      base: 6,
      equipment: 7,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 30,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 350 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightPistol,
    name: "Taurus Omni-6",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 6,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 6,
        reloadMethod: reloadMethodEnum.Cylinder,
      },
    ],
    availability: { rating: 3, restriction: restrictionEnum.Restricted },
    cost: { base: 300 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightPistol,
    name: "Taurus Omni-6 (with heavy pistol ammo)",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 6,
        reloadMethod: reloadMethodEnum.Cylinder,
      },
    ],
    availability: { rating: 3, restriction: restrictionEnum.Restricted },
    cost: { base: 300 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HeavyPistol,
    name: "Ares Predator V",
    accuracy: {
      base: 5,
      equipment: 7,
    },
    damage: {
      damageAmount: {
        base: 8,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 15,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 5, restriction: restrictionEnum.Restricted },
    cost: { base: 725 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HeavyPistol,
    name: "Ares Viper Slivergun",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 9,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
      annotation: damageAnnoationEnum.Flechette,
    },
    armourPenetration: { base: 4 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 30,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 8, restriction: restrictionEnum.Forbidden },
    cost: { base: 380 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HeavyPistol,
    name: "Browning Ultra-Power",
    accuracy: {
      base: 5,
      equipment: 6,
    },
    damage: {
      damageAmount: {
        base: 8,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 10,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 640 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HeavyPistol,
    name: "Colt Government 2066",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 14,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 7, restriction: restrictionEnum.Restricted },
    cost: { base: 425 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HeavyPistol,
    name: "Remington Roomsweeper",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 8,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 250 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HeavyPistol,
    name: "Remington Roomsweeper (with flechettes)",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 9,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      annotation: damageAnnoationEnum.Flechette,
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 4 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 8,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 250 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.HeavyPistol,
    name: "Ruger Super Warhawk",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 9,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 6,
        reloadMethod: reloadMethodEnum.Cylinder,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 400 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.MachinePistol,
    name: "Ares Crusader II",
    accuracy: {
      base: 5,
      equipment: 7,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 2 },
    ammo: [
      {
        amount: 40,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 9, restriction: restrictionEnum.Restricted },
    cost: { base: 830 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.MachinePistol,
    name: "Ceska Black Scorpion",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 6,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 35,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 270 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.MachinePistol,
    name: "Steyr TMP",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 30,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 8, restriction: restrictionEnum.Restricted },
    cost: { base: 350 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SubmachineGun,
    name: "Colt Cobra TZ-120",
    accuracy: {
      base: 4,
      equipment: 5,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 2, equipment: 3 },
    ammo: [
      {
        amount: 32,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 5, restriction: restrictionEnum.Restricted },
    cost: { base: 660 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SubmachineGun,
    name: "FN P93 Praetor",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 8,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 1, equipment: 2 },
    ammo: [
      {
        amount: 50,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 11, restriction: restrictionEnum.Forbidden },
    cost: { base: 900 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SubmachineGun,
    name: "HK-227",
    accuracy: {
      base: 5,
      equipment: 7,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 28,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 8, restriction: restrictionEnum.Restricted },
    cost: { base: 730 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SubmachineGun,
    name: "Ingram Smartgun X",
    accuracy: {
      base: 4,
      equipment: 6,
    },
    damage: {
      damageAmount: {
        base: 8,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.BurstFire, firearmModeEnum.FullAutomatic],
    recoilCompensation: { base: 2 },
    ammo: [
      {
        amount: 32,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 800 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SubmachineGun,
    name: "SCK Model 100",
    accuracy: {
      base: 5,
      equipment: 7,
    },
    damage: {
      damageAmount: {
        base: 8,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 30,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 8875 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SubmachineGun,
    name: "Uzi IV",
    accuracy: {
      base: 4,
      equipment: 5,
    },
    damage: {
      damageAmount: {
        base: 7,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 24,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 450 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultRifle,
    name: "AK-97",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 10,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 38,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 950 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultRifle,
    name: "Ares Alpha",
    accuracy: {
      base: 5,
      equipment: 7,
    },
    damage: {
      damageAmount: {
        base: 11,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 2 },
    ammo: [
      {
        amount: 42,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 11, restriction: restrictionEnum.Forbidden },
    cost: { base: 2650 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultRifle,
    name: "Ares Alpha (Grenade Launcher)",
    accuracy: {
      base: 4,
      equipment: 6,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.Grenade,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 6,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 11, restriction: restrictionEnum.Forbidden },
    cost: { base: 2650 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultRifle,
    name: "Colt M23",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 9,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 40,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 550 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultRifle,
    name: "FN HAR",
    accuracy: {
      base: 5,
      equipment: 6,
    },
    damage: {
      damageAmount: {
        base: 10,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [
      firearmModeEnum.SemiAutomatic,
      firearmModeEnum.BurstFire,
      firearmModeEnum.FullAutomatic,
    ],
    recoilCompensation: { base: 2 },
    ammo: [
      {
        amount: 35,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 8, restriction: restrictionEnum.Restricted },
    cost: { base: 1500 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultRifle,
    name: "Yamaha Raiden",
    accuracy: {
      base: 6,
      equipment: 8,
    },
    damage: {
      damageAmount: {
        base: 11,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [firearmModeEnum.BurstFire, firearmModeEnum.FullAutomatic],
    recoilCompensation: { base: 1 },
    ammo: [
      {
        amount: 60,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 14, restriction: restrictionEnum.Forbidden },
    cost: { base: 2600 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SniperRifle,
    name: "Ares Desert Strike",
    accuracy: {
      base: 7,
    },
    damage: {
      damageAmount: {
        base: 12,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -4 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 14,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 10, restriction: restrictionEnum.Forbidden },
    cost: { base: 17500 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SniperRifle,
    name: "Cavalier Arms Crockett EBR",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 12,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -3 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 20,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 12, restriction: restrictionEnum.Forbidden },
    cost: { base: 10300 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SniperRifle,
    name: "Ranger Arms SM-5",
    accuracy: {
      base: 8,
    },
    damage: {
      damageAmount: {
        base: 14,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -5 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 15,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 16, restriction: restrictionEnum.Forbidden },
    cost: { base: 28000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SniperRifle,
    name: "Remington 950",
    accuracy: {
      base: 7,
    },
    damage: {
      damageAmount: {
        base: 12,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -4 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 5,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 2100 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.SniperRifle,
    name: "Ruger 100",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 11,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -3 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 8,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 1300 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Shotgun,
    name: "Defiance T-250",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 10,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SingleShot, firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 5,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 450 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Shotgun,
    name: "Enfield AS-7",
    accuracy: {
      base: 4,
      equipment: 5,
    },
    damage: {
      damageAmount: {
        base: 13,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SemiAutomatic, firearmModeEnum.BurstFire],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 10,
        reloadMethod: reloadMethodEnum.Cylinder,
      },
      { amount: 24, reloadMethod: reloadMethodEnum.Drum },
    ],
    availability: { rating: 12, restriction: restrictionEnum.Forbidden },
    cost: { base: 1100 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Shotgun,
    name: "PJSS Model 55",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 11,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -1 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 2,
        reloadMethod: reloadMethodEnum.BreakAction,
      },
    ],
    availability: { rating: 9, restriction: restrictionEnum.Restricted },
    cost: { base: 1000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Special,
    name: "Ares S-III Super Squirt",
    accuracy: {
      base: 3,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.Chemical,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 20,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 7, restriction: restrictionEnum.Restricted },
    cost: { base: 950 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Special,
    name: "Fichetti Pain Inducer",
    accuracy: {
      base: 3,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.Chemical,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 10,
        reloadMethod: reloadMethodEnum.Special,
      },
    ],
    availability: { rating: 11, restriction: restrictionEnum.Restricted },
    cost: { base: 5000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Special,
    name: "Parashield Dart Pistol",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.DrugToxin,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 5,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 4, restriction: restrictionEnum.Restricted },
    cost: { base: 600 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.Special,
    name: "Parashield Dart Rifle",
    accuracy: {
      base: 6,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.DrugToxin,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 6,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 6, restriction: restrictionEnum.Restricted },
    cost: { base: 1200 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.LightMachinegun,
    name: "Ingram Valiant",
    accuracy: {
      base: 5,
      equipment: 6,
    },
    damage: {
      damageAmount: {
        base: 9,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -2 },
    mode: [firearmModeEnum.BurstFire, firearmModeEnum.FullAutomatic],
    recoilCompensation: { base: 2, equipment: 3 },
    ammo: [
      {
        amount: 50,
        reloadMethod: reloadMethodEnum.Clip,
      },
      {
        amount: 100,
        reloadMethod: reloadMethodEnum.BeltFed,
      },
    ],
    availability: { rating: 12, restriction: restrictionEnum.Forbidden },
    cost: { base: 5800 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.MediumHeavyMachinegun,
    name: "Stoner-Ares M202",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 10,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -3 },
    mode: [firearmModeEnum.FullAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 50,
        reloadMethod: reloadMethodEnum.Clip,
      },
      {
        amount: 100,
        reloadMethod: reloadMethodEnum.BeltFed,
      },
    ],
    availability: { rating: 12, restriction: restrictionEnum.Forbidden },
    cost: { base: 7000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.MediumHeavyMachinegun,
    name: "RPK HMG",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 12,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -4 },
    mode: [firearmModeEnum.FullAutomatic],
    recoilCompensation: { base: 0, equipment: 6 },
    ammo: [
      {
        amount: 50,
        reloadMethod: reloadMethodEnum.Clip,
      },
      {
        amount: 100,
        reloadMethod: reloadMethodEnum.BeltFed,
      },
    ],
    availability: { rating: 16, restriction: restrictionEnum.Forbidden },
    cost: { base: 16300 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultCannon,
    name: "Ares Antioch-2",
    accuracy: {
      base: 4,
      equipment: 6,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.Grenade,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 8,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 8, restriction: restrictionEnum.Forbidden },
    cost: { base: 3200 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultCannon,
    name: "ArmTech MGL-12",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.Grenade,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 12,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 10, restriction: restrictionEnum.Forbidden },
    cost: { base: 5000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultCannon,
    name: "Aztechnology Striker",
    accuracy: {
      base: 5,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.Missile,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 1,
        reloadMethod: reloadMethodEnum.MuzzleLoader,
      },
    ],
    availability: { rating: 10, restriction: restrictionEnum.Forbidden },
    cost: { base: 1200 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultCannon,
    name: "Krime Cannon",
    accuracy: {
      base: 4,
    },
    damage: {
      damageAmount: {
        base: 16,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -6 },
    mode: [firearmModeEnum.SemiAutomatic],
    recoilCompensation: { base: 0, equipment: 1 },
    ammo: [
      {
        amount: 6,
        reloadMethod: reloadMethodEnum.InternalMagazine,
      },
    ],
    availability: { rating: 20, restriction: restrictionEnum.Forbidden },
    cost: { base: 21000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultCannon,
    name: "Onotari Interceptor",
    accuracy: {
      base: 4,
      equipment: 6,
    },
    damage: {
      damageAmount: {
        base: 0,
        calculationType: damageCalculationMethodEnum.Missile,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: 0 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 2,
        reloadMethod: reloadMethodEnum.MuzzleLoader,
      },
    ],
    availability: { rating: 18, restriction: restrictionEnum.Forbidden },
    cost: { base: 14000 },
    type: weaponTypeEnum.Firearm,
  },
  {
    subtype: firearmWeaponTypeEnum.AssaultCannon,
    name: "Panther XXL",
    accuracy: {
      base: 5,
      equipment: 7,
    },
    damage: {
      damageAmount: {
        base: 17,
        calculationType: damageCalculationMethodEnum.Normal,
      },
      type: damageTypeEnum.Physical,
    },
    armourPenetration: { base: -6 },
    mode: [firearmModeEnum.SingleShot],
    recoilCompensation: { base: 0 },
    ammo: [
      {
        amount: 15,
        reloadMethod: reloadMethodEnum.Clip,
      },
    ],
    availability: { rating: 20, restriction: restrictionEnum.Forbidden },
    cost: { base: 43000 },
    type: weaponTypeEnum.Firearm,
  },
];
