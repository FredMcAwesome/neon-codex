import { type } from "arktype";
import { attributeTypeEnum, skillCategoryEnum } from "../../enums.js";
export const SkillSchema = type({
  "+": "reject",
  // id: "string",
  name: "string",
  isKnowledgeSkill: "boolean",
  description: "string",
  category: type.valueOf(skillCategoryEnum),
  attribute: type.valueOf(attributeTypeEnum),
  default: "boolean",
  exotic: "boolean",
  "skillGroup?": "string",
  "specialisations?": "string[]",
  source: "string",
  page: "number",
});
export type SkillType = typeof SkillSchema.infer;
export const SkillListSchema = type(SkillSchema.array());
export type SkillListType = typeof SkillListSchema.infer;

export const CustomSkillSchema = SkillSchema.merge({
  skillPoints: "number",
  karmaPoints: "number",
  "specialisationsSelected?": "string[]",
});
export type CustomSkillType = typeof CustomSkillSchema.infer;
export const CustomSkillListSchema = type(CustomSkillSchema.array());
export type CustomSkillListType = typeof CustomSkillListSchema.infer;

export const CustomSkillGroupSchema = type({
  "+": "reject",
  name: "string",
  skillGroupPoints: "number",
  karmaPoints: "number",
});
export type CustomSkillGroupType = typeof CustomSkillGroupSchema.infer;
export const CustomSkillGroupListSchema = type(CustomSkillGroupSchema.array());
export type CustomSkillGroupListType = typeof CustomSkillGroupListSchema.infer;

export const CustomKnowledgeSkillSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(skillCategoryEnum),
  attribute: type.valueOf(attributeTypeEnum),
  skillPoints: "number",
  karmaPoints: "number",
  "specialisationsSelected?": "string[]",
});

export type CustomKnowledgeSkillType = typeof CustomKnowledgeSkillSchema.infer;
