import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Qualities } from "../../models/rpg/traits/qualityModel.js";
import {
  type QualityListType,
  QualityListSchema,
} from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";

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
  const qualityListParsed = QualityListSchema.safeParse(rawJson);
  if (qualityListParsed.success) {
    console.log("qualities all g");
    unlinkedQualities = qualityListParsed.data;
  } else {
    console.log(qualityListParsed.error.errors[0]);
    assert(false, "qualities is undefined");
  }
  const stagedQualities: Array<Qualities> = [];
  unlinkedQualities.forEach((quality) => {
    stagedQualities.push(new Qualities(quality));
    // console.log(quality.name);
  });
  return { unlinkedQualities, stagedQualities };
};
