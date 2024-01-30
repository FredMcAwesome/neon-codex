import { z as zod } from "zod";
import { AugmentationListSchema } from "./augmentationSchemas.js";
import { UseGearListSchema } from "./commonSchemas.js";
import { VehicleListSchema } from "./vehicleSchemas.js";
import { WeaponSummaryListSchema } from "./weaponSchemas.js";

export const EquipmentListSchema = zod.object({
  weapons: WeaponSummaryListSchema,
  gears: UseGearListSchema,
  augmentations: AugmentationListSchema,
  vehicles: VehicleListSchema,
});
export type EquipmentListType = zod.infer<typeof EquipmentListSchema>;
