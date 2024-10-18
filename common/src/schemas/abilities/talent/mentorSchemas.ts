import { z as zod } from "zod";
import { mentorCategoryEnum, sourceBookEnum } from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

export const MentorBaseSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    advantage: zod.string(),
    disadvantage: zod.string(),
    bonus: zod.optional(BonusSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type MentorBaseType = zod.infer<typeof MentorBaseSchema>;

export const MentorChoiceSchema = zod
  .object({
    name: zod.string(),
    bonus: zod.optional(BonusSchema),
    set: zod.number(),
  })
  .strict();
export type MentorChoiceType = zod.infer<typeof MentorChoiceSchema>;

export const MentorSchema = zod.discriminatedUnion("category", [
  MentorBaseSchema.extend({
    category: zod.literal(mentorCategoryEnum.MentorSpirit),
    choices: zod.array(MentorChoiceSchema),
    choiceCount: zod.number(),
    required: zod.optional(RequirementsSchema),
  }).strict(),
  MentorBaseSchema.extend({
    category: zod.literal(mentorCategoryEnum.Paragon),
  }).strict(),
]);

export type MentorType = zod.infer<typeof MentorSchema>;
export const MentorListSchema = zod.array(MentorSchema);
export type MentorListType = zod.infer<typeof MentorListSchema>;
