import { z as zod } from "zod";
import { AugmentationSchema } from "./augmentationSchemas.js";
import { MatrixAccessorySchema, MatrixSchema } from "./electronicSchemas.js";
import { otherGearSchema } from "./otherGearSchema.js";
import { MagicGearSchema } from "./magicalSchemas.js";
import { VehiclesAndDronesSchema } from "./riggerSchema.js";
import { WeaponLinkedListSchema } from "./weaponSchemas.js";

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

export const GearListSchema = zod
  .object({
    weapons: WeaponLinkedListSchema,
    electronics: MatrixListSchema,
    electronicAccessories: MatrixAccessoriesListSchema,
    otherGear: OtherGearListSchema,
    augmentations: AugmentationListSchema,
    magicalEquipment: MagicGearListSchema,
    vehiclesAndDrones: VehiclesAndDronesListSchema,
  })
  .strict();
export type GearListType = zod.infer<typeof GearListSchema>;
