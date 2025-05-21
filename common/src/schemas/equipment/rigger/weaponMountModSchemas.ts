import {
  ammoSourceEnum,
  mathOperatorEnum,
  restrictionEnum,
  vehicleModAttributeEnum,
  vehicleModTypeEnum,
  vehicleModRatingEnum,
  sourceBookEnum,
} from "../../../enums.js";
import { z as zod } from "zod";
import { RequirementsSchema } from "../../shared/requiredSchemas.js";
import { RangeCostSchema } from "../../shared/commonSchemas.js";

const WeaponMountModRatingSchema = zod.array(
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
export type WeaponMountModRatingType = zod.infer<
  typeof WeaponMountModRatingSchema
>;

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

const AvailabilityWeaponMountModSchema = zod
  .object({
    rating: zod.number(),
    restriction: zod.nativeEnum(restrictionEnum),
  })
  .strict();

export type AvailabilityWeaponMountModType = zod.infer<
  typeof AvailabilityWeaponMountModSchema
>;

const InnerCostVehicleModSchema = zod.union([
  zod.object({ option: zod.nativeEnum(vehicleModAttributeEnum) }).strict(),
  zod.number(),
  zod.object({ operator: zod.nativeEnum(mathOperatorEnum) }).strict(),
]);

type PartialCostWeaponMountModType = Array<
  | zod.infer<typeof InnerCostVehicleModSchema>
  | { subnumbers: PartialCostWeaponMountModType }
>;
const PartialCostWeaponMountModSchema: zod.ZodType<PartialCostWeaponMountModType> =
  zod.array(
    zod.union([
      InnerCostVehicleModSchema,
      zod
        .object({
          subnumbers: zod.lazy(() => PartialCostWeaponMountModSchema),
        })
        .strict(),
    ])
  );

const CostWeaponMountModSchema = zod.union([
  RangeCostSchema,
  PartialCostWeaponMountModSchema,
  zod
    .object({
      ratingLinked: zod.array(PartialCostWeaponMountModSchema),
    })
    .strict(),
]);
export type CostWeaponMountModType = zod.infer<typeof CostWeaponMountModSchema>;

export const WeaponMountModSchema = zod
  .object({
    name: zod.string(),
    description: zod.string(),
    type: zod.nativeEnum(vehicleModTypeEnum),
    slotCost: SlotCostSchema,
    additionalAmmo: zod.optional(zod.number()),
    percentageAmmoIncrease: zod.optional(zod.number()),
    replaceAmmo: zod.optional(ReplaceAmmoSchema),
    requirements: zod.optional(RequirementsSchema),
    userSelectable: zod.optional(zod.literal(false)),
    availability: AvailabilityWeaponMountModSchema,
    cost: CostWeaponMountModSchema,
    source: zod.nativeEnum(sourceBookEnum),
    page: zod.number(),
  })
  .strict();

export type WeaponMountModType = zod.infer<typeof WeaponMountModSchema>;
export const WeaponMountModListSchema = zod.array(WeaponMountModSchema);
export type WeaponMountModListType = zod.infer<typeof WeaponMountModListSchema>;
