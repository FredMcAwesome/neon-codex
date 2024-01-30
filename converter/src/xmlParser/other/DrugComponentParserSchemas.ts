import {
  drugComponentCategoryEnum,
  limitCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import {
  attributeXMLEnum,
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";

const attributeValueSchema = zod
  .object({
    name: zod.nativeEnum(attributeXMLEnum),
    value: zod.number(),
  })
  .strict();
const limitCategoryValueSchema = zod
  .object({
    name: zod.nativeEnum(limitCategoryEnum),
    value: zod.number(),
  })
  .strict();

const QualitySchema = zod.union([
  zod
    .object({
      xmltext: zod.string(),
      _rating: zod.string(),
    })
    .strict(),
  zod.string(),
]);

const DrugEffectSchema = zod
  .object({
    // Different levels that can be applied (for Block)
    level: zod.optional(zod.number()),
    // List of attribute bonuses/penalties
    attribute: zod.optional(
      zod.union([attributeValueSchema, zod.array(attributeValueSchema)])
    ),
    // Damage on crash
    crashdamage: zod.optional(zod.number()),
    // How long the effect lasts
    duration: zod.optional(zod.number()),
    // Initiative Dice modification
    initiativedice: zod.optional(zod.number()),
    // Additional notes, need to include these
    // e.g. Additional crash effects, Vector change, etc.
    info: zod.optional(zod.string()),
    // Modifications to limits
    limit: zod.optional(
      zod.union([limitCategoryValueSchema, zod.array(limitCategoryValueSchema)])
    ),
    // Add Quality
    quality: zod.optional(QualitySchema),
    // How quickly the Drug takes effect
    speed: zod.optional(zod.number()),
  })
  .strict();

const DrugEffectXmlListSchema = zod.union([
  zod.object({ effect: DrugEffectSchema }).strict(),
  zod.object({ effect: zod.array(DrugEffectSchema) }).strict(),
]);
export type DrugEffectXmlListType = zod.infer<typeof DrugEffectXmlListSchema>;

const DrugComponentXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Drug Component Category
    category: zod.nativeEnum(drugComponentCategoryEnum),
    // Effects of component, by level for Block
    effects: zod.optional(DrugEffectXmlListSchema),
    // Availability
    availability: StringOrNumberSchema,
    // Cost
    cost: zod.number(),
    // Applicable only for Enhancer, how many times it can be applied
    limit: zod.optional(zod.number()),
    // Addiction Rating
    rating: zod.optional(zod.number()),
    // Addiction Threshold
    threshold: zod.optional(zod.number()),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type DrugComponentXmlType = zod.infer<typeof DrugComponentXmlSchema>;
export const DrugComponentListXmlSchema = zod.array(DrugComponentXmlSchema);
export type DrugComponentListXmlType = zod.infer<
  typeof DrugComponentListXmlSchema
>;
