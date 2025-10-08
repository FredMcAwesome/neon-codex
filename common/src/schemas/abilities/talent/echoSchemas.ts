import { type } from "arktype";
import { mentorCategoryEnum, sourceBookEnum } from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";

export const EchoSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.unit(mentorCategoryEnum.MentorSpirit),
  // TODO: match to limit
  "repeatable?": "true",
  "bonus?": BonusSchema,
  "userSelectable?": "false",
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type EchoType = typeof EchoSchema.infer;

export const EchoListSchema = type(EchoSchema.array());
export type EchoListType = typeof EchoListSchema.infer;
