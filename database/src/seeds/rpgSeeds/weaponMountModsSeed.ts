import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WeaponMountModifications } from "../../models/rpg/equipment/rigger/weaponMountModModel.js";
import {
  WeaponMountModListSchema,
  type WeaponMountModListType,
} from "@neon-codex/common";
import { type } from "arktype";

export const getWeaponMountModifications = function () {
  const currentPath = import.meta.url;
  let weaponMountMods: WeaponMountModListType = [];
  const relativeConverterPath = "converter/jsonFiles/weaponMountMods.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const weaponMountListParsed = WeaponMountModListSchema(rawJson);
  if (weaponMountListParsed instanceof type.errors) {
    console.log(weaponMountListParsed.summary);
    assert(false, "Weapon Mount Mods is undefined");
  } else {
    console.log("Weapon Mount Mods all g");
    weaponMountMods = weaponMountListParsed;
  }
  const stagedWeaponMountMods: Array<WeaponMountModifications> = [];
  weaponMountMods.forEach((weaponMountMod) => {
    stagedWeaponMountMods.push(new WeaponMountModifications(weaponMountMod));
    // console.log(weaponMountMod.name);
  });
  return {
    unlinkedWeaponMountMods: weaponMountMods,
    stagedWeaponMountMods,
  };
};
