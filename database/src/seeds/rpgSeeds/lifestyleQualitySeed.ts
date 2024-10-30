import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  LifestyleQualityListSchema,
  type LifestyleQualityListType,
} from "@neon-codex/common/build/schemas/otherData/lifestyleSchemas.js";
import { LifestyleQualities } from "../../models/rpg/otherData/lifestyleQualityModel.js";

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
  const lifestyleQualityListParsed =
    LifestyleQualityListSchema.safeParse(rawJson);
  if (lifestyleQualityListParsed.success) {
    console.log("lifestyle qualities all g");
    unlinkedLifestyleQualities = lifestyleQualityListParsed.data;
  } else {
    console.log(lifestyleQualityListParsed.error.errors[0]);
    assert(false, "lifestyle qualities is undefined");
  }
  const stagedLifestyleQualities: Array<LifestyleQualities> = [];
  unlinkedLifestyleQualities.forEach((lifestyleQuality) => {
    stagedLifestyleQualities.push(new LifestyleQualities(lifestyleQuality));
  });
  return { unlinkedLifestyleQualities, stagedLifestyleQualities };
};
