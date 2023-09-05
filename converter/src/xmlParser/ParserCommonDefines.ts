import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";

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

const NameCategorySchema = zod
  .object({
    name: zod.string(),
    category: zod.string(),
  })
  .strict();

const GearsGearsSchema = zod
  .object({
    xmltext: zod.string(),
    _rating: zod.string(),
    _consumecapacity: zod.string(),
  })
  .strict();

export const UseGearXmlSchema = zod
  .object({
    name: zod.union([
      zod.string(),
      zod.object({ xmltext: zod.string(), _select: zod.string() }).strict(),
    ]),
    category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
    rating: zod.optional(zod.number()),
    maxrating: zod.optional(zod.number()),
    capacity: zod.optional(zod.string()),
    gears: zod.optional(
      zod
        .object({
          usegear: zod.optional(
            zod.union([zod.array(NameCategorySchema), NameCategorySchema])
          ),
          gear: zod.optional(
            zod.union([zod.array(GearsGearsSchema), GearsGearsSchema])
          ),
        })
        .strict()
    ),
  })
  .strict();
export const GearXmlSchema = zod
  .object({
    usegear: zod.union([UseGearXmlSchema, zod.array(UseGearXmlSchema)]),
  })
  .strict();
export type GearXmlType = zod.infer<typeof GearXmlSchema>;

export enum attributeXMLEnum {
  BOD = "BOD",
  AGI = "AGI",
  REA = "REA",
  STR = "STR",
  WIL = "WIL",
  LOG = "LOG",
  INT = "INT",
  CHA = "CHA",
  MAG = "MAG",
  RES = "RES",
  INI = "INI",
  DEP = "DEP",
  EDG = "EDG",
}

export const StringOrNumberSchema = zod.union([zod.number(), zod.string()]);
export const StringArrayOrStringSchema = zod.union([
  zod.array(zod.string()),
  zod.string(),
]);

const LimitModifierSchema = zod
  .object({
    limit: zod.string(),
    value: zod.number(),
    condition: zod.optional(zod.string()),
  })
  .strict();

const SkillSchema = zod
  .object({
    name: zod.string(),
    bonus: zod.number(),
  })
  .strict();

const SpecificSkillSchema = zod
  .object({
    name: zod.string(),
    bonus: zod.number(),
  })
  .strict();

export const BonusXmlSchema = zod
  .object({
    limitmodifier: zod.optional(
      zod.union([zod.array(LimitModifierSchema), LimitModifierSchema])
    ),
    fatigueresist: zod.optional(zod.number()),
    selecttext: zod.optional(zod.literal("")),
    sociallimit: zod.optional(zod.number()),
    specificskill: zod.optional(
      zod.union([zod.array(SpecificSkillSchema), SpecificSkillSchema])
    ),
  })
  .strict();

export const WirelessXmlSchema = zod.union([
  BonusXmlSchema,
  zod
    .object({
      skillcategory: SkillSchema,
    })
    .strict(),
  zod.object({ specificskill: SkillSchema }).strict(),
]);
