import {
  priorityLetterEnum,
  priorityCategoryEnum,
  priorityTableRunnerLevelEnum,
  skillTalentSourceEnum,
  talentCategoryEnum,
} from "../../enums.js";
import { z as zod } from "zod";
import { RequirementsSchema } from "../shared/requiredSchemas.js";

const PriorityBaseSchema = zod
  .object({
    name: zod.string(),
    rowLetter: zod.nativeEnum(priorityLetterEnum),
  })
  .strict();

const PriorityMetatypeBaseSchema = zod
  .object({
    name: zod.string(),
    specialAttributePoints: zod.number(),
    karmaCost: zod.number(),
  })
  .strict();

const PriorityMetatypeSchema = PriorityMetatypeBaseSchema.extend({
  metavariantList: zod.optional(zod.array(PriorityMetatypeBaseSchema)),
}).strict();
export type PriorityMetatypeType = zod.infer<typeof PriorityMetatypeSchema>;

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

export const PrioritySchema = zod.discriminatedUnion("category", [
  PriorityBaseSchema.extend({
    category: zod.literal(priorityCategoryEnum.Heritage),
    metatypeList: zod.array(PriorityMetatypeSchema),
  }).strict(),
  PriorityBaseSchema.extend({
    category: zod.literal(priorityCategoryEnum.Talent),
    talentList: zod.array(TalentPrioritySchema),
  }).strict(),
  PriorityBaseSchema.extend({
    category: zod.literal(priorityCategoryEnum.Attributes),
    attributes: zod.number(),
  }).strict(),
  PriorityBaseSchema.extend({
    category: zod.literal(priorityCategoryEnum.Skills),
    skillPoints: zod.number(),
    skillGroupPoints: zod.number(),
  }).strict(),
  PriorityBaseSchema.extend({
    category: zod.literal(priorityCategoryEnum.Resources),
    priorityTable: zod.nativeEnum(priorityTableRunnerLevelEnum),
    resources: zod.number(),
  }).strict(),
]);
export type PriorityType = zod.infer<typeof PrioritySchema>;
export const PriorityListSchema = zod.array(PrioritySchema);
export type PriorityListType = zod.infer<typeof PriorityListSchema>;
