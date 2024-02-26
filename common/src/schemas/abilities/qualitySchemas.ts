import { z as zod } from "zod";
import { qualityCategoryEnum, qualityLimitEnum } from "../../enums.js";
import { BonusSchema } from "../shared/bonusSchemas.js";
import { RequirementsSchema } from "../shared/requiredSchemas.js";

const QualityLimitSchema = zod.union([
  zod
    .object({
      option: zod.nativeEnum(qualityLimitEnum),
    })
    .strict(),
  zod.number(),
]);
export type QualityLimitType = zod.infer<typeof QualityLimitSchema>;

const QualityKarmaDiscountSchema = zod
  .object({
    requirements: RequirementsSchema,
    value: zod.number(),
  })
  .strict();
export type QualityKarmaDiscountType = zod.infer<
  typeof QualityKarmaDiscountSchema
>;

const QualityFirstLevelBonusSchema = zod.union([
  zod
    .object({
      // Increase to Notoriety level
      notoriety: zod.number(),
    })
    .strict(),
  zod
    .object({
      // prevents attribute maximum/s from being increased
      attributeMaxClamp: zod.array(zod.string()),
    })
    .strict(),
]);
export type QualityFirstLevelBonusType = zod.infer<
  typeof QualityFirstLevelBonusSchema
>;

export const QualitySchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(qualityCategoryEnum),
    karma: zod.number(),
    charGenOnly: zod.optional(zod.literal(true)),
    charGenLimit: zod.optional(zod.number()),
    charGenDoNotContributeToKarmaLimit: zod.optional(zod.literal(true)),
    charGenNoKarma: zod.optional(zod.literal(true)),
    chargenQualityOnly_NotSelectableIfPriorityChargen: zod.optional(
      zod.literal(true)
    ),
    careerOnly: zod.optional(zod.literal(true)),
    charGenCostInCareer: zod.optional(zod.literal(true)),
    limit: zod.optional(QualityLimitSchema),
    sharedLimitQualityList: zod.optional(zod.array(zod.string())),
    karmaDiscount: zod.optional(QualityKarmaDiscountSchema),
    noLevels: zod.optional(zod.literal(true)),
    firstLevelBonus: zod.optional(QualityFirstLevelBonusSchema),
    addWeapons: zod.optional(zod.array(zod.string())),
    isMetagenic: zod.optional(zod.literal(true)),
    canBuyWithSpellPoints: zod.optional(zod.literal(true)),
    userSelectable: zod.optional(zod.literal(false)),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();
export type QualityType = zod.infer<typeof QualitySchema>;
export const QualityListSchema = zod.array(QualitySchema);
export type QualityListType = zod.infer<typeof QualityListSchema>;
