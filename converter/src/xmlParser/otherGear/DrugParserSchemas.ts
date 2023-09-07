import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import {
  BonusXmlSchema,
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../ParserCommonDefines.js";

const DrugXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.union([
      zod.array(zod.nativeEnum(gearCategoryEnum)),
      zod.nativeEnum(gearCategoryEnum),
    ]),
    rating: zod.optional(StringOrNumberSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
    avail: StringOrNumberSchema,
    cost: StringOrNumberSchema,
    speed: zod.optional(zod.number()),
    vectors: zod.optional(zod.string()),
    duration: zod.optional(StringOrNumberSchema),
    bonus: zod.optional(BonusXmlSchema),
  })
  .strict();
export type DrugXmlType = zod.infer<typeof DrugXmlSchema>;
export const DrugListXmlSchema = zod.array(DrugXmlSchema);
export type DrugListXmlType = zod.infer<typeof DrugListXmlSchema>;
