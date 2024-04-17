import { z as zod } from "zod";
import {
  BonusQualityListSchema,
  BonusSchema,
  ForbiddenQualityListSchema,
  InitiativeSchema,
} from "../shared/bonusSchemas.js";
import { heritageCategoryEnum } from "../../enums.js";

export const AttributeRangeSchema = zod
  .object({
    min: zod.number(),
    max: zod.number(),
    augmentedMax: zod.number(),
  })
  .strict();
export type AttributeRangeType = zod.infer<typeof AttributeRangeSchema>;

const MovementEnvironmentSchema = zod
  .object({
    ground: zod.number(),
    water: zod.number(),
    air: zod.number(),
  })
  .strict();

const MovementStrideSchema = zod
  .object({
    walk: MovementEnvironmentSchema,
    run: MovementEnvironmentSchema,
    sprint: MovementEnvironmentSchema,
  })
  .strict();
export type MovementStrideType = zod.infer<typeof MovementStrideSchema>;

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
    addPowerList: zod.optional(zod.array(zod.string())),
    addQualityList: zod.optional(BonusQualityListSchema),
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
