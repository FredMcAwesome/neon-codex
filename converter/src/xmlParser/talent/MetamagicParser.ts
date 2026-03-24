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
import { mentorCategoryEnum } from "@neon-codex/common";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { type } from "arktype";
import { MetamagicSchema } from "@neon-codex/common";
import { resolveDuplicateNames } from "../utilities.js";

const MetamagicXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  adept: type.or("'True'", "'False'"),
  magician: type.or("'True'", "'False'"),
  "limit?": "'False'",
  "bonus?": BonusXmlSchema,
  "required?": RequiredXmlSchema,
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
});
type MetamagicXmlType = typeof MetamagicXmlSchema.infer;
export const MetamagicListXmlSchema = type(MetamagicXmlSchema.array());

export function ParseMetamagics() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/metamagic.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jObj: any = parser.parse(xml_string);
  // console.dir(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.metamagics.metamagic[5],
  //   // jObj.chummer.metamagics.metamagic[41].required.allof.quality
  //   { depth: Infinity }
  // );

  const metamagicListParsed = MetamagicListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.metamagics.metamagic
  );

  if (metamagicListParsed instanceof type.errors) {
    console.log(metamagicListParsed.summary);
    assert(false);
    console.log("metamagic.xml initial arktype parsed");
  }
  const metamagicListConverted = metamagicListParsed.map((metamagic) => {
    const convertedMetamagic = convertMetamagic(metamagic);
    const check = MetamagicSchema(convertedMetamagic);
    if (check instanceof type.errors) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.dir(convertedMetamagic, { depth: Infinity });
      throw new Error(check.summary);
    }
    return check;
  });
  resolveDuplicateNames(metamagicListConverted, "metamagic.xml");
  // console.log(metamagicListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/metamagics.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(metamagicListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertMetamagic(metamagic: MetamagicXmlType) {
  // console.log(`\n${mentor.name}`);

  const bonus =
    metamagic.bonus !== undefined
      ? convertXmlBonus(metamagic.bonus)
      : undefined;
  const required =
    metamagic.required !== undefined
      ? convertRequirements(metamagic.required)
      : undefined;
  const source = convertSource(metamagic.source);

  return {
    name: metamagic.name,
    description: "",
    category: mentorCategoryEnum.MentorSpirit,
    adept: metamagic.adept === "True",
    magician: metamagic.magician === "True",
    ...(metamagic.limit === "False" && { repeatable: true }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(required !== undefined && { requirements: required }),
    source: source,
    page: metamagic.page,
  };
}
