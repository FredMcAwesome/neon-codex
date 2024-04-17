import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  HeritageListSchema,
  type HeritageListType,
} from "@neon-codex/common/build/schemas/abilities/heritageSchemas.js";
import {
  Metahumans,
  Metasapients,
  Heritages,
  Shapeshifters,
} from "../../models/rpg/traits/heritageModel.js";
import { heritageCategoryEnum } from "@neon-codex/common/build/enums.js";

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
  const heritageListParsed = HeritageListSchema.safeParse(rawJson);
  if (heritageListParsed.success) {
    console.log("heritages all g");
    unlinkedHeritages = heritageListParsed.data;
  } else {
    console.log(heritageListParsed.error.errors[0]);
    assert(false, "heritages is undefined");
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
