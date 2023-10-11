import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";

const BiowareXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    limit: zod.optional(
      zod.union([
        zod.literal("False"),
        zod.literal("{arm}"),
        zod.literal("{leg}"),
        zod.literal("{BODUnaug}"),
        zod.literal(1),
      ])
    ),
    category: StringArrayOrStringSchema,
    bannedgrades: zod.optional(
      zod
        .object({
          grade: zod.array(zod.string()),
        })
        .strict()
    ),
    ess: StringOrNumberSchema,
    addtoparentess: zod.optional(zod.literal("")),
    rating: zod.optional(StringOrNumberSchema),
    capacity: zod.optional(StringOrNumberSchema),
    avail: StringOrNumberSchema,
    cost: StringOrNumberSchema,
    addweapon: zod.optional(zod.string()),
    blocksmounts: zod.optional(zod.string()),
    selectside: zod.optional(zod.literal("")),
    bonus: zod.optional(BonusXmlSchema),
    required: zod.optional(RequiredXmlSchema),
    forbidden: zod.optional(RequiredXmlSchema),
    allowgear: zod.optional(
      zod
        .object({
          gearcategory: zod.array(zod.string()),
        })
        .strict()
    ),
    allowsubsystems: zod.optional(
      zod
        .object({
          category: StringArrayOrStringSchema,
        })
        .strict()
    ),
    notes: zod.optional(zod.string()),
    requireparent: zod.optional(zod.literal("")),
    pairbonus: zod.optional(
      zod
        .object({
          walkmultiplier: zod.optional(
            zod
              .object({
                val: zod.number(),
                category: zod.string(),
              })
              .strict()
          ),
          unarmedreach: zod.optional(zod.number()),
          unarmeddv: zod.optional(zod.number()),
          reach: zod.optional(
            zod
              .object({
                xmltext: zod.number(),
                _name: zod.string(),
              })
              .strict()
          ),
        })
        .strict()
    ),
    pairinclude: zod.optional(
      zod
        .object({
          name: zod.string(),
        })
        .strict()
    ),
    hide: zod.optional(zod.literal("")),
    forcegrade: zod.optional(zod.literal("None")),
    isgeneware: zod.optional(zod.literal("")),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type BiowareXmlType = zod.infer<typeof BiowareXmlSchema>;
export const BiowareListXmlSchema = zod.array(BiowareXmlSchema);
export type BiowareListXmlType = zod.infer<typeof BiowareListXmlSchema>;
