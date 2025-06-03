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
import { type } from "arktype";

const AdeptPowerSubBonusXmlSchema = type({
  id: "string",
  name: "string",
  // Power Point Cost
  points: "number",
  levels: type.or("'True'", "'False'"),
  limit: "number",
  // Other powers that count to this power's limit
  "includeinlimit?": type({
    name: StringArrayOrStringSchema,
  }),
  "action?": type.valueOf(actionEnum),
  "adeptway?": "number",
  "adeptwayrequires?": type.or(
    type({
      required: RequiredXmlSchema,
    }),
    { magicianswayforbids: "''" }
  ),
  "doublecost?": "'False'",
  // Extra point cost for first level only
  "extrapointcost?": "number",
  "maxlevels?": "number",

  // Not selectable
  "hide?": "''",
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
type AdeptPowerSubBonusXmlType = typeof AdeptPowerSubBonusXmlSchema.infer;

// Need to split up type/annotate schema to avoid TS7056 error
export type AdeptPowerXmlType = AdeptPowerSubBonusXmlType & {
  bonus?: BonusXmlType | undefined;
  required?: RequiredXmlType | undefined;
  forbidden?: RequiredXmlType | undefined;
};
const AdeptPowerXmlSchema = AdeptPowerSubBonusXmlSchema.and({
  // Bonus (these are specific choices to select when adding when)
  // e.g. summoning spell chooses what you summon
  "bonus?": BonusXmlSchema,
  // Requirements e.g. type of spellcaster
  "required?": RequiredXmlSchema,
  "forbidden?": RequiredXmlSchema,
});
export const AdeptPowerListXmlSchema = type(AdeptPowerXmlSchema.array());
export type AdeptPowerListXmlType = typeof AdeptPowerListXmlSchema.infer;
