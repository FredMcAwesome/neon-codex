import { z as zod } from "zod";
import { AugmentationSchema } from "./augmentationSchemas.js";
import { MatrixAccessorySchema, MatrixSchema } from "./electronicSchemas.js";
import { otherGearSchema } from "./otherGearSchema.js";
import { MagicGearSchema } from "./magicalSchemas.js";
import { WeaponPreDBSummarySchema } from "./weaponSchemas.js";
import { VehiclesAndDronesSchema } from "./riggerSchema.js";

export const WeaponListSchema = zod.array(WeaponPreDBSummarySchema);
export type WeaponListType = zod.infer<typeof WeaponListSchema>;

export const MatrixListSchema = zod.array(MatrixSchema);
export type MatrixListType = zod.infer<typeof MatrixListSchema>;

export const MatrixAccessoriesListSchema = zod.array(MatrixAccessorySchema);
export type MatrixAccessoriesListType = zod.infer<
  typeof MatrixAccessoriesListSchema
>;

export const OtherGearListSchema = zod.array(otherGearSchema);
export type OtherGearListType = zod.infer<typeof OtherGearListSchema>;

export const AugmentationListSchema = zod.array(AugmentationSchema);
export type AugmentationListType = zod.infer<typeof AugmentationListSchema>;

export const MagicGearListSchema = zod.array(MagicGearSchema);
export type MagicGearListType = zod.infer<typeof MagicGearListSchema>;

export const VehiclesAndDronesListSchema = zod.array(VehiclesAndDronesSchema);
export type VehiclesAndDronesListType = zod.infer<
  typeof VehiclesAndDronesListSchema
>;

export const GearListSchema = zod.object({
  weapons: WeaponListSchema,
  electronics: MatrixListSchema,
  electronicAccessories: MatrixAccessoriesListSchema,
  otherGear: OtherGearListSchema,
  augmentations: AugmentationListSchema,
  magicalEquipment: MagicGearListSchema,
  vehiclesAndDrones: VehiclesAndDronesListSchema,
});
export type GearListType = zod.infer<typeof GearListSchema>;
