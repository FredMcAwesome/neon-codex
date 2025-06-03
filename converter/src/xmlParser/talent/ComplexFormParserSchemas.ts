// import { standardCalculationEnum } from "@neon-codex/common/build/enums.js";

import { type } from "arktype";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  SourceXmlSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { complexFormTargetEnum } from "@neon-codex/common/build/enums.js";

const ComplexFormXmlSchema = type({
  id: "string",
  name: "string",
  // Complex form target type
  target: type.valueOf(complexFormTargetEnum),
  // Duration complex forms lasts/casting time
  duration: XmlDurationSchema,
  // Fading value
  fv: "string",
  // Bonus (these are specific choices to select when adding when)
  // e.g. summoning spell chooses what you summon
  "bonus?": BonusXmlSchema,
  // Requirements e.g. type of spellcaster
  "required?": RequiredXmlSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
export type ComplexFormXmlType = typeof ComplexFormXmlSchema.infer;
export const ComplexFormListXmlSchema = type(ComplexFormXmlSchema.array());
export type ComplexFormListXmlType = typeof ComplexFormListXmlSchema.infer;
