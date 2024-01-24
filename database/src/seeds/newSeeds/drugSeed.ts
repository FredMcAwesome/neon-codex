import {
  DrugComponentListSchema,
  DrugListSchema,
} from "@shadowrun/common/build/schemas/drugSchemas.js";
import type {
  DrugComponentListType,
  DrugListType,
} from "@shadowrun/common/build/schemas/drugSchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Drugs } from "../../models/gear/otherGear/drugModel.js";
import { DrugComponents } from "../../models/gear/otherGear/drugComponentModel.js";

export const getDrugs = function () {
  const currentPath = import.meta.url;
  let drugs: DrugListType;
  let relativeConverterPath = "converter/jsonFiles/drugs.json";
  const rootPath = "../../../../../";
  let jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  let rawJson = JSON.parse(jsonString);
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
  let relativeConverterPath = "converter/jsonFiles/drugComponents.json";
  const rootPath = "../../../../../";
  let jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  let rawJson = JSON.parse(jsonString);
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
