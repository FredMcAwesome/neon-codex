// import { standardCalculationEnum } from "@neon-codex/common/build/enums.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { complexFormTargetEnum } from "@neon-codex/common/build/enums.js";

const ComplexFormXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Complex form target type
    target: zod.nativeEnum(complexFormTargetEnum),
    // Duration complex forms lasts/casting time
    duration: XmlDurationSchema,
    // Fading value
    fv: zod.string(),
    // Bonus (these are specific choices to select when adding when)
    // e.g. summoning spell chooses what you summon
    bonus: zod.optional(BonusXmlSchema),
    // Requirements e.g. type of spellcaster
    required: zod.optional(RequiredXmlSchema),
    source: zod.union([SourceXmlSchema, zod.literal(2050)]),
    page: zod.number(),
  })
  .strict();
export type ComplexFormXmlType = zod.infer<typeof ComplexFormXmlSchema>;
export const ComplexFormListXmlSchema = zod.array(ComplexFormXmlSchema);
export type ComplexFormListXmlType = zod.infer<typeof ComplexFormListXmlSchema>;
