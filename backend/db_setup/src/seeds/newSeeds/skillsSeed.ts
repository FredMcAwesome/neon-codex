import {
  SkillListType,
  SkillListSchema,
} from "@shadowrun/common/src/schemas/skillSchema.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Skills } from "../../../../src/models/chummerdb/skillModel.js";

export const getSkills = function () {
  const currentPath = import.meta.url;
  let skills: SkillListType | undefined = undefined;
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../character/skills.json"),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const skillListParsed = SkillListSchema.safeParse(rawJson);
  if (skillListParsed.success) {
    console.log("skills all g");
    skills = skillListParsed.data;
  } else {
    console.log(skillListParsed.error.errors[0]);
  }
  if (skills === undefined) {
    assert(false);
  }
  const stagedSkills: Array<Skills> = [];
  skills.forEach((skill) => {
    stagedSkills.push(new Skills(skill));
    console.log(skill.name);
  });
  return stagedSkills;
};
