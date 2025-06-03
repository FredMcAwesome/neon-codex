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
import { type } from "arktype";

const IncludedPowerListSchema = type({
  name: "string",
  "selectText?": "string",
  "rating?": "number",
}).array();
export type IncludedPowerListType = typeof IncludedPowerListSchema.infer;

const PartialHeritageSchema = type({
  // id: "string",
  name: "string",
  description: "string",
  pointBuyKarmaCost: "number",
  "halveAttributePoints?": "true",
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
  "initiative?": InitiativeSchema,
  "nonStandardMovement?": "true",
  "movement?": MovementStrideSchema,
  "addWeaponList?": "string[]",
  "addPowerList?": IncludedPowerListSchema,
  "addQualityList?": BonusGenericListSchema,
  "forbiddenQualityList?": ForbiddenQualityListSchema,
  "bonus?": BonusSchema,
  source: "string",
  page: "number",
});
const MetavariantSchema = PartialHeritageSchema.and({
  category: type.unit(heritageCategoryEnum.Metavariant),
  baseHeritage: "string",
});
// Can't have a union as a key for a discriminated union so
// need to do this instead
const PartialBaseHeritageSchema = PartialHeritageSchema.and({
  "metavariantList?": "string[]",
});
export const HeritageSchema = type.or(
  PartialBaseHeritageSchema.and({
    category: type.unit(heritageCategoryEnum.Metahuman),
  }),
  PartialBaseHeritageSchema.and({
    category: type.unit(heritageCategoryEnum.Metasapient),
  }),
  PartialBaseHeritageSchema.and({
    category: type.unit(heritageCategoryEnum.Shapeshifter),
  }),
  MetavariantSchema
);
export type HeritageType = typeof HeritageSchema.infer;
export const HeritageListSchema = type(HeritageSchema.array());
export type HeritageListType = typeof HeritageListSchema.infer;
