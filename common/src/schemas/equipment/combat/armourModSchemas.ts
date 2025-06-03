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
import { CustomisedGearListSchema } from "../other/gearSchemas.js";
import { type } from "arktype";

const InnerAvailabilityArmourModSchema = type({
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
const AvailabilityArmourModSchema = type.or(
  InnerAvailabilityArmourModSchema,
  type({ ratingLinked: InnerAvailabilityArmourModSchema.array() })
);
export type AvailabilityArmourModType =
  typeof AvailabilityArmourModSchema.infer;

const InnerCostArmourModSchema = type.or(
  "number",
  type({
    option: type.valueOf(costEnum),
  }),
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
        subnumbers: "RecursiveCostArmourModSchema",
      },
    ],
    "[]",
  ],
});
export const CostArmourModSchema = type.or(
  RecursiveCostArmourModSchema,
  type({ ratingLinked: RecursiveCostArmourModSchema.array() })
);
export type CostArmourModType = typeof CostArmourModSchema.infer;

const InnerCapacityArmourModSchema = type.or(
  "number",
  type({
    option: type.valueOf(capacityEnum),
  }),
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
        subnumbers: "SingleCapacityArmourModSchema",
      },
    ],
    "[]",
  ],
});
export const CapacityArmourModSchema = type.or(
  SingleCapacityArmourModSchema,
  type({
    ratingLinked: SingleCapacityArmourModSchema,
  })
);
export type CapacityArmourModType = typeof CapacityArmourModSchema.infer;

const HostArmourRequirementSchema = type({
  "requiredMod?": "string",
  "hostArmour?": "string",
});
export type HostArmourRequirementType =
  typeof HostArmourRequirementSchema.infer;

export const ArmourModSchema = type({
  name: "string",
  description: "string",
  category: type.valueOf(armourModCategoryEnum),
  maxRating: "number",
  damageReduction: DamageReductionArmourSchema,
  capacityCost: CapacityArmourModSchema,
  "hostArmourRequirements?": HostArmourRequirementSchema,
  "includedGearList?": CustomisedGearListSchema,
  "bonus?": BonusSchema,
  "wirelessBonus?": BonusSchema,
  "userSelectable?": "false",
  availability: AvailabilityArmourModSchema,
  cost: CostArmourModSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type ArmourModType = typeof ArmourModSchema.infer;

export const ArmourModListSchema = type(ArmourModSchema.array());
export type ArmourModListType = typeof ArmourModListSchema.infer;

export const CustomisedArmourModSchema = type({
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
