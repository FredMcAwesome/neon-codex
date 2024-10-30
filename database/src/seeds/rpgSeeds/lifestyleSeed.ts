import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  LifestyleListSchema,
  type LifestyleListType,
} from "@neon-codex/common/build/schemas/otherData/lifestyleSchemas.js";
import { Lifestyles } from "../../models/rpg/otherData/lifestyleModel.js";

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
  const lifestyleListParsed = LifestyleListSchema.safeParse(rawJson);
  if (lifestyleListParsed.success) {
    console.log("lifestyles all g");
    unlinkedLifestyles = lifestyleListParsed.data;
  } else {
    console.log(lifestyleListParsed.error.errors[0]);
    assert(false, "lifestyles is undefined");
  }
  const stagedLifestyles: Array<Lifestyles> = [];
  unlinkedLifestyles.forEach((lifestyleQuality) => {
    stagedLifestyles.push(new Lifestyles(lifestyleQuality));
  });
  return stagedLifestyles;
};
