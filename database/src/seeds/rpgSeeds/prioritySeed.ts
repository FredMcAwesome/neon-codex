import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  PriorityTableSchema,
  type PriorityTableType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import { Priorities } from "../../models/rpg/otherData/priorityModel.js";
import { priorityLetterEnum } from "@neon-codex/common/build/enums.js";

export const getPriorities = function () {
  const currentPath = import.meta.url;
  let unlinkedPriorities: PriorityTableType;
  const relativeConverterPath = "converter/jsonFiles/priorities.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const priorityListParsed = PriorityTableSchema.safeParse(rawJson);
  if (priorityListParsed.success) {
    console.log("priorities all g");
    unlinkedPriorities = priorityListParsed.data;
  } else {
    console.log(priorityListParsed.error.errors[0]);
    assert(false, "priorities is undefined");
  }
  const stagedPriorities: Array<Priorities> = [];
  stagedPriorities.push(
    new Priorities({ ...unlinkedPriorities.A, priority: priorityLetterEnum.A })
  );
  stagedPriorities.push(
    new Priorities({ ...unlinkedPriorities.B, priority: priorityLetterEnum.B })
  );
  stagedPriorities.push(
    new Priorities({ ...unlinkedPriorities.C, priority: priorityLetterEnum.C })
  );
  stagedPriorities.push(
    new Priorities({ ...unlinkedPriorities.D, priority: priorityLetterEnum.D })
  );
  stagedPriorities.push(
    new Priorities({ ...unlinkedPriorities.E, priority: priorityLetterEnum.E })
  );
  return {
    unlinkedPriorities,
    stagedPriorities,
  };
};
