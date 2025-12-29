import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Qualities } from "../../models/rpg/traits/qualityModel.js";
import { type QualityListType, QualityListSchema } from "@neon-codex/common";
import { type } from "arktype";

export const getQualities = function () {
  const currentPath = import.meta.url;
  let unlinkedQualities: QualityListType;
  const relativeConverterPath = "converter/jsonFiles/qualities.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const qualityListParsed = QualityListSchema(rawJson);
  if (qualityListParsed instanceof type.errors) {
    console.log(qualityListParsed.summary);
    assert(false, "qualities is undefined");
  } else {
    console.log("qualities all g");
    unlinkedQualities = qualityListParsed;
  }
  const stagedQualities: Array<Qualities> = [];
  unlinkedQualities.forEach((quality) => {
    stagedQualities.push(new Qualities(quality));
    // console.log(quality.name);
  });
  return { unlinkedQualities, stagedQualities };
};
