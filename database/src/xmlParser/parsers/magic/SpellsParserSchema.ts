// import { standardCalculationEnum } from "@shadowrun/common/src/enums.js";
import { z as zod } from "zod";
import { attributeXMLEnum, SourceXmlSchema } from "../ParserCommonDefines.js";

const SpellXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    page: zod.number(),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    category: zod.string(),
    damage: zod.union([
      zod.literal("P"),
      zod.literal("S"),
      zod.literal(0),
      zod.literal("Special"),
    ]),
    descriptor: zod.optional(zod.string()),
    duration: zod.union([
      zod.literal("I"),
      zod.literal("S"),
      zod.literal("P"),
      zod.literal("Special"),
    ]),
    dv: zod.string(),
    range: zod.string(),
    type: zod.string(),
    bonus: zod.optional(
      zod.object({
        selecttext: zod.optional(zod.literal("")),
        selectattribute: zod.optional(
          zod.object({
            excludeattribute: zod.array(zod.nativeEnum(attributeXMLEnum)),
          })
        ),
      })
    ),
    required: zod.optional(
      zod.object({
        allof: zod.optional(
          zod.object({
            metamagicart: zod.optional(zod.string()),
            spell: zod.optional(zod.string()),
          })
        ),
        oneof: zod.optional(
          zod.object({
            quality: StringArrayOrStringSchema,
          })
        ),
      })
    ),
  })
  .strict();
export type SpellXmlType = zod.infer<typeof SpellXmlSchema>;
export const SpellListXmlSchema = zod.array(SpellXmlSchema);
export type SpellListXmlType = zod.infer<typeof SpellListXmlSchema>;
