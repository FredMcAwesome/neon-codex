import { z as zod } from "zod";
import { equipmentPackCategoryEnum } from "../../enums.js";
import { CustomisedAugmentationListSchema } from "./bodyModification/augmentationSchemas.js";
import { CustomisedGearListSchema } from "./other/gearSchemas.js";
import { CustomisedArmourListSchema } from "./combat/armourSchemas.js";
import { CustomisedVehicleListSchema } from "./rigger/vehicleSchemas.js";
import { CustomisedWeaponListSchema } from "./combat/weaponSchemas.js";
import { CustomisedLifestyleListSchema } from "../otherData/lifestyleSchemas.js";

export const EquipmentPackSchema = zod
  .object({
    name: zod.string(),
    category: zod.nativeEnum(equipmentPackCategoryEnum),
    nuyen: zod.number(),
    armourList: CustomisedArmourListSchema,
    augmentationList: CustomisedAugmentationListSchema,
    gearList: CustomisedGearListSchema,
    vehicleList: CustomisedVehicleListSchema,
    weaponList: CustomisedWeaponListSchema,
    lifestyleList: CustomisedLifestyleListSchema,
    description: zod.string(),
  })
  .strict();
export type EquipmentPackType = zod.infer<typeof EquipmentPackSchema>;
export const EquipmentPackListSchema = zod.array(EquipmentPackSchema);
export type EquipmentPackListType = zod.infer<typeof EquipmentPackListSchema>;
