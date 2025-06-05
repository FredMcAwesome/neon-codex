import { type } from "arktype";
import { sourceBookEnum } from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";

export const EchoSchema = type({
  name: "string",
  description: "string",
  "bonus?": BonusSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type EchoType = typeof EchoSchema.infer;

export const EchoListSchema = type(EchoSchema.array());
export type EchoListType = typeof EchoListSchema.infer;
