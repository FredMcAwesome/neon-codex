import { z as zod } from "zod";
import { ValueRangeSchema } from "./weaponSchemas.js";

export const CyberdeckAttributeArraySchema = zod.array(zod.number()).length(4);
export type CyberdeckAttributeArrayType = zod.infer<
  typeof CyberdeckAttributeArraySchema
>;

export const CapacitySchema = ValueRangeSchema;
export type CapacityType = zod.infer<typeof CapacitySchema>;
