import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  LifestyleListSchema,
  type LifestyleListType,
} from "@neon-codex/common";
import { Lifestyles } from "../../models/rpg/otherData/lifestyleModel.js";
import { type } from "arktype";

export const getLifestyles = function () {
  const currentPath = import.meta.url;
  let unlinkedLifestyles: LifestyleListType;
  const relativeConverterPath = "converter/jsonFiles/lifestyles.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const lifestyleListParsed = LifestyleListSchema(rawJson);
  if (lifestyleListParsed instanceof type.errors) {
    console.log(lifestyleListParsed.summary);
    assert(false, "lifestyles is undefined");
  } else {
    console.log("lifestyles all g");
    unlinkedLifestyles = lifestyleListParsed;
  }
  const stagedLifestyles: Array<Lifestyles> = [];
  unlinkedLifestyles.forEach((lifestyleQuality) => {
    stagedLifestyles.push(new Lifestyles(lifestyleQuality));
  });
  return stagedLifestyles;
};
