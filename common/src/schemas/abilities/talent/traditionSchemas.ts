import { type } from "arktype";
import {
  sourceBookEnum,
  traditionDrainAttributeEnum,
  traditionSpiritFormEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

export const TraditionSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  drain: type.valueOf(traditionDrainAttributeEnum),
  "spiritForm?": type.valueOf(traditionSpiritFormEnum),
  spiritTypes: type.or(
    "'Select Spirits'",
    // All spirits that have the materialise power can be conjured
    "'All'",
    type({
      "+": "reject",
      spiritCombat: "string",
      spiritDetection: "string",
      spiritHealth: "string",
      spiritIllusion: "string",
      spiritManipulation: "string",
    })
  ),
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type TraditionType = typeof TraditionSchema.infer;

export const TraditionListSchema = type(TraditionSchema.array());
export type TraditionListType = typeof TraditionListSchema.infer;
