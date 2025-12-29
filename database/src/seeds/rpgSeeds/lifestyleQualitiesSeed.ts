import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  LifestyleQualityListSchema,
  type LifestyleQualityListType,
} from "@neon-codex/common";
import { LifestyleQualities } from "../../models/rpg/otherData/lifestyleQualityModel.js";
import { type } from "arktype";

export const getLifestyleQualities = function () {
  const currentPath = import.meta.url;
  let unlinkedLifestyleQualities: LifestyleQualityListType;
  const relativeConverterPath = "converter/jsonFiles/lifestyleQualities.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const lifestyleQualityListParsed = LifestyleQualityListSchema(rawJson);
  if (lifestyleQualityListParsed instanceof type.errors) {
    console.log(lifestyleQualityListParsed.summary);
    assert(false, "lifestyle qualities is undefined");
  } else {
    console.log("lifestyle qualities all g");
    unlinkedLifestyleQualities = lifestyleQualityListParsed;
  }
  const stagedLifestyleQualities: Array<LifestyleQualities> = [];
  unlinkedLifestyleQualities.forEach((lifestyleQuality) => {
    stagedLifestyleQualities.push(new LifestyleQualities(lifestyleQuality));
  });
  return { unlinkedLifestyleQualities, stagedLifestyleQualities };
};
