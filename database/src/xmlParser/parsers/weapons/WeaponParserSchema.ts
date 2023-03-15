import { gearCategoryEnum } from "@shadowrun/common/src/enums.js";
import {
  weaponXmlSubtypeEnum,
  WeaponXmlSubtypeSchema,
} from "@shadowrun/common/src/schemas/commonSchema.js";
import { MountSchema } from "@shadowrun/common/src/schemas/weaponSchemas.js";
import { z as zod } from "zod";

const UseGearXmlSchema = zod
  .object({
    name: zod.union([
      zod.string(),
      zod.object({ xmltext: zod.string(), _select: zod.string() }).strict(),
    ]),
    category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
    rating: zod.optional(zod.number()),
  })
  .strict();
export const GearXmlSchema = zod
  .object({
    usegear: zod.union([UseGearXmlSchema, zod.array(UseGearXmlSchema)]),
  })
  .strict();
export type GearXmlType = zod.infer<typeof GearXmlSchema>;
const AccessoryXmlSchema = zod
  .object({
    name: zod.string(),
    mount: zod.optional(zod.union([zod.array(MountSchema), MountSchema])),
    rating: zod.optional(zod.number()),
    gears: zod.optional(GearXmlSchema),
  })
  .strict();
export type AccessoryXmlType = zod.infer<typeof AccessoryXmlSchema>;

const UnderbarrelXmlSchema = zod
  .object({
    underbarrel: zod.union([zod.array(zod.string()), zod.string()]),
  })
  .strict();

export type RequiredXmlType = zod.infer<typeof RequiredXmlSchema>;

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
export const SourceXmlSchema = zod.nativeEnum(sourceBookXmlEnum);

const AccuracyXmlSchema = zod.union([zod.number(), zod.string()]);
export type AccuracyXmlType = zod.infer<typeof AccuracyXmlSchema>;

const DamageXmlSchema = zod.union([zod.string(), zod.literal(0)]);
export type DamageXmlType = zod.infer<typeof DamageXmlSchema>;

const AccessoriesXmlSchema = zod.union([
  zod.array(AccessoryXmlSchema),
  AccessoryXmlSchema,
]);
export type AccessoriesXmlType = zod.infer<typeof AccessoriesXmlSchema>;

const WeaponDetailsOrXmlSchema = zod
  .object({
    category: zod.union([
      zod.array(zod.nativeEnum(weaponXmlSubtypeEnum)),
      zod.nativeEnum(weaponXmlSubtypeEnum),
    ]),
    useskill: zod.union([zod.array(zod.string()), zod.string()]),
    AND: zod.object({
      OR: zod
        .object({
          category: zod.union([zod.array(zod.string()), zod.string()]),
        })
        .strict(),
    }),
  })
  .strict();

const RequiredXmlSchema = zod.union([
  zod.object({
    weapondetails: zod
      .object({
        name: zod.optional(zod.string()),
        conceal: zod.optional(
          zod
            .object({
              xmltext: zod.number(),
              _operation: zod.union([
                zod.literal("lessthanequals"),
                zod.literal("greaterthan"),
              ]),
            })
            .strict()
        ),
      })
      .strict(),
  }),
  zod
    .object({
      OR: WeaponDetailsOrXmlSchema,
    })
    .strict(),
  zod.object({
    AND: zod.object({}), // unused
  }),
]);

const WeaponXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    type: zod.union([zod.literal("Ranged"), zod.literal("Melee")]),
    category: WeaponXmlSubtypeSchema,
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
      zod
        .object({
          accessory: AccessoriesXmlSchema,
        })
        .strict()
    ),
    accessorymounts: zod.optional(
      zod
        .object({
          mount: zod.union([zod.array(MountSchema), MountSchema]),
        })
        .strict()
    ),
    addweapon: zod.optional(zod.union([zod.array(zod.string()), zod.string()])),
    allowaccessory: zod.optional(
      zod.union([zod.literal("True"), zod.literal("False")])
    ),
    allowgear: zod.optional(
      zod
        .object({
          gearcategory: zod.union([
            zod.array(zod.nativeEnum(gearCategoryEnum)),
            zod.nativeEnum(gearCategoryEnum),
          ]),
        })
        .strict()
    ),
    alternaterange: zod.optional(zod.string()),
    ammocategory: zod.optional(zod.nativeEnum(weaponXmlSubtypeEnum)),
    ammoslots: zod.optional(zod.number()),
    cyberware: zod.optional(zod.literal("True")),
    doubledcostaccessorymounts: zod.optional(
      zod
        .object({
          mount: zod.union([zod.array(MountSchema), MountSchema]),
        })
        .strict()
    ),
    extramount: zod.optional(MountSchema),
    hide: zod.optional(zod.literal("")),
    mount: zod.optional(MountSchema),
    range: zod.optional(zod.string()),
    required: zod.optional(RequiredXmlSchema),
    requireammo: zod.optional(
      zod.union([zod.literal("False"), zod.literal("microtorpedo")])
    ),
    singleshot: zod.optional(zod.literal(2)),
    sizecategory: zod.optional(zod.string()),
    shortburst: zod.optional(zod.literal(6)),
    spec: zod.optional(zod.string()),
    spec2: zod.optional(zod.string()),
    underbarrels: zod.optional(UnderbarrelXmlSchema),
    useskill: zod.optional(zod.string()),
    useskillspec: zod.optional(zod.string()),
    weapontype: zod.optional(zod.string()),
  })
  .strict();
export type WeaponXmlType = zod.infer<typeof WeaponXmlSchema>;
export const WeaponListXmlSchema = zod.array(WeaponXmlSchema);
export type WeaponListXmlType = zod.infer<typeof WeaponListXmlSchema>;
