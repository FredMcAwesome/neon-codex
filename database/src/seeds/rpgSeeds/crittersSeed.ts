import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CritterListSchema, type CritterListType } from "@neon-codex/common";
import { Critters } from "../../models/rpg/creatures/critterModel.js";
import { type } from "arktype";

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
  const critterListParsed = CritterListSchema(rawJson);
  if (critterListParsed instanceof type.errors) {
    console.log(critterListParsed.summary);
    assert(false, "critters is undefined");
  } else {
    console.log("critters all g");
    unlinkedCritters = critterListParsed;
  }
  const stagedCritters: Array<Critters> = [];
  unlinkedCritters.forEach((critter) => {
    stagedCritters.push(new Critters(critter));
    // console.log(critter.name);
  });
  return { unlinkedCritters, stagedCritters };
};
