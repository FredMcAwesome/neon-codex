import assert from "assert";
import type { GenericModListType } from "@neon-codex/common/build/schemas/shared/modSchemas.js";
import {
  convertIncludedXmlGears,
  convertXmlModObject,
} from "../common/ParserHelper.js";
import type {
  ArmorEquipmentPackXmlType,
  BiowareEquipmentPackXmlType,
  CyberwareEquipmentPackXmlType,
  VehicleEquipmentPackXmlType,
  WeaponEquipmentPackXmlType,
} from "./EquipmentPackParserSchemas.js";
import { augmentationTypeEnum } from "@neon-codex/common/build/enums.js";
import type { AugmentationSubsystemListType } from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";

export const convertArmorEquipmentPack = function (
  pack: ArmorEquipmentPackXmlType
) {
  let modList: GenericModListType | undefined;
  if (pack.mods !== undefined) {
    const tempModList = Array.isArray(pack.mods.mod)
      ? pack.mods.mod
      : [pack.mods.mod];
    modList = convertXmlModObject(
      // coerce into the expected format
      {
        name: tempModList.map((mod) => {
          if (mod.rating === undefined) {
            return mod.name;
          }
          return {
            xmltext: mod.name,
            _rating: mod.rating.toString(),
          };
        }),
      }
    );
  }
  let gearList;
  if (pack.gears !== undefined) {
    gearList = convertIncludedXmlGears({ usegear: pack.gears.gear });
  }
  return {
    name: pack.name,
    gearList: gearList,
    modList: modList,
  };
};

export const convertAugmentationEquipmentPack = function (
  augmentation: CyberwareEquipmentPackXmlType | BiowareEquipmentPackXmlType,
  type: augmentationTypeEnum
) {
  let gearList;
  if ("gears" in augmentation && augmentation.gears !== undefined) {
    gearList = convertIncludedXmlGears({ usegear: augmentation.gears.gear });
  }
  let subsystemList: AugmentationSubsystemListType | undefined;
  if ("cyberwares" in augmentation && augmentation.cyberwares !== undefined) {
    const cyberwareList = Array.isArray(augmentation.cyberwares.cyberware)
      ? augmentation.cyberwares.cyberware
      : [augmentation.cyberwares.cyberware];
    subsystemList = {
      cyberwareList: cyberwareList,
    };
  }
  if (gearList !== undefined && subsystemList !== undefined) {
    assert(
      type === augmentationTypeEnum.Cyberware,
      `Illegal for ${augmentation.name}`
    );
  }
  return {
    name: augmentation.name,
    grade: augmentation.grade,
    rating: augmentation.rating,
    type: type,
    ...(gearList !== undefined && { gearList: gearList }),
    ...(subsystemList !== undefined && { subsystemList: subsystemList }),
  };
};

export const convertVehicleEquipmentPack = function (
  vehicle: VehicleEquipmentPackXmlType
) {
  let gearList;
  if (vehicle.gears !== undefined) {
    gearList = convertIncludedXmlGears({ usegear: vehicle.gears.gear });
  }
  let weaponList;
  if (vehicle.weapons !== undefined) {
    const tempWeaponList = Array.isArray(vehicle.weapons.weapon)
      ? vehicle.weapons.weapon
      : [vehicle.weapons.weapon];

    weaponList = tempWeaponList.map((weapon) => {
      return convertWeaponEquipmentPack(weapon);
    });
  }
  return {
    name: vehicle.name,
    gearList: gearList,
    weaponList: weaponList,
  };
};

export const convertWeaponEquipmentPack = function (
  xmlWeapon: WeaponEquipmentPackXmlType
) {
  let accessoryList;
  if (xmlWeapon.accessories !== undefined) {
    const tempAccessoryList = Array.isArray(xmlWeapon.accessories.accessory)
      ? xmlWeapon.accessories.accessory
      : [xmlWeapon.accessories.accessory];
    accessoryList = tempAccessoryList.map((accessory) => {
      return { name: accessory.name };
    });
  }
  return {
    name: xmlWeapon.name,
    accessoryList: accessoryList,
  };
};
