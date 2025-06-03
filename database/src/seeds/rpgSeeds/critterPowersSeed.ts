import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  CritterPowerListSchema,
  type CritterPowerListType,
} from "@neon-codex/common/build/schemas/abilities/talent/critterPowerSchemas.js";
import { CritterPowers } from "../../models/rpg/abilities/critterPowerModel.js";
import { type } from "arktype";

export const getCritterPowers = function () {
  const currentPath = import.meta.url;
  let unlinkedCritterPowers: CritterPowerListType;
  const relativeConverterPath = "converter/jsonFiles/critterPowers.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const critterPowerListParsed = CritterPowerListSchema(rawJson);
  if (critterPowerListParsed instanceof type.errors) {
    console.log(critterPowerListParsed.summary);
    assert(false, "critter powers is undefined");
  } else {
    console.log("critter powers all g");
    unlinkedCritterPowers = critterPowerListParsed;
  }
  const stagedCritterPowers: Array<CritterPowers> = [];
  unlinkedCritterPowers.forEach((critterPower) => {
    stagedCritterPowers.push(new CritterPowers(critterPower));
    // console.log(critterPower.name);
  });
  return stagedCritterPowers;
};
