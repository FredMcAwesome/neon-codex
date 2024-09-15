import { z as zod } from "zod";
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

const ProgramRatingSchema = zod
  .object({
    maxRating: zod.number(),
    minRating: zod.number(),
  })
  .strict();
export type ProgramRatingType = zod.infer<typeof ProgramRatingSchema>;

export const AvailabilityProgramSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
  })
  .strict();
export type AvailabilityProgramType = zod.infer<
  typeof AvailabilityProgramSchema
>;

const InnerCostProgramSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);
type InnerCostProgramType = zod.infer<typeof InnerCostProgramSchema>;

type PartialCostProgramType = Array<
  InnerCostProgramType | { subnumbers: PartialCostProgramType }
>;

const PartialCostProgramSchema: zod.ZodType<PartialCostProgramType> = zod.array(
  zod.union([
    InnerCostProgramSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => PartialCostProgramSchema),
      })
      .strict(),
  ])
);

export const CostProgramSchema = zod.union([
  PartialCostProgramSchema,
  zod.object({ ratingLinked: zod.array(PartialCostProgramSchema) }).strict(),
]);

export type CostProgramType = zod.infer<typeof CostProgramSchema>;

export const ProgramSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(programCategoryEnum),
    rating: zod.optional(ProgramRatingSchema),
    availability: AvailabilityProgramSchema,
    cost: CostProgramSchema,
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type ProgramType = zod.infer<typeof ProgramSchema>;
export const ProgramListSchema = zod.array(ProgramSchema);
export type ProgramListType = zod.infer<typeof ProgramListSchema>;
