import { WeaponAccessorySummaryListSchema } from "@shadowrun/common/build/schemas/weaponAccessorySchemas.js";
import type { WeaponAccessorySummaryListType } from "@shadowrun/common/build/schemas/weaponAccessorySchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WeaponAccessories } from "../../models/rpg/equipment/combat/weaponAccessoryModel.js";

export const getWeaponAccessories = function () {
  const currentPath = import.meta.url;
  let unlinkedWeaponAccessories: WeaponAccessorySummaryListType;
  const relativeConverterPath = "converter/jsonFiles/weaponAccessories.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const weaponAccessoryListParsed =
    WeaponAccessorySummaryListSchema.safeParse(rawJson);
  if (weaponAccessoryListParsed.success) {
    console.log("weapon accessories all g");
    unlinkedWeaponAccessories = weaponAccessoryListParsed.data;
  } else {
    console.log(weaponAccessoryListParsed.error.errors[0]);
    assert(false, "weaponAccessories is undefined");
  }
  const stagedWeaponAccessories: Array<WeaponAccessories> = [];
  unlinkedWeaponAccessories.forEach((weaponAccessory) => {
    stagedWeaponAccessories.push(new WeaponAccessories(weaponAccessory));
    // console.log(weaponAccessory.name);
  });
  return {
    unlinkedWeaponAccessories,
    stagedWeaponAccessories,
  };
};
