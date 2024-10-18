import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MentorListSchema,
  type MentorListType,
} from "@neon-codex/common/build/schemas/abilities/talent/mentorSchemas.js";
import {
  Mentors,
  MentorSpirits,
  Paragons,
} from "../../models/rpg/otherData/mentorModel.js";
import { mentorCategoryEnum } from "@neon-codex/common/build/enums.js";

export const getMentors = function () {
  const currentPath = import.meta.url;
  let unlinkedMentorSpirits: MentorListType;
  let unlinkedParagons: MentorListType;
  let relativeConverterPath = "converter/jsonFiles/mentors.json";
  const rootPath = "../../../../../";
  let jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let rawJson = JSON.parse(jsonString);
  const mentorSpiritListParsed = MentorListSchema.safeParse(rawJson);
  if (mentorSpiritListParsed.success) {
    console.log("mentor spirits all g");
    unlinkedMentorSpirits = mentorSpiritListParsed.data;
  } else {
    console.log(mentorSpiritListParsed.error.errors[0]);
    assert(false, "mentor spirits is undefined");
  }
  const stagedMentors: Array<Mentors> = [];
  unlinkedMentorSpirits.forEach((mentor) => {
    assert(mentor.category === mentorCategoryEnum.MentorSpirit);
    stagedMentors.push(new MentorSpirits(mentor));
  });

  relativeConverterPath = "converter/jsonFiles/paragons.json";
  jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  rawJson = JSON.parse(jsonString);
  const paragonListParsed = MentorListSchema.safeParse(rawJson);
  if (paragonListParsed.success) {
    console.log("paragons all g");
    unlinkedParagons = paragonListParsed.data;
  } else {
    console.log(paragonListParsed.error.errors[0]);
    assert(false, "paragons is undefined");
  }

  unlinkedParagons.forEach((mentor) => {
    assert(mentor.category === mentorCategoryEnum.Paragon);
    stagedMentors.push(new Paragons(mentor));
  });
  // console.log(mentor.name);
  return stagedMentors;
};
