import { type } from "arktype";
import {
  priorityLetterEnum,
  skillTalentSourceEnum,
  talentCategoryEnum,
} from "../../enums.js";

import { RequirementsSchema } from "../shared/requiredSchemas.js";

const PriorityMetatypeBaseSchema = type({
  name: "string",
  specialAttributePoints: "number",
  karmaCost: "number",
});
const HeritagePrioritySchema = PriorityMetatypeBaseSchema.and({
  "metavariantList?": PriorityMetatypeBaseSchema.array(),
});
export type HeritagePriorityType = typeof HeritagePrioritySchema.infer;

const SkillBaseSchema = type({
  points: "number",
  rating: "number",
});
export type SkillBaseType = typeof SkillBaseSchema.infer;

const SkillSourceSchema = SkillBaseSchema.and({
  source: type.valueOf(skillTalentSourceEnum),
});
export type SkillSourceType = typeof SkillSourceSchema.infer;

const SkillSchema = SkillBaseSchema.and({
  skillList: "string[]",
});
export type SkillType = typeof SkillSchema.infer;

const SkillGroupSchema = SkillBaseSchema.and({
  groupList: "string[]",
});
export type SkillGroupType = typeof SkillGroupSchema.infer;

const TalentBaseSchema = type({
  // Name is xml value and label is xml name
  name: "string",
  label: "string",
  "includedQuality?": "string",
  "includedSkills?": type.or(SkillSchema, SkillSourceSchema),
  "includedSkillGroups?": SkillGroupSchema,
  "required?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
});
const MagicTalentPrioritySchema = TalentBaseSchema.and({
  category: type.unit(talentCategoryEnum.Magic),
  magic: "number",
  "formulae?": "number",
});

const ResonanceTalentPrioritySchema = TalentBaseSchema.and({
  category: type.unit(talentCategoryEnum.Resonance),
  resonance: "number",
  complexForms: "number",
});

const DepthTalentPrioritySchema = TalentBaseSchema.and({
  category: type.unit(talentCategoryEnum.Depth),
  depth: "number",
});

const MundaneTalentPrioritySchema = TalentBaseSchema.and({
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
  name: "string",
  heritageList: HeritagePrioritySchema.array(),
});
export type HeritageOptionsPriorityType =
  typeof HeritageOptionsPrioritySchema.infer;

export const TalentOptionsPrioritySchema = type({
  name: "string",
  talentList: TalentPrioritySchema.array(),
});
export type TalentOptionsPriorityType =
  typeof TalentOptionsPrioritySchema.infer;

export const AttributePrioritySchema = type({
  name: "string",
  attributes: "number",
});
export type AttributePriorityType = typeof AttributePrioritySchema.infer;
export const SkillPrioritySchema = type({
  name: "string",
  skillPoints: "number",
  skillGroupPoints: "number",
});
export type SkillPriorityType = typeof SkillPrioritySchema.infer;
export const ResourcePrioritySchema = type({
  name: "string",
  resources: "number",
});
export type ResourcePriorityType = typeof ResourcePrioritySchema.infer;
export const ResourceOptionsPrioritySchema = type({
  streetLevel: ResourcePrioritySchema,
  standard: ResourcePrioritySchema,
  primeRunner: ResourcePrioritySchema,
});
export type ResourceOptionsPriorityType =
  typeof ResourceOptionsPrioritySchema.infer;

const PrioritySchema = type({
  heritages: HeritageOptionsPrioritySchema,
  attributes: AttributePrioritySchema,
  talents: TalentOptionsPrioritySchema,
  skills: SkillPrioritySchema,
  resources: ResourceOptionsPrioritySchema,
});
export type PriorityType = typeof PrioritySchema.infer;
const PriorityRowSchema = PrioritySchema.and({
  priority: type.valueOf(priorityLetterEnum),
});
export type PriorityRowType = typeof PriorityRowSchema.infer;

export const PriorityTableSchema = type({
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
