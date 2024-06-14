import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ComplexFormListSchema,
  type ComplexFormListType,
} from "@neon-codex/common/build/schemas/abilities/magic/complexFormSchemas.js";
import { ComplexForms } from "../../models/rpg/abilities/complexFormModel.js";

export const getComplexForms = function () {
  const currentPath = import.meta.url;
  let unlinkedComplexForms: ComplexFormListType;
  const relativeConverterPath = "converter/jsonFiles/complexForms.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const complexFormListParsed = ComplexFormListSchema.safeParse(rawJson);
  if (complexFormListParsed.success) {
    console.log("complex forms all g");
    unlinkedComplexForms = complexFormListParsed.data;
  } else {
    console.log(complexFormListParsed.error.errors[0]);
    assert(false, "complex forms is undefined");
  }
  const stagedComplexForms: Array<ComplexForms> = [];
  unlinkedComplexForms.forEach((complexForm) => {
    stagedComplexForms.push(new ComplexForms(complexForm));
    // console.log(complexForm.name);
  });
  return stagedComplexForms;
};
