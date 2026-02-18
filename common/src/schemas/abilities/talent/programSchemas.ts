import {
  costEnum,
  mathOperatorEnum,
  programCategoryEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { AvailabilityRatingSchema } from "../../shared/commonSchemas.js";
import { type } from "arktype";

const ProgramRatingSchema = type({
  "+": "reject",
  maxRating: "number",
  minRating: "number",
});
export type ProgramRatingType = typeof ProgramRatingSchema.infer;

export const AvailabilityProgramSchema = type({
  "+": "reject",
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
});
export type AvailabilityProgramType = typeof AvailabilityProgramSchema.infer;

const InnerCostProgramSchema = type.or(
  "number",
  type({ "+": "reject", option: type.valueOf(costEnum) }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

const { PartialCostProgramSchema } = type.module({
  PartialCostProgramSchema: [
    [
      InnerCostProgramSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "PartialCostProgramSchema",
      },
    ],
    "[]",
  ],
});

export const CostProgramSchema = type.or(
  PartialCostProgramSchema,
  type({
    "+": "reject",
    ratingLinked: PartialCostProgramSchema.array(),
  })
);

export type CostProgramType = typeof CostProgramSchema.infer;

export const ProgramSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(programCategoryEnum),
  "rating?": ProgramRatingSchema,
  availability: AvailabilityProgramSchema,
  cost: CostProgramSchema,
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type ProgramType = typeof ProgramSchema.infer;
export const ProgramListSchema = type(ProgramSchema.array());
export type ProgramListType = typeof ProgramListSchema.infer;
