import {
  ammoSourceEnum,
  mathOperatorEnum,
  ratingMeaningEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModTypeEnum,
  vehicleModRatingEnum,
  cyberwareCategoryEnum,
  sourceBookEnum,
  firearmWeaponTypeEnum,
} from "../../../enums.js";
import { z as zod } from "zod";
import { BonusSchema } from "../../shared/bonusSchemas.js";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { RangeCostSchema } from "../../shared/commonSchemas.js";

const VehicleModRatingSchema = zod.array(
  zod.union([
    zod
      .object({
        option: zod.nativeEnum(vehicleModRatingEnum),
      })
      .strict(),
    zod.nativeEnum(mathOperatorEnum),
    zod.number(),
  ])
);
export type VehicleModRatingType = zod.infer<typeof VehicleModRatingSchema>;

const ReplaceAmmoSchema = zod.array(
  zod
    .object({
      reloadMethod: zod.nativeEnum(ammoSourceEnum),
      capacity: zod.optional(zod.number()),
      numberOfAmmunitionHolders: zod.optional(zod.number()),
    })
    .strict()
);
export type ReplaceAmmoType = zod.infer<typeof ReplaceAmmoSchema>;

const InnerSlotCostSchema = zod.union([
  zod
    .object({
      option: zod.nativeEnum(vehicleModAttributeEnum),
    })
    .strict(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
  zod.number(),
]);

export type PartialSlotCostType = Array<
  zod.infer<typeof InnerSlotCostSchema> | { subnumbers: PartialSlotCostType }
>;
const PartialSlotCostSchema: zod.ZodType<PartialSlotCostType> = zod.array(
  zod.union([
    InnerSlotCostSchema,
    zod
      .object({
        subnumbers: zod.lazy(() => PartialSlotCostSchema),
      })
      .strict(),
  ])
);

const SlotCostSchema = zod.union([
  PartialSlotCostSchema,
  zod
    .object({
      ratingLinked: zod.array(PartialSlotCostSchema),
    })
    .strict(),
]);
export type SlotCostType = zod.infer<typeof SlotCostSchema>;

const InnerAvailabilityRatingVehicleModSchema = zod.union([
  zod.object({ option: zod.nativeEnum(vehicleModAttributeEnum) }).strict(),
  zod.number(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type AvailabilityRatingVehicleModType = Array<
  | zod.infer<typeof InnerAvailabilityRatingVehicleModSchema>
  | { subnumbers: AvailabilityRatingVehicleModType }
>;
const AvailabilityRatingVehicleModSchema: zod.ZodType<AvailabilityRatingVehicleModType> =
  zod.array(
    zod.union([
      InnerAvailabilityRatingVehicleModSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => AvailabilityRatingVehicleModSchema),
        })
        .strict(),
    ])
  );

const PartialAvailabilityVehicleModSchema = zod
  .object({
    rating: AvailabilityRatingVehicleModSchema,
    restriction: zod.nativeEnum(restrictionEnum),
  })
  .strict();

const AvailabilityVehicleModSchema = zod.union([
  PartialAvailabilityVehicleModSchema,
  zod
    .object({
      ratingLinked: zod.array(PartialAvailabilityVehicleModSchema),
    })
    .strict(),
]);
export type AvailabilityVehicleModType = zod.infer<
  typeof AvailabilityVehicleModSchema
>;

const InnerCostVehicleModSchema = zod.union([
  zod.object({ option: zod.nativeEnum(vehicleModAttributeEnum) }).strict(),
  zod.number(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type PartialCostVehicleModType = Array<
  | zod.infer<typeof InnerCostVehicleModSchema>
  | { subnumbers: PartialCostVehicleModType }
>;
const PartialCostVehicleModSchema: zod.ZodType<PartialCostVehicleModType> =
  zod.array(
    zod.union([
      InnerCostVehicleModSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => PartialCostVehicleModSchema),
        })
        .strict(),
    ])
  );

const CostVehicleModSchema = zod.union([
  RangeCostSchema,
  PartialCostVehicleModSchema,
  zod
    .object({
      ratingLinked: zod.array(PartialCostVehicleModSchema),
    })
    .strict(),
]);
export type CostVehicleModType = zod.infer<typeof CostVehicleModSchema>;

export const VehicleModSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    type: zod.nativeEnum(vehicleModTypeEnum),
    maxRating: VehicleModRatingSchema,
    minRating: zod.optional(VehicleModRatingSchema),
    ratingMeaning: zod.optional(zod.nativeEnum(ratingMeaningEnum)),
    capacity: zod.optional(zod.number()),
    isDowngrade: zod.optional(zod.literal(true)),
    // TODO: Make this a child of vehicleModSchema
    // combine with allowedSubsystemList, addPhysicalBoxes
    requiresDroneParent: zod.optional(zod.literal(true)),
    allowedSubsystemList: zod.optional(
      zod.array(zod.nativeEnum(cyberwareCategoryEnum))
    ),
    addPhysicalBoxes: zod.optional(zod.number()),
    slotCost: SlotCostSchema,
    weaponMountValidCategoryList: zod.optional(
      zod.array(zod.nativeEnum(firearmWeaponTypeEnum))
    ),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityVehicleModSchema,
    cost: CostVehicleModSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export type VehicleModType = zod.infer<typeof VehicleModSchema>;
export const VehicleModListSchema = zod.array(VehicleModSchema);
export type VehicleModListType = zod.infer<typeof VehicleModListSchema>;

export const CustomisedVehicleModSchema = zod
  .object({
    baseMod: zod.string(),
    rating: zod.optional(zod.number()),
    // display this like 'name (specificOption)'
    specificOption: zod.optional(zod.string()),
    subsystemList: zod.optional(zod.array(zod.string())),
  })
  .strict();
export type CustomisedVehicleModType = zod.infer<
  typeof CustomisedVehicleModSchema
>;
export const CustomisedVehicleModListSchema = zod.array(
  CustomisedVehicleModSchema
);
export type CustomisedVehicleModListType = zod.infer<
  typeof CustomisedVehicleModListSchema
>;
