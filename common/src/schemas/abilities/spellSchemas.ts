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
} from "../../enums.js";
import { BonusSchema } from "../shared/bonusSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";

const spellDamageSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.literal("Special"),
    })
    .strict(),
]);
export type spellDamageType = zod.infer<typeof spellDamageSchema>;

const spellRangeSchema = zod
  .object({
    value: zod.nativeEnum(spellRangeEnum),
    target: zod.nativeEnum(spellTargetEnum),
  })
  .strict();
export type spellRangeType = zod.infer<typeof spellRangeSchema>;

export const SpellSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(spellCategoryEnum),
    type: zod.nativeEnum(spellTypeEnum),
    damageType: zod.nativeEnum(damageTypeEnum),
    descriptorList: zod.array(zod.nativeEnum(spellDescriptorEnum)),
    duration: zod.nativeEnum(durationEnum),
    damage: spellDamageSchema,
    range: spellRangeSchema,
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export type SpellType = zod.infer<typeof SpellSchema>;

export const SpellListSchema = zod.array(SpellSchema);
export type SpellListType = zod.infer<typeof SpellListSchema>;
