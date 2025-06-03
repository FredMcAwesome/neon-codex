import {
  mathOperatorEnum,
  standardCalculationEnum,
} from "@neon-codex/common/build/enums.js";

import { BonusXmlWrappedSchema } from "../common/BonusParserSchemas.js";
import {
  StringArrayOrStringSchema,
  XmlPowerSchema,
  XmlQualityListSchema,
} from "../common/ParserCommonDefines.js";
import { type } from "arktype";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const XmlMovementSchema = type.or(
  // Formatted like: Ground/Water/Air speed
  "string",
  type({
    // Alt text is for shapeshifters (the orignal form speeds)
    _alt: "string",
    xmltext: "string",
  })
);
export type XmlMovementType = typeof XmlMovementSchema.infer;

const BaseMetatypeXmlSubBonusSchema = type({
  id: "string",
  name: "string",
  // Karma cost for point buy
  karma: "number",
  "halveattributepoints?": "''",
  // optional for metavariants only
  "category?": "string",
  // Body
  bodmin: "number",
  bodmax: "number",
  // Augmented maximum (bonus with cyberware https://www.reddit.com/r/Shadowrun/comments/deo0go/augmented_maximum_defined_in_5e/)
  bodaug: "number",
  // Agility
  agimin: "number",
  agimax: "number",
  agiaug: "number",
  // Reaction
  reamin: "number",
  reamax: "number",
  reaaug: "number",
  // Strength
  strmin: "number",
  strmax: "number",
  straug: "number",
  // Charisma
  chamin: "number",
  chamax: "number",
  chaaug: "number",
  // Intuition
  intmin: "number",
  intmax: "number",
  intaug: "number",
  // Logic
  logmin: "number",
  logmax: "number",
  logaug: "number",
  // Willpower
  wilmin: "number",
  wilmax: "number",
  wilaug: "number",
  // Initiative
  inimin: "number",
  inimax: "number",
  iniaug: "number",
  // Edge
  edgmin: "number",
  edgmax: "number",
  edgaug: "number",
  // Magic
  magmin: "number",
  magmax: "number",
  magaug: "number",
  // Resonance
  resmin: "number",
  resmax: "number",
  resaug: "number",
  // Depth
  depmin: "number",
  depmax: "number",
  depaug: "number",
  // Essence
  essmin: "number",
  essmax: "number",
  essaug: "number",
  // Additional initiative dice
  // Only used in metavariants (this should probably be moved into bonus tag)
  "initiativedice?": "number",
  // Doesn't have normal movement e.g. An AI program doesn't have a physical body
  "movement?": "'Special'",
  // Movement speeds
  // optional for metavariants only
  "walk?": XmlMovementSchema,
  "run?": XmlMovementSchema,
  "sprint?": XmlMovementSchema,
  // Add a natural weapon
  "addweapon?": StringArrayOrStringSchema,
  // Included powers
  "powers?": type({
    power: type.or(XmlPowerSchema, XmlPowerSchema.array()),
  }),

  // Included qualities
  "qualities?": XmlQualityListSchema,
  // Illegal qualities
  "qualityrestriction?": XmlQualityListSchema,
  source: "string",
  page: "number",
});
// Need to split up type/annotate schema to avoid TS7056 error
const BaseMetatypeXmlSchema = BaseMetatypeXmlSubBonusSchema.and(
  BonusXmlWrappedSchema
);
export type BaseMetatypeXmlType = typeof BaseMetatypeXmlSchema.infer;

export type MetatypeXmlType = BaseMetatypeXmlType & {
  metavariants?:
    | {
        metavariant: BaseMetatypeXmlType | Array<BaseMetatypeXmlType>;
      }
    | undefined;
};

export const MetatypeXmlSchema = BaseMetatypeXmlSchema.and({
  // metavariants of the base form
  "metavariants?": type({
    metavariant: type.or(BaseMetatypeXmlSchema, BaseMetatypeXmlSchema.array()),
  }),
});

export const MetatypeListXmlSchema = type(MetatypeXmlSchema.array());
