import {
  ammoSourceEnum,
  firearmWeaponTypeEnum,
  mathOperatorEnum,
  ratingMeaningEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModSubtypeEnum,
  vehicleModRatingEnum,
  vehicleModTypeEnum,
  cyberwareCategoryEnum,
  sourceBookEnum,
} from "../enums.js";
import { z as zod } from "zod";
import { BonusSchema } from "./shared/bonusSchemas.js";
import { RequirementsSchema } from "./shared/requiredSchemas.js";

const RiggerModRatingSchema = zod.array(
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
export type RiggerModRatingType = zod.infer<typeof RiggerModRatingSchema>;

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

const InnerAvailabilityRatingRiggerModSchema = zod.union([
  zod.object({ option: zod.nativeEnum(vehicleModAttributeEnum) }).strict(),
  zod.number(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type AvailabilityRatingRiggerModType = Array<
  | zod.infer<typeof InnerAvailabilityRatingRiggerModSchema>
  | { subnumbers: AvailabilityRatingRiggerModType }
>;
const AvailabilityRatingRiggerModSchema: zod.ZodType<AvailabilityRatingRiggerModType> =
  zod.array(
    zod.union([
      InnerAvailabilityRatingRiggerModSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => AvailabilityRatingRiggerModSchema),
        })
        .strict(),
    ])
  );

const PartialAvailabilityRiggerModSchema = zod
  .object({
    rating: AvailabilityRatingRiggerModSchema,
    restriction: zod.nativeEnum(restrictionEnum),
  })
  .strict();

const AvailabilityRiggerModSchema = zod.union([
  PartialAvailabilityRiggerModSchema,
  zod
    .object({
      ratingLinked: zod.array(PartialAvailabilityRiggerModSchema),
    })
    .strict(),
]);
export type AvailabilityRiggerModType = zod.infer<
  typeof AvailabilityRiggerModSchema
>;

const InnerCostRiggerModSchema = zod.union([
  zod.object({ option: zod.nativeEnum(vehicleModAttributeEnum) }).strict(),
  zod.number(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

export type PartialCostRiggerModType = Array<
  | zod.infer<typeof InnerCostRiggerModSchema>
  | { subnumbers: PartialCostRiggerModType }
>;
const PartialCostRiggerModSchema: zod.ZodType<PartialCostRiggerModType> =
  zod.array(
    zod.union([
      InnerCostRiggerModSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => PartialCostRiggerModSchema),
        })
        .strict(),
    ])
  );

const CostRiggerModSchema = zod.union([
  PartialCostRiggerModSchema,
  zod
    .object({
      ratingLinked: zod.array(PartialCostRiggerModSchema),
    })
    .strict(),
  zod
    .object({
      range: zod
        .object({
          min: zod.number(),
          max: zod.number(),
        })
        .strict(),
    })
    .strict(),
]);
export type CostRiggerModType = zod.infer<typeof CostRiggerModSchema>;

const VehicleModPartialSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    subtype: zod.nativeEnum(vehicleModSubtypeEnum),
    maxRating: RiggerModRatingSchema,
    minRating: zod.optional(RiggerModRatingSchema),
    ratingMeaning: zod.optional(zod.nativeEnum(ratingMeaningEnum)),
    capacity: zod.optional(zod.number()),
    addPhysicalBoxes: zod.optional(zod.number()),
    isDowngrade: zod.optional(zod.literal(true)),
    requiresDroneParent: zod.optional(zod.literal(true)),
    slotCost: SlotCostSchema,
    subsystemList: zod.optional(
      zod.array(zod.nativeEnum(cyberwareCategoryEnum))
    ),
    bonus: zod.optional(BonusSchema),
    requirements: zod.optional(RequirementsSchema),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityRiggerModSchema,
    cost: CostRiggerModSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export const VehicleModSchema = zod.discriminatedUnion("type", [
  VehicleModPartialSchema.extend({
    type: zod.literal(vehicleModTypeEnum.Vehicle),
    weaponMountValidCategoryList: zod.optional(
      zod.array(zod.nativeEnum(firearmWeaponTypeEnum))
    ),
  }),
  VehicleModPartialSchema.extend({
    type: zod.literal(vehicleModTypeEnum.WeaponMount),
    additionalAmmo: zod.optional(zod.number()),
    percentageAmmoIncrease: zod.optional(zod.number()),
    replaceAmmo: zod.optional(ReplaceAmmoSchema),
  }),
]);

export type VehicleModType = zod.infer<typeof VehicleModSchema>;
export const VehicleModListSchema = zod.array(VehicleModSchema);
export type VehicleModListType = zod.infer<typeof VehicleModListSchema>;
