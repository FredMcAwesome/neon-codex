import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GearListSchema } from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type { GearListType } from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import { Gears } from "../../models/rpg/equipment/other/gearModel.js";

export const getGears = function () {
  const currentPath = import.meta.url;
  let unlinkedGears: GearListType;
  const relativeConverterPath = "converter/jsonFiles/gears.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const gearListParsed = GearListSchema.safeParse(rawJson);
  if (gearListParsed.success) {
    console.log("Gears all g");
    unlinkedGears = gearListParsed.data;
  } else {
    console.log(gearListParsed.error.errors[0]);
    assert(false, "gears is undefined");
  }
  const stagedGears: Array<Gears> = [];
  unlinkedGears.forEach((gear) => {
    stagedGears.push(new Gears(gear));
    // console.log(gear.name);
  });
  return { unlinkedGears, stagedGears };
};
