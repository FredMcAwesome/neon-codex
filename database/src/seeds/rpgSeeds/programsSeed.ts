import {
  ProgramListSchema,
  type ProgramListType,
} from "@neon-codex/common/build/schemas/abilities/talent/programSchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Programs } from "../../models/rpg/abilities/programModel.js";

export const getPrograms = function () {
  const currentPath = import.meta.url;
  let programs: ProgramListType;
  const relativeConverterPath = "converter/jsonFiles/programs.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const programListParsed = ProgramListSchema.safeParse(rawJson);
  if (programListParsed.success) {
    console.log("programs all g");
    programs = programListParsed.data;
  } else {
    console.log(programListParsed.error.errors[0]);
    assert(false, "programs is undefined");
  }
  const stagedPrograms: Array<Programs> = [];
  programs.forEach((program) => {
    stagedPrograms.push(new Programs(program));
    // console.log(armourMod.name);
  });
  return stagedPrograms;
};
