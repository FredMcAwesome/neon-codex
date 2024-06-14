import { z as zod } from "zod";
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
export const CritterRatingSubnumberSchema = zod.union([
  zod.number(),
  zod.object({ option: zod.nativeEnum(critterAttributePowerEnum) }).strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type CritterRatingNonArrayType =
  | zod.infer<typeof CritterRatingSubnumberSchema>
  | {
      subnumbers: CritterRatingType;
    };

export type CritterRatingType = Array<CritterRatingNonArrayType>;
export const CritterRatingSchema: zod.ZodType<CritterRatingType> = zod.array(
  zod.union([
    CritterRatingSubnumberSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CritterRatingSchema),
      })
      .strict(),
  ])
);

const SkillLoadingSchema = zod
  .object({
    name: zod.string(),
    specialised: zod.optional(zod.array(zod.string())),
    rating: CritterRatingSchema,
    select: zod.optional(zod.string()),
  })
  .strict();

const SkillGroupLoadingSchema = zod
  .object({
    name: zod.string(),
    rating: CritterRatingSchema,
  })
  .strict();

const KnowledgeSkillSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(skillCategoryEnum),
    attribute: zod.nativeEnum(attributeTypeEnum),
    skillPoints: zod.number(),
    specialisationsSelected: zod.optional(zod.array(zod.string())),
  })
  .strict();
export type CritterIncludedKnowledgeSkillType = zod.infer<
  typeof KnowledgeSkillSchema
>;

const CritterSkillListSchema = zod
  .object({
    skillList: zod.array(SkillLoadingSchema),
    skillGroupList: zod.optional(zod.array(SkillGroupLoadingSchema)),
    knowledgeSkillList: zod.optional(zod.array(KnowledgeSkillSchema)),
  })
  .strict();
export type CritterSkillListType = zod.infer<typeof CritterSkillListSchema>;

const CritterAttributeRangeSchema = zod
  .object({
    min: CritterRatingSchema,
    max: CritterRatingSchema,
    augmentedMax: CritterRatingSchema,
  })
  .strict();
export type CritterAttributeRangeType = zod.infer<
  typeof CritterAttributeRangeSchema
>;

const IncludedCritterPowerRatingSchema = zod.union([
  zod.number(),
  zod
    .object({
      power: zod.literal(true),
    })
    .strict(),
]);
export type IncludedCritterPowerRatingType = zod.infer<
  typeof IncludedCritterPowerRatingSchema
>;

const IncludedCritterPowerSchema = zod
  .object({
    name: zod.string(),
    selectText: zod.optional(zod.string()),
    rating: zod.optional(IncludedCritterPowerRatingSchema),
  })
  .strict();
export const IncludedCritterPowerListSchema = zod.array(
  IncludedCritterPowerSchema
);
export type IncludedCritterPowerListType = zod.infer<
  typeof IncludedCritterPowerListSchema
>;

const IncludedComplexFormSchema = zod
  .object({
    name: zod.string(),
    select: zod.optional(zod.nativeEnum(matrixAttributeEnum)),
  })
  .strict();
const IncludedComplexFormListSchema = zod.array(IncludedComplexFormSchema);
export type IncludedComplexFormListType = zod.infer<
  typeof IncludedComplexFormListSchema
>;

export const CritterSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(critterTypeEnum),
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
    nonStandardMovement: zod.optional(zod.literal(true)),
    movement: zod.optional(MovementStrideSchema),
    includedPowerList: zod.optional(IncludedCritterPowerListSchema),
    optionalPowerList: zod.optional(IncludedCritterPowerListSchema),
    addQualityList: zod.optional(BonusGenericListSchema),
    addBiowareList: zod.optional(BonusGenericListSchema),
    addComplexFormList: zod.optional(IncludedComplexFormListSchema),
    skills: CritterSkillListSchema,
    bonus: zod.optional(BonusSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type CritterType = zod.infer<typeof CritterSchema>;

export const CritterListSchema = zod.array(CritterSchema);
export type CritterListType = zod.infer<typeof CritterListSchema>;
