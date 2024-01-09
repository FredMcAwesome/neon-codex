import { ArmourModListSchema } from "@shadowrun/common/build/schemas/armourModSchemas.js";
import type { ArmourModListType } from "@shadowrun/common/build/schemas/armourModSchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ArmourModifications } from "../../models/gear/combatGear/armourModificationModel.js";

export const getArmourModifications = function () {
  const currentPath = import.meta.url;
  let armourMods: ArmourModListType | undefined = undefined;
  const relativeConverterPath = "converter/jsonFiles/armourMods.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const armourModListParsed = ArmourModListSchema.safeParse(rawJson);
  if (armourModListParsed.success) {
    console.log("armour mods all g");
    armourMods = armourModListParsed.data;
  } else {
    console.log(armourModListParsed.error.errors[0]);
  }
  if (armourMods === undefined) {
    assert(false);
  }
  const stagedArmourMods: Array<ArmourModifications> = [];
  armourMods.forEach((armourMod) => {
    stagedArmourMods.push(new ArmourModifications(armourMod));
    // console.log(armourMod.name);
  });
  return stagedArmourMods;
};
