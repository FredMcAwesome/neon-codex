import { z as zod } from "zod";
import { AugmentationListSchema } from "./augmentationSchemas.js";
import { GearListSchema } from "./gearSchemas.js";
import { VehicleListSchema } from "./vehicleSchemas.js";
import { WeaponSummaryListSchema } from "./weaponSchemas.js";
import { ArmourListSchema } from "./armourSchemas.js";

export const EquipmentListSchema = zod
  .object({
    weapons: WeaponSummaryListSchema,
    armours: ArmourListSchema,
    gears: GearListSchema,
    augmentations: AugmentationListSchema,
    vehicles: VehicleListSchema,
  })
  .strict();
export type EquipmentListType = zod.infer<typeof EquipmentListSchema>;
