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

export type EquipmentListType = {
  equipmentPackList: EquipmentPackListType;
  weaponList: WeaponListType;
  weaponAccessoryList: WeaponAccessoryListType;
  armourList: ArmourListType;
  armourModificationList: ArmourModListType;
  gearList: GearListType;
  augmentationList: AugmentationListType;
  vehicleList: VehicleListType;
  vehicleModificationList: VehicleModListType;
};
export const EquipmentListSchema: zod.ZodType<EquipmentListType> = zod
  .object({
    equipmentPackList: EquipmentPackListSchema,
    weaponList: WeaponListSchema,
    weaponAccessoryList: WeaponAccessoryListSchema,
    armourList: ArmourListSchema,
    armourModificationList: ArmourModListSchema,
    gearList: GearListSchema,
    augmentationList: AugmentationListSchema,
    vehicleList: VehicleListSchema,
    vehicleModificationList: VehicleModListSchema,
  })
  .strict();

export type SelectedEquipmentListType = {
  weaponList: CustomisedWeaponListType;
  armourList: CustomisedArmourListType;
  gearList: CustomisedGearListType;
  augmentationList: CustomisedAugmentationListType;
  vehicleList: CustomisedVehicleListType;
};
export const SelectedEquipmentListSchema: zod.ZodType<SelectedEquipmentListType> =
  zod
    .object({
      weaponList: CustomisedWeaponListSchema,
      armourList: CustomisedArmourListSchema,
      gearList: CustomisedGearListSchema,
      augmentationList: CustomisedAugmentationListSchema,
      vehicleList: CustomisedVehicleListSchema,
    })
    .strict();
