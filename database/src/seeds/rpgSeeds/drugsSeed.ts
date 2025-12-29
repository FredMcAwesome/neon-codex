import { DrugComponentListSchema, DrugListSchema } from "@neon-codex/common";
import type { DrugComponentListType, DrugListType } from "@neon-codex/common";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DrugComponents } from "../../models/rpg/equipment/other/drugComponentModel.js";
import { Drugs } from "../../models/rpg/equipment/other/drugModel.js";
import { type } from "arktype";

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
  const drugListParsed = DrugListSchema(rawJson);
  if (drugListParsed instanceof type.errors) {
    console.log(drugListParsed.summary);
    assert(false, "drugs is undefined");
  } else {
    console.log("drugs all g");
    drugs = drugListParsed;
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
  const drugComponentListParsed = DrugComponentListSchema(rawJson);
  if (drugComponentListParsed instanceof type.errors) {
    console.log(drugComponentListParsed.summary);
    assert(false, "drugComponents is undefined");
  } else {
    console.log("drug components all g");
    drugComponents = drugComponentListParsed;
  }
  const stagedDrugComponents: Array<DrugComponents> = [];
  drugComponents.forEach((drugComponent) => {
    stagedDrugComponents.push(new DrugComponents(drugComponent));
    // console.log(drugComponent.name);
  });
  return stagedDrugComponents;
};
