import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ArmourModifications } from "../../models/rpg/equipment/combat/armourModificationModel.js";
import { ArmourModListSchema } from "@shadowrun/common/build/schemas/armourModSchemas.js";
import type { ArmourModListType } from "@shadowrun/common/build/schemas/armourModSchemas.js";

export const getArmourModifications = function () {
  const currentPath = import.meta.url;
  let unlinkedArmourMods: ArmourModListType;
  const relativeConverterPath = "converter/jsonFiles/armourMods.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const armourModListParsed = ArmourModListSchema.safeParse(rawJson);
  if (armourModListParsed.success) {
    console.log("armour mods all g");
    unlinkedArmourMods = armourModListParsed.data;
  } else {
    console.log(armourModListParsed.error.errors[0]);
    assert(false, "armourMods is undefined");
  }
  const stagedArmourModifications: Array<ArmourModifications> = [];
  unlinkedArmourMods.forEach((armourMod) => {
    stagedArmourModifications.push(new ArmourModifications(armourMod));
    // console.log(armourMod.name);
  });
  return { unlinkedArmourMods, stagedArmourModifications };
};
