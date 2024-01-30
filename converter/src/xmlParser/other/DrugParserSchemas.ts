import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";

const DrugXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Category of gear this is
    category: zod.union([
      zod.literal(gearCategoryEnum.Drugs),
      zod.literal(gearCategoryEnum.Toxins),
    ]),
    // Unused
    rating: zod.literal(0),
    // Availability
    avail: StringOrNumberSchema,
    // Cost
    cost: zod.number(),
    // How quickly drug takes effect
    speed: zod.optional(zod.number()),
    // How the drug is administered (Contact, Injection, Ingestion, Inhalation)
    vectors: zod.optional(zod.string()),
    // How long the effect lasts
    duration: zod.optional(StringOrNumberSchema),
    // Bonus applied by Drug
    bonus: zod.optional(BonusXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type DrugXmlType = zod.infer<typeof DrugXmlSchema>;
export const DrugListXmlSchema = zod.array(DrugXmlSchema);
export type DrugListXmlType = zod.infer<typeof DrugListXmlSchema>;
