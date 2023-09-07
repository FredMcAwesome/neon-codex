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

export const StringOrNumberSchema = zod.union([zod.number(), zod.string()]);
export const StringArrayOrStringSchema = zod.union([
  zod.array(zod.string()),
  zod.string(),
]);
export const NumberOrRatingSchema = zod.union([
  zod.number(),
  zod.literal("Rating"),
]);

const LimitModifierSchema = zod
  .object({
    limit: zod.string(),
    value: NumberOrRatingSchema,
    condition: zod.optional(zod.string()),
  })
  .strict();

const SkillSchema = zod
  .object({
    name: zod.string(),
    bonus: NumberOrRatingSchema,
    _precedence: zod.optional(zod.literal("0")),
    condition: zod.optional(zod.string()),
  })
  .strict();

const GenericNameValueSchema = zod
  .object({
    name: zod.optional(zod.string()),
    value: zod.optional(zod.number()),
    val: zod.optional(StringOrNumberSchema),
    min: zod.optional(StringOrNumberSchema),
    max: zod.optional(StringOrNumberSchema),
    aug: zod.optional(zod.string()),
    _precedence: zod.optional(zod.string()),
    xmltext: zod.optional(StringOrNumberSchema),
  })
  .strict();

export const BonusXmlSchema = zod.union([
  zod
    .object({
      // Enter a name for this item
      selecttext: zod.optional(
        zod.union([
          zod
            .object({
              _xml: zod.string(),
              _xpath: zod.string(),
              _allowedit: zod.optional(zod.string()),
            })
            .strict(),
          zod.literal(""),
        ])
      ),
      // Choose a weapon to link to
      selectweapon: zod.optional(
        zod.union([
          zod
            .object({
              _weapondetails: zod.string(),
            })
            .strict(),
          zod.literal(""),
        ])
      ),
      // Choose a skill to link to
      selectskill: zod.optional(
        zod
          .object({
            _limittoskill: zod.optional(zod.string()),
            _knowledgeskills: zod.optional(zod.string()),
            _skillcategory: zod.optional(zod.string()),
            _limittoattribute: zod.optional(zod.string()),
            _maximumrating: zod.optional(zod.string()),
            applytorating: zod.optional(zod.string()),
            val: zod.optional(zod.number()),
          })
          .strict()
      ),
      // Choose a power to link to
      selectpowers: zod.optional(
        zod
          .object({
            selectpower: zod
              .object({
                ignorerating: zod.literal("True"),
                val: zod.literal("Rating"),
                limit: zod.literal("Rating"),
                pointsperlevel: zod.number(),
              })
              .strict(),
          })
          .strict()
      ),
      // Choose a tradition to link to
      selecttradition: zod.optional(zod.literal("")),
      // Choose a license to link to
      selectrestricted: zod.optional(zod.literal("")),
      // Choose a cyberware to link to
      selectcyberware: zod.optional(
        zod.union([
          zod
            .object({
              category: zod.string(),
            })
            .strict(),
          zod.literal(""),
        ])
      ),
      // bonus to these categories
      skillcategory: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      skillgroup: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      activesoft: zod.optional(
        zod
          .object({
            val: zod.string(),
          })
          .strict()
      ),
      skillsoft: zod.optional(
        zod
          .object({
            val: zod.string(),
            _excludecategory: zod.optional(zod.string()),
            _skillcategory: zod.optional(zod.string()),
          })
          .strict()
      ),
      limitmodifier: zod.optional(
        zod.union([zod.array(LimitModifierSchema), LimitModifierSchema])
      ),
      specificskill: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      skillsoftaccess: zod.optional(
        zod
          .object({
            xmltext: zod.literal("Rating"),
            _precedence: zod.literal("0"),
          })
          .strict()
      ),
      skillattribute: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      skilllinkedattribute: zod.optional(
        zod.union([zod.array(SkillSchema), SkillSchema])
      ),
      skillwire: zod.optional(
        zod.union([GenericNameValueSchema, zod.string()])
      ),
      hardwires: zod.optional(
        zod
          .object({
            xmltext: zod.literal("Rating"),
            _knowledgeskill: zod.optional(zod.literal("True")),
            _excludecategory: zod.optional(zod.string()),
          })
          .strict()
      ),
      spellcategory: zod.optional(
        zod
          .object({
            name: zod.string(),
            val: zod.literal("Rating"),
          })
          .strict()
      ),
      essencepenaltyt100: zod.optional(zod.string()),
      weaponspecificdice: zod.optional(
        zod
          .object({
            xmltext: zod.literal("Rating"),
            _type: zod.literal("Melee"),
          })
          .strict()
      ),
      weaponaccuracy: zod.optional(
        zod
          .object({
            name: zod.string(),
            value: zod.number(),
          })
          .strict()
      ),
      weaponskillaccuracy: zod.optional(
        zod
          .object({
            selectskill: zod.optional(
              zod
                .object({
                  _knowledgeskills: zod.optional(zod.string()),
                })
                .strict()
            ),
            value: zod.number(),
          })
          .strict()
      ),
      smartlink: zod.optional(zod.number()),
      matrixinitiativedice: zod.optional(
        zod
          .object({
            xmltext: zod.number(),
            _precedence: zod.string(),
          })
          .strict()
      ),
      _unique: zod.optional(zod.string()),
      toxincontactresist: zod.optional(NumberOrRatingSchema),
      pathogencontactresist: zod.optional(NumberOrRatingSchema),
      toxincontactimmune: zod.optional(zod.string()),
      pathogencontactimmune: zod.optional(zod.string()),
      toxininhalationresist: zod.optional(NumberOrRatingSchema),
      pathogeninhalationresist: zod.optional(NumberOrRatingSchema),
      toxininhalationimmune: zod.optional(zod.literal("")),
      pathogeninhalationimmune: zod.optional(zod.literal("")),
      toxiningestionresist: zod.optional(NumberOrRatingSchema),
      pathogeningestionresist: zod.optional(NumberOrRatingSchema),
      toxiningestionimmune: zod.optional(zod.literal("")),
      pathogeningestionimmune: zod.optional(zod.literal("")),
      toxininjectionresist: zod.optional(NumberOrRatingSchema),
      pathogeninjectionresist: zod.optional(NumberOrRatingSchema),
      toxininjectionimmune: zod.optional(zod.literal("")),
      pathogeninjectionimmune: zod.optional(zod.literal("")),
      fatigueresist: zod.optional(NumberOrRatingSchema),
      sociallimit: zod.optional(StringOrNumberSchema),
      physicallimit: zod.optional(NumberOrRatingSchema),
      attribute: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
      ),
      limit: zod.optional(
        zod.union([zod.array(GenericNameValueSchema), GenericNameValueSchema])
      ),
      quality: zod.optional(
        zod
          .object({
            xmltext: zod.string(),
            _rating: zod.string(),
          })
          .strict()
      ),
      addqualities: zod.optional(
        zod
          .object({
            addquality: zod.string(),
          })
          .strict()
      ),
      initiativedice: zod.optional(zod.number()),
      damageresistance: zod.optional(StringOrNumberSchema),
      radiationresist: zod.optional(zod.number()),
      sonicresist: zod.optional(zod.number()),
      unarmeddv: zod.optional(StringOrNumberSchema),
      unarmeddvphysical: zod.optional(zod.string()),
      specificattribute: zod.optional(
        zod.union([GenericNameValueSchema, zod.array(GenericNameValueSchema)])
      ),
      _mode: zod.optional(zod.string()),
      attributekarmacost: zod.optional(
        zod.union([GenericNameValueSchema, zod.array(GenericNameValueSchema)])
      ),
      knowledgeskillkarmacost: zod.optional(
        zod.union([GenericNameValueSchema, zod.array(GenericNameValueSchema)])
      ),
      conditionmonitor: zod.optional(
        zod
          .object({
            sharedthresholdoffset: zod.optional(NumberOrRatingSchema),
            physical: zod.optional(zod.number()),
          })
          .strict()
      ),
      memory: zod.optional(NumberOrRatingSchema),
      mentallimit: zod.optional(NumberOrRatingSchema),
      disablequality: zod.optional(StringArrayOrStringSchema),
      walkmultiplier: zod.optional(
        zod
          .object({
            val: zod.optional(zod.number()),
            category: zod.string(),
            percent: zod.optional(zod.number()),
          })
          .strict()
      ),
      runmultiplier: zod.optional(
        zod
          .object({
            val: zod.optional(zod.number()),
            category: zod.string(),
            percent: zod.optional(zod.number()),
          })
          .strict()
      ),
      sprintbonus: zod.optional(
        zod
          .object({
            val: zod.optional(zod.number()),
            category: zod.string(),
            percent: zod.optional(zod.number()),
          })
          .strict()
      ),
      armor: zod.optional(
        zod.union([
          zod
            .object({
              xmltext: zod.literal("Rating"),
              _group: zod.literal("0"),
            })
            .strict(),
          NumberOrRatingSchema,
        ])
      ),
      lifestylecost: zod.optional(zod.number()),
      stuncmrecovery: zod.optional(NumberOrRatingSchema),
      physicalcmrecovery: zod.optional(NumberOrRatingSchema),
      initiativepass: zod.optional(GenericNameValueSchema),
      firearmor: zod.optional(zod.number()),
      electricityarmor: zod.optional(zod.number()),
      coldarmor: zod.optional(zod.number()),
      unarmedreach: zod.optional(zod.number()),
      physiologicaladdictionfirsttime: zod.optional(NumberOrRatingSchema),
      psychologicaladdictionfirsttime: zod.optional(NumberOrRatingSchema),
      physiologicaladdictionalreadyaddicted: zod.optional(NumberOrRatingSchema),
      psychologicaladdictionalreadyaddicted: zod.optional(NumberOrRatingSchema),
      adapsin: zod.optional(zod.literal("")),
      composure: zod.optional(zod.number()),
      judgeintentionsdefense: zod.optional(zod.number()),
      drainresist: zod.optional(zod.number()),
      fadingresist: zod.optional(zod.number()),
      directmanaspellresist: zod.optional(zod.number()),
      detectionspellresist: zod.optional(zod.number()),
      manaillusionresist: zod.optional(zod.number()),
      mentalmanipulationresist: zod.optional(zod.number()),
      decreasebodresist: zod.optional(zod.number()),
      decreaseagiresist: zod.optional(zod.number()),
      decreaserearesist: zod.optional(zod.number()),
      decreasestrresist: zod.optional(zod.number()),
      decreasecharesist: zod.optional(zod.number()),
      decreaseintresist: zod.optional(zod.number()),
      decreaselogresist: zod.optional(zod.number()),
      decreasewilresist: zod.optional(zod.number()),
      dodge: zod.optional(zod.number()),
      initiative: zod.optional(
        zod.union([zod.number(), GenericNameValueSchema])
      ),
      reflexrecorderoptimization: zod.optional(zod.literal("")),
      ambidextrous: zod.optional(zod.literal("")),
      addlimb: zod.optional(
        zod
          .object({
            limbslot: zod.string(),
            val: zod.number(),
            _precedence: zod.literal("0"),
          })
          .strict()
      ),
    })
    .strict(),
  zod.literal(""),
]);

export type BonusXmlType = zod.infer<typeof BonusXmlSchema>;

export const WirelessXmlSchema = zod.union([
  BonusXmlSchema,
  zod
    .object({
      skillcategory: SkillSchema,
    })
    .strict(),
  zod.object({ specificskill: SkillSchema }).strict(),
]);

const ModXmlSchema = zod.union([
  zod.string(),
  zod
    .object({
      xmltext: zod.string(),
      _rating: zod.optional(zod.string()),
      _select: zod.optional(zod.string()),
      _maxrating: zod.optional(zod.string()),
      _cost: zod.optional(zod.string()),
    })
    .strict(),
]);

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

export const ModUnionXmlSchema = zod.union([
  ModListXmlSchema,
  zod
    .object({
      name: zod.optional(zod.union([zod.string(), zod.array(zod.string())])),
      mod: zod.union([ModListXmlSchema, zod.array(ModListXmlSchema)]),
    })
    .strict(),
]);

const ModCategoryXmlSchema = zod
  .object({
    category: zod.string(),
  })
  .strict();

export const ModCategoryListXmlSchema = zod.union([
  zod.array(ModCategoryXmlSchema),
  ModCategoryXmlSchema,
]);
