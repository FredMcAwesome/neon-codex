import { gearCategoryEnum } from "@neon-codex/common/build/enums.js";

import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { type } from "arktype";

const DrugXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Category of gear this is
  category: type.or(
    type.unit(gearCategoryEnum.Drugs),
    type.unit(gearCategoryEnum.Toxins)
  ),
  // Unused
  rating: "0",
  // Availability
  avail: StringOrNumberSchema,
  // Cost
  cost: "number",
  // How quickly drug takes effect
  "speed?": "number",
  // How the drug is administered (Contact, Injection, Ingestion, Inhalation)
  "vectors?": "string",
  // How long the effect lasts
  "duration?": StringOrNumberSchema,
  // Bonus applied by Drug
  "bonus?": BonusXmlSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type DrugXmlType = typeof DrugXmlSchema.infer;
export const DrugListXmlSchema = type(DrugXmlSchema.array());
export type DrugListXmlType = typeof DrugListXmlSchema.infer;
