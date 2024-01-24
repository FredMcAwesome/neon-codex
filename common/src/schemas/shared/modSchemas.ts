import { z as zod } from "zod";

const GenericModSchema = zod
  .object({
    name: zod.string(),
    rating: zod.optional(zod.number()),
  })
  .strict();

export const GenericModListSchema = zod.array(GenericModSchema);
export type GenericModListType = zod.infer<typeof GenericModListSchema>;

export const GenericVehicleModListSchema = zod.array(
  GenericModSchema.extend({
    addCyberware: zod.optional(zod.string()),
    // display this like 'name (specificOption)'
    specificOption: zod.optional(zod.string()),
  }).strict()
);
export type GenericVehicleModListType = zod.infer<
  typeof GenericVehicleModListSchema
>;
