import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AugmentationListSchema } from "@neon-codex/common";
import type { AugmentationListType } from "@neon-codex/common";
import {
  Augmentations,
  Biowares,
  Cyberwares,
} from "../../models/rpg/equipment/bodyModification/augmentationModel.js";
import { augmentationCategoryEnum } from "@neon-codex/common";
import { type } from "arktype";

export const getAugmentations = function () {
  const currentPath = import.meta.url;
  let cyberwares: AugmentationListType;
  let biowares: AugmentationListType;
  let relativeConverterPath = "converter/jsonFiles/biowares.json";
  const rootPath = "../../../../../";
  let jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let rawJson = JSON.parse(jsonString);
  const biowareListParsed = AugmentationListSchema(rawJson);
  if (biowareListParsed instanceof type.errors) {
    console.log(biowareListParsed.summary);
    assert(false, "biowares is undefined");
  } else {
    console.log("biowares all g");
    biowares = biowareListParsed;
  }
  const stagedAugmentations: Array<Augmentations> = [];
  biowares.forEach((augmentation) => {
    assert(augmentation.category === augmentationCategoryEnum.Bioware);
    stagedAugmentations.push(new Biowares(augmentation));
    // console.log(augmentation.name);
  });

  relativeConverterPath = "converter/jsonFiles/cyberwares.json";
  jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  rawJson = JSON.parse(jsonString);
  const cyberwareListParsed = AugmentationListSchema(rawJson);
  if (cyberwareListParsed instanceof type.errors) {
    console.log(cyberwareListParsed.summary);
    assert(false, "cyberwares is undefined");
  } else {
    console.log("cyberwares all g");
    cyberwares = cyberwareListParsed;
  }

  cyberwares.forEach((augmentation) => {
    assert(augmentation.category === augmentationCategoryEnum.Cyberware);
    stagedAugmentations.push(new Cyberwares(augmentation));
    // console.log(augmentation.name);
  });
  const unlinkedAugmentations = biowares.concat(cyberwares);
  return { unlinkedAugmentations, stagedAugmentations };
};
