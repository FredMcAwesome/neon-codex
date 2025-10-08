import { equipmentPackCategoryEnum } from "../../enums.js";
import { CustomisedAugmentationListSchema } from "./bodyModification/augmentationSchemas.js";
import { CustomisedGearListSchema } from "./other/gearSchemas.js";
import { CustomisedArmourListSchema } from "./combat/armourSchemas.js";
import { CustomisedVehicleListSchema } from "./rigger/vehicleSchemas.js";
import { CustomisedWeaponListSchema } from "./combat/weaponSchemas.js";
import { CustomisedLifestyleListSchema } from "../otherData/lifestyleSchemas.js";
import { type } from "arktype";

export const EquipmentPackSchema = type({
  "+": "reject",
  name: "string",
  category: type.valueOf(equipmentPackCategoryEnum),
  nuyen: "number",
  armourList: CustomisedArmourListSchema,
  augmentationList: CustomisedAugmentationListSchema,
  gearList: CustomisedGearListSchema,
  vehicleList: CustomisedVehicleListSchema,
  weaponList: CustomisedWeaponListSchema,
  lifestyleList: CustomisedLifestyleListSchema,
  description: "string",
});
export type EquipmentPackType = typeof EquipmentPackSchema.infer;
export const EquipmentPackListSchema = type(EquipmentPackSchema.array());
export type EquipmentPackListType = typeof EquipmentPackListSchema.infer;
