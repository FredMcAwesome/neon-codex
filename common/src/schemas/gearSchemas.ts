import { z as zod } from "zod";
import { AugmentationListSchema } from "./augmentationSchemas.js";
import { MatrixAccessorySchema, MatrixSchema } from "./electronicSchemas.js";
import { OtherGearSchema } from "./otherGearSchemas.js";
import { RiggerSchema } from "./riggerSchemas.js";
import { WeaponLinkedListSchema } from "./weaponSchemas.js";

export const MatrixListSchema = zod.array(MatrixSchema);
export type MatrixListType = zod.infer<typeof MatrixListSchema>;

export const MatrixAccessoriesListSchema = zod.array(MatrixAccessorySchema);
export type MatrixAccessoriesListType = zod.infer<
  typeof MatrixAccessoriesListSchema
>;

export const OtherGearListSchema = zod.array(OtherGearSchema);
export type OtherGearListType = zod.infer<typeof OtherGearListSchema>;

export const VehiclesAndDronesListSchema = zod.array(RiggerSchema);
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
    vehiclesAndDrones: VehiclesAndDronesListSchema,
  })
  .strict();
export type GearListType = zod.infer<typeof GearListSchema>;
