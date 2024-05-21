import { z as zod } from "zod";
import {
  sourceBookEnum,
  critterTypeEnum,
  skillCategoryEnum,
  mathOperatorEnum,
  critterAttributePowerEnum,
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
    rating: zod.optional(CritterRatingSchema),
    select: zod.optional(zod.string()),
  })
  .strict();

const SkillGroupLoadingSchema = zod
  .object({
    name: zod.string(),
    rating: zod.optional(zod.number()),
  })
  .strict();

const KnowledgeSkillSchema = zod
  .object({
    name: zod.string(),
    rating: zod.number(),
    category: zod.nativeEnum(skillCategoryEnum),
  })
  .strict();

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
    addPowerList: zod.optional(zod.array(zod.string())),
    optionalPowerList: zod.optional(zod.array(zod.string())),
    addQualityList: zod.optional(BonusGenericListSchema),
    addBiowareList: zod.optional(BonusGenericListSchema),
    complexFormList: zod.optional(BonusGenericListSchema),
    skills: CritterSkillListSchema,
    bonus: zod.optional(BonusSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type CritterType = zod.infer<typeof CritterSchema>;

export const CritterListSchema = zod.array(CritterSchema);
export type CritterListType = zod.infer<typeof CritterListSchema>;
