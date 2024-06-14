import { z as zod } from "zod";
import { attributeTypeEnum, skillCategoryEnum } from "../../enums.js";
export const SkillSchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    isKnowledgeSkill: zod.boolean(),
    description: zod.string(),
    category: zod.nativeEnum(skillCategoryEnum),
    attribute: zod.nativeEnum(attributeTypeEnum),
    default: zod.boolean(),
    exotic: zod.boolean(),
    skillGroup: zod.optional(zod.string()),
    specialisations: zod.optional(zod.array(zod.string())),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();
export type SkillType = zod.infer<typeof SkillSchema>;
export const SkillListSchema = zod.array(SkillSchema);
export type SkillListType = zod.infer<typeof SkillListSchema>;

export const CustomSkillSchema = SkillSchema.extend({
  skillPoints: zod.number(),
  karmaPoints: zod.number(),
  specialisationsSelected: zod.optional(zod.array(zod.string())),
}).strict();
export type CustomSkillType = zod.infer<typeof CustomSkillSchema>;
export const CustomSkillListSchema = zod.array(CustomSkillSchema);
export type CustomSkillListType = zod.infer<typeof CustomSkillListSchema>;

export const CustomSkillGroupSchema = zod
  .object({
    name: zod.string(),
    skillGroupPoints: zod.number(),
    karmaPoints: zod.number(),
  })
  .strict();
export type CustomSkillGroupType = zod.infer<typeof CustomSkillGroupSchema>;
export const CustomSkillGroupListSchema = zod.array(CustomSkillGroupSchema);
export type CustomSkillGroupListType = zod.infer<
  typeof CustomSkillGroupListSchema
>;

export const CustomKnowledgeSkillSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(skillCategoryEnum),
    attribute: zod.nativeEnum(attributeTypeEnum),
    skillPoints: zod.number(),
    karmaPoints: zod.number(),
    specialisationsSelected: zod.optional(zod.array(zod.string())),
  })
  .strict();

export type CustomKnowledgeSkillType = zod.infer<
  typeof CustomKnowledgeSkillSchema
>;
