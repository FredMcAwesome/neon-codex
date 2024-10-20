import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MartialArtListSchema,
  type MartialArtListType,
} from "@neon-codex/common/build/schemas/abilities/martialArtSchemas.js";
import { MartialArts } from "../../models/rpg/abilities/martialArtModel.js";

export const getMartialArts = function () {
  const currentPath = import.meta.url;
  let unlinkedMartialArts: MartialArtListType;
  const relativeConverterPath = "converter/jsonFiles/martialArts.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const martialArtListParsed = MartialArtListSchema.safeParse(rawJson);
  if (martialArtListParsed.success) {
    console.log("martial art all g");
    unlinkedMartialArts = martialArtListParsed.data;
  } else {
    console.log(martialArtListParsed.error.errors[0]);
    assert(false, "martial arts is undefined");
  }
  const stagedMartialArts: Array<MartialArts> = [];
  unlinkedMartialArts.forEach((martialArt) => {
    stagedMartialArts.push(new MartialArts(martialArt));
  });
  // console.log(martialArts.name);
  return {
    unlinkedMartialArts: unlinkedMartialArts,
    stagedMartialArts: stagedMartialArts,
  };
};
