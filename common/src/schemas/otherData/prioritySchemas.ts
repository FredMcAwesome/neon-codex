import { type } from "arktype";
import {
  priorityLetterEnum,
  skillTalentSourceEnum,
  talentCategoryEnum,
} from "../../enums.js";

import { RequirementsSchema } from "../shared/requiredSchemas.js";

const PriorityMetatypeBaseSchema = type({
  "+": "reject",
  name: "string",
  specialAttributePoints: "number",
  karmaCost: "number",
});
const HeritagePrioritySchema = PriorityMetatypeBaseSchema.merge({
  "metavariantList?": PriorityMetatypeBaseSchema.array(),
});
export type HeritagePriorityType = typeof HeritagePrioritySchema.infer;

const SkillBaseSchema = type({
  "+": "reject",
  skillCount: "number",
  rating: "number",
});
export type SkillBaseType = typeof SkillBaseSchema.infer;

const IncludedSkillSourceSchema = SkillBaseSchema.merge({
  source: type.valueOf(skillTalentSourceEnum),
});
export type IncludedSkillSourceType = typeof IncludedSkillSourceSchema.infer;

const IncludedSkillOptionsSchema = SkillBaseSchema.merge({
  skillOptionList: "string[]",
});
export type IncludedSkillOptionsType = typeof IncludedSkillOptionsSchema.infer;

const SkillGroupSchema = SkillBaseSchema.merge({
  groupList: "string[]",
});
export type SkillGroupType = typeof SkillGroupSchema.infer;

const TalentBaseSchema = type({
  "+": "reject",
  // Name is xml value and label is xml name
  name: "string",
  label: "string",
  "includedQuality?": "string",
  "includedSkills?": type.or(
    IncludedSkillOptionsSchema,
    IncludedSkillSourceSchema
  ),
  "includedSkillGroups?": SkillGroupSchema,
  "required?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
});
const MagicTalentPrioritySchema = TalentBaseSchema.merge({
  category: type.unit(talentCategoryEnum.Magic),
  magic: "number",
  "formulae?": "number",
});

const ResonanceTalentPrioritySchema = TalentBaseSchema.merge({
  category: type.unit(talentCategoryEnum.Resonance),
  resonance: "number",
  complexForms: "number",
});

const DepthTalentPrioritySchema = TalentBaseSchema.merge({
  category: type.unit(talentCategoryEnum.Depth),
  depth: "number",
});

const MundaneTalentPrioritySchema = TalentBaseSchema.merge({
  category: type.unit(talentCategoryEnum.Mundane),
});

const TalentPrioritySchema = type.or(
  MagicTalentPrioritySchema,
  ResonanceTalentPrioritySchema,
  DepthTalentPrioritySchema,
  MundaneTalentPrioritySchema
);
export type TalentPriorityType = typeof TalentPrioritySchema.infer;

export const HeritageOptionsPrioritySchema = type({
  "+": "reject",
  name: "string",
  heritageList: HeritagePrioritySchema.array(),
});
export type HeritageOptionsPriorityType =
  typeof HeritageOptionsPrioritySchema.infer;

export const TalentOptionsPrioritySchema = type({
  "+": "reject",
  name: "string",
  talentList: TalentPrioritySchema.array(),
});
export type TalentOptionsPriorityType =
  typeof TalentOptionsPrioritySchema.infer;

export const AttributePrioritySchema = type({
  "+": "reject",
  name: "string",
  attributes: "number",
});
export type AttributePriorityType = typeof AttributePrioritySchema.infer;
export const SkillPrioritySchema = type({
  "+": "reject",
  name: "string",
  skillPoints: "number",
  skillGroupPoints: "number",
});
export type SkillPriorityType = typeof SkillPrioritySchema.infer;
export const ResourcePrioritySchema = type({
  "+": "reject",
  name: "string",
  resources: "number",
});
export type ResourcePriorityType = typeof ResourcePrioritySchema.infer;
export const ResourceOptionsPrioritySchema = type({
  "+": "reject",
  streetLevel: ResourcePrioritySchema,
  standard: ResourcePrioritySchema,
  primeRunner: ResourcePrioritySchema,
});
export type ResourceOptionsPriorityType =
  typeof ResourceOptionsPrioritySchema.infer;

const PrioritySchema = type({
  "+": "reject",
  heritages: HeritageOptionsPrioritySchema,
  attributes: AttributePrioritySchema,
  talents: TalentOptionsPrioritySchema,
  skills: SkillPrioritySchema,
  resources: ResourceOptionsPrioritySchema,
});
export type PriorityType = typeof PrioritySchema.infer;
const PriorityRowSchema = PrioritySchema.merge({
  priority: type.valueOf(priorityLetterEnum),
});
export type PriorityRowType = typeof PriorityRowSchema.infer;

export const PriorityTableSchema = type({
  "+": "reject",
  A: PrioritySchema,
  B: PrioritySchema,
  C: PrioritySchema,
  D: PrioritySchema,
  E: PrioritySchema,
});
export type PriorityTableType = typeof PriorityTableSchema.infer;

export const PriorityLetterOptions = [
  priorityLetterEnum.A,
  priorityLetterEnum.B,
  priorityLetterEnum.C,
  priorityLetterEnum.D,
  priorityLetterEnum.E,
];
