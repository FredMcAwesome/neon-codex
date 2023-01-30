import { z as zod } from "zod";
import {
  focusTypeEnum,
  formulaTypeEnum,
  magicalGearTypeEnum,
} from "../enums.js";
import { AvailabilitySchema, CostSchema } from "./commonSchema.js";

const typeInformation = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal(magicalGearTypeEnum.Focus),
    subtype: zod.nativeEnum(focusTypeEnum),
  }),
  zod.object({
    type: zod.literal(magicalGearTypeEnum.Formula),
    subtype: zod.nativeEnum(formulaTypeEnum),
  }),
  zod.object({
    type: zod.literal(magicalGearTypeEnum.Supply),
  }),
]);
export const MagicGearSchema = zod.object({
  typeInformation: typeInformation,
  name: zod.string(),
  availability: AvailabilitySchema,
  cost: CostSchema,
  description: zod.string(),
});
export type MagicGearType = zod.infer<typeof MagicGearSchema>;
