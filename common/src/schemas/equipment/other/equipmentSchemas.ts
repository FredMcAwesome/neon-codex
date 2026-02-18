import {
  AugmentationListSchema,
  CustomisedAugmentationListSchema,
  CustomisedAugmentationLoadedListSchema,
  type AugmentationListType,
  type CustomisedAugmentationListType,
  type CustomisedAugmentationLoadedListType,
} from "../bodyModification/augmentationSchemas.js";
import {
  CustomisedGearListSchema,
  CustomisedGearLoadedListSchema,
  GearListSchema,
  type CustomisedGearListType,
  type CustomisedGearLoadedListType,
  type GearListType,
} from "./gearSchemas.js";
import {
  CustomisedVehicleListSchema,
  CustomisedVehicleLoadedListSchema,
  VehicleListSchema,
  type CustomisedVehicleListType,
  type CustomisedVehicleLoadedListType,
  type VehicleListType,
} from "../rigger/vehicleSchemas.js";
import {
  CustomisedWeaponListSchema,
  CustomisedWeaponLoadedListSchema,
  WeaponListSchema,
  type CustomisedWeaponListType,
  type CustomisedWeaponLoadedListType,
  type WeaponListType,
} from "../combat/weaponSchemas.js";
import {
  ArmourListSchema,
  CustomisedArmourListSchema,
  CustomisedArmourLoadedListSchema,
  type ArmourListType,
  type CustomisedArmourListType,
  type CustomisedArmourLoadedListType,
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
import { Type, type } from "arktype";

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
export const EquipmentListSchema = type({
  "+": "reject",
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
});

export type SelectedEquipmentListType = {
  equipmentPackList: EquipmentPackListType;
  augmentationList: CustomisedAugmentationListType;
  armourList: CustomisedArmourListType;
  gearList: CustomisedGearListType;
  vehicleList: CustomisedVehicleListType;
  weaponList: CustomisedWeaponListType;
};
export const SelectedEquipmentListSchema = type({
  "+": "reject",
  equipmentPackList: EquipmentPackListSchema,
  augmentationList: CustomisedAugmentationListSchema,
  armourList: CustomisedArmourListSchema,
  gearList: CustomisedGearListSchema,
  vehicleList: CustomisedVehicleListSchema,
  weaponList: CustomisedWeaponListSchema,
});

export type SelectedEquipmentLoadedListType = {
  equipmentPackList: EquipmentPackListType;
  augmentationList: CustomisedAugmentationLoadedListType;
  armourList: CustomisedArmourLoadedListType;
  gearList: CustomisedGearLoadedListType;
  vehicleList: CustomisedVehicleLoadedListType;
  weaponList: CustomisedWeaponLoadedListType;
};
export const SelectedEquipmentLoadedListSchema: Type<SelectedEquipmentLoadedListType> =
  type({
    "+": "reject",
    equipmentPackList: EquipmentPackListSchema,
    augmentationList: CustomisedAugmentationLoadedListSchema,
    armourList: CustomisedArmourLoadedListSchema,
    gearList: CustomisedGearLoadedListSchema,
    vehicleList: CustomisedVehicleLoadedListSchema,
    weaponList: CustomisedWeaponLoadedListSchema,
  });
