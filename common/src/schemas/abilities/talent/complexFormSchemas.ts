import { type } from "arktype";
import {
  complexFormTargetEnum,
  durationEnum,
  sourceBookEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

const fadingValueSchema = type.or("number", {
  option: "'Special'",
});
export type fadingValueType = typeof fadingValueSchema.infer;

export const ComplexFormSchema = type({
  name: "string",
  description: "string",
  target: type.valueOf(complexFormTargetEnum),
  duration: type.valueOf(durationEnum),
  fadingValue: fadingValueSchema,
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});

export type ComplexFormType = typeof ComplexFormSchema.infer;

export const ComplexFormListSchema = type(ComplexFormSchema.array());
export type ComplexFormListType = typeof ComplexFormListSchema.infer;
