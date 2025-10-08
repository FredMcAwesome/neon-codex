import { type } from "arktype";
import {
  sourceBookEnum,
  critterTypeEnum,
  skillCategoryEnum,
  mathOperatorEnum,
  critterAttributePowerEnum,
  matrixAttributeEnum,
  attributeTypeEnum,
} from "../../enums.js";
import { BonusGenericListSchema, BonusSchema } from "../shared/bonusSchemas.js";
import { MovementStrideSchema } from "../shared/commonSchemas.js";

// critter rating is a recursive type
export const CritterRatingSubnumberSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(critterAttributePowerEnum),
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

export type CritterRatingNonArrayType =
  | typeof CritterRatingSubnumberSchema.infer
  | {
      subnumbers: CritterRatingType;
    };

export type CritterRatingType = Array<CritterRatingNonArrayType>;
export const { CritterRatingSchema } = type.module({
  CritterRatingSchema: [
    [
      CritterRatingSubnumberSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "CritterRatingSchema",
      },
    ],
    "[]",
  ],
});

const SkillLoadingSchema = type({
  "+": "reject",
  name: "string",
  "specialised?": "string[]",
  rating: CritterRatingSchema,
  "select?": "string",
});
const SkillGroupLoadingSchema = type({
  "+": "reject",
  name: "string",
  rating: CritterRatingSchema,
});
const KnowledgeSkillSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(skillCategoryEnum),
  attribute: type.valueOf(attributeTypeEnum),
  skillPoints: "number",
  "specialisationsSelected?": "string[]",
});
export type CritterIncludedKnowledgeSkillType =
  typeof KnowledgeSkillSchema.infer;

const CritterSkillListSchema = type({
  "+": "reject",
  skillList: SkillLoadingSchema.array(),
  "skillGroupList?": SkillGroupLoadingSchema.array(),
  "knowledgeSkillList?": KnowledgeSkillSchema.array(),
});
export type CritterSkillListType = typeof CritterSkillListSchema.infer;

const CritterAttributeRangeSchema = type({
  "+": "reject",
  min: CritterRatingSchema,
  max: CritterRatingSchema,
  augmentedMax: CritterRatingSchema,
});
export type CritterAttributeRangeType =
  typeof CritterAttributeRangeSchema.infer;

const IncludedCritterPowerRatingSchema = type.or(
  "number",
  type({
    "+": "reject",
    power: "true",
  })
);
export type IncludedCritterPowerRatingType =
  typeof IncludedCritterPowerRatingSchema.infer;

const IncludedCritterPowerSchema = type({
  "+": "reject",
  name: "string",
  "selectText?": "string",
  "rating?": IncludedCritterPowerRatingSchema,
});
export const IncludedCritterPowerListSchema = type(
  IncludedCritterPowerSchema
).array();
export type IncludedCritterPowerListType =
  typeof IncludedCritterPowerListSchema.infer;

const IncludedComplexFormSchema = type({
  "+": "reject",
  name: "string",
  "select?": type.valueOf(matrixAttributeEnum),
});
const IncludedComplexFormListSchema = type(IncludedComplexFormSchema.array());
export type IncludedComplexFormListType =
  typeof IncludedComplexFormListSchema.infer;

export const CritterSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(critterTypeEnum),
  bodyAttributeRange: CritterAttributeRangeSchema,
  agilityAttributeRange: CritterAttributeRangeSchema,
  reactionAttributeRange: CritterAttributeRangeSchema,
  strengthAttributeRange: CritterAttributeRangeSchema,
  charismaAttributeRange: CritterAttributeRangeSchema,
  intuitionAttributeRange: CritterAttributeRangeSchema,
  logicAttributeRange: CritterAttributeRangeSchema,
  willpowerAttributeRange: CritterAttributeRangeSchema,
  initiativeAttributeRange: CritterAttributeRangeSchema,
  edgeAttributeRange: CritterAttributeRangeSchema,
  magicAttributeRange: CritterAttributeRangeSchema,
  resonanceAttributeRange: CritterAttributeRangeSchema,
  essenceAttributeRange: CritterAttributeRangeSchema,
  depthAttributeRange: CritterAttributeRangeSchema,
  "nonStandardMovement?": "true",
  "movement?": MovementStrideSchema,
  "includedPowerList?": IncludedCritterPowerListSchema,
  "optionalPowerList?": IncludedCritterPowerListSchema,
  "addQualityList?": BonusGenericListSchema,
  "addBiowareList?": BonusGenericListSchema,
  "addComplexFormList?": IncludedComplexFormListSchema,
  skills: CritterSkillListSchema,
  "bonus?": BonusSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type CritterType = typeof CritterSchema.infer;

export const CritterListSchema = type(CritterSchema.array());
export type CritterListType = typeof CritterListSchema.infer;
