/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z as zod } from "zod";
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { MentorSchema } from "@neon-codex/common/build/schemas/abilities/talent/mentorSchemas.js";
import { mentorCategoryEnum } from "@neon-codex/common/build/enums.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";

const MentorSpiritXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    advantage: zod.string(),
    disadvantage: zod.string(),
    bonus: zod.optional(BonusXmlSchema),
    choices: zod
      .object({
        choice: zod.array(
          zod
            .object({
              _set: zod.optional(zod.string()),
              name: zod.string(),
              // optional as sometimes the bonus is too specific to apply in general
              bonus: zod.optional(BonusXmlSchema),
            })
            .strict()
        ),
      })
      .strict(),
    required: zod.optional(RequiredXmlSchema),
    source: zod.nativeEnum(sourceBookXmlEnum),
    page: zod.number(),
  })
  .strict();
type MentorSpiritXmlType = zod.infer<typeof MentorSpiritXmlSchema>;
export const MentorSpiritListXmlSchema = zod.array(MentorSpiritXmlSchema);

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

  const mentorListParsed = MentorSpiritListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mentors.mentor
  );

  if (mentorListParsed.success) console.log("mentors.xml initial zod parsed");
  else {
    console.log(mentorListParsed.error.errors[0]);
    assert(false);
  }

  const mentorList = mentorListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const mentorListConverted = mentorList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((mentor) => {
      const convertedMentor = convertMentor(mentor);
      const check = MentorSchema.safeParse(convertedMentor);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedMentor);
        throw new Error(check.error.message);
      }
      return check.data;
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
      bonus: choiceBonus,
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
