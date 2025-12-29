// import { standardCalculationEnum } from "@neon-codex/common";

import { type } from "arktype";
import {
  BonusXmlSchema,
  type BonusXmlType,
} from "../common/BonusParserSchemas.js";
import { SourceXmlSchema } from "../common/ParserCommonDefines.js";
import {
  RequiredXmlSchema,
  type RequiredXmlType,
} from "../common/RequiredParserSchemas.js";
import { traditionSpiritFormEnum } from "@neon-codex/common";

export enum traditionXmlDrainAttributeEnum {
  WilCha = "{WIL} + {CHA}",
  WilInt = "{WIL} + {INT}",
  WilLog = "{WIL} + {LOG}",
  WilMag = "{WIL} + {MAG}",
  WilWil = "{WIL} + {WIL}",
}

const TraditionSubBonusXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Abilities used to resist drain e.g. {WIL} + {INT}
  // Traditions that have an empty Drain value will automatically
  // be permitted to choose their drain attribute.
  drain: type.or(type.valueOf(traditionXmlDrainAttributeEnum), "''"),
  // replace materialisation power with this power instead
  "spiritform?": type.valueOf(traditionSpiritFormEnum),

  "limitspiritchoices?": "'False'",
  // Other powers that count to this power's limit
  spirits: type.or(
    "''",
    type({
      "+": "reject",
      spiritcombat: "string",
      spiritdetection: "string",
      spirithealth: "string",
      spiritillusion: "string",
      spiritmanipulation: "string",
    })
  ),
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});

// Need to split up type/annotate schema to avoid TS7056 error
export type TraditionXmlType = typeof TraditionXmlSchema.infer;
const TraditionXmlSchema = TraditionSubBonusXmlSchema.merge({
  // Bonus (these are specific choices to select when adding when)
  // e.g. summoning spell chooses what you summon
  "bonus?": BonusXmlSchema,
  // Requirements e.g. type of spellcaster
  "required?": RequiredXmlSchema,
});
export const TraditionListXmlSchema = type(TraditionXmlSchema.array());
export type TraditionListXmlType = typeof TraditionListXmlSchema.infer;
