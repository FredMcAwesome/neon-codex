import { z as zod } from "zod";
import {
  complexFormTargetEnum,
  durationEnum,
  sourceBookEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

const fadingValueSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.literal("Special"),
    })
    .strict(),
]);
export type fadingValueType = zod.infer<typeof fadingValueSchema>;

export const ComplexFormSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    target: zod.nativeEnum(complexFormTargetEnum),
    duration: zod.nativeEnum(durationEnum),
    fadingValue: fadingValueSchema,
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export type ComplexFormType = zod.infer<typeof ComplexFormSchema>;

export const ComplexFormListSchema = zod.array(ComplexFormSchema);
export type ComplexFormListType = zod.infer<typeof ComplexFormListSchema>;
