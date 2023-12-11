import {
  ammoSourceEnum,
  firearmWeaponTypeEnum,
  mathOperatorEnum,
  ratingMeaningEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModCategoryEnum,
  vehicleModRatingEnum,
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

const ReplaceAmmoSchema = zod.array(
  zod
    .object({
      reloadMethod: zod.nativeEnum(ammoSourceEnum),
      capacity: zod.optional(zod.number()),
      numberOfAmmunitionHolders: zod.optional(zod.number()),
    })
    .strict()
);

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

export const RiggerModSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    category: zod.nativeEnum(vehicleModCategoryEnum),
    maxRating: zod.union([
      zod.number(),
      zod
        .object({
          option: zod.nativeEnum(vehicleModRatingEnum),
        })
        .strict(),
    ]),
    minRating: zod.optional(RiggerModRatingSchema),
    ratingMeaning: zod.optional(zod.nativeEnum(ratingMeaningEnum)),
    bonus: zod.optional(BonusSchema),
    additionalAmmo: zod.optional(zod.number()),
    percentageAmmoIncrease: zod.optional(zod.number()),
    replaceAmmo: zod.optional(ReplaceAmmoSchema),
    capacity: zod.optional(zod.number()),
    addPhysicalBoxes: zod.optional(zod.number()),
    isDowngrade: zod.optional(zod.literal(true)),
    requiresDroneParent: zod.optional(zod.literal(true)),
    requirements: zod.optional(RequirementsSchema),
    slotCost: SlotCostSchema,
    subsystemList: zod.optional(zod.array(zod.string())),
    weaponMountValidCategoryList: zod.optional(
      zod.array(zod.nativeEnum(firearmWeaponTypeEnum))
    ),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityRiggerModSchema,
    cost: CostRiggerModSchema,
    source: zod.string(),
    page: zod.number(),
    modType: zod.union([zod.literal("Vehicle"), zod.literal("Weapon Mount")]),
  })
  .strict();

export type RiggerModType = zod.infer<typeof RiggerModSchema>;
export const RiggerModListSchema = zod.array(RiggerModSchema);
