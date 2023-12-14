import { z as zod } from "zod";
import {
  damageTypeEnum,
  durationEnum,
  sourceBookEnum,
  spellCategoryEnum,
  spellDescriptorEnum,
  spellRangeEnum,
  spellTargetEnum,
  spellTypeEnum,
} from "../enums.js";
import { BonusSchema } from "./shared/bonusSchemas.js";
import { RequirementsSchema } from "./shared/requiredSchemas.js";

export const SpellSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(spellCategoryEnum),
    damageType: zod.nativeEnum(damageTypeEnum),
    descriptorList: zod.array(zod.nativeEnum(spellDescriptorEnum)),
    duration: zod.nativeEnum(durationEnum),
    damage: zod.union([
      zod.number(),
      zod
        .object({
          option: zod.literal("Special"),
        })
        .strict(),
    ]),
    range: zod
      .object({
        value: zod.nativeEnum(spellRangeEnum),
        target: zod.nativeEnum(spellTargetEnum),
      })
      .strict(),
    type: zod.nativeEnum(spellTypeEnum),
    bonus: zod.optional(BonusSchema),
    required: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export const SpellListSchema = zod.array(SpellSchema);
