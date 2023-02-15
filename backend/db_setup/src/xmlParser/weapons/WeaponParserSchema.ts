import {
  firearmAccessoryMountLocationEnum,
  gearXmlCategoryEnum,
} from "@shadowrun/common/src/enums.js";
import { z as zod } from "zod";
const MountXmlSchema = zod.nativeEnum(firearmAccessoryMountLocationEnum);
export type MountXmlType = zod.infer<typeof MountXmlSchema>;
const UseGearXmlSchema = zod.object({
  name: zod.string(),
  category: zod.optional(zod.nativeEnum(gearXmlCategoryEnum)),
  rating: zod.optional(zod.number()),
});
const GearXmlSchema = zod.object({
  usegear: zod.union([UseGearXmlSchema, zod.array(UseGearXmlSchema)]),
});
const AccessoryXmlSchema = zod.object({
  name: zod.string(),
  mount: zod.optional(zod.union([zod.array(MountXmlSchema), MountXmlSchema])),
  rating: zod.optional(zod.number()),
  gears: zod.optional(GearXmlSchema),
});
export type AccessoryXmlType = zod.infer<typeof AccessoryXmlSchema>;

const UseGearSchema = zod.object({
  name: zod.string(),
  category: zod.optional(
    zod.object({ option: zod.nativeEnum(gearXmlCategoryEnum) })
  ),
  rating: zod.optional(zod.number()),
});
const AccessorySchema = zod.object({
  name: zod.string(),
  mount: zod.optional(zod.array(MountXmlSchema)),
  rating: zod.optional(zod.number()),
  gears: zod.optional(zod.array(UseGearSchema)),
});

export type AccessoryType = zod.infer<typeof AccessorySchema>;

const UnderbarrelXmlSchema = zod.object({
  underbarrel: zod.union([zod.array(zod.string()), zod.string()]),
});

const WeaponDetailsOrXmlSchema = zod.object({
  category: zod.union([zod.array(zod.string()), zod.string()]),
  useskill: zod.union([zod.array(zod.string()), zod.string()]),
  AND: zod.object({
    OR: zod.object({
      category: zod.union([zod.array(zod.string()), zod.string()]),
    }),
  }),
});

const RequiredXmlSchema = zod.union([
  zod.object({
    weapondetails: zod.object({
      name: zod.optional(zod.string()),
      conceal: zod.optional(zod.number()),
    }),
  }),
  zod.object({
    OR: WeaponDetailsOrXmlSchema,
  }),
]);

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
  Rigger5 = "R5",
  HowlingShadows = "HS",
  TheVladivostokGauntlet = "TVG",
  SplinteredState = "SPS",
  ShadowsInFocus_Butte = "SFB",
  HongKongSourcebook = "HKS",
  Lockdown = "LCD",
  ShadowsInFocus_SanFranciscoMetroplex = "SFM",
  ShadowsInFocus_Metropole = "SFME",
  CuttingAces = "CA",
  Shadowrun2050 = "2050",
  BookOfTheLost = "BOTL",
  ForbiddenArcana = "FA",
  StateOfTheArtADL = "SAG",
  TheCompleteTrog = "TCT",
  ShadowsInFocus_SiouxNation_CountingCoup = "SFCC",
  DarkTerrors = "DTR",
  TheSeattleGambit = "TSG",
  StreetLethal = "SL",
  KillCode = "KC",
  Hamburg = "HAMG",
  BetterThanBad = "BTB",
  Aetherology = "AET",
  NoFuture = "NF",
  DatapulsSOTA2080 = "SOTG",
  DatapulsVerschlusssache = "DPVG",
  KrimeKatalog = "KK",
  ShadowrunMissions0803_10BlockTango = "SRM0803",
  ShadowrunMissions0804_DirtyLaundry = "SRM0804",
  ShadowrunQuickStartRules = "QSR",
  GrimmesErwachen = "GE",
  SprawlWilds = "SW",
}
const SourceXmlSchema = zod.nativeEnum(sourceBookXmlEnum);

export enum weaponSubtypeXmlEnum {
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
  Holduts = "Holdouts",
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
  UnderbarrelWeapons = "Underbarrel Weapons",
  BioWeapon = "Bio-Weapon",
  Carbines = "Carbines",
}

const WeaponSubtypeXmlSchema = zod.nativeEnum(weaponSubtypeXmlEnum);

export enum weaponRangeXmlEnum {
  Flamethrowers = "Flamethrowers",
  LightCrossbows = "Light Crossbows",
  MediumCrossbows = "Medium Crossbows",
  HeavyCrossbows = "Heavy Crossbows",
  Tasers = "Tasers",
  Holduts = "Holdouts",
  LightPistols = "Light Pistols",
  HeavyPistols = "Heavy Pistols",
  MachinePistols = "Machine Pistols",
  SubmachineGuns = "Submachine Guns",
  AssaultRifles = "Assault Rifles",
  SportingRifles = "Sporting Rifles",
  Shotguns = "Shotguns",
  ShotgunsFlechette = "Shotguns (flechette)",
  ShotgunsSlug = "Shotguns (slug)",
  SniperRifles = "Sniper Rifles",
  LightMachineguns = "Light Machine Guns",
  Medium_HeavyMachinegun = "Medium/Heavy Machinegun",
  GrenadeLaunchers = "Grenade Launchers",
  MissileLaunchers = "Missile Launchers",
  UnderbarrelWeapons = "Underbarrel Weapons",
  StandardGrenade = "Standard Grenade",
  AerodynamicGrenade = "Aerodynamic Grenade",
  HarpoonGun = "Harpoon Gun",
  HarpoonGun_Underwater = "Harpoon Gun (Underwater)",
  Shuriken = "Shuriken",
  ThrownKnife = "Thrown Knife",
}

const WeaponRangeXmlSchema = zod.nativeEnum(weaponRangeXmlEnum);

const AccuracyXmlSchema = zod.union([zod.number(), zod.string()]);
export type AccuracyXmlType = zod.infer<typeof AccuracyXmlSchema>;

const DamageXmlSchema = zod.union([zod.string(), zod.literal(0)]);
export type DamageXmlType = zod.infer<typeof DamageXmlSchema>;

const AccessoriesXmlSchema = zod.union([
  zod.array(AccessoryXmlSchema),
  AccessoryXmlSchema,
]);
export type AccessoriesXmlType = zod.infer<typeof AccessoriesXmlSchema>;

const WeaponXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: WeaponSubtypeXmlSchema,
    type: zod.union([zod.literal("Ranged"), zod.literal("Melee")]),
    conceal: zod.number(),
    accuracy: AccuracyXmlSchema,
    reach: zod.number(),
    damage: DamageXmlSchema,
    ap: zod.union([zod.number(), zod.string()]),
    mode: zod.union([zod.string(), zod.literal(0)]),
    rc: zod.union([zod.number(), zod.literal("-")]),
    ammo: zod.union([zod.string(), zod.number()]),
    avail: zod.union([zod.string(), zod.number()]),
    cost: zod.union([zod.string(), zod.number()]),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
    accessories: zod.optional(
      zod.object({
        accessory: AccessoriesXmlSchema,
      })
    ),
    accessorymounts: zod.optional(
      zod.object({
        mount: zod.union([zod.array(MountXmlSchema), MountXmlSchema]),
      })
    ),
    addweapon: zod.optional(zod.union([zod.array(zod.string()), zod.string()])),
    allowaccessory: zod.optional(
      zod.union([zod.literal("True"), zod.literal("False")])
    ),
    allowgear: zod.optional(
      zod.object({
        gearcategory: zod.union([
          zod.array(zod.nativeEnum(gearXmlCategoryEnum)),
          zod.nativeEnum(gearXmlCategoryEnum),
        ]),
      })
    ),
    alternaterange: zod.optional(zod.nativeEnum(weaponRangeXmlEnum)),
    ammocategory: zod.optional(zod.nativeEnum(weaponSubtypeXmlEnum)),
    ammoslots: zod.optional(zod.number()),
    cyberware: zod.optional(zod.literal("True")),
    doubledcostaccessorymounts: zod.optional(
      zod.object({
        mount: zod.union([zod.array(MountXmlSchema), MountXmlSchema]),
      })
    ),
    extramount: zod.optional(MountXmlSchema),
    hide: zod.optional(zod.literal("")),
    mount: zod.optional(MountXmlSchema),
    range: zod.optional(WeaponRangeXmlSchema),
    required: zod.optional(RequiredXmlSchema),
    requireammo: zod.optional(
      zod.union([zod.literal("False"), zod.literal("microtorpedo")])
    ),
    singleshot: zod.optional(zod.literal(2)),
    sizecategory: zod.optional(zod.string()),
    shortburst: zod.optional(zod.literal(6)),
    spec: zod.optional(zod.string()),
    spec2: zod.optional(zod.string()),
    underbarrels: zod.optional(
      zod.union([zod.array(UnderbarrelXmlSchema), UnderbarrelXmlSchema])
    ),
    useskill: zod.optional(zod.string()),
    useskillspec: zod.optional(zod.string()),
    weapontype: zod.optional(zod.string()),
  })
  .strict();
export type WeaponXmlType = zod.infer<typeof WeaponXmlSchema>;
export const WeaponListXmlSchema = zod.array(WeaponXmlSchema);
export type WeaponListXmlType = zod.infer<typeof WeaponListXmlSchema>;
