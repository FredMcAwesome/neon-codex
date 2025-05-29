import { z as zod } from "zod";
import {
  AugmentationListSchema,
  CustomisedAugmentationListSchema,
  type AugmentationListType,
  type CustomisedAugmentationListType,
} from "../bodyModification/augmentationSchemas.js";
import {
  CustomisedGearListSchema,
  GearListSchema,
  type CustomisedGearListType,
  type GearListType,
} from "./gearSchemas.js";
import {
  CustomisedVehicleListSchema,
  VehicleListSchema,
  type CustomisedVehicleListType,
  type VehicleListType,
} from "../rigger/vehicleSchemas.js";
import {
  CustomisedWeaponListSchema,
  WeaponListSchema,
  type CustomisedWeaponListType,
  type WeaponListType,
} from "../combat/weaponSchemas.js";
import {
  ArmourListSchema,
  CustomisedArmourListSchema,
  type ArmourListType,
  type CustomisedArmourListType,
} from "../combat/armourSchemas.js";
import {
  EquipmentPackListSchema,
  type EquipmentPackListType,
} from "../equipmentPackSchemas.js";
import {
  WeaponAccessoryListSchema,
  type WeaponAccessoryListType,
} from "../combat/weaponAccessorySchemas.js";
import {
  ArmourModListSchema,
  type ArmourModListType,
} from "../combat/armourModSchemas.js";
import {
  VehicleModListSchema,
  type VehicleModListType,
} from "../rigger/vehicleModSchemas.js";
import {
  WeaponMountModListSchema,
  type WeaponMountModListType,
} from "../rigger/weaponMountModSchemas.js";

export type EquipmentListType = {
  equipmentPackList: EquipmentPackListType;
  augmentationList: AugmentationListType;
  armourList: ArmourListType;
  armourModificationList: ArmourModListType;
  gearList: GearListType;
  vehicleList: VehicleListType;
  vehicleModificationList: VehicleModListType;
  weaponMountModificationList: WeaponMountModListType;
  weaponList: WeaponListType;
  weaponAccessoryList: WeaponAccessoryListType;
};
export const EquipmentListSchema: zod.ZodType<EquipmentListType> = zod
  .object({
    equipmentPackList: EquipmentPackListSchema,
    augmentationList: AugmentationListSchema,
    armourList: ArmourListSchema,
    armourModificationList: ArmourModListSchema,
    gearList: GearListSchema,
    vehicleList: VehicleListSchema,
    vehicleModificationList: VehicleModListSchema,
    weaponMountModificationList: WeaponMountModListSchema,
    weaponList: WeaponListSchema,
    weaponAccessoryList: WeaponAccessoryListSchema,
  })
  .strict();

export type SelectedEquipmentListType = {
  equipmentPackList: EquipmentPackListType;
  augmentationList: CustomisedAugmentationListType;
  armourList: CustomisedArmourListType;
  gearList: CustomisedGearListType;
  vehicleList: CustomisedVehicleListType;
  weaponList: CustomisedWeaponListType;
};
export const SelectedEquipmentListSchema: zod.ZodType<SelectedEquipmentListType> =
  zod
    .object({
      equipmentPackList: EquipmentPackListSchema,
      augmentationList: CustomisedAugmentationListSchema,
      armourList: CustomisedArmourListSchema,
      gearList: CustomisedGearListSchema,
      vehicleList: CustomisedVehicleListSchema,
      weaponList: CustomisedWeaponListSchema,
    })
    .strict();
