import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WeaponMountModifications } from "../../models/rpg/equipment/rigger/weaponMountModModel.js";
import {
  WeaponMountModListSchema,
  type WeaponMountModListType,
} from "@neon-codex/common/build/schemas/equipment/rigger/weaponMountModSchemas.js";

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
  const weaponMountListParsed = WeaponMountModListSchema.safeParse(rawJson);
  if (weaponMountListParsed.success) {
    console.log("Weapon Mount Mods all g");
    weaponMountMods = weaponMountListParsed.data;
  } else {
    console.log(weaponMountListParsed.error.errors[0]);
    assert(false, "Weapon Mount Mods is undefined");
  }
  const stagedWeaponMountMods: Array<WeaponMountModifications> = [];
  weaponMountMods.forEach((weaponMountMod) => {
    stagedWeaponMountMods.push(new WeaponMountModifications(weaponMountMod));
    // console.log(weaponMountMod.name);
  });
  return stagedWeaponMountMods;
};
