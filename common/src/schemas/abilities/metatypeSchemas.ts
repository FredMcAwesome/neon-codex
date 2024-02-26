import { z as zod } from "zod";
import {
  BonusQualityListSchema,
  BonusSchema,
  InitiativeSchema,
} from "../shared/bonusSchemas.js";
import { metatypeCategoryEnum } from "../../enums.js";

const AttributeRangeSchema = zod
  .object({
    min: zod.number(),
    max: zod.number(),
    augmentedMax: zod.number(),
  })
  .strict();
export type AttributeRangeType = zod.infer<typeof AttributeRangeSchema>;

const MovementEnvironmentSchema = zod
  .object({
    ground: zod.number(),
    water: zod.number(),
    air: zod.number(),
  })
  .strict();

const MovementStrideSchema = zod
  .object({
    walk: MovementEnvironmentSchema,
    run: MovementEnvironmentSchema,
    sprint: MovementEnvironmentSchema,
  })
  .strict();
export type MovementStrideType = zod.infer<typeof MovementStrideSchema>;

const BaseMetatypeSchema = zod
  .object({
    // id: zod.string(),
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(metatypeCategoryEnum),
    pointBuyKarmaCost: zod.number(),
    halveAttributePoints: zod.optional(zod.literal(true)),
    bodyAttributeRange: AttributeRangeSchema,
    agilityAttributeRange: AttributeRangeSchema,
    reactionAttributeRange: AttributeRangeSchema,
    strengthAttributeRange: AttributeRangeSchema,
    charismaAttributeRange: AttributeRangeSchema,
    intuitionAttributeRange: AttributeRangeSchema,
    logicAttributeRange: AttributeRangeSchema,
    willpowerAttributeRange: AttributeRangeSchema,
    initiativeAttributeRange: AttributeRangeSchema,
    edgeAttributeRange: AttributeRangeSchema,
    magicAttributeRange: AttributeRangeSchema,
    resonanceAttributeRange: AttributeRangeSchema,
    essenceAttributeRange: AttributeRangeSchema,
    depthAttributeRange: AttributeRangeSchema,
    initiative: zod.optional(InitiativeSchema),
    nonStandardMovement: zod.optional(zod.literal(true)),
    movement: zod.optional(MovementStrideSchema),
    addWeaponList: zod.optional(zod.array(zod.string())),
    addPowerList: zod.optional(zod.array(zod.string())),
    addQualityList: zod.optional(BonusQualityListSchema),
    forbiddenQualityList: zod.optional(BonusQualityListSchema),
    bonus: zod.optional(BonusSchema),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();
export type BaseMetatypeType = zod.infer<typeof BaseMetatypeSchema>;
export const MetatypeSchema = BaseMetatypeSchema.extend({
  metavariantList: zod.optional(zod.array(BaseMetatypeSchema)),
}).strict();
export type MetatypeType = zod.infer<typeof MetatypeSchema>;
export const MetatypeListSchema = zod.array(MetatypeSchema);
export type MetatypeListType = zod.infer<typeof MetatypeListSchema>;
