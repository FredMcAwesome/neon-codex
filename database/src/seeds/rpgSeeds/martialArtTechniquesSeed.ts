import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MartialArtTechniqueListSchema,
  type MartialArtTechniqueListType,
} from "@neon-codex/common/build/schemas/abilities/martialArtSchemas.js";
import { MartialArtTechniques } from "../../models/rpg/abilities/martialArtTechniqueModel.js";
import { type } from "arktype";

export const getMartialArtTechniques = function () {
  const currentPath = import.meta.url;
  let unlinkedMartialArtTechniques: MartialArtTechniqueListType;
  const relativeConverterPath = "converter/jsonFiles/martialArtTechniques.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const martialArtListParsed = MartialArtTechniqueListSchema(rawJson);
  if (martialArtListParsed instanceof type.errors) {
    console.log(martialArtListParsed.summary);
    assert(false, "martial arts (techniques) is undefined");
  } else {
    console.log("martial art (techniques) all g");
    unlinkedMartialArtTechniques = martialArtListParsed;
  }
  const stagedMartialArtTechnique: Array<MartialArtTechniques> = [];
  unlinkedMartialArtTechniques.forEach((martialArtTechnique) => {
    stagedMartialArtTechnique.push(
      new MartialArtTechniques(martialArtTechnique)
    );
  });
  // console.log(martialArts.name);
  return stagedMartialArtTechnique;
};
