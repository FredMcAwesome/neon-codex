import { type } from "arktype";
import { mentorCategoryEnum, sourceBookEnum } from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

export const MentorBaseSchema = type({
  name: "string",
  description: "string",
  advantage: "string",
  disadvantage: "string",
  "bonus?": BonusSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type MentorBaseType = typeof MentorBaseSchema.infer;

export const MentorChoiceSchema = type({
  name: "string",
  "bonus?": BonusSchema,
  set: "number",
});
export type MentorChoiceType = typeof MentorChoiceSchema.infer;

export const MentorSchema = type.or(
  MentorBaseSchema.and({
    category: type.unit(mentorCategoryEnum.MentorSpirit),
    choices: MentorChoiceSchema.array(),
    choiceCount: "number",
    "required?": RequirementsSchema,
  }),
  MentorBaseSchema.and({
    category: type.unit(mentorCategoryEnum.Paragon),
  })
);

export type MentorType = typeof MentorSchema.infer;
export const MentorListSchema = type(MentorSchema.array());
export type MentorListType = typeof MentorListSchema.infer;
