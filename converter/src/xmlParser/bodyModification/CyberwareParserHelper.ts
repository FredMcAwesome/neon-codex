import assert from "assert";
import {
  cyberwareCategoryEnum,
  augmentationMountSlotEnum,
  mathOperatorEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  cyberwareRatingType,
  CyberwareSubsystemsXmlType,
  CyberwareSubsystemsRecursiveType,
} from "./CyberwareParserSchemas.js";
import { mountLocationXmlEnum } from "./CyberwareParserSchemas.js";
import { cyberwareXmlCategoryEnum } from "./CyberwareParserSchemas.js";
import { convertIncludedXmlGears } from "../common/ParserHelper.js";
import type { AugmentationSubsystemListType } from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";

export const convertCyberwareCategory = function (
  category: cyberwareXmlCategoryEnum
) {
  switch (category) {
    case cyberwareXmlCategoryEnum.Bodyware:
      return cyberwareCategoryEnum.Bodyware;
    case cyberwareXmlCategoryEnum.AutoInjectorMods:
      return cyberwareCategoryEnum.AutoInjectorMods;
    case cyberwareXmlCategoryEnum.CosmeticEnhancement:
      return cyberwareCategoryEnum.CosmeticEnhancement;
    case cyberwareXmlCategoryEnum.Cyberlimb:
      return cyberwareCategoryEnum.Cyberlimb;
    case cyberwareXmlCategoryEnum.CyberlimbAccessory:
      return cyberwareCategoryEnum.CyberlimbAccessory;
    case cyberwareXmlCategoryEnum.CyberlimbEnhancement:
      return cyberwareCategoryEnum.CyberlimbEnhancement;
    case cyberwareXmlCategoryEnum.Cybersuite:
      return cyberwareCategoryEnum.Cybersuite;
    case cyberwareXmlCategoryEnum.CyberImplantWeapon:
      return cyberwareCategoryEnum.CyberImplantWeapon;
    case cyberwareXmlCategoryEnum.CyberImplantWeaponAccessory:
      return cyberwareCategoryEnum.CyberImplantWeaponAccessory;
    case cyberwareXmlCategoryEnum.Earware:
      return cyberwareCategoryEnum.Earware;
    case cyberwareXmlCategoryEnum.Eyeware:
      return cyberwareCategoryEnum.Eyeware;
    case cyberwareXmlCategoryEnum.HardNanoware:
      return cyberwareCategoryEnum.HardNanoware;
    case cyberwareXmlCategoryEnum.Headware:
      return cyberwareCategoryEnum.Headware;
    case cyberwareXmlCategoryEnum.Nanocybernetics:
      return cyberwareCategoryEnum.Nanocybernetics;
    case cyberwareXmlCategoryEnum.SoftNanoware:
      return cyberwareCategoryEnum.SoftNanoware;
    case cyberwareXmlCategoryEnum.SpecialBiodroneCyberware:
      return cyberwareCategoryEnum.SpecialBiodroneCyberware;
  }
};

export const convertCyberwareRating = function (rating: cyberwareRatingType) {
  if (typeof rating === "number") {
    return [rating];
  }

  switch (rating) {
    case "{STRMaximum}":
      return [{ option: "Maximum Strength" }];
    case "{AGIMaximum}":
      return [{ option: "Maximum Agility" }];
    case "{STRMinimum}+1":
      return [
        { option: "Minimum Strength" },
        { operator: mathOperatorEnum.Add },
        1,
      ];
    case "{AGIMinimum}+1":
      return [
        { option: "Minimum Agility" },
        { operator: mathOperatorEnum.Add },
        1,
      ];
  }
};

export const convertMountLocation = function (
  mountLocation: mountLocationXmlEnum
) {
  switch (mountLocation) {
    case "wrist":
      return augmentationMountSlotEnum.Wrist;
    case "elbow":
      return augmentationMountSlotEnum.Elbow;
    case "shoulder":
      return augmentationMountSlotEnum.Shoulder;
    case "ankle":
      return augmentationMountSlotEnum.Ankle;
    case "knee":
      return augmentationMountSlotEnum.Knee;
    case "hip":
      return augmentationMountSlotEnum.Hip;
    default:
      assert(false, mountLocation);
  }
};

export const convertSubsystem = function (
  subsystems: CyberwareSubsystemsXmlType | undefined
): AugmentationSubsystemListType | undefined {
  if (subsystems === undefined) {
    return undefined;
  }
  assert(
    subsystems.bioware !== undefined || subsystems.cyberware !== undefined
  );
  const biowareXmlList =
    subsystems.bioware === undefined
      ? undefined
      : Array.isArray(subsystems.bioware)
      ? subsystems.bioware
      : [subsystems.bioware];
  let cyberwareXmlList =
    subsystems.cyberware === undefined
      ? undefined
      : Array.isArray(subsystems.cyberware)
      ? subsystems.cyberware
      : [subsystems.cyberware];
  let biowareList;
  if (biowareXmlList !== undefined) {
    biowareList = biowareXmlList.map((bioware) => {
      return convertSubsystemInternal(bioware);
    });
  }
  let cyberwareList;
  if (cyberwareXmlList !== undefined) {
    cyberwareList = cyberwareXmlList.map((cyberware) => {
      return convertSubsystemInternal(cyberware);
    });
  }

  return {
    cyberwareList: cyberwareList,
    biowareList: biowareList,
  };
};

export const convertSubsystemInternal = function (
  subsystemInteral: CyberwareSubsystemsRecursiveType
) {
  const gearsXml = subsystemInteral.gears;
  const subsystemsXml = subsystemInteral.subsystems;
  const name = subsystemInteral.name;
  const rating = subsystemInteral.rating;
  const forced = subsystemInteral.forced;

  let gearList;
  if (gearsXml !== undefined) {
    gearList = convertIncludedXmlGears(gearsXml);
  }
  let subsystems;
  if (subsystemsXml !== undefined) {
    subsystems = convertSubsystem(subsystemsXml);
  }

  return {
    name: name,
    rating: rating,
    forced: forced,
    subsystem: subsystems,
    gearList: gearList,
  };
};

// TODO: change category to non-xml versions
export const convertSubsystemCategory = function (
  subsystems: { category: string | Array<string> } | undefined
) {
  if (subsystems === undefined) {
    return undefined;
  }
  const subsystemList = Array.isArray(subsystems.category)
    ? subsystems.category
    : [subsystems.category];
  return subsystemList.map((subsystem) => {
    switch (subsystem) {
      case cyberwareXmlCategoryEnum.AutoInjectorMods:
        return cyberwareCategoryEnum.AutoInjectorMods;
      case cyberwareXmlCategoryEnum.Bodyware:
        return cyberwareCategoryEnum.Bodyware;
      case cyberwareXmlCategoryEnum.CosmeticEnhancement:
        return cyberwareCategoryEnum.CosmeticEnhancement;
      case cyberwareXmlCategoryEnum.Cyberlimb:
        return cyberwareCategoryEnum.Cyberlimb;
      case cyberwareXmlCategoryEnum.CyberlimbAccessory:
        return cyberwareCategoryEnum.CyberlimbAccessory;
      case cyberwareXmlCategoryEnum.CyberlimbEnhancement:
        return cyberwareCategoryEnum.CyberlimbEnhancement;
      case cyberwareXmlCategoryEnum.Cybersuite:
        return cyberwareCategoryEnum.Cybersuite;
      case cyberwareXmlCategoryEnum.CyberImplantWeapon:
        return cyberwareCategoryEnum.CyberImplantWeapon;
      case cyberwareXmlCategoryEnum.CyberImplantWeaponAccessory:
        return cyberwareCategoryEnum.CyberImplantWeaponAccessory;
      case cyberwareXmlCategoryEnum.Earware:
        return cyberwareCategoryEnum.Earware;
      case cyberwareXmlCategoryEnum.Eyeware:
        return cyberwareCategoryEnum.Eyeware;
      case cyberwareXmlCategoryEnum.HardNanoware:
        return cyberwareCategoryEnum.HardNanoware;
      case cyberwareXmlCategoryEnum.Headware:
        return cyberwareCategoryEnum.Headware;
      case cyberwareXmlCategoryEnum.Nanocybernetics:
        return cyberwareCategoryEnum.Nanocybernetics;
      case cyberwareXmlCategoryEnum.SoftNanoware:
        return cyberwareCategoryEnum.SoftNanoware;
      case cyberwareXmlCategoryEnum.SpecialBiodroneCyberware:
        return cyberwareCategoryEnum.SpecialBiodroneCyberware;
      default:
        assert(false, subsystem);
    }
  });
};
