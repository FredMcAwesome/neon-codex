import {
  DrugComponentListSchema,
  DrugListSchema,
} from "@neon-codex/common/build/schemas/drugSchemas.js";
import type {
  DrugComponentListType,
  DrugListType,
} from "@neon-codex/common/build/schemas/drugSchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DrugComponents } from "../../models/rpg/equipment/other/drugComponentModel.js";
import { Drugs } from "../../models/rpg/equipment/other/drugModel.js";

export const getDrugs = function () {
  const currentPath = import.meta.url;
  let drugs: DrugListType;
  const relativeConverterPath = "converter/jsonFiles/drugs.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const drugListParsed = DrugListSchema.safeParse(rawJson);
  if (drugListParsed.success) {
    console.log("drugs all g");
    drugs = drugListParsed.data;
  } else {
    console.log(drugListParsed.error.errors[0]);
    assert(false, "drugs is undefined");
  }
  const stagedDrugs: Array<Drugs> = [];
  drugs.forEach((drug) => {
    stagedDrugs.push(new Drugs(drug));
    // console.log(drug.name);
  });
  return stagedDrugs;
};

export const getDrugComponents = function () {
  const currentPath = import.meta.url;
  let drugComponents: DrugComponentListType;
  const relativeConverterPath = "converter/jsonFiles/drugComponents.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const drugComponentListParsed = DrugComponentListSchema.safeParse(rawJson);
  if (drugComponentListParsed.success) {
    console.log("drug components all g");
    drugComponents = drugComponentListParsed.data;
  } else {
    console.log(drugComponentListParsed.error.errors[0]);
    assert(false, "drugComponents is undefined");
  }
  const stagedDrugComponents: Array<DrugComponents> = [];
  drugComponents.forEach((drugComponent) => {
    stagedDrugComponents.push(new DrugComponents(drugComponent));
    // console.log(drugComponent.name);
  });
  return stagedDrugComponents;
};
