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

const ParagonXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.literal("Resonance"),
    advantage: zod.string(),
    disadvantage: zod.string(),
    bonus: zod.optional(BonusXmlSchema),
    source: zod.nativeEnum(sourceBookXmlEnum),
    page: zod.number(),
  })
  .strict();
type ParagonXmlType = zod.infer<typeof ParagonXmlSchema>;
export const ParagonListXmlSchema = zod.array(ParagonXmlSchema);

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

  const paragonListParsed = ParagonListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mentors.mentor
  );

  if (paragonListParsed.success) console.log("paragon.xml initial zod parsed");
  else {
    console.log(paragonListParsed.error.errors[0]);
    assert(false);
  }

  const paragonList = paragonListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const paragonListConverted = paragonList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((paragon) => {
      const convertedParagon = convertParagon(paragon);
      const check = MentorSchema.safeParse(convertedParagon);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedParagon);
        throw new Error(check.error.message);
      }
      return check.data;
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
