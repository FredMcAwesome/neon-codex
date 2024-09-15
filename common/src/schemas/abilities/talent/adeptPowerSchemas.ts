import { z as zod } from "zod";
import { actionEnum, sourceBookEnum } from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";

export const AdeptPowerSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    pointCost: zod.number(),
    extraFirstLevelPointCost: zod.optional(zod.number()),
    levels: zod.boolean(),
    limit: zod.number(),
    sharedLimitAdeptPowerList: zod.optional(zod.array(zod.string())),
    action: zod.optional(zod.nativeEnum(actionEnum)),
    adeptWay: zod.optional(
      zod
        .object({
          pointCost: zod.number(),
          requirements: zod.optional(RequirementsSchema),
        })
        .strict()
    ),
    doubleCost: zod.optional(zod.literal(false)),
    maxLevels: zod.optional(zod.number()),
    userSelectable: zod.optional(zod.literal(false)),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();
export type AdeptPowerType = zod.infer<typeof AdeptPowerSchema>;

export const AdeptPowerListSchema = zod.array(AdeptPowerSchema);
export type AdeptPowerListType = zod.infer<typeof AdeptPowerListSchema>;
