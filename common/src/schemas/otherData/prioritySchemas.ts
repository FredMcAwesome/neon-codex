import {
  priorityLetterEnum,
  skillTalentSourceEnum,
  talentCategoryEnum,
} from "../../enums.js";
import { z as zod } from "zod";
import { RequirementsSchema } from "../shared/requiredSchemas.js";

const PriorityMetatypeBaseSchema = zod
  .object({
    name: zod.string(),
    specialAttributePoints: zod.number(),
    karmaCost: zod.number(),
  })
  .strict();

const HeritagePrioritySchema = PriorityMetatypeBaseSchema.extend({
  metavariantList: zod.optional(zod.array(PriorityMetatypeBaseSchema)),
}).strict();
export type HeritagePriorityType = zod.infer<typeof HeritagePrioritySchema>;

const SkillBaseSchema = zod
  .object({
    points: zod.number(),
    rating: zod.number(),
  })
  .strict();
export type SkillBaseType = zod.infer<typeof SkillBaseSchema>;

const SkillSourceSchema = SkillBaseSchema.extend({
  source: zod.nativeEnum(skillTalentSourceEnum),
}).strict();
export type SkillSourceType = zod.infer<typeof SkillSourceSchema>;

const SkillSchema = SkillBaseSchema.extend({
  skillList: zod.array(zod.string()),
}).strict();
export type SkillType = zod.infer<typeof SkillSchema>;

const SkillGroupSchema = SkillBaseSchema.extend({
  groupList: zod.array(zod.string()),
}).strict();
export type SkillGroupType = zod.infer<typeof SkillGroupSchema>;

const TalentBaseSchema = zod
  .object({
    // Name is xml value and label is xml name
    name: zod.string(),
    label: zod.string(),
    includedQuality: zod.optional(zod.string()),
    includedSkills: zod.optional(zod.union([SkillSchema, SkillSourceSchema])),
    includedSkillGroups: zod.optional(SkillGroupSchema),
    required: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
  })
  .strict();

const MagicTalentPrioritySchema = TalentBaseSchema.extend({
  category: zod.literal(talentCategoryEnum.Magic),
  magic: zod.number(),
  spells: zod.optional(zod.number()),
}).strict();

const ResonanceTalentPrioritySchema = TalentBaseSchema.extend({
  category: zod.literal(talentCategoryEnum.Resonance),
  resonance: zod.number(),
  complexForms: zod.number(),
}).strict();

const DepthTalentPrioritySchema = TalentBaseSchema.extend({
  category: zod.literal(talentCategoryEnum.Depth),
  depth: zod.number(),
}).strict();

const MundaneTalentPrioritySchema = TalentBaseSchema.extend({
  category: zod.literal(talentCategoryEnum.Mundane),
}).strict();

const TalentPrioritySchema = zod.discriminatedUnion("category", [
  MagicTalentPrioritySchema,
  ResonanceTalentPrioritySchema,
  DepthTalentPrioritySchema,
  MundaneTalentPrioritySchema,
]);
export type TalentPriorityType = zod.infer<typeof TalentPrioritySchema>;

export const HeritageOptionsPrioritySchema = zod
  .object({
    name: zod.string(),
    heritageList: zod.array(HeritagePrioritySchema),
  })
  .strict();
export type HeritageOptionsPriorityType = zod.infer<
  typeof HeritageOptionsPrioritySchema
>;
export const TalentOptionsPrioritySchema = zod
  .object({
    name: zod.string(),
    talentList: zod.array(TalentPrioritySchema),
  })
  .strict();
export type TalentOptionsPriorityType = zod.infer<
  typeof TalentOptionsPrioritySchema
>;
export const AttributePrioritySchema = zod
  .object({
    name: zod.string(),
    attributes: zod.number(),
  })
  .strict();
export type AttributePriorityType = zod.infer<typeof AttributePrioritySchema>;
export const SkillPrioritySchema = zod
  .object({
    name: zod.string(),
    skillPoints: zod.number(),
    skillGroupPoints: zod.number(),
  })
  .strict();
export type SkillPriorityType = zod.infer<typeof SkillPrioritySchema>;
export const ResourcePrioritySchema = zod
  .object({
    name: zod.string(),
    resources: zod.number(),
  })
  .strict();
export type ResourcePriorityType = zod.infer<typeof ResourcePrioritySchema>;
export const ResourceOptionsPrioritySchema = zod
  .object({
    streetLevel: ResourcePrioritySchema,
    standard: ResourcePrioritySchema,
    primeRunner: ResourcePrioritySchema,
  })
  .strict();
export type ResourceOptionsPriorityType = zod.infer<
  typeof ResourceOptionsPrioritySchema
>;

const PrioritySchema = zod
  .object({
    heritages: HeritageOptionsPrioritySchema,
    attributes: AttributePrioritySchema,
    talents: TalentOptionsPrioritySchema,
    skills: SkillPrioritySchema,
    resources: ResourceOptionsPrioritySchema,
  })
  .strict();
export type PriorityType = zod.infer<typeof PrioritySchema>;
const PriorityRowSchema = PrioritySchema.extend({
  priority: zod.nativeEnum(priorityLetterEnum),
}).strict();
export type PriorityRowType = zod.infer<typeof PriorityRowSchema>;

export const PriorityTableSchema = zod
  .object({
    A: PrioritySchema,
    B: PrioritySchema,
    C: PrioritySchema,
    D: PrioritySchema,
    E: PrioritySchema,
  })
  .strict();
export type PriorityTableType = zod.infer<typeof PriorityTableSchema>;

export const PriorityLetterOptions = [
  priorityLetterEnum.A,
  priorityLetterEnum.B,
  priorityLetterEnum.C,
  priorityLetterEnum.D,
  priorityLetterEnum.E,
];
