// import { standardCalculationEnum } from "@shadowrun/common/build/enums.js";
import { z as zod } from "zod";
import {
  attributeXMLEnum,
  SourceXmlSchema,
  StringArrayOrStringSchema,
} from "../common/ParserCommonDefines.js";

const SpiritSchema = zod
  .object({
    spirit: StringArrayOrStringSchema,
    addtoselected: zod.optional(
      zod.union([zod.literal("False"), zod.literal("True")])
    ),
  })
  .strict();

const RequiredSubtypeSchema = zod
  .object({
    quality: zod.optional(StringArrayOrStringSchema),
    group: zod.optional(
      zod
        .object({
          initiategrade: zod.number(),
          tradition: zod.string(),
        })
        .strict()
    ),
    metamagic: zod.optional(zod.string()),
    metamagicart: zod.optional(zod.string()),
    spell: zod.optional(zod.string()),
    art: zod.optional(zod.string()),
  })
  .strict();

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
      zod
        .object({
          selecttext: zod.optional(zod.literal("")),
          selectattribute: zod.optional(
            zod
              .object({
                excludeattribute: zod.array(zod.nativeEnum(attributeXMLEnum)),
              })
              .strict()
          ),
          addspirit: zod.optional(
            zod.union([zod.array(SpiritSchema), SpiritSchema])
          ),
        })
        .strict()
    ),
    required: zod.optional(
      zod
        .object({
          allof: zod.optional(RequiredSubtypeSchema),
          oneof: zod.optional(RequiredSubtypeSchema),
        })
        .strict()
    ),
  })
  .strict();
export type SpellXmlType = zod.infer<typeof SpellXmlSchema>;
export const SpellListXmlSchema = zod.array(SpellXmlSchema);
export type SpellListXmlType = zod.infer<typeof SpellListXmlSchema>;
