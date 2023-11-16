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

// TODO: does this need to be separate?
const GearsGearsSchema = zod
  .object({
    xmltext: zod.string(),
    _rating: zod.string(),
    _consumecapacity: zod.string(),
  })
  .strict();

const GearsGearsUnionSchema = zod
  .object({
    gear: zod.optional(
      zod.union([zod.array(GearsGearsSchema), GearsGearsSchema])
    ),
  })
  .strict();

type GearsGearsUnionType = zod.infer<typeof GearsGearsUnionSchema>;

const PartialInnerUseGearXmlSchema = zod
  .object({
    name: zod.union([
      zod.string(),
      zod.object({ xmltext: zod.string(), _select: zod.string() }).strict(),
    ]),
    category: zod.optional(zod.nativeEnum(gearCategoryEnum)),
    rating: zod.optional(zod.number()),
    maxrating: zod.optional(zod.number()),
    capacity: zod.optional(zod.string()),
  })
  .strict();

export type GearsType = zod.infer<typeof PartialInnerUseGearXmlSchema> & {
  gears?: zod.infer<typeof GearXmlSchema> | GearsGearsUnionType | undefined;
};

const InnerUseGearXmlSchema: zod.ZodType<GearsType> =
  PartialInnerUseGearXmlSchema.extend({
    gears: zod.optional(
      zod.union([zod.lazy(() => GearXmlSchema), GearsGearsUnionSchema])
    ),
  });

// split into its own schema for ease of reading
export const UseGearXmlSchema = zod.union([
  zod.string(),
  zod.object({ xmltext: zod.string(), _rating: zod.string() }).strict(),
  InnerUseGearXmlSchema,
]);
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

export enum limbSlotXmlEnum {
  ARM = "arm",
  LEG = "leg",
  TORSO = "torso",
  SKULL = "skull",
}

export const StringOrNumberSchema = zod.union([zod.number(), zod.string()]);
export const StringArrayOrStringSchema = zod.union([
  zod.array(zod.string()),
  zod.string(),
]);
export const NumberOrRatingSchema = zod.union([
  zod.number(),
  zod.literal("Rating"),
]);

export const LimitModifierSchema = zod
  .object({
    limit: zod.union([
      zod.literal("Physical"),
      zod.literal("Social"),
      zod.literal("Mental"),
    ]),
    value: NumberOrRatingSchema,
    // these are keys for strings listed in en-us.xml
    condition: zod.optional(
      zod.union([
        zod.literal("LimitCondition_AttribSkillINT"),
        zod.literal("LimitCondition_AttribSkillLOG"),
        zod.literal("LimitCondition_ShieldPhysicalPenalty"),
        zod.literal("LimitCondition_Visible"),
        zod.literal("LimitCondition_BunkerGearVisible"),
        zod.literal("LimitCondition_CorporationVisible"),
        zod.literal("LimitCondition_IntimidationVisible"),
        zod.literal("LimitCondition_ExcludeIntimidationVisible"),
        zod.literal("LimitCondition_PublicVisible"),
        zod.literal("LimitCondition_GangVisible"),
        zod.literal("LimitCondition_ClimbingTests"),
        zod.literal("LimitCondition_SkillGroupStealth"),
        zod.literal("LimitCondition_SkillGroupStealthNaked"),
        zod.literal("LimitCondition_SkillsKnowledgeAcademic"),
        zod.literal("LimitCondition_SkillsKnowledgeScientificTechnical"),
        zod.literal("LimitCondition_SkillsActiveDisguiseImpersonation"),
        zod.literal("LimitCondition_SkillsActiveEscapeArtist"),
        zod.literal("LimitCondition_SkillsActiveEscapeArtistGrappleLoose"),
        zod.literal("LimitCondition_SkillsActiveFirstAidMedicine"),
        zod.literal("LimitCondition_SkillsActiveGymnasticsClimbing"),
        zod.literal("LimitCondition_SkillsActiveLeadership"),
        zod.literal("LimitCondition_SkillsActiveNavigation"),
        zod.literal("LimitCondition_SkillsActivePerception"),
        zod.literal("LimitCondition_SkillsActivePerceptionHearing"),
        zod.literal("LimitCondition_SkillsActivePerceptionSpatialRecognizer"),
        zod.literal("LimitCondition_SkillsActivePerceptionVisual"),
        zod.literal("LimitCondition_SkillsActivePerformance"),
        zod.literal("LimitCondition_SkillsActivePerformanceSinging"),
        zod.literal("LimitCondition_SkillsActivePerformanceSynthtrument"),
        zod.literal("LimitCondition_SkillsActiveSneakingVisible"),
        zod.literal("LimitCondition_SkillsActiveSneakingNaked"),
        zod.literal("LimitCondition_SkillsActiveSwimming"),
        zod.literal("LimitCondition_SportsFans"),
        zod.literal("LimitCondition_SportsRivals"),
        zod.literal("LimitCondition_Sprawl"),
        zod.literal("LimitCondition_ExcludeFansGangers"),
        zod.literal("LimitCondition_TestSneakingThermal"),
        zod.literal("LimitCondition_TestSpeech"),
        zod.literal("LimitCondition_TestsEndurance"),
        zod.literal("LimitCondition_Skillwires"),
        zod.literal("LimitCondition_CyberwareHydraulicJacks"),
        zod.literal("LimitCondition_CyberwareBalanceTail"),
        zod.literal("LimitCondition_CyberwareCyberfins"),
        zod.literal("LimitCondition_CyberwareFootAnchor"),
        zod.literal("LimitCondition_CyberwareMonkeyFoot"),
        zod.literal("LimitCondition_CyberwareRaptorFoot"),
        zod.literal("LimitCondition_CyberwareSnakeFingers"),
        zod.literal("LimitCondition_InUse"),
        zod.literal("LimitCondition_ExcludeIntimidation"),
        zod.literal("LimitCondition_Intimidation"),
        zod.literal("LimitCondition_GearAutopicker"),
        zod.literal("LimitCondition_NationalLanguageRanks"),
        zod.literal("LimitCondition_Megacorp"),
        zod.literal("LimitCondition_QualityTrustworthy"),
        zod.literal("LimitCondition_QualityChatty"),
      ])
    ),
  })
  .strict();

export const SkillSchema = zod
  .object({
    name: zod.string(),
    bonus: NumberOrRatingSchema,
    _precedence: zod.optional(zod.literal("0")),
    condition: zod.optional(zod.string()),
  })
  .strict();

const SkillListSchema = zod.union([zod.array(SkillSchema), SkillSchema]);
export type SkillListType = zod.infer<typeof SkillListSchema>;

export const SpiritSchema = zod
  .object({
    spirit: StringArrayOrStringSchema,
    addtoselected: zod.optional(
      zod.union([zod.literal("False"), zod.literal("True")])
    ),
  })
  .strict();

export const GenericNameValueSchema = zod
  .object({
    name: zod.optional(zod.string()),
    _name: zod.optional(zod.string()),
    value: zod.optional(zod.number()),
    val: zod.optional(StringOrNumberSchema),
    min: zod.optional(StringOrNumberSchema),
    max: zod.optional(StringOrNumberSchema),
    aug: zod.optional(zod.string()),
    _precedence: zod.optional(zod.string()),
    xmltext: zod.optional(StringOrNumberSchema),
  })
  .strict();

export type GenericNameValueType = zod.infer<typeof GenericNameValueSchema>;

const GenericNameValueListSchema = zod.union([
  zod.array(GenericNameValueSchema),
  GenericNameValueSchema,
]);

export type GenericNameValueListType = zod.infer<
  typeof GenericNameValueListSchema
>;

const ModXmlSchema = zod.union([
  zod.string(),
  zod
    .object({
      xmltext: zod.string(),
      // select="Driver">Searchlight
      _select: zod.optional(zod.string()),
      _rating: zod.optional(zod.string()),
      // used when the mod rating exceeds the item rating
      _maxrating: zod.optional(zod.string()),
      _cost: zod.optional(zod.string()),
    })
    .strict(),
]);
export type ModXmlType = zod.infer<typeof ModXmlSchema>;

export const ModListXmlSchema = zod
  .object({
    name: zod.union([zod.array(ModXmlSchema), ModXmlSchema]),
    addslots: zod.optional(zod.number()),
    subsystems: zod.optional(
      zod
        .object({
          cyberware: zod
            .object({
              name: zod.string(),
            })
            .strict(),
        })
        .strict()
    ),
  })
  .strict();
export type ModListXmlType = zod.infer<typeof ModListXmlSchema>;

export const ModRecursiveXmlSchema = ModListXmlSchema.extend({
  mod: zod.optional(zod.union([ModListXmlSchema, zod.array(ModListXmlSchema)])),
}).strict();

export type ModRecursiveXmlType = zod.infer<typeof ModRecursiveXmlSchema>;

export const CategoryXmlListSchema = zod.array(
  zod
    .object({
      _blackmarket: zod.string(),
      xmltext: zod.string(),
    })
    .strict()
);
export type CategoryXmlListType = zod.infer<typeof CategoryXmlListSchema>;

export const AugmentationXmlLimitSchema = zod.union([
  // Unlimited times
  zod.literal("False"),
  // Replaces arm
  zod.literal("{arm}"),
  // Replaces leg
  zod.literal("{leg}"),
  // Replaces torso
  zod.literal("{torso}"),
  // Replaces skull
  zod.literal("{skull}"),
  // Replaces finger
  zod.literal("{arm} * 5"),
  // Up to Unaugmented Body Score
  zod.literal("{BODUnaug}"),
  // This augmentation can be taken up to this number
  zod.number(),
]);

export type AugmentationXmlLimitType = zod.infer<
  typeof AugmentationXmlLimitSchema
>;

export enum augmentationXmlGradeEnum {
  None = "None",
  Used = "Used",
  UsedAdapsin = "Used (Adapsin)",
  Standard = "Standard",
  // Standard augmentations after taking Burnout's Way quality
  StandardBurnout = "Standard (Burnout's Way)",
  Alphaware = "Alphaware",
  AlphawareAdapsin = "Alphaware (Adapsin)",
  Betaware = "Betaware",
  BetawareAdapsin = "Betaware (Adapsin)",
  Deltaware = "Deltaware",
  DeltawareAdapsin = "Deltaware (Adapsin)",
  Gammaware = "Gammaware",
  GammawareAdapsin = "Gammaware (Adapsin)",
  Omegaware = "Omegaware",
  OmegawareAdapsin = "Omegaware (Adapsin)",
  Greyware = "Greyware",
  GreywareAdapsin = "Greyware (Adapsin)",
}

export const xmlAllowGearSchema = zod.union([
  zod
    .object({
      gearcategory: zod.optional(
        zod.union([
          zod.array(zod.nativeEnum(gearCategoryEnum)),
          zod.nativeEnum(gearCategoryEnum),
        ])
      ),
      gearname: zod.optional(zod.array(zod.string())),
    })
    .strict(),
  zod.string(),
]);

export type xmlAllowGearType = zod.infer<typeof xmlAllowGearSchema>;
