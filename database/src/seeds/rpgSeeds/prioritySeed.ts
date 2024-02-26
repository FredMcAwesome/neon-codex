import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  PriorityListSchema,
  type PriorityListType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import {
  AttributePriorities,
  HeritagePriorities,
  Priorities,
  ResourcePriorities,
  SkillPriorities,
  TalentPriorities,
} from "../../models/rpg/otherData/priorityModel.js";
import { priorityCategoryEnum } from "@neon-codex/common/build/enums.js";

export const getPriorities = function () {
  const currentPath = import.meta.url;
  let unlinkedPriorities: PriorityListType;
  const relativeConverterPath = "converter/jsonFiles/priorities.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const priorityListParsed = PriorityListSchema.safeParse(rawJson);
  if (priorityListParsed.success) {
    console.log("priorities all g");
    unlinkedPriorities = priorityListParsed.data;
  } else {
    console.log(priorityListParsed.error.errors[0]);
    assert(false, "priorities is undefined");
  }
  const stagedPriorities: Array<Priorities> = [];
  unlinkedPriorities.forEach((priority) => {
    switch (priority.category) {
      case priorityCategoryEnum.Heritage:
        // needs linking later
        stagedPriorities.push(new HeritagePriorities(priority));
        break;
      case priorityCategoryEnum.Attributes:
        stagedPriorities.push(new AttributePriorities(priority));
        break;
      case priorityCategoryEnum.Talent:
        // needs linking later
        stagedPriorities.push(new TalentPriorities(priority));
        break;
      case priorityCategoryEnum.Skills:
        stagedPriorities.push(new SkillPriorities(priority));
        break;
      case priorityCategoryEnum.Resources:
        stagedPriorities.push(new ResourcePriorities(priority));
        break;
    }
    // console.log(metatype.name);
  });
  return {
    unlinkedPriorities,
    stagedPriorities,
  };
};
