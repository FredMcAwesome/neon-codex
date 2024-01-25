import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AugmentationListSchema } from "@shadowrun/common/build/schemas/augmentationSchemas.js";
import type { AugmentationListType } from "@shadowrun/common/build/schemas/augmentationSchemas.js";
import {
  Augmentations,
  Biowares,
  Cyberwares,
} from "../../models/rpg/gear/augmentationGear/augmentationModel.js";
import { augmentationTypeEnum } from "@shadowrun/common/src/enums.js";

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
  const biowareListParsed = AugmentationListSchema.safeParse(rawJson);
  if (biowareListParsed.success) {
    console.log("biowares all g");
    biowares = biowareListParsed.data;
  } else {
    console.log(biowareListParsed.error.errors[0]);
    assert(false, "biowares is undefined");
  }
  const stagedAugmentations: Array<Augmentations> = [];
  biowares.forEach((augmentation) => {
    assert(augmentation.type === augmentationTypeEnum.Bioware);
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
  const cyberwareListParsed = AugmentationListSchema.safeParse(rawJson);
  if (cyberwareListParsed.success) {
    console.log("cyberwares all g");
    cyberwares = cyberwareListParsed.data;
  } else {
    console.log(cyberwareListParsed.error.errors[0]);
    assert(false, "cyberwares is undefined");
  }

  cyberwares.forEach((augmentation) => {
    assert(augmentation.type === augmentationTypeEnum.Cyberware);
    stagedAugmentations.push(new Cyberwares(augmentation));
    // console.log(augmentation.name);
  });
  const unlinkedAugmentations = biowares.concat(cyberwares);
  return { unlinkedAugmentations, stagedAugmentations };
};
