import { z as zod } from "zod";
import {
  SourceXmlSchema,
  StringArrayOrStringSchema,
  StringOrNumberSchema,
} from "../ParserCommonDefines.js";

const GenericNameValueSchema = zod.object({
  name: zod.string(),
  val: zod.optional(StringOrNumberSchema),
  max: zod.optional(StringOrNumberSchema),
});

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
      zod.object({
        grade: zod.array(zod.string()),
      })
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
    bonus: zod.optional(
      zod.object({
        damageresistance: zod.optional(zod.string()),
        unarmeddv: zod.optional(zod.string()),
        unarmeddvphysical: zod.optional(zod.string()),
        specificattribute: zod.optional(
          zod.union([GenericNameValueSchema, zod.array(GenericNameValueSchema)])
        ),
      })
    ),
    forbidden: zod.optional(
      zod.object({
        oneof: zod.object({
          cyberware: zod.optional(StringArrayOrStringSchema),
          bioware: zod.optional(StringArrayOrStringSchema),
          quality: zod.optional(zod.string()),
        }),
      })
    ),
    allowgear: zod.optional(
      zod.object({
        gearcategory: zod.array(zod.string()),
      })
    ),
    allowsubsystems: zod.optional(
      zod.object({
        category: StringArrayOrStringSchema,
      })
    ),
    notes: zod.optional(zod.string()),
    requireparent: zod.optional(zod.literal("")),
    required: zod.optional(
      zod.object({
        oneof: zod.optional(
          zod.object({
            bioware: zod.optional(StringArrayOrStringSchema),
            metatype: zod.optional(zod.string()),
          })
        ),
        allof: zod.optional(
          zod.object({
            metatype: zod.string(),
          })
        ),
      })
    ),
    pairbonus: zod.optional(
      zod.object({
        walkmultiplier: zod.optional(
          zod.object({
            val: zod.number(),
            category: zod.string(),
          })
        ),
        unarmedreach: zod.optional(zod.number()),
      })
    ),
    pairinclude: zod.optional(
      zod.object({
        name: zod.string(),
      })
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
