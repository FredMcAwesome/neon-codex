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
    category: zod.union([
      zod.array(zod.nativeEnum(gearCategoryEnum)),
      zod.nativeEnum(gearCategoryEnum),
    ]),
    rating: zod.optional(StringOrNumberSchema),
    avail: StringOrNumberSchema,
    cost: StringOrNumberSchema,
    speed: zod.optional(zod.number()),
    vectors: zod.optional(zod.string()),
    duration: zod.optional(StringOrNumberSchema),
    bonus: zod.optional(BonusXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type DrugXmlType = zod.infer<typeof DrugXmlSchema>;
export const DrugListXmlSchema = zod.array(DrugXmlSchema);
export type DrugListXmlType = zod.infer<typeof DrugListXmlSchema>;
