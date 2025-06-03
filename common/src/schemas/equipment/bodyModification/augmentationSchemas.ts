import {
  augmentationGradeEnum,
  augmentationLimitEnum,
  augmentationTypeEnum,
  availabilityEnum,
  biowareCategoryEnum,
  capacityEnum,
  costEnum,
  cyberwareCategoryEnum,
  gearCategoryEnum,
  limbSlotEnum,
  mathOperatorEnum,
  augmentationMountSlotEnum,
  ratingMeaningEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../../../enums.js";
import {
  AvailabilityRatingSchema,
  EssenceCostSchema,
  RatingSchema,
} from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import {
  CustomisedGearListSchema,
  type CustomisedGearListType,
} from "../other/gearSchemas.js";
import { type } from "arktype";

export const InnerAvailabilityAugmentationSchema = type({
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.or(
    type.unit(mathOperatorEnum.Add),
    type.unit(availabilityEnum.Gear)
  ),
});
export type InnerAvailabilityAugmentationType =
  typeof InnerAvailabilityAugmentationSchema.infer;

export const AvailabilityAugmentationSchema = type.or(
  { ratingLinked: InnerAvailabilityAugmentationSchema.array() },
  InnerAvailabilityAugmentationSchema
);
export type AvailabilityAugmentationType =
  typeof AvailabilityAugmentationSchema.infer;

const InnerCostAugmentationSchema = type.or(
  "number",
  type({
    option: type.valueOf(costEnum),
  }),
  { operator: type.valueOf(mathOperatorEnum) }
);

const { PartialCostAugmentationSchema } = type.module({
  PartialCostAugmentationSchema: [
    [
      InnerCostAugmentationSchema,
      "|",
      {
        subnumbers: "PartialCostAugmentationSchema",
      },
    ],
    "[]",
  ],
});

export const CostAugmentationSchema = type.or(
  PartialCostAugmentationSchema,
  { ratingLinked: PartialCostAugmentationSchema.array() },
  {
    range: {
      min: InnerCostAugmentationSchema,
      max: InnerCostAugmentationSchema,
    },
  }
);

export type CostAugmentationType = typeof CostAugmentationSchema.infer;

const InnerCapacityAugmentationSchema = type.or(
  "number",
  type({
    option: type.valueOf(capacityEnum),
  }),
  { operator: type.valueOf(mathOperatorEnum) }
);

export type SingleCapacityAugmentationType = Array<
  | typeof InnerCapacityAugmentationSchema.infer
  | { subnumbers: SingleCapacityAugmentationType }
>;
export const { SingleCapacityAugmentationSchema } = type.module({
  SingleCapacityAugmentationSchema: [
    [
      InnerCapacityAugmentationSchema,
      "|",
      {
        subnumbers: "SingleCapacityAugmentationSchema",
      },
    ],
    "[]",
  ],
});
export const CapacityAugmentationSchema = type.or(
  SingleCapacityAugmentationSchema,
  type({
    ratingLinked: SingleCapacityAugmentationSchema.array(),
  })
);
export type CapacityAugmentationType = typeof CapacityAugmentationSchema.infer;

export type CyberwareSubsystemsRecursiveType = {
  name: string;
  forced?: string | undefined;
  rating?: number | undefined;
  gearList?: CustomisedGearListType | undefined;
  subsystem?: AugmentationSubsystemListType | undefined;
};

export const { SubsystemListSchema, AugmentationSubsystemListSchema } =
  type.module({
    SubsystemListSchema: [
      {
        name: "string",
        "forced?": "string",
        "rating?": "number",
        "gearList?": CustomisedGearListSchema,
        "subsystem?": "AugmentationSubsystemListSchema",
      },
      "[]",
    ],
    AugmentationSubsystemListSchema: {
      "cyberwareList?": "SubsystemListSchema",
      "biowareList?": "SubsystemListSchema",
    },
  });

export type AugmentationSubsystemListType =
  typeof AugmentationSubsystemListSchema.infer;

const deviceRatingSchema = type({ option: "'Rating'" });
export type deviceRatingType = typeof deviceRatingSchema.infer;

const AugmentationLimitSchema = type.or(
  "number",
  type({
    option: type.valueOf(augmentationLimitEnum),
  })
);
export type AugmentationLimitType = typeof AugmentationLimitSchema.infer;

export const AugmentationPartialSchema = type({
  name: "string",
  description: "string",
  "wireless?": "string",
  "augmentationLimit?": AugmentationLimitSchema,
  "unavailableGrades?": type.valueOf(augmentationGradeEnum).array(),
  essenceCost: EssenceCostSchema,
  "modification?": "true",
  rating: RatingSchema,
  "ratingMeaning?": type.valueOf(ratingMeaningEnum),
  "addWeapon?": "string",
  "blockedMountList?": type.valueOf(augmentationMountSlotEnum).array(),
  "selectSide?": "true",
  "bonus?": BonusSchema,
  "pairBonus?": BonusSchema,
  "pairIncludeList?": "string[]",
  "requirements?": RequirementsSchema,
  "forbidden?": RequirementsSchema,
  "allowedGearList?": "string[]",
  "includedGearList?": CustomisedGearListSchema,
  "allowedGearCategories?": type.valueOf(gearCategoryEnum).array(),
  "userSelectable?": "false",
  "allowSubsystemCategoryList?": type(
    type.or(
      type.valueOf(cyberwareCategoryEnum),
      type.valueOf(biowareCategoryEnum)
    )
  ).array(),
  availability: AvailabilityAugmentationSchema,
  cost: CostAugmentationSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});

const CyberwareSchema = AugmentationPartialSchema.and({
  type: type.unit(augmentationTypeEnum.Cyberware),
  subtype: type.valueOf(cyberwareCategoryEnum),
  "programs?": "'Rating'",
  "capacity?": CapacityAugmentationSchema,
  "capacityCost?": CapacityAugmentationSchema,
  "addToParentCapacity?": "true",
  "addParentWeaponAccessory?": "true",
  "removalCost?": "number",
  "inheritAttributes?": "true",
  "limbSlot?": type.valueOf(limbSlotEnum),
  "useBothLimbSlots?": "true",
  "mountsLocation?": type.valueOf(augmentationMountSlotEnum),
  "modularMount?": "true",
  "wirelessBonus?": BonusSchema,
  "wirelessPairBonus?": BonusSchema,
  "wirelessPairInclude?": "string",
  "includedSubsystemList?": AugmentationSubsystemListSchema,
  "forceGrade?": type.valueOf(augmentationGradeEnum),
  "deviceRating?": deviceRatingSchema,
  "addVehicle?": "string",
  // wireless description
  "wireless?": "string",
});

const BiowareSchema = AugmentationPartialSchema.and({
  type: type.enumerated(augmentationTypeEnum.Bioware),
  subtype: type.valueOf(biowareCategoryEnum),
  "isGeneware?": "true",
});

export const AugmentationSchema = type.or(CyberwareSchema, BiowareSchema);

export type AugmentationType = typeof AugmentationSchema.infer;
export const AugmentationListSchema = type(AugmentationSchema.array());
export type AugmentationListType = typeof AugmentationListSchema.infer;

export const CustomisedAugmentationSchema = type({
  baseAugmentation: "string",
  // This overrides baseAugmentation included gear
  "gearList?": CustomisedGearListSchema,
  "rating?": "number",
  "customName?": "string",
  grade: type.valueOf(augmentationGradeEnum),
  "subsystemList?": AugmentationSubsystemListSchema,
});
export type CustomisedAugmentationType =
  typeof CustomisedAugmentationSchema.infer;
export const CustomisedAugmentationListSchema = type(
  CustomisedAugmentationSchema.array()
);
export type CustomisedAugmentationListType =
  typeof CustomisedAugmentationListSchema.infer;
