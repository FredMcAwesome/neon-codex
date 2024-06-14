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

export enum traditionXmlDrainAttributeEnum {
  WilCha = "{WIL} + {CHA}",
  WilInt = "{WIL} + {INT}",
  WilLog = "{WIL} + {LOG}",
  WilMag = "{WIL} + {MAG}",
  WilWil = "{WIL} + {WIL}",
}

const TraditionSubBonusXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Abilities used to resist drain e.g. {WIL} + {INT}
    drain: zod.union([
      zod.nativeEnum(traditionXmlDrainAttributeEnum),
      zod.literal(""),
    ]),
    // replace materialisation power with this power instead
    spiritform: zod.optional(
      zod.union([zod.literal("Possession"), zod.literal("Inhabitation")])
    ),

    limitspiritchoices: zod.optional(zod.literal("False")),
    // Other powers that count to this power's limit
    spirits: zod.union([
      zod.literal(""),
      zod
        .object({
          spiritcombat: zod.string(),
          spiritdetection: zod.string(),
          spirithealth: zod.string(),
          spiritillusion: zod.string(),
          spiritmanipulation: zod.string(),
        })
        .strict(),
    ]),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
type TraditionSubBonusXmlType = zod.infer<typeof TraditionSubBonusXmlSchema>;

// Need to split up type/annotate schema to avoid TS7056 error
export type TraditionXmlType = TraditionSubBonusXmlType & {
  bonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
};
const TraditionXmlSchema: zod.ZodSchema<TraditionXmlType> =
  TraditionSubBonusXmlSchema.extend({
    // Bonus (these are specific choices to select when adding when)
    // e.g. summoning spell chooses what you summon
    bonus: zod.optional(BonusXmlSchema),
    // Requirements e.g. type of spellcaster
    required: zod.optional(RequiredXmlSchema),
  });
export const TraditionListXmlSchema = zod.array(TraditionXmlSchema);
export type TraditionListXmlType = zod.infer<typeof TraditionListXmlSchema>;
