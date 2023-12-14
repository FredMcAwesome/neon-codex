import { z as zod } from "zod";
import {
  augmentationGradeEnum,
  augmentationLimitEnum,
  availabilityEnum,
  biowareCategoryEnum,
  capcityAugmentationEnum,
  costAugmentationEnum,
  cyberwareCategoryEnum,
  limbSlotEnum,
  mathOperatorEnum,
  mountSlotEnum,
  restrictionEnum,
  sourceBookEnum,
} from "../enums.js";
import {
  AllowedGearSchema,
  AvailabilityRatingSchema,
  CapacitySchema,
  RatingSchema,
  UseGearListSchema,
  UseGearListType,
} from "./commonSchemas.js";
import { BonusSchema } from "./shared/bonusSchemas.js";
import { RequirementsSchema } from "./shared/requiredSchemas.js";

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
      option: zod.nativeEnum(costAugmentationEnum),
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
      option: zod.nativeEnum(capcityAugmentationEnum),
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

// export const EssenceSchema = zod
//   .object({
//     base: BaseOrSpecialSchema,
//     specialCalculation: GearCalculation,
//   })
//   .strict();
// export type EssenceType = zod.infer<typeof EssenceSchema>;
// Essence Cost is a recursive type
export const EssenceSubnumberSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.literal("Rating"),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type EssenceCostType = Array<
  | zod.infer<typeof EssenceSubnumberSchema>
  | {
      subnumbers: EssenceCostType;
    }
>;
export const EssenceCostRecursiveSchema: zod.ZodType<EssenceCostType> =
  zod.array(
    zod.union([
      EssenceSubnumberSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => EssenceCostRecursiveSchema),
        })
        .strict(),
    ])
  );

export const EssenceCostSchema = zod.union([
  zod
    .object({
      ratingLinked: zod.array(EssenceCostRecursiveSchema),
    })
    .strict(),
  EssenceCostRecursiveSchema,
]);

export const CyberlimbOptionsSchema = zod
  .object({
    syntheticCapacity: CapacitySchema,
    syntheticCost: CostAugmentationSchema,
  })
  .strict();

// const TypeInformationAugmentationSchema = zod.discriminatedUnion("type", [
//   zod
//     .object({
//       type: zod.literal(augmentationTypeEnum.Headware),
//     })
//     .strict(),
//   zod
//     .object({
//       type: zod.literal(augmentationTypeEnum.Eyeware),
//     })
//     .strict(),
//   zod
//     .object({
//       type: zod.literal(augmentationTypeEnum.Earware),
//     })
//     .strict(),
//   zod
//     .object({
//       type: zod.literal(augmentationTypeEnum.Bodyware),
//     })
//     .strict(),
//   zod
//     .object({
//       type: zod.literal(augmentationTypeEnum.Cyberlimbs),
//       syntheticCapacity: CapacitySchema,
//       syntheticCost: CostAugmentationSchema,
//     })
//     .strict(),
//   zod
//     .object({
//       type: zod.literal(augmentationTypeEnum.Bioware),
//     })
//     .strict(),
//   zod
//     .object({
//       type: zod.literal(augmentationTypeEnum.CulturedBioware),
//     })
//     .strict(),
// ]);

const AugmentationLimitSchema = zod.union([
  zod.number(),
  zod
    .object({
      option: zod.nativeEnum(augmentationLimitEnum),
    })
    .strict(),
]);

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

export const AugmentationSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    augmentationLimit: zod.optional(AugmentationLimitSchema),
    category: zod.union([
      zod.nativeEnum(biowareCategoryEnum),
      zod.nativeEnum(cyberwareCategoryEnum),
    ]),
    unavailableGrades: zod.optional(
      zod.array(zod.nativeEnum(augmentationGradeEnum))
    ),
    essenceCost: EssenceCostSchema,
    modification: zod.optional(zod.literal(true)),
    rating: zod.optional(RatingSchema),
    addWeapon: zod.optional(zod.string()),
    blockedMountList: zod.optional(zod.array(zod.nativeEnum(mountSlotEnum))),
    selectSide: zod.optional(zod.literal(true)),
    bonus: zod.optional(BonusSchema),
    pairBonus: zod.optional(BonusSchema),
    pairIncludeList: zod.optional(zod.array(zod.string())),
    requirements: zod.optional(RequirementsSchema),
    forbidden: zod.optional(RequirementsSchema),
    allowedGear: zod.optional(AllowedGearSchema),
    userSelectable: zod.optional(zod.literal(false)),
    allowCategoryList: zod.optional(
      zod.union([
        zod.array(zod.nativeEnum(cyberwareCategoryEnum)),
        zod.array(zod.nativeEnum(biowareCategoryEnum)),
      ])
    ),
    availability: AvailabilityAugmentationSchema,
    cost: CostAugmentationSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),

    // typeInformation: TypeInformationAugmentationSchema,
    // capacity: zod.optional(CapacitySchema),
    // capacityCost: zod.optional(CostAugmentationSchema),
    // cyberlimbOptions: zod.optional(CyberlimbOptionsSchema),
    // wireless: zod.optional(zod.string()),

    // cyberware specific
    ratingLabel: zod.optional(
      zod.union([
        zod.literal("Rating_LengthInCmBy10"),
        zod.literal("Rating_Meters"),
      ])
    ),
    programs: zod.optional(zod.literal("Rating")),
    capacity: zod.optional(CapacityAugmentationSchema),
    addToParentCapacity: zod.optional(zod.literal(true)),
    addParentWeaponAccessory: zod.optional(zod.literal(true)),
    removalCost: zod.optional(zod.number()),
    inheritAttributes: zod.optional(zod.literal(true)),
    limbSlot: zod.optional(zod.nativeEnum(limbSlotEnum)),
    useBothLimbSlots: zod.optional(zod.literal(true)),
    mountsLocation: zod.optional(zod.nativeEnum(mountSlotEnum)),
    modularMount: zod.optional(zod.literal(true)),
    wirelessBonus: zod.optional(BonusSchema),
    wirelessPairBonus: zod.optional(BonusSchema),
    wirelessPairIncludeList: zod.optional(zod.array(zod.string())),
    gearList: zod.optional(UseGearListSchema),
    subsystemList: zod.optional(AugmentationSubsystemListSchema),
    forceGrade: zod.optional(zod.nativeEnum(augmentationGradeEnum)),
    deviceRating: zod.optional(
      zod.object({ option: zod.literal("Rating") }).strict()
    ),
    addVehicle: zod.optional(zod.string()),

    // bioware specific
    isGeneware: zod.optional(zod.literal(true)),
  })
  .strict();
export type AugmentationType = zod.infer<typeof AugmentationSchema>;
