import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AugmentationListSchema } from "@shadowrun/common/build/schemas/augmentationSchemas.js";
import type { AugmentationListType } from "@shadowrun/common/build/schemas/augmentationSchemas.js";
import {
  Biowares,
  Cyberwares,
} from "../../models/gear/augmentationGear/augmentationModel.js";
import { augmentationTypeEnum } from "@shadowrun/common";

export const getAugmentations = function () {
  const currentPath = import.meta.url;
  let cyberwares: AugmentationListType | undefined = undefined;
  let biowares: AugmentationListType | undefined = undefined;
  let relativeConverterPath = "converter/jsonFiles/biowares.json";
  const rootPath = "../../../../../";
  let jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  let rawJson = JSON.parse(jsonString);
  const biowareListParsed = AugmentationListSchema.safeParse(rawJson);
  if (biowareListParsed.success) {
    console.log("biowares all g");
    biowares = biowareListParsed.data;
  } else {
    console.log(biowareListParsed.error.errors[0]);
    assert(false);
  }
  const stagedBiowares: Array<Biowares> = [];
  biowares.forEach((augmentation) => {
    assert(augmentation.type === augmentationTypeEnum.Bioware);
    stagedBiowares.push(new Biowares(augmentation));
    // console.log(augmentation.name);
  });

  relativeConverterPath = "converter/jsonFiles/cyberwares.json";
  jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  rawJson = JSON.parse(jsonString);
  const cyberwareListParsed = AugmentationListSchema.safeParse(rawJson);
  if (cyberwareListParsed.success) {
    console.log("cyberwares all g");
    cyberwares = cyberwareListParsed.data;
  } else {
    console.log(cyberwareListParsed.error.errors[0]);
    assert(false);
  }

  const stagedCyberwares: Array<Cyberwares> = [];
  cyberwares.forEach((augmentation) => {
    assert(augmentation.type === augmentationTypeEnum.Cyberware);
    stagedCyberwares.push(new Cyberwares(augmentation));
    // console.log(augmentation.name);
  });
  return { stagedBiowares, stagedCyberwares };
};
