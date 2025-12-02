import { type } from "arktype";
import {
  damageTypeEnum,
  durationEnum,
  sourceBookEnum,
  spellCategoryEnum,
  spellDescriptorEnum,
  spellTypeEnum,
} from "../../../enums.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { spellRangeSchema } from "../../shared/commonSchemas.js";

const spellDamageSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: "'Special'",
  })
);
export type spellDamageType = typeof spellDamageSchema.infer;

export const SpellSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(spellCategoryEnum),
  type: type.valueOf(spellTypeEnum),
  damageType: type.valueOf(damageTypeEnum),
  descriptorList: type.valueOf(spellDescriptorEnum).array(),
  duration: type.valueOf(durationEnum),
  damage: spellDamageSchema,
  range: spellRangeSchema,
  "bonus?": BonusSchema,
  "requirements?": RequirementsSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});

export type SpellType = typeof SpellSchema.infer;

export const SpellListSchema = type(SpellSchema.array());
export type SpellListType = typeof SpellListSchema.infer;
