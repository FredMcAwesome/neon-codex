import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HeritageListSchema, type HeritageListType } from "@neon-codex/common";
import {
  Metahumans,
  Metasapients,
  Heritages,
  Shapeshifters,
} from "../../models/rpg/traits/heritageModel.js";
import { heritageCategoryEnum } from "@neon-codex/common";
import { type } from "arktype";

export const getHeritages = function () {
  const currentPath = import.meta.url;
  let unlinkedHeritages: HeritageListType;
  const relativeConverterPath = "converter/jsonFiles/metatypes.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const heritageListParsed = HeritageListSchema(rawJson);
  if (heritageListParsed instanceof type.errors) {
    console.log(heritageListParsed.summary);
    assert(false, "heritages is undefined");
  } else {
    console.log("heritages all g");
    unlinkedHeritages = heritageListParsed;
  }
  const stagedHeritages: Array<Heritages> = [];
  unlinkedHeritages.forEach((heritage) => {
    switch (heritage.category) {
      case heritageCategoryEnum.Metahuman:
        stagedHeritages.push(new Metahumans(heritage));
        break;
      case heritageCategoryEnum.Metasapient:
        stagedHeritages.push(new Metasapients(heritage));
        break;
      case heritageCategoryEnum.Shapeshifter:
        stagedHeritages.push(new Shapeshifters(heritage));
        break;
      case heritageCategoryEnum.Metavariant:
        // skip for now as we need the related heritage in db
        break;
    }
    // console.log(heritages.name);
  });

  return {
    unlinkedHeritages,
    stagedHeritages,
  };
};
