// import { standardCalculationEnum } from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import {
  BonusXmlSchema,
  type BonusXmlType,
} from "../common/BonusParserSchemas.js";
import { SourceXmlSchema } from "../common/ParserCommonDefines.js";
import {
  RequiredXmlSchema,
  type RequiredXmlType,
} from "../common/RequiredParserSchemas.js";
import { StringArrayOrStringSchema } from "../common/ParserCommonDefines.js";
import { actionEnum } from "@neon-codex/common/build/enums.js";

const AdeptPowerSubBonusXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Power Point Cost
    points: zod.number(),
    levels: zod.union([zod.literal("True"), zod.literal("False")]),
    limit: zod.number(),
    // Other powers that count to this power's limit
    includeinlimit: zod.optional(
      zod
        .object({
          name: StringArrayOrStringSchema,
        })
        .strict()
    ),
    action: zod.optional(zod.nativeEnum(actionEnum)),
    adeptway: zod.optional(zod.number()),
    adeptwayrequires: zod.optional(
      zod.union([
        zod
          .object({
            required: RequiredXmlSchema,
          })
          .strict(),
        zod.object({ magicianswayforbids: zod.literal("") }).strict(),
      ])
    ),
    doublecost: zod.optional(zod.literal("False")),
    // Extra point cost for first level only
    extrapointcost: zod.optional(zod.number()),
    maxlevels: zod.optional(zod.number()),

    // Not selectable
    hide: zod.optional(zod.literal("")),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
type AdeptPowerSubBonusXmlType = zod.infer<typeof AdeptPowerSubBonusXmlSchema>;

// Need to split up type/annotate schema to avoid TS7056 error
export type AdeptPowerXmlType = AdeptPowerSubBonusXmlType & {
  bonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
  forbidden?: RequiredXmlType | undefined;
};
const AdeptPowerXmlSchema: zod.ZodSchema<AdeptPowerXmlType> =
  AdeptPowerSubBonusXmlSchema.extend({
    // Bonus (these are specific choices to select when adding when)
    // e.g. summoning spell chooses what you summon
    bonus: zod.optional(BonusXmlSchema),
    // Requirements e.g. type of spellcaster
    required: zod.optional(RequiredXmlSchema),
    forbidden: zod.optional(RequiredXmlSchema),
  });
export const AdeptPowerListXmlSchema = zod.array(AdeptPowerXmlSchema);
export type AdeptPowerListXmlType = zod.infer<typeof AdeptPowerListXmlSchema>;
