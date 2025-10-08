import {
  drugComponentCategoryEnum,
  limitCategoryEnum,
} from "@neon-codex/common/build/enums.js";

import {
  attributeXMLEnum,
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { type } from "arktype";

const attributeValueSchema = type({
  "+": "reject",
  name: type.valueOf(attributeXMLEnum),
  value: "number",
});
const limitCategoryValueSchema = type({
  "+": "reject",
  name: type.valueOf(limitCategoryEnum),
  value: "number",
});
const QualitySchema = type.or(
  type({ "+": "reject", xmltext: "string", _rating: "string" }),
  "string"
);

const DrugEffectSchema = type({
  "+": "reject",
  // Different levels that can be applied (for Block)
  "level?": "number",
  // List of attribute bonuses/penalties
  "attribute?": type.or(attributeValueSchema, attributeValueSchema.array()),
  // Damage on crash
  "crashdamage?": "number",
  // How long the effect lasts
  "duration?": "number",
  // Initiative Dice modification
  "initiativedice?": "number",
  // Additional notes, need to include these
  // e.g. Additional crash effects, Vector change, etc.
  "info?": "string",
  // Modifications to limits
  "limit?": type.or(limitCategoryValueSchema, limitCategoryValueSchema.array()),
  // Add Quality
  "quality?": QualitySchema,
  // How quickly the Drug takes effect
  "speed?": "number",
});
const DrugEffectXmlListSchema = type({
  "+": "reject",
  effect: type.or(DrugEffectSchema, DrugEffectSchema.array()),
});
export type DrugEffectXmlListType = typeof DrugEffectXmlListSchema.infer;

const DrugComponentXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Drug Component Category
  category: type.valueOf(drugComponentCategoryEnum),
  // Effects of component, by level for Block
  "effects?": DrugEffectXmlListSchema,
  // Availability
  availability: StringOrNumberSchema,
  // Cost
  cost: "number",
  // Applicable only for Enhancer, how many times it can be applied
  "limit?": "number",
  // Addiction Rating
  "rating?": "number",
  // Addiction Threshold
  "threshold?": "number",
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type DrugComponentXmlType = typeof DrugComponentXmlSchema.infer;
export const DrugComponentListXmlSchema = type(DrugComponentXmlSchema.array());
export type DrugComponentListXmlType = typeof DrugComponentListXmlSchema;
