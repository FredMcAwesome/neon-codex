/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { MentorSchema } from "@neon-codex/common";
import { mentorCategoryEnum } from "@neon-codex/common";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { type } from "arktype";

const MentorSpiritXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  advantage: "string",
  disadvantage: "string",
  "bonus?": BonusXmlSchema,
  choices: {
    choice: type({
      "+": "reject",
      "_set?": "string",
      name: "string",
      // optional as sometimes the bonus is too specific to apply in general
      "bonus?": BonusXmlSchema,
    }).array(),
  },
  "required?": RequiredXmlSchema,
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
});
type MentorSpiritXmlType = typeof MentorSpiritXmlSchema.infer;
export const MentorSpiritListXmlSchema = type(MentorSpiritXmlSchema.array());

export function ParseMentorSpirits() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/mentors.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jObj: any = parser.parse(xml_string);
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.mentors.mentor[73]
  // );

  const mentorListParsed = MentorSpiritListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mentors.mentor
  );

  if (mentorListParsed instanceof type.errors) {
    console.log(mentorListParsed.summary);
    assert(false);
  } else {
    console.log("mentors.xml initial arktype parsed");
  }

  const mentorList = mentorListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const mentorListConverted = mentorList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((mentor) => {
      const convertedMentor = convertMentor(mentor);
      const check = MentorSchema(convertedMentor);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedMentor, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
  // console.log(paragonListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/mentors.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(mentorListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertMentor(mentor: MentorSpiritXmlType) {
  // console.log(`\n${mentor.name}`);

  let choiceCount = 0;
  const choices = mentor.choices.choice.map((choice) => {
    const choiceBonus =
      choice.bonus !== undefined ? convertXmlBonus(choice.bonus) : undefined;
    const set = choice._set !== undefined ? parseInt(choice._set) : 1;
    assert(!isNaN(set));
    choiceCount = set > choiceCount ? set : choiceCount;
    return {
      name: choice.name,
      ...(choiceBonus !== undefined && { bonus: choiceBonus }),
      set: set,
    };
  });

  const bonus =
    mentor.bonus !== undefined ? convertXmlBonus(mentor.bonus) : undefined;
  const required =
    mentor.required !== undefined
      ? convertRequirements(mentor.required)
      : undefined;
  const source = convertSource(mentor.source);

  return {
    name: mentor.name,
    description: "",
    category: mentorCategoryEnum.MentorSpirit,
    advantage: mentor.advantage,
    disadvantage: mentor.disadvantage,
    choices: choices,
    choiceCount: choiceCount,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(required !== undefined && { required: required }),
    source: source,
    page: mentor.page,
  };
}
