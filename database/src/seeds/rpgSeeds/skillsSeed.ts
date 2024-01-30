import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Skills } from "../../models/rpg/abilities/skillModel.js";
import { SkillListSchema } from "@neon-codex/common/build/schemas/skillSchemas.js";
import type { SkillListType } from "@neon-codex/common/build/schemas/skillSchemas.js";

export const getSkills = function () {
  const currentPath = import.meta.url;
  let skills: SkillListType;
  const relativeConverterPath = "converter/jsonFiles/skills.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const skillListParsed = SkillListSchema.safeParse(rawJson);
  if (skillListParsed.success) {
    console.log("skills all g");
    skills = skillListParsed.data;
  } else {
    console.log(skillListParsed.error.errors[0]);
    assert(false, "skills is undefined");
  }
  const stagedSkills: Array<Skills> = [];
  skills.forEach((skill) => {
    stagedSkills.push(new Skills(skill));
    // console.log(skill.name);
  });
  return stagedSkills;
};
