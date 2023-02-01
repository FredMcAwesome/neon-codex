import { z as zod } from "zod";
import {
  focusTypeEnum,
  formulaTypeEnum,
  magicalGearTypeEnum,
} from "../enums.js";
import { AvailabilitySchema, CostSchema } from "./commonSchema.js";

export const MagicGearSchema = zod.object({
  type: zod.nativeEnum(magicalGearTypeEnum),
  subtype: zod.optional(
    zod.union([zod.nativeEnum(focusTypeEnum), zod.nativeEnum(formulaTypeEnum)])
  ),
  name: zod.string(),
  availability: AvailabilitySchema,
  cost: CostSchema,
  description: zod.string(),
});
export type MagicGearType = zod.infer<typeof MagicGearSchema>;
