import {
  getWeapons,
  getWeaponAccessories,
  getArmours,
  getArmourModifications,
  getGears,
  getAugmentations,
  getVehicles,
  getVehicleModifications,
  getWeaponMountModifications,
  getEquipmentPacks,
} from "../routes/character.js";
import {
  EquipmentListSchema,
  EQUIPMENT_DATA_VERSION,
} from "@neon-codex/common";
import type {
  ArmourModType,
  ArmourType,
  AugmentationSubsystemListType,
  AugmentationType,
  CustomisedArmourListType,
  CustomisedArmourModListType,
  CustomisedArmourType,
  CustomisedAugmentationListType,
  CustomisedAugmentationType,
  CustomisedGearListType,
  CustomisedLifestyleListType,
  CustomisedVehicleListType,
  CustomisedVehicleModListType,
  CustomisedVehicleType,
  CustomisedWeaponAccessoryListType,
  CustomisedWeaponListType,
  CustomisedWeaponMountListType,
  CustomisedWeaponMountType,
  CustomisedWeaponType,
  EquipmentListType,
  GearType,
  VehicleModType,
  VehicleType,
  WeaponAccessoryType,
  WeaponMountModType,
  WeaponType,
  EquipmentPackType,
} from "@neon-codex/common";
import { type } from "arktype";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { RequestContext } from "@mikro-orm/postgresql";
import { init } from "../utils/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function alphabetise<T extends { name: string }>(a: T, b: T) {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal ignoring case, fall back to case-sensitive then
  // JSON for a total deterministic order between runs
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return compareJson(a, b);
}

function compareStrings(a: string, b: string): number {
  const aU = a.toUpperCase();
  const bU = b.toUpperCase();
  if (aU < bU) {
    return -1;
  }
  if (aU > bU) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function compareOptionalString(
  a: string | undefined,
  b: string | undefined
): number {
  if (a === undefined && b === undefined) {
    return 0;
  }
  if (a === undefined) {
    return -1;
  }
  if (b === undefined) {
    return 1;
  }
  return compareStrings(a, b);
}

function compareOptionalNumber(
  a: number | undefined,
  b: number | undefined
): number {
  if (a === undefined && b === undefined) {
    return 0;
  }
  if (a === undefined) {
    return -1;
  }
  if (b === undefined) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function compareJson(a: unknown, b: unknown): number {
  const aS = JSON.stringify(a);
  const bS = JSON.stringify(b);
  if (aS === undefined && bS === undefined) {
    return 0;
  }
  if (aS === undefined) {
    return -1;
  }
  if (bS === undefined) {
    return 1;
  }
  if (aS < bS) {
    return -1;
  }
  if (aS > bS) {
    return 1;
  }
  return 0;
}

function sortStringList<T extends string>(list: T[]): void {
  list.sort(compareStrings);
}

function sortCustomisedGearList(list: CustomisedGearListType): void {
  for (const gear of list) {
    if (gear.innerGearList !== undefined) {
      sortCustomisedGearList(gear.innerGearList);
    }
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseGear, b.baseGear);
    if (byBase !== 0) {
      return byBase;
    }
    const byOption = compareOptionalString(a.specificOption, b.specificOption);
    if (byOption !== 0) {
      return byOption;
    }
    const byRating = compareOptionalNumber(a.rating, b.rating);
    if (byRating !== 0) {
      return byRating;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedArmourModList(list: CustomisedArmourModListType): void {
  for (const mod of list) {
    if (mod.gearList !== undefined) {
      sortCustomisedGearList(mod.gearList);
    }
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseMod, b.baseMod);
    if (byBase !== 0) {
      return byBase;
    }
    const byRating = compareOptionalNumber(a.rating, b.rating);
    if (byRating !== 0) {
      return byRating;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedVehicleModList(
  list: CustomisedVehicleModListType
): void {
  for (const mod of list) {
    if (mod.subsystemList !== undefined) {
      sortStringList(mod.subsystemList);
    }
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseMod, b.baseMod);
    if (byBase !== 0) {
      return byBase;
    }
    const byOption = compareOptionalString(a.specificOption, b.specificOption);
    if (byOption !== 0) {
      return byOption;
    }
    const byRating = compareOptionalNumber(a.rating, b.rating);
    if (byRating !== 0) {
      return byRating;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedWeaponAccessoryList(
  list: CustomisedWeaponAccessoryListType
): void {
  for (const accessory of list) {
    sortCustomisedGearList(accessory.gearList);
    sortStringList(accessory.mountList);
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseAccessory, b.baseAccessory);
    if (byBase !== 0) {
      return byBase;
    }
    const byRating = compareOptionalNumber(a.rating, b.rating);
    if (byRating !== 0) {
      return byRating;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedWeaponMountList(
  list: CustomisedWeaponMountListType
): void {
  for (const mount of list) {
    if (mount.weaponMountModList !== undefined) {
      sortStringList(mount.weaponMountModList);
    }
    if (mount.weaponMounted !== undefined) {
      sortCustomisedWeapon(mount.weaponMounted);
    }
  }
  list.sort((a, b) => {
    const byControl = compareStrings(a.control, b.control);
    if (byControl !== 0) {
      return byControl;
    }
    const byFlexibility = compareStrings(a.flexibility, b.flexibility);
    if (byFlexibility !== 0) {
      return byFlexibility;
    }
    const bySize = compareStrings(a.size, b.size);
    if (bySize !== 0) {
      return bySize;
    }
    const byVisibility = compareStrings(a.visibility, b.visibility);
    if (byVisibility !== 0) {
      return byVisibility;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedWeapon(weapon: CustomisedWeaponType): void {
  if (weapon.accessoryList !== undefined) {
    sortCustomisedWeaponAccessoryList(weapon.accessoryList);
  }
}

function sortCustomisedWeaponList(list: CustomisedWeaponListType): void {
  for (const weapon of list) {
    sortCustomisedWeapon(weapon);
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseWeapon, b.baseWeapon);
    if (byBase !== 0) {
      return byBase;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedArmour(armour: CustomisedArmourType): void {
  if (armour.modList !== undefined) {
    sortCustomisedArmourModList(armour.modList);
  }
  if (armour.gearList !== undefined) {
    sortCustomisedGearList(armour.gearList);
  }
}

function sortCustomisedArmourList(list: CustomisedArmourListType): void {
  for (const armour of list) {
    sortCustomisedArmour(armour);
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseArmour, b.baseArmour);
    if (byBase !== 0) {
      return byBase;
    }
    return compareJson(a, b);
  });
}

function sortSubsystemItemList(
  list: Array<{
    name: string;
    rating?: number;
    gearList?: CustomisedGearListType;
    subsystem?: AugmentationSubsystemListType;
  }>
): void {
  for (const item of list) {
    if (item.gearList !== undefined) {
      sortCustomisedGearList(item.gearList);
    }
    if (item.subsystem !== undefined) {
      sortAugmentationSubsystemList(item.subsystem);
    }
  }
  list.sort((a, b) => {
    const byName = compareStrings(a.name, b.name);
    if (byName !== 0) {
      return byName;
    }
    const byRating = compareOptionalNumber(a.rating, b.rating);
    if (byRating !== 0) {
      return byRating;
    }
    return compareJson(a, b);
  });
}

function sortAugmentationSubsystemList(
  subsystem: AugmentationSubsystemListType
): void {
  if (subsystem.cyberwareList !== undefined) {
    sortSubsystemItemList(subsystem.cyberwareList);
  }
  if (subsystem.biowareList !== undefined) {
    sortSubsystemItemList(subsystem.biowareList);
  }
}

function sortCustomisedAugmentation(
  augmentation: CustomisedAugmentationType
): void {
  if (augmentation.gearList !== undefined) {
    sortCustomisedGearList(augmentation.gearList);
  }
  if (augmentation.subsystemList !== undefined) {
    sortAugmentationSubsystemList(augmentation.subsystemList);
  }
}

function sortCustomisedAugmentationList(
  list: CustomisedAugmentationListType
): void {
  for (const augmentation of list) {
    sortCustomisedAugmentation(augmentation);
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseAugmentation, b.baseAugmentation);
    if (byBase !== 0) {
      return byBase;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedVehicle(vehicle: CustomisedVehicleType): void {
  if (vehicle.modList !== undefined) {
    sortCustomisedVehicleModList(vehicle.modList);
  }
  if (vehicle.gearList !== undefined) {
    sortCustomisedGearList(vehicle.gearList);
  }
  if (vehicle.weaponMountList !== undefined) {
    sortCustomisedWeaponMountList(vehicle.weaponMountList);
  }
}

function sortCustomisedVehicleList(list: CustomisedVehicleListType): void {
  for (const vehicle of list) {
    sortCustomisedVehicle(vehicle);
  }
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseVehicle, b.baseVehicle);
    if (byBase !== 0) {
      return byBase;
    }
    return compareJson(a, b);
  });
}

function sortCustomisedLifestyleList(list: CustomisedLifestyleListType): void {
  list.sort((a, b) => {
    const byBase = compareStrings(a.baseLifestyle, b.baseLifestyle);
    if (byBase !== 0) {
      return byBase;
    }
    if (a.purchasedDuration < b.purchasedDuration) {
      return -1;
    }
    if (a.purchasedDuration > b.purchasedDuration) {
      return 1;
    }
    return compareJson(a, b);
  });
}

function sortWeapon(weapon: WeaponType): void {
  if (weapon.allowedGearList !== undefined) {
    sortStringList(weapon.allowedGearList);
  }
  if (weapon.allowedGearCategories !== undefined) {
    sortStringList(weapon.allowedGearCategories);
  }
  if (weapon.includedAccessoryList !== undefined) {
    sortCustomisedWeaponAccessoryList(weapon.includedAccessoryList);
  }
  if (weapon.alternativeWeaponForms !== undefined) {
    sortStringList(weapon.alternativeWeaponForms);
  }
  if (weapon.relatedSkillSpecialisationList !== undefined) {
    sortStringList(weapon.relatedSkillSpecialisationList);
  }
  if ("rangeList" in weapon && weapon.rangeList !== undefined) {
    sortStringList(weapon.rangeList);
  }
  if ("firearmOptions" in weapon && weapon.firearmOptions !== undefined) {
    const firearmOptions = weapon.firearmOptions;
    sortStringList(firearmOptions.mode);
    if (firearmOptions.accessoryMountList !== undefined) {
      sortStringList(firearmOptions.accessoryMountList);
    }
    if (firearmOptions.doubleCostAccessoryMountList !== undefined) {
      sortStringList(firearmOptions.doubleCostAccessoryMountList);
    }
    if (firearmOptions.underbarrelWeaponList !== undefined) {
      sortStringList(firearmOptions.underbarrelWeaponList);
    }
  }
  if (
    "hostWeaponMountsRequired" in weapon &&
    weapon.hostWeaponMountsRequired !== undefined
  ) {
    sortStringList(weapon.hostWeaponMountsRequired);
  }
}

function sortWeaponAccessory(accessory: WeaponAccessoryType): void {
  if (accessory.allowedGearList !== undefined) {
    sortStringList(accessory.allowedGearList);
  }
  if (accessory.allowedGearCategories !== undefined) {
    sortStringList(accessory.allowedGearCategories);
  }
  if (accessory.includedGearList !== undefined) {
    sortCustomisedGearList(accessory.includedGearList);
  }
  if (accessory.hostWeaponMountsRequired !== undefined) {
    sortStringList(accessory.hostWeaponMountsRequired);
  }
}

function sortArmour(armour: ArmourType): void {
  if (armour.includedGearList !== undefined) {
    sortCustomisedGearList(armour.includedGearList);
  }
  if (armour.includedModList !== undefined) {
    sortCustomisedArmourModList(armour.includedModList);
  }
}

function sortArmourMod(mod: ArmourModType): void {
  if (mod.includedGearList !== undefined) {
    sortCustomisedGearList(mod.includedGearList);
  }
}

function sortGear(gear: GearType): void {
  if (gear.allowedGearList !== undefined) {
    sortStringList(gear.allowedGearList);
  }
  if (gear.includedGearList !== undefined) {
    sortCustomisedGearList(gear.includedGearList);
  }
  if (gear.allowCategoryList !== undefined) {
    sortStringList(gear.allowCategoryList);
  }
}

function sortAugmentation(augmentation: AugmentationType): void {
  if (augmentation.pairIncludeList !== undefined) {
    sortStringList(augmentation.pairIncludeList);
  }
  if (augmentation.allowedGearList !== undefined) {
    sortStringList(augmentation.allowedGearList);
  }
  if (augmentation.includedGearList !== undefined) {
    sortCustomisedGearList(augmentation.includedGearList);
  }
  if (augmentation.allowedGearCategories !== undefined) {
    sortStringList(augmentation.allowedGearCategories);
  }
  if (augmentation.allowSubsystemCategoryList !== undefined) {
    sortStringList(augmentation.allowSubsystemCategoryList);
  }
  if (augmentation.blockedMountList !== undefined) {
    sortStringList(augmentation.blockedMountList);
  }
  if (augmentation.unavailableGrades !== undefined) {
    sortStringList(augmentation.unavailableGrades);
  }
  if (
    "includedSubsystemList" in augmentation &&
    augmentation.includedSubsystemList !== undefined
  ) {
    sortAugmentationSubsystemList(augmentation.includedSubsystemList);
  }
}

function sortVehicle(vehicle: VehicleType): void {
  if (vehicle.includedGearList !== undefined) {
    sortCustomisedGearList(vehicle.includedGearList);
  }
  if (vehicle.includedModList !== undefined) {
    sortCustomisedVehicleModList(vehicle.includedModList);
  }
  if (vehicle.includedWeaponMountList !== undefined) {
    const mountList = vehicle.includedWeaponMountList;
    for (const mount of mountList) {
      if (mount.weaponMountModList !== undefined) {
        sortStringList(mount.weaponMountModList);
      }
      if (mount.weaponMounted !== undefined) {
        sortCustomisedWeapon(mount.weaponMounted);
      }
    }
    sortCustomisedWeaponMountList(mountList);
  }
}

function sortVehicleMod(mod: VehicleModType): void {
  if (mod.allowedSubsystemList !== undefined) {
    sortStringList(mod.allowedSubsystemList);
  }
  if (mod.weaponMountValidCategoryList !== undefined) {
    sortStringList(mod.weaponMountValidCategoryList);
  }
}

function sortWeaponMountMod(_mod: WeaponMountModType): void {
  // No nested sortable lists currently; kept for completeness and
  // future-proofing deterministic output.
}

function sortEquipmentPack(pack: EquipmentPackType): void {
  sortCustomisedArmourList(pack.armourList);
  sortCustomisedAugmentationList(pack.augmentationList);
  sortCustomisedGearList(pack.gearList);
  sortCustomisedVehicleList(pack.vehicleList);
  sortCustomisedWeaponList(pack.weaponList);
  sortCustomisedLifestyleList(pack.lifestyleList);
}

async function generate() {
  console.log("Fetching equipment data...");
  const db = await init();
  const [
    weaponList,
    weaponAccessoryList,
    armourList,
    armourModificationList,
    gearList,
    augmentationList,
    vehicleList,
    vehicleModificationList,
    weaponMountModificationList,
    equipmentPackList,
  ] = await Promise.all([
    RequestContext.create(db.em, getWeapons),
    RequestContext.create(db.em, getWeaponAccessories),
    RequestContext.create(db.em, getArmours),
    RequestContext.create(db.em, getArmourModifications),
    RequestContext.create(db.em, getGears),
    RequestContext.create(db.em, getAugmentations),
    RequestContext.create(db.em, getVehicles),
    RequestContext.create(db.em, getVehicleModifications),
    RequestContext.create(db.em, getWeaponMountModifications),
    RequestContext.create(db.em, getEquipmentPacks),
  ]);

  for (const weapon of weaponList) {
    sortWeapon(weapon);
  }
  for (const accessory of weaponAccessoryList) {
    sortWeaponAccessory(accessory);
  }
  for (const armour of armourList) {
    sortArmour(armour);
  }
  for (const mod of armourModificationList) {
    sortArmourMod(mod);
  }
  for (const gear of gearList) {
    sortGear(gear);
  }
  for (const augmentation of augmentationList) {
    sortAugmentation(augmentation);
  }
  for (const vehicle of vehicleList) {
    sortVehicle(vehicle);
  }
  for (const mod of vehicleModificationList) {
    sortVehicleMod(mod);
  }
  for (const mod of weaponMountModificationList) {
    sortWeaponMountMod(mod);
  }
  for (const pack of equipmentPackList) {
    sortEquipmentPack(pack);
  }

  const equipmentData: EquipmentListType = {
    version: EQUIPMENT_DATA_VERSION,
    weaponList: weaponList.sort(alphabetise),
    weaponAccessoryList: weaponAccessoryList.sort(alphabetise),
    armourList: armourList.sort(alphabetise),
    armourModificationList: armourModificationList.sort(alphabetise),
    gearList: gearList.sort(alphabetise),
    augmentationList: augmentationList.sort(alphabetise),
    vehicleList: vehicleList.sort(alphabetise),
    vehicleModificationList: vehicleModificationList.sort(alphabetise),
    weaponMountModificationList: weaponMountModificationList.sort(alphabetise),
    equipmentPackList: equipmentPackList.sort(alphabetise),
  };

  const parsedEquipmentData = EquipmentListSchema(equipmentData);
  if (parsedEquipmentData instanceof type.errors) {
    throw new Error(
      `Generated equipment data failed schema validation:\n${parsedEquipmentData.summary}`
    );
  }

  const outputPath = path.resolve(
    __dirname,
    "../../../frontend/public/equipment-data.json"
  );

  console.log(`Writing to ${outputPath}...`);
  await fs.writeFile(
    outputPath,
    `${JSON.stringify(parsedEquipmentData, null, 2)}\n`
  );
  console.log("Done!");
  await db.close();
  process.exit(0);
}

generate().catch(async (err) => {
  console.error(err);
  try {
    const db = await init();
    await db.close();
  } catch {
    console.log("DB close failed. Cannot close DB");
  }
  process.exit(1);
});
