import { z as zod } from "zod";

export const ModListSchema = zod.array(
  zod.union([
    zod
      .object({
        additionalSlots: zod.number(),
      })
      .strict(),
    zod
      .object({
        name: zod.string(),
        // display this like 'name (specificOption)'
        specificOption: zod.optional(zod.string()),
        rating: zod.optional(zod.number()),
        cost: zod.optional(zod.number()),
        addCyberware: zod.optional(zod.string()),
      })
      .strict(),
  ])
);
export type ModListType = zod.infer<typeof ModListSchema>;
