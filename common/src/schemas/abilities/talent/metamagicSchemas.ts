import { type } from "arktype";
import { mentorCategoryEnum, sourceBookEnum } from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

export const MetamagicSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(mentorCategoryEnum),
  adept: "boolean",
  magician: "boolean",
  "repeatable?": "true",
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type MetamagicType = typeof MetamagicSchema.infer;

export const MetamagicListSchema = type(MetamagicSchema.array());
export type MetamagicListType = typeof MetamagicListSchema.infer;
