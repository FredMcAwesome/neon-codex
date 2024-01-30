import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ArmourListSchema } from "@shadowrun/common/build/schemas/armourSchemas.js";
import type { ArmourListType } from "@shadowrun/common/build/schemas/armourSchemas.js";
import { Armours } from "../../models/rpg/equipment/combat/armourModel.js";

export const getArmours = function () {
  const currentPath = import.meta.url;
  let unlinkedArmours: ArmourListType;
  const relativeConverterPath = "converter/jsonFiles/armours.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const armourListParsed = ArmourListSchema.safeParse(rawJson);
  if (armourListParsed.success) {
    console.log("armours all g");
    unlinkedArmours = armourListParsed.data;
  } else {
    console.log(armourListParsed.error.errors[0]);
    assert(false, "armours is undefined");
  }
  const stagedArmours: Array<Armours> = [];
  unlinkedArmours.forEach((armour) => {
    stagedArmours.push(new Armours(armour));
    // console.log(armour.name);
  });
  return { unlinkedArmours, stagedArmours };
};
