import { BonusSchema } from "../shared/bonusSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";
import { sourceBookEnum } from "../../enums.js";
import { type } from "arktype";

export const MartialArtSchema = type({
  "+": "reject",
  name: "string",
  "bonus?": BonusSchema,
  techniqueList: type.or(
    "string[]",
    type({
      "+": "reject",
      allTechniques: "true",
    })
  ),
  "karmaCost?": "number",
  "requirements?": RequirementsSchema,
  description: "string",
  source: type.valueOf(sourceBookEnum),
  page: "number",
});

export type MartialArtType = typeof MartialArtSchema.infer;
export const MartialArtListSchema = type(MartialArtSchema.array());

export type MartialArtListType = typeof MartialArtListSchema.infer;

export const MartialArtTechniqueSchema = type({
  "+": "reject",
  name: "string",
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  description: "string",
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type MartialArtTechniqueType = typeof MartialArtTechniqueSchema.infer;

export const MartialArtTechniqueListSchema = type(
  MartialArtTechniqueSchema.array()
);
export type MartialArtTechniqueListType =
  typeof MartialArtTechniqueListSchema.infer;
