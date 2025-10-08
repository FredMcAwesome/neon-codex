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
import { MentorSchema } from "@neon-codex/common/build/schemas/abilities/talent/mentorSchemas.js";
import { mentorCategoryEnum } from "@neon-codex/common/build/enums.js";
import { type } from "arktype";

const ParagonXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  category: "'Resonance'",
  advantage: "string",
  disadvantage: "string",
  "bonus?": BonusXmlSchema,
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
});
type ParagonXmlType = typeof ParagonXmlSchema.infer;
export const ParagonListXmlSchema = type(ParagonXmlSchema.array());

export function ParseParagons() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/paragons.xml"),
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
  //   jObj.chummer.spells.spell[337].required
  // );

  const paragonListParsed = ParagonListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mentors.mentor
  );

  if (paragonListParsed instanceof type.errors) {
    console.log(paragonListParsed.summary);
    assert(false);
  } else {
    console.log("paragon.xml initial arktype parsed");
  }

  const paragonList = paragonListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const paragonListConverted = paragonList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((paragon) => {
      const convertedParagon = convertParagon(paragon);
      const check = MentorSchema(convertedParagon);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedParagon, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
  // console.log(paragonListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/paragons.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(paragonListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertParagon(paragon: ParagonXmlType) {
  // console.log(`\n${paragon.name}`);

  const bonus =
    paragon.bonus !== undefined ? convertXmlBonus(paragon.bonus) : undefined;
  const source = convertSource(paragon.source);

  return {
    name: paragon.name,
    description: "",
    category: mentorCategoryEnum.Paragon,
    advantage: paragon.advantage,
    disadvantage: paragon.disadvantage,
    ...(bonus !== undefined && { bonus: bonus }),
    source: source,
    page: paragon.page,
  };
}
