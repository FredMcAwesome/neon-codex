import { z as zod } from "zod";
import {
  AugmentationListSchema,
  type AugmentationListType,
} from "./augmentationSchemas.js";
import { GearListSchema, type GearListType } from "./gearSchemas.js";
import { VehicleListSchema, type VehicleListType } from "./vehicleSchemas.js";
import {
  WeaponSummaryListSchema,
  type WeaponSummaryListType,
} from "./weaponSchemas.js";
import { ArmourListSchema, type ArmourListType } from "./armourSchemas.js";

export type EquipmentListType = {
  weapons: WeaponSummaryListType;
  armours: ArmourListType;
  gears: GearListType;
  augmentations: AugmentationListType;
  vehicles: VehicleListType;
};
export const EquipmentListSchema: zod.ZodType<EquipmentListType> = zod
  .object({
    weapons: WeaponSummaryListSchema,
    armours: ArmourListSchema,
    gears: GearListSchema,
    augmentations: AugmentationListSchema,
    vehicles: VehicleListSchema,
  })
  .strict();
