import { z as zod } from "zod";
import { attributeTypeEnum, skillCategoryEnum } from "../enums.js";
export const SkillSchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    attribute: zod.nativeEnum(attributeTypeEnum),
    category: zod.nativeEnum(skillCategoryEnum),
    default: zod.boolean(),
    exotic: zod.boolean(),
    skillGroup: zod.optional(zod.string()),
    requiresgroundmovement: zod.optional(zod.string()),
    requiresswimmovement: zod.optional(zod.string()),
    requiresflymovement: zod.optional(zod.string()),
    specialisations: zod.optional(zod.array(zod.string())),
    source: zod.string(),
    page: zod.number(),
    description: zod.string(),
  })
  .strict();
export type SkillType = zod.infer<typeof SkillSchema>;
export const SkillListSchema = zod.array(SkillSchema);
export type SkillListType = zod.infer<typeof SkillListSchema>;

export const CustomSkillSchema = SkillSchema.extend({
  skillGroupPoints: zod.number(),
  skillPoints: zod.number(),
  karmaPoints: zod.number(),
  specialisationsSelected: zod.optional(zod.array(zod.string())),
}).strict();
export type CustomSkillType = zod.infer<typeof CustomSkillSchema>;
export const CustomSkillListSchema = zod.array(CustomSkillSchema);
export type CustomSkillListType = zod.infer<typeof CustomSkillListSchema>;
