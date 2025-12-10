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
import type { EquipmentListType } from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
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

  // names must be equal
  return 0;
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

  const equipmentData: EquipmentListType = {
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

  const outputPath = path.resolve(
    __dirname,
    "../../../frontend/public/equipment-data.json"
  );

  console.log(`Writing to ${outputPath}...`);
  await fs.writeFile(outputPath, JSON.stringify(equipmentData));
  console.log("Done!");
  process.exit(0);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
