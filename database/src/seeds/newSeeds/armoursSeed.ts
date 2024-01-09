import { ArmourListSchema } from "@shadowrun/common/build/schemas/armourSchemas.js";
import type { ArmourListType } from "@shadowrun/common/build/schemas/armourSchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Armours } from "../../models/gear/combatGear/armourModel.js";

export const getArmours = function () {
  const currentPath = import.meta.url;
  let armours: ArmourListType | undefined = undefined;
  const relativeConverterPath = "converter/jsonFiles/armours.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const armourListParsed = ArmourListSchema.safeParse(rawJson);
  if (armourListParsed.success) {
    console.log("armours all g");
    armours = armourListParsed.data;
  } else {
    console.log(armourListParsed.error.errors[0]);
  }
  if (armours === undefined) {
    assert(false);
  }
  const stagedArmours: Array<Armours> = [];
  armours.forEach((armour) => {
    stagedArmours.push(new Armours(armour));
    // console.log(armour.name);
  });
  return stagedArmours;
};
