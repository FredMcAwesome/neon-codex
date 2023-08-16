import {
  WeaponAccessorySummaryListSchema,
  WeaponAccessorySummaryListType,
} from "@shadowrun/common/src/schemas/weaponAccessorySchema.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WeaponAccessories } from "../../models/gear/combatGear/weaponAccessoryModel.js";

export const getWeaponAccessories = function () {
  const currentPath = import.meta.url;
  let weaponAccessories: WeaponAccessorySummaryListType | undefined = undefined;
  const relativeConverterPath = "converter/jsonFiles/weaponAccessories.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const weaponAccessoryListParsed =
    WeaponAccessorySummaryListSchema.safeParse(rawJson);
  if (weaponAccessoryListParsed.success) {
    console.log("Weapon Accessories all g");
    weaponAccessories = weaponAccessoryListParsed.data;
  } else {
    console.log(weaponAccessoryListParsed.error.errors[0]);
  }
  if (weaponAccessories === undefined) {
    assert(false);
  }
  const stagedWeaponAccessories: Array<WeaponAccessories> = [];
  weaponAccessories.forEach((weaponAccessory) => {
    stagedWeaponAccessories.push(new WeaponAccessories(weaponAccessory));
    console.log(weaponAccessory.name);
  });
  return stagedWeaponAccessories;
};
