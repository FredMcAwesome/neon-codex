import { z as zod } from "zod";
import {
  BonusGenericListSchema,
  BonusSchema,
  ForbiddenQualityListSchema,
  InitiativeSchema,
} from "../shared/bonusSchemas.js";
import { heritageCategoryEnum } from "../../enums.js";
import {
  AttributeRangeSchema,
  MovementStrideSchema,
} from "../shared/commonSchemas.js";

const IncludedPowerListSchema = zod.array(
  zod
    .object({
      name: zod.string(),
      selectText: zod.optional(zod.string()),
      rating: zod.optional(zod.number()),
    })
    .strict()
);
export type IncludedPowerListType = zod.infer<typeof IncludedPowerListSchema>;

const PartialHeritageSchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    pointBuyKarmaCost: zod.number(),
    halveAttributePoints: zod.optional(zod.literal(true)),
    bodyAttributeRange: AttributeRangeSchema,
    agilityAttributeRange: AttributeRangeSchema,
    reactionAttributeRange: AttributeRangeSchema,
    strengthAttributeRange: AttributeRangeSchema,
    charismaAttributeRange: AttributeRangeSchema,
    intuitionAttributeRange: AttributeRangeSchema,
    logicAttributeRange: AttributeRangeSchema,
    willpowerAttributeRange: AttributeRangeSchema,
    initiativeAttributeRange: AttributeRangeSchema,
    edgeAttributeRange: AttributeRangeSchema,
    magicAttributeRange: AttributeRangeSchema,
    resonanceAttributeRange: AttributeRangeSchema,
    essenceAttributeRange: AttributeRangeSchema,
    depthAttributeRange: AttributeRangeSchema,
    initiative: zod.optional(InitiativeSchema),
    nonStandardMovement: zod.optional(zod.literal(true)),
    movement: zod.optional(MovementStrideSchema),
    addWeaponList: zod.optional(zod.array(zod.string())),
    addPowerList: zod.optional(IncludedPowerListSchema),
    addQualityList: zod.optional(BonusGenericListSchema),
    forbiddenQualityList: zod.optional(ForbiddenQualityListSchema),
    bonus: zod.optional(BonusSchema),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();
const MetavariantSchema = PartialHeritageSchema.extend({
  category: zod.literal(heritageCategoryEnum.Metavariant),
  baseHeritage: zod.string(),
}).strict();
// Can't have a union as a key for a discriminated union so
// need to do this instead
const PartialBaseHeritageSchema = PartialHeritageSchema.extend({
  metavariantList: zod.optional(zod.array(zod.string())),
}).strict();
export const HeritageSchema = zod.discriminatedUnion("category", [
  PartialBaseHeritageSchema.extend({
    category: zod.literal(heritageCategoryEnum.Metahuman),
  }).strict(),
  PartialBaseHeritageSchema.extend({
    category: zod.literal(heritageCategoryEnum.Metasapient),
  }).strict(),
  PartialBaseHeritageSchema.extend({
    category: zod.literal(heritageCategoryEnum.Shapeshifter),
  }).strict(),
  MetavariantSchema,
]);
export type HeritageType = zod.infer<typeof HeritageSchema>;
export const HeritageListSchema = zod.array(HeritageSchema);
export type HeritageListType = zod.infer<typeof HeritageListSchema>;
