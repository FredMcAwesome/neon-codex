import { z as zod } from "zod";
import {
  sourceBookEnum,
  traditionDrainAttributeEnum,
  traditionSpiritFormEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

export const TraditionSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    drain: zod.nativeEnum(traditionDrainAttributeEnum),
    spiritForm: zod.optional(zod.nativeEnum(traditionSpiritFormEnum)),
    spiritTypes: zod.union([
      zod.literal("Select Spirits"),
      // All spirits that have the materialise power can be conjured
      zod.literal("All"),
      zod
        .object({
          spiritCombat: zod.string(),
          spiritDetection: zod.string(),
          spiritHealth: zod.string(),
          spiritIllusion: zod.string(),
          spiritManipulation: zod.string(),
        })
        .strict(),
    ]),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type TraditionType = zod.infer<typeof TraditionSchema>;

export const TraditionListSchema = zod.array(TraditionSchema);
export type TraditionListType = zod.infer<typeof TraditionListSchema>;
