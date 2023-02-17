import { z as zod } from "zod";
import { attributeTypeEnum, skillCategoryEnum } from "../enums.js";
export const SkillSchema = zod
  .object({
    id: zod.string(),
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
  })
  .strict();
export type SkillType = zod.infer<typeof SkillSchema>;
