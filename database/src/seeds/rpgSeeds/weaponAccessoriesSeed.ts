import { WeaponAccessoryListSchema } from "@neon-codex/common";
import type { WeaponAccessoryListType } from "@neon-codex/common";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WeaponAccessories } from "../../models/rpg/equipment/combat/weaponAccessoryModel.js";
import { type } from "arktype";

export const getWeaponAccessories = function () {
  const currentPath = import.meta.url;
  let unlinkedWeaponAccessories: WeaponAccessoryListType;
  const relativeConverterPath = "converter/jsonFiles/weaponAccessories.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const weaponAccessoryListParsed = WeaponAccessoryListSchema(rawJson);
  if (weaponAccessoryListParsed instanceof type.errors) {
    console.log(weaponAccessoryListParsed.summary);
    assert(false, "weaponAccessories is undefined");
  } else {
    console.log("weapon accessories all g");
    unlinkedWeaponAccessories = weaponAccessoryListParsed;
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
