import {
  attributeTypeEnum,
  costEnum,
  gearCategoryEnum,
  gearDeviceRatingEnum,
  gearRatingEnum,
  mathOperatorEnum,
  parentGearEnum,
  personaFormEnum,
  ratingMeaningEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../../../enums.js";
import {
  AmmoForWeaponTypeSchema,
  AvailabilityRatingSchema,
  RangeCostSchema,
} from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { WeaponBonusSchema } from "../../shared/weaponSharedSchemas.js";
import { type } from "arktype";

export const PartialAvailabilityGearSchema = type({
  "+": "reject",
  rating: AvailabilityRatingSchema,
  restriction: type.valueOf(restrictionEnum),
  "modifier?": type.unit(mathOperatorEnum.Add),
});
const AvailabilityGearSchema = type.or(
  PartialAvailabilityGearSchema,
  type({ "+": "reject", ratingLinked: PartialAvailabilityGearSchema.array() })
);
export type AvailabilityGearType = typeof AvailabilityGearSchema.infer;

const InnerCostGearSchema = type.or(
  "number",
  type({ "+": "reject", option: type.valueOf(costEnum) }),
  type({
    "+": "reject",
    operator: type.valueOf(mathOperatorEnum),
  })
);

export type RecursiveCostGearType = Array<
  typeof InnerCostGearSchema.infer | { subnumbers: RecursiveCostGearType }
>;
export const { RecursiveCostGearSchema } = type.module({
  RecursiveCostGearSchema: [
    [
      InnerCostGearSchema,
      "|",
      {
        "+": "reject",
        subnumbers: "RecursiveCostGearSchema ",
      },
    ],
    "[]",
  ],
});

export const CostGearSchema = type.or(
  RangeCostSchema,
  RecursiveCostGearSchema,
  type({
    "+": "reject",
    ratingLinked: RecursiveCostGearSchema.array(),
  })
);
export type CostGearType = typeof CostGearSchema.infer;

const GearDeviceRatingSchema = type.or(
  type({ "+": "reject", option: type.valueOf(gearDeviceRatingEnum) }),
  "number"
);
export type GearDeviceRatingType = typeof GearDeviceRatingSchema.infer;

const GearProgramSchema = type(
  type.or(
    "number",
    type({ "+": "reject", option: type.valueOf(parentGearEnum) }),
    type({
      "+": "reject",
      operator: type.valueOf(mathOperatorEnum),
    })
  )
).array();
export type GearProgramType = typeof GearProgramSchema.infer;

export const GearDeviceAttributeSchema = type.or(
  type({
    "+": "reject",
    option: type.or(
      type.valueOf(attributeTypeEnum),
      type.valueOf(parentGearEnum)
    ),
  }),
  "number"
);
export type GearDeviceAttributeType = typeof GearDeviceAttributeSchema.infer;

const GearCapacitySchema = type(
  type.or(
    type({ "+": "reject", option: type.valueOf(parentGearEnum) }),
    type({ "+": "reject", operator: type.valueOf(mathOperatorEnum) }),
    "number"
  )
).array();
const GearCapacityInformationSchema = type({
  "+": "reject",
  "capacity?": GearCapacitySchema,
  "capacityCost?": GearCapacitySchema,
});
export type GearCapacityInformationType =
  typeof GearCapacityInformationSchema.infer;

const GearRatingSchema = type.or(
  "number",
  type({
    "+": "reject",
    option: type.valueOf(gearRatingEnum),
  })
);
export type GearRatingType = typeof GearRatingSchema.infer;

const WeightSchema = type.or(
  type({
    "+": "reject",
    option: "'Rating'",
  }),
  "number"
);
export type WeightType = typeof WeightSchema.infer;

export const { CustomisedGearSchema, CustomisedGearListSchema } = type.module({
  CustomisedGearSchema: {
    "+": "reject",
    baseGear: "string",
    // optional as only sometimes required to identify the gear
    "category?": type.valueOf(gearCategoryEnum),
    "customName?": "string",
    "specificOption?": "string",
    "rating?": "number",
    "consumeCapacity?": "true",
    "currentQuantity?": "number",
    "innerGearList?": "CustomisedGearListSchema",
  },
  CustomisedGearListSchema: "CustomisedGearSchema[]",
});

export type CustomisedGearType = typeof CustomisedGearSchema.infer;
export type CustomisedGearListType = typeof CustomisedGearListSchema.infer;

export const GearSchema = type({
  "+": "reject",
  name: "string",
  description: "string",
  category: type.valueOf(gearCategoryEnum),
  "minRating?": GearRatingSchema,
  "maxRating?": GearRatingSchema,
  "ratingMeaning?": type.valueOf(ratingMeaningEnum),
  "includedWeapon?": type({
    "+": "reject",
    name: "string",
    "rating?": { option: type.valueOf(gearRatingEnum) },
  }),

  "allowCategoryList?": type.valueOf(gearCategoryEnum).array(),
  "purchaseQuantity?": "number",
  "bonus?": BonusSchema,
  "weaponBonus?": WeaponBonusSchema,
  "isFlechetteAmmo?": "true",
  "flechetteWeaponBonus?": WeaponBonusSchema,
  "ammoForWeaponType?": AmmoForWeaponTypeSchema.array(),
  "explosiveWeight?": WeightSchema,
  "userSelectable?": "false",
  "allowedGearList?": "string[]",
  "includedGearList?": CustomisedGearListSchema,
  "deviceRating?": GearDeviceRatingSchema,
  "programs?": GearProgramSchema,
  "attributeArray?": "number[]",
  "attack?": GearDeviceAttributeSchema,
  "sleaze?": GearDeviceAttributeSchema,
  "dataProcessing?": GearDeviceAttributeSchema,
  "firewall?": GearDeviceAttributeSchema,
  "canFormPersona?": type.valueOf(personaFormEnum),
  "capacityInformation?": GearCapacityInformationSchema,
  "armourCapacityInformation?": GearCapacityInformationSchema,
  "requirements?": RequirementsSchema,
  "requireParent?": "true",
  "forbidden?": RequirementsSchema,
  "modifyAttributeArray?": "number[]",
  "modifyAttack?": GearDeviceAttributeSchema,
  "modifySleaze?": GearDeviceAttributeSchema,
  "modifyDataProcessing?": GearDeviceAttributeSchema,
  "modifyFirewall?": GearDeviceAttributeSchema,
  "addMatrixBoxes?": "number",
  "renameCustomLabel?": "true",
  availability: AvailabilityGearSchema,
  cost: CostGearSchema,
  source: type.valueOf(sourceBookEnum),
  page: "number",
});
export type GearType = typeof GearSchema.infer;
export const GearListSchema = type(GearSchema.array());
export type GearListType = typeof GearListSchema.infer;

export const { CustomisedGearLoadedSchema, CustomisedGearLoadedListSchema } =
  type.module({
    CustomisedGearLoadedSchema: {
      "+": "reject",
      baseGear: GearSchema,
      // optional as only sometimes required to identify the gear
      "category?": type.valueOf(gearCategoryEnum),
      "customName?": "string",
      "specificOption?": "string",
      "rating?": "number",
      "consumeCapacity?": "true",
      "currentQuantity?": "number",
      "innerGearList?": "CustomisedGearLoadedListSchema",
    },
    CustomisedGearLoadedListSchema: "CustomisedGearLoadedSchema[]",
  });

export type CustomisedGearLoadedType = typeof CustomisedGearLoadedSchema.infer;
export type CustomisedGearLoadedListType =
  typeof CustomisedGearLoadedListSchema.infer;
