import {
  armourModCategoryEnum,
  capacityEnum,
  costEnum,
  mathOperatorEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  DamageReductionArmourSchema,
} from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import {
  CustomisedGearListSchema,
  CustomisedGearLoadedListSchema,
} from "../other/gearSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { type } from "arktype";

const InnerAvailabilityArmourModSchema = type({
  "+": "reject",
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
const AvailabilityArmourModSchema = type.or(
  InnerAvailabilityArmourModSchema,
  type({
    "+": "reject",
    ratingLinked: InnerAvailabilityArmourModSchema.array(),
  })
);
export type AvailabilityArmourModType =
  typeof AvailabilityArmourModSchema.infer;

const InnerCostArmourModSchema = type.or(
  "number",
  type({ "+": "reject", option: type.valueOf(costEnum) }),
  { operator: type.valueOf(mathOperatorEnum) }
);

export type RecursiveCostArmourModType = Array<
  | typeof InnerCostArmourModSchema.infer
  | { subnumbers: RecursiveCostArmourModType }
>;
export const { RecursiveCostArmourModSchema } = type.module({
  RecursiveCostArmourModSchema: [
    [
      InnerCostArmourModSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "RecursiveCostArmourModSchema",
      },
    ],
    "[]",
  ],
});
export const CostArmourModSchema = type.or(
  RecursiveCostArmourModSchema,
  type({ "+": "reject", ratingLinked: RecursiveCostArmourModSchema.array() })
);
export type CostArmourModType = typeof CostArmourModSchema.infer;

const InnerCapacityArmourModSchema = type.or(
  "number",
  type({ "+": "reject", option: type.valueOf(capacityEnum) }),
  { operator: type.valueOf(mathOperatorEnum) }
);

export type SingleCapacityArmourModType = Array<
  | typeof InnerCapacityArmourModSchema.infer
  | { subnumbers: SingleCapacityArmourModType }
>;
export const { SingleCapacityArmourModSchema } = type.module({
  SingleCapacityArmourModSchema: [
    [
      InnerCapacityArmourModSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "SingleCapacityArmourModSchema",
      },
    ],
    "[]",
  ],
});
export const CapacityArmourModSchema = type.or(
  SingleCapacityArmourModSchema,
  type({ "+": "reject", ratingLinked: SingleCapacityArmourModSchema })
);
export type CapacityArmourModType = typeof CapacityArmourModSchema.infer;

export const ArmourModSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(armourModCategoryEnum),
  maxRating: "number",
  damageReduction: DamageReductionArmourSchema,
  capacityCost: CapacityArmourModSchema,
  "includedGearList?": CustomisedGearListSchema,
  "bonus?": BonusSchema,
  "wirelessBonus?": BonusSchema,
  "userSelectable?": "false",
  "requirements?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
  availability: AvailabilityArmourModSchema,
  cost: CostArmourModSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type ArmourModType = typeof ArmourModSchema.infer;

export const ArmourModListSchema = type(ArmourModSchema.array());
export type ArmourModListType = typeof ArmourModListSchema.infer;

export const CustomisedArmourModSchema = type({
  "+": "reject",
  baseMod: "string",
  "gearList?": CustomisedGearListSchema,
  "rating?": "number",
});
export type CustomisedArmourModType = typeof CustomisedArmourModSchema.infer;

export const CustomisedArmourModListSchema = type(
  CustomisedArmourModSchema.array()
);
export type CustomisedArmourModListType =
  typeof CustomisedArmourModListSchema.infer;

export const CustomisedArmourModLoadedSchema = type({
  "+": "reject",
  baseMod: ArmourModSchema,
  "gearList?": CustomisedGearLoadedListSchema,
  "rating?": "number",
});
export type CustomisedArmourModLoadedType =
  typeof CustomisedArmourModLoadedSchema.infer;

export const CustomisedArmourModLoadedListSchema = type(
  CustomisedArmourModLoadedSchema.array()
);
export type CustomisedArmourModLoadedListType =
  typeof CustomisedArmourModLoadedListSchema.infer;
