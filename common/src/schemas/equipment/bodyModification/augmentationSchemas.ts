import { z as zod } from "zod";
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
  UseGearListSchema,
} from "../../shared/commonSchemas.js";
import type { UseGearListType } from "../../shared/commonSchemas.js";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { GearListSchema } from "../other/gearSchemas.js";

export const InnerAvailabilityAugmentationSchema = zod
  .object({
    rating: AvailabilityRatingSchema,
    restriction: zod.nativeEnum(restrictionEnum),
    modifier: zod.optional(
      zod.union([
        zod.literal(mathOperatorEnum.Add),
        zod.literal(availabilityEnum.Gear),
      ])
    ),
  })
  .strict();
export type InnerAvailabilityAugmentationType = zod.infer<
  typeof InnerAvailabilityAugmentationSchema
>;

export const AvailabilityAugmentationSchema = zod.union([
  zod
    .object({ ratingLinked: zod.array(InnerAvailabilityAugmentationSchema) })
    .strict(),
  InnerAvailabilityAugmentationSchema,
]);
export type AvailabilityAugmentationType = zod.infer<
  typeof AvailabilityAugmentationSchema
>;

const InnerCostAugmentationSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(costEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);
type InnerCostAugmentationType = zod.infer<typeof InnerCostAugmentationSchema>;

type PartialCostAugmentationType = Array<
  InnerCostAugmentationType | { subnumbers: PartialCostAugmentationType }
>;

const PartialCostAugmentationSchema: zod.ZodType<PartialCostAugmentationType> =
  zod.array(
    zod.union([
      InnerCostAugmentationSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => PartialCostAugmentationSchema),
        })
        .strict(),
    ])
  );

export const CostAugmentationSchema = zod.union([
  PartialCostAugmentationSchema,
  zod
    .object({ ratingLinked: zod.array(PartialCostAugmentationSchema) })
    .strict(),
  zod
    .object({
      range: zod
        .object({
          min: InnerCostAugmentationSchema,
          max: InnerCostAugmentationSchema,
        })
        .strict(),
    })
    .strict(),
]);

export type CostAugmentationType = zod.infer<typeof CostAugmentationSchema>;

const InnerCapacityAugmentationSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(capacityEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type SingleCapacityAugmentationType = Array<
  | zod.infer<typeof InnerCapacityAugmentationSchema>
  | { subnumbers: SingleCapacityAugmentationType }
>;
export const SingleCapacityAugmentationSchema: zod.ZodType<SingleCapacityAugmentationType> =
  zod.array(
    zod.union([
      InnerCapacityAugmentationSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => SingleCapacityAugmentationSchema),
        })
        .strict(),
    ])
  );
export const CapacityAugmentationSchema = zod.union([
  SingleCapacityAugmentationSchema,
  zod
    .object({
      ratingLinked: zod.array(SingleCapacityAugmentationSchema),
    })
    .strict(),
]);
export type CapacityAugmentationType = zod.infer<
  typeof CapacityAugmentationSchema
>;

export type CyberwareSubsystemsRecursiveType = {
  name: string;
  forced?: string | undefined;
  rating?: number | undefined;
  gears?: UseGearListType | undefined;
  subsystem?: AugmentationSubsystemListType | undefined;
};

const SubsystemListSchema: zod.ZodType<
  Array<CyberwareSubsystemsRecursiveType>
> = zod.array(
  zod
    .object({
      name: zod.string(),
      forced: zod.optional(zod.string()),
      rating: zod.optional(zod.number()),
      gears: zod.optional(UseGearListSchema),
      subsystem: zod.optional(zod.lazy(() => AugmentationSubsystemListSchema)),
    })
    .strict()
);

export const AugmentationSubsystemListSchema = zod
  .object({
    cyberwareList: zod.optional(SubsystemListSchema),
    biowareList: zod.optional(SubsystemListSchema),
  })
  .strict();
export type AugmentationSubsystemListType = zod.infer<
  typeof AugmentationSubsystemListSchema
>;

const deviceRatingSchema = zod
  .object({ option: zod.literal("Rating") })
  .strict();
export type deviceRatingType = zod.infer<typeof deviceRatingSchema>;

const AugmentationLimitSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(augmentationLimitEnum),
    })
    .strict(),
]);
export type AugmentationLimitType = zod.infer<typeof AugmentationLimitSchema>;

export const AugmentationPartialSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    wireless: zod.optional(zod.string()),
    augmentationLimit: zod.optional(AugmentationLimitSchema),
    unavailableGrades: zod.optional(
      zod.array(zod.nativeEnum(augmentationGradeEnum))
    ),
    essenceCost: EssenceCostSchema,
    modification: zod.optional(zod.literal(true)),
    rating: RatingSchema,
    ratingMeaning: zod.optional(zod.nativeEnum(ratingMeaningEnum)),
    addWeapon: zod.optional(zod.string()),
    blockedMountList: zod.optional(
      zod.array(zod.nativeEnum(augmentationMountSlotEnum))
    ),
    selectSide: zod.optional(zod.literal(true)),
    bonus: zod.optional(BonusSchema),
    pairBonus: zod.optional(BonusSchema),
    pairIncludeList: zod.optional(zod.array(zod.string())),
    requirements: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
    allowedGearList: zod.optional(zod.array(zod.string())),
    includedGearList: zod.optional(UseGearListSchema),
    allowedGearCategories: zod.optional(
      zod.array(zod.nativeEnum(gearCategoryEnum))
    ),
    userSelectable: zod.optional(zod.literal(false)),
    allowCategoryList: zod.optional(
      zod.array(
        zod.union([
          zod.nativeEnum(cyberwareCategoryEnum),
          zod.nativeEnum(biowareCategoryEnum),
        ])
      )
    ),
    availability: AvailabilityAugmentationSchema,
    cost: CostAugmentationSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

const CyberwareSchema = AugmentationPartialSchema.extend({
  type: zod.literal(augmentationTypeEnum.Cyberware),
  subtype: zod.nativeEnum(cyberwareCategoryEnum),
  programs: zod.optional(zod.literal("Rating")),
  capacity: zod.optional(CapacityAugmentationSchema),
  capacityCost: zod.optional(CapacityAugmentationSchema),
  addToParentCapacity: zod.optional(zod.literal(true)),
  addParentWeaponAccessory: zod.optional(zod.literal(true)),
  removalCost: zod.optional(zod.number()),
  inheritAttributes: zod.optional(zod.literal(true)),
  limbSlot: zod.optional(zod.nativeEnum(limbSlotEnum)),
  useBothLimbSlots: zod.optional(zod.literal(true)),
  mountsLocation: zod.optional(zod.nativeEnum(augmentationMountSlotEnum)),
  modularMount: zod.optional(zod.literal(true)),
  wirelessBonus: zod.optional(BonusSchema),
  wirelessPairBonus: zod.optional(BonusSchema),
  wirelessPairInclude: zod.optional(zod.string()),
  subsystemList: zod.optional(AugmentationSubsystemListSchema),
  forceGrade: zod.optional(zod.nativeEnum(augmentationGradeEnum)),
  deviceRating: zod.optional(deviceRatingSchema),
  addVehicle: zod.optional(zod.string()),
  // wireless description
  wireless: zod.optional(zod.string()),
}).strict();

const BiowareSchema = AugmentationPartialSchema.extend({
  type: zod.literal(augmentationTypeEnum.Bioware),
  subtype: zod.nativeEnum(biowareCategoryEnum),
  isGeneware: zod.optional(zod.literal(true)),
}).strict();

export const AugmentationSchema = zod.discriminatedUnion("type", [
  CyberwareSchema,
  BiowareSchema,
]);

export type AugmentationType = zod.infer<typeof AugmentationSchema>;
export const AugmentationListSchema = zod.array(AugmentationSchema);
export type AugmentationListType = zod.infer<typeof AugmentationListSchema>;

export const CustomisedAugmentationSchema = zod
  .object({
    baseAugmentation: AugmentationSchema,
    // This overrides baseAugmentation included gear
    gearList: zod.optional(GearListSchema),
    // TODO: is rating a thing for augmentations?
    // rating: zod.optional(zod.number()),
    customName: zod.optional(zod.string()),
  })
  .strict();
export type CustomisedAugmentationType = zod.infer<
  typeof CustomisedAugmentationSchema
>;
export const CustomisedAugmentationListSchema = zod.array(
  CustomisedAugmentationSchema
);
export type CustomisedAugmentationListType = zod.infer<
  typeof CustomisedAugmentationListSchema
>;
