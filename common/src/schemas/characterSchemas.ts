import { z as zod } from "zod";

export enum PrioritiesEnum {
  Metatype,
  Attributes,
  Magic,
  Skills,
  Resources,
}
export enum PriorityLevelEnum {
  A,
  B,
  C,
  D,
  E,
}

export enum MetatypeEnum {
  Human,
  Elf,
  Dwarf,
  Ork,
  Troll,
}
export enum MagicTypeEnum {
  Adept,
  AspectedMagician,
  Magician,
  MysticAdept,
  NotAwakened,
  Technomancer,
}

export const PrioritiesSchema = zod
  .object({
    MetatypePriority: zod.nativeEnum(PriorityLevelEnum),
    MetatypeSubselection: zod.nativeEnum(MetatypeEnum),
    AttributesPriority: zod.nativeEnum(PriorityLevelEnum),
    MagicPriority: zod.nativeEnum(PriorityLevelEnum),
    MagicSubselection: zod.nativeEnum(MagicTypeEnum),
    SkillsPriority: zod.nativeEnum(PriorityLevelEnum),
    ResourcesPriority: zod.nativeEnum(PriorityLevelEnum),
  })
  .strict();
export type PrioritiesType = zod.infer<typeof PrioritiesSchema>;

export const AttributesSchema = zod.object({
  body: zod.number(),
  agility: zod.number(),
  reaction: zod.number(),
  strength: zod.number(),
  willpower: zod.number(),
  logic: zod.number(),
  intuition: zod.number(),
  charisma: zod.number(),
});
export type AttributesType = zod.infer<typeof AttributesSchema>;

export const SpecialAttributesSchema = zod
  .object({
    edge: zod.number(),
    magic: zod.number(),
  })
  .strict();
export type SpecialAttributesType = zod.infer<typeof SpecialAttributesSchema>;

// export const CharacterInformationSchema = zod
//   .object({
//     priorityInfo: PrioritiesSchema,
//     attributeInfo: AttributesSchema,
//     specialAttributeInfo: SpecialAttributesSchema,
//     skillSelections: CustomSkillListSchema,
//     equipmentSelected: EquipmentListSchema,
//     karmaPoints: zod.number(),
//     nuyen: zod.number(),
//   })
//   .strict();

export enum QualityEnum {
  Ambidextrous,
  AnalyticalMind,
  Apititude,
  AstralChamelon,
  Bilingual,
  Blandness,
  Catlike,
  Codeslinger,
  DoubleJointed,
  ExceptionalAttribute,
  FirstImpression,
  FocusedConcentration,
  Gearhead,
  Guts,
  HighPainTolerance,
  HomeGround,
  HumanLooking,
  Indomitable,
  Juryrigger,
  Lucky,
  MagicalResistance,
  MentorSpirit,
  NaturalAthelete,
  NaturalHardening,
  NaturalImmunity,
  PhotographicMemory,
  QuickHealer,
  ResistanceToPathogensToxins,
  SpiritAffinity,
  Toughness,
  WillToLive,
  Addiction,
  Allergy,
  AstralBeacon,
  BadLuck,
  BadRep,
  CodeOfHonor,
  Codeblock,
  CombatParalysis,
  Dependents,
  DistinctiveStyle,
  ElfPoser,
  Gremlins,
  Incompetent,
  Insomnia,
  LossOfConfidence,
  LowPainTolerance,
  OrkPoser,
  Prejudiced,
  Scorched,
  SensitiveSystem,
  SimsenseVertigo,
  SINnerLayered,
  SocialStress,
  SpiritBane,
  Uncouth,
  Uneducated,
  UnsteadyHands,
  WeakImmuneSystem,
}

export enum QualitySubqualityEnum {
  HomeGround_AstralAcclimation,
  HomeGround_YouKnowAGuy,
  HomeGround_DigitalTurf,
  HomeGround_TheTransporter,
  HomeGround_OnTheLam,
  HomeGround_StreetPolitics,
  Addition_Mild,
  Addition_Moderate,
  Addition_Severe,
  Addition_Burnout,
  Alergy_Uncommon_Mild,
  Alergy_Uncommon_Moderate,
  Alergy_Uncommon_Severe,
  Alergy_Uncommon_Extreme,
  Alergy_Common_Mild,
  Alergy_Common_Moderate,
  Alergy_Common_Severe,
  Alergy_Common_Extreme,
  Prejudiced_CommonGroup_Biased,
  Prejudiced_CommonGroup_Outspoken,
  Prejudiced_CommonGroup_Radical,
  Prejudiced_SpecificGroup_Biased,
  Prejudiced_SpecificGroup_Outspoken,
  Prejudiced_SpecificGroup_Radical,
  Scorched_MemoryLossShort,
  Scorched_MemoryLossLong,
  Scorched_Blackout,
  Scorched_Migraines,
  Scorched_ParanoiaAnxiety,
  SINnerLayered_NationalSIN,
  SINnerLayered_CriminalSIN,
  SINnerLayered_CorporateLimitedSIN,
  SINnerLayered_CorporateSIN,
}
const CostRangeSchema = zod.array(zod.number());
export type CostRange = zod.infer<typeof CostRangeSchema>;

export const SubqualitySchema = zod
  .object({
    name: zod.string(),
    id: zod.nativeEnum(QualitySubqualityEnum),
    description: zod.string(),
    cost: zod.optional(zod.number()),
  })
  .strict();
export type SubqualityType = zod.infer<typeof SubqualitySchema>;

export const QualitySchema = zod
  .object({
    name: zod.string(),
    id: zod.nativeEnum(QualityEnum),
    positive: zod.boolean(),
    cost: zod.union([zod.number(), CostRangeSchema]),
    maxRating: zod.optional(zod.number()),
    description: zod.optional(zod.string()),
    subqualities: zod.optional(zod.array(SubqualitySchema)),
  })
  .strict();
export type QualityType = zod.infer<typeof QualitySchema>;

export const SelectedQualitySchema = QualitySchema.extend({
  costSelected: zod.optional(zod.number()),
  ratingSelected: zod.optional(zod.number()),
  subqualitySelected: zod.optional(SubqualitySchema),
}).strict();

export type SelectedQualityType = zod.infer<typeof SelectedQualitySchema>;
