import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MentorListSchema, type MentorListType } from "@neon-codex/common";
import {
  Mentors,
  MentorSpirits,
  Paragons,
} from "../../models/rpg/otherData/mentorModel.js";
import { mentorCategoryEnum } from "@neon-codex/common";
import { type } from "arktype";

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
  const mentorSpiritListParsed = MentorListSchema(rawJson);
  if (mentorSpiritListParsed instanceof type.errors) {
    console.log(mentorSpiritListParsed.summary);
    assert(false, "mentor spirits is undefined");
  } else {
    console.log("mentor spirits all g");
    unlinkedMentorSpirits = mentorSpiritListParsed;
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
  const paragonListParsed = MentorListSchema(rawJson);
  if (paragonListParsed instanceof type.errors) {
    console.log(paragonListParsed.summary);
    assert(false, "paragons is undefined");
  } else {
    console.log("paragons all g");
    unlinkedParagons = paragonListParsed;
  }

  unlinkedParagons.forEach((mentor) => {
    assert(mentor.category === mentorCategoryEnum.Paragon);
    stagedMentors.push(new Paragons(mentor));
  });
  // console.log(mentor.name);
  return {
    unlinkedMentorSpirits,
    unlinkedParagons,
    stagedMentors,
  };
};
