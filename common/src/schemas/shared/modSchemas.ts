import { z as zod } from "zod";

const GenericModSchema = zod
  .object({
    baseMod: zod.string(),
    rating: zod.optional(zod.number()),
  })
  .strict();

export const GenericModListSchema = zod.array(GenericModSchema);
export type GenericModListType = zod.infer<typeof GenericModListSchema>;
