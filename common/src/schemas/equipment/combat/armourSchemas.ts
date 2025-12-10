import {
  restrictionEnum,
  mathOperatorEnum,
  costEnum,
  armourCategoryEnum,
  availabilityEnum,
  sourceBookEnum,
  armourModCategoryEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  DamageReductionArmourSchema,
  RangeCostSchema,
} from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { GenericModListSchema } from "../../shared/modSchemas.js";
import {
  CustomisedArmourModListSchema,
  CustomisedArmourModLoadedListSchema,
} from "./armourModSchemas.js";
import {
  CustomisedGearListSchema,
  CustomisedGearLoadedListSchema,
} from "../other/gearSchemas.js";
import { type } from "arktype";

export const AvailabilityArmourSchema = type({
  "+": "reject",
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
export type AvailabilityArmourType = typeof AvailabilityArmourSchema.infer;

const InnerCostArmourSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(costEnum),
  }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

const { PartialCostArmourSchema } = type.module({
  PartialCostArmourSchema: [
    [
      InnerCostArmourSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "PartialCostArmourSchema",
      },
    ],
    "[]",
  ],
});

export const CostArmourSchema = type.or(
  RangeCostSchema,
  PartialCostArmourSchema
);

export type CostArmourType = typeof CostArmourSchema.infer;

const CapacityArmourSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(availabilityEnum),
  })
);
export type CapacityArmourType = typeof CapacityArmourSchema.infer;

export const ArmourSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(armourCategoryEnum),
  "maxRating?": "number",
  damageReduction: DamageReductionArmourSchema,
  "customFitStackDamageReduction?": "number",
  capacity: CapacityArmourSchema,
  "isWeapon?": "true",
  "includedGearList?": CustomisedGearListSchema,
  "bonus?": BonusSchema,
  "wirelessBonus?": BonusSchema,
  "includedModList?": CustomisedArmourModListSchema,
  "allowModsFromCategory?": type.valueOf(armourModCategoryEnum),
  "addModFromCategory?": type.valueOf(armourModCategoryEnum),
  availability: AvailabilityArmourSchema,
  cost: CostArmourSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type ArmourType = typeof ArmourSchema.infer;

export const ArmourListSchema = type(ArmourSchema.array());
export type ArmourListType = typeof ArmourListSchema.infer;

export const CustomisedArmourSchema = type({
  "+": "reject",
  baseArmour: "string",
  // This overrides baseArmour modifications
  "modList?": CustomisedArmourModListSchema,
  // This overrides baseArmour gears
  "gearList?": CustomisedGearListSchema,
  "customName?": "string",
});
export type CustomisedArmourType = typeof CustomisedArmourSchema.infer;
export const CustomisedArmourListSchema = type(CustomisedArmourSchema.array());
export type CustomisedArmourListType = typeof CustomisedArmourListSchema.infer;

export const CustomisedArmourLoadedSchema = type({
  "+": "reject",
  baseArmour: ArmourSchema,
  // This overrides baseArmour modifications
  "modList?": CustomisedArmourModLoadedListSchema,
  // This overrides baseArmour gears
  "gearList?": CustomisedGearLoadedListSchema,
  "customName?": "string",
});
export type CustomisedArmourLoadedType =
  typeof CustomisedArmourLoadedSchema.infer;
export const CustomisedArmourLoadedListSchema = type(
  CustomisedArmourLoadedSchema.array()
);
export type CustomisedArmourLoadedListType =
  typeof CustomisedArmourLoadedListSchema.infer;
