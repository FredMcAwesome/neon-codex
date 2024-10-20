import { z as zod } from "zod";
import { BonusSchema } from "../shared/bonusSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";
import { sourceBookEnum } from "../../enums.js";

export const MartialArtSchema = zod
  .object({
    name: zod.string(),
    bonus: zod.optional(BonusSchema),
    techniqueList: zod.union([
      zod.array(zod.string()),
      zod
        .object({
          allTechniques: zod.literal(true),
        })
        .strict(),
    ]),
    karmaCost: zod.optional(zod.number()),
    requirements: zod.optional(RequirementsSchema),
    description: zod.string(),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export type MartialArtType = zod.infer<typeof MartialArtSchema>;
export const MartialArtListSchema = zod.array(MartialArtSchema);

export type MartialArtListType = zod.infer<typeof MartialArtListSchema>;

export const MartialArtTechniqueSchema = zod
  .object({
    name: zod.string(),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    description: zod.string(),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type MartialArtTechniqueType = zod.infer<
  typeof MartialArtTechniqueSchema
>;

export const MartialArtTechniqueListSchema = zod.array(
  MartialArtTechniqueSchema
);
export type MartialArtTechniqueListType = zod.infer<
  typeof MartialArtTechniqueListSchema
>;
