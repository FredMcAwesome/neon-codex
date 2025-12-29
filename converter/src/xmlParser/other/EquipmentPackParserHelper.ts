import assert from "assert";
import type { GenericModListType } from "@neon-codex/common";
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
import {
  augmentationCategoryEnum,
  weaponAccessoryMountLocationEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "@neon-codex/common";
import type { AugmentationSubsystemListType } from "@neon-codex/common";
import type { CustomisedWeaponType } from "@neon-codex/common";
import { getWeaponMounts } from "../combat/WeaponAccessoryParserHelper.js";
import type { CustomisedVehicleType } from "@neon-codex/common";
import type { CustomisedArmourType } from "@neon-codex/common";

export const convertArmorEquipmentPack = function (
  pack: ArmorEquipmentPackXmlType
): CustomisedArmourType {
  let modList: GenericModListType | undefined;
  if ("mods" in pack && pack.mods !== undefined) {
    const tempModList = Array.isArray(pack.mods.mod)
      ? pack.mods.mod
      : [pack.mods.mod];
    modList = convertXmlModObject(
      // coerce into the expected format
      {
        name: tempModList.map((mod) => {
          if (!("rating" in mod)) {
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
  if ("gears" in pack && pack.gears !== undefined) {
    gearList = convertIncludedXmlGears({ usegear: pack.gears.gear });
  }
  return {
    baseArmour: pack.name,
    ...(gearList !== undefined && { gearList: gearList }),
    ...(modList !== undefined && {
      modList: modList.map((mod) => {
        return { ...mod, gearList: [] };
      }),
    }),
  };
};

export const convertAugmentationEquipmentPack = function (
  augmentation: CyberwareEquipmentPackXmlType | BiowareEquipmentPackXmlType,
  category: augmentationCategoryEnum
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
      category === augmentationCategoryEnum.Cyberware,
      `Illegal for ${augmentation.name}`
    );
  }
  return {
    baseAugmentation: augmentation.name,
    grade: augmentation.grade,
    ...("rating" in augmentation && { rating: augmentation.rating }),
    ...(gearList !== undefined && { gearList: gearList }),
    ...(subsystemList !== undefined && { subsystemList: subsystemList }),
  };
};

export const convertVehicleEquipmentPack = function (
  vehicle: VehicleEquipmentPackXmlType
): CustomisedVehicleType {
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
    baseVehicle: vehicle.name,
    ...(gearList !== undefined && { gearList: gearList }),
    // simplist way to store the weapon list is to create dummy weapon mounts
    // this is then fixed in the seeder
    ...(weaponList !== undefined && {
      weaponMountList: weaponList.map((weapon) => {
        return {
          control: weaponMountControlEnum.Remote_SR5,
          flexibility: weaponMountFlexibilityEnum.Flexible_SR5,
          size: weaponMountSizeEnum.Heavy_SR5,
          visibility: weaponMountVisibilityEnum.External_SR5,
          weaponMounted: {
            baseWeapon: weapon.baseWeapon,
            ...("accessoryList" in weapon && {
              accessoryList: weapon.accessoryList,
            }),
            ...("rating" in weapon && { rating: weapon.rating }),
          },
        };
      }),
    }),
  };
};

export const convertWeaponEquipmentPack = function (
  xmlWeapon: WeaponEquipmentPackXmlType
): CustomisedWeaponType {
  let accessoryList;
  if (xmlWeapon.accessories !== undefined) {
    const tempAccessoryList = Array.isArray(xmlWeapon.accessories.accessory)
      ? xmlWeapon.accessories.accessory
      : [xmlWeapon.accessories.accessory];
    accessoryList = tempAccessoryList.map((accessory) => {
      return {
        baseAccessory: accessory.name,
        gearList: [],
        mountList: getWeaponMounts(accessory.mount) || [
          weaponAccessoryMountLocationEnum.None,
        ],
      };
    });
  }
  return {
    baseWeapon: xmlWeapon.name,
    accessoryList: accessoryList || [],
  };
};
