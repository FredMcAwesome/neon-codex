import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  CritterListSchema,
  type CritterListType,
} from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";
import { Critters } from "../../models/rpg/creatures/critterModel.js";

export const getCritters = function () {
  const currentPath = import.meta.url;
  let unlinkedCritters: CritterListType;
  const relativeConverterPath = "converter/jsonFiles/critters.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const critterListParsed = CritterListSchema.safeParse(rawJson);
  if (critterListParsed.success) {
    console.log("critters all g");
    unlinkedCritters = critterListParsed.data;
  } else {
    console.log(critterListParsed.error.errors[0]);
    assert(false, "critters is undefined");
  }
  const stagedCritters: Array<Critters> = [];
  unlinkedCritters.forEach((critter) => {
    stagedCritters.push(new Critters(critter));
    // console.log(critter.name);
  });
  return { unlinkedCritters, stagedCritters };
};
