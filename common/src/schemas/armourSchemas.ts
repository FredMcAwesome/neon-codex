import { z as zod } from "zod";
import {
  restrictionEnum,
  mathOperatorEnum,
  costArmourEnum,
  armourCategoryEnum,
  availabilityEnum,
  sourceBookEnum,
} from "../enums.js";
import { AvailabilityRatingSchema } from "./commonSchemas.js";
import { BonusSchema } from "./shared/bonusSchemas.js";
import { ModListSchema } from "./shared/modSchemas.js";
import { UseGearListSchema } from "./weaponSchemas.js";

export const AvailabilityArmourSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(zod.literal(mathOperatorEnum.Add)),
  })
  .strict();
export type AvailabilityArmourType = zod.infer<typeof AvailabilityArmourSchema>;

const InnerCostArmourSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costArmourEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

const RangeCostArmourSchema = zod
  .object({
    range: zod
      .object({
        min: zod.number(),
        max: zod.number(),
      })
      .strict(),
  })
  .strict();

export type CostArmourType = Array<
  | zod.infer<typeof InnerCostArmourSchema>
  | { subnumbers: CostArmourType }
  | zod.infer<typeof RangeCostArmourSchema>
>;
export const CostArmourSchema: zod.ZodType<CostArmourType> = zod.array(
  zod.union([
    InnerCostArmourSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => CostArmourSchema),
      })
      .strict(),
    RangeCostArmourSchema,
  ])
);

export const ArmourSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(armourCategoryEnum),
    maxRating: zod.optional(zod.number()),
    damageReduction: zod.union([
      zod.number(),
      zod.object({
        option: zod.nativeEnum(availabilityEnum),
      }),
    ]),
    customFitStackDamageReduction: zod.optional(zod.number()),
    capacity: zod.union([
      zod.number(),
      zod.object({
        option: zod.nativeEnum(availabilityEnum),
      }),
    ]),
    isWeapon: zod.optional(zod.literal(true)),
    availability: AvailabilityArmourSchema,
    cost: CostArmourSchema,
    includedGear: zod.optional(UseGearListSchema),
    bonus: zod.optional(BonusSchema),
    wirelessBonus: zod.optional(BonusSchema),
    mods: zod.optional(ModListSchema),
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export const ArmourListSchema = zod.array(ArmourSchema);
