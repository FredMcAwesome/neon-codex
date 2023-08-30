import { gearCategoryEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../ParserCommonDefines.js";

const GenericNameValueSchema = zod
  .object({
    name: zod.string(),
    value: zod.number(),
  })
  .strict();

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
    bonus: zod.optional(
      zod
        .object({
          attribute: zod.union([
            zod.array(GenericNameValueSchema),
            GenericNameValueSchema,
          ]),
          limit: zod.optional(
            zod.union([
              zod.array(GenericNameValueSchema),
              GenericNameValueSchema,
            ])
          ),
          quality: zod.optional(
            zod
              .object({
                xmltext: zod.string(),
                _rating: zod.string(),
              })
              .strict()
          ),
          initiativedice: zod.optional(zod.number()),
        })
        .strict()
    ),
  })
  .strict();
export type DrugXmlType = zod.infer<typeof DrugXmlSchema>;
export const DrugListXmlSchema = zod.array(DrugXmlSchema);
export type DrugListXmlType = zod.infer<typeof DrugListXmlSchema>;
