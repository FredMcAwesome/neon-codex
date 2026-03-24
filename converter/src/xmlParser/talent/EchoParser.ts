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
import { type } from "arktype";
import { EchoSchema } from "@neon-codex/common";
import { resolveDuplicateNames } from "../utilities.js";

const EchoXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  "bonus?": BonusXmlSchema,
  "limit?": type.or("'False'", "number", "'Mental'"),
  "hide?": "''",
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
});
type EchoXmlType = typeof EchoXmlSchema.infer;
export const EchoListXmlSchema = type(EchoXmlSchema.array());

export function ParseEchos() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/echoes.xml"),
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
  //   jObj.chummer.echoes.echo[28],
  //   { depth: Infinity }
  // );

  const EchoListParsed = EchoListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.echoes.echo
  );

  if (EchoListParsed instanceof type.errors) {
    console.log(EchoListParsed.summary);
    assert(false);
  } else {
    console.log("echoes.xml initial arktype parsed");
  }

  const EchoListConverted = EchoListParsed.map((Echo) => {
    const convertedEcho = convertEcho(Echo);
    const check = EchoSchema(convertedEcho);
    if (check instanceof type.errors) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.dir(convertedEcho, { depth: Infinity });
      throw new Error(check.summary);
    }
    return check;
  });
  resolveDuplicateNames(EchoListConverted, "echoes.xml");
  // console.log(EchoListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/echoes.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(EchoListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertEcho(Echo: EchoXmlType) {
  // console.log(`\n${mentor.name}`);

  const bonus =
    Echo.bonus !== undefined ? convertXmlBonus(Echo.bonus) : undefined;

  const source = convertSource(Echo.source);

  return {
    name: Echo.name,
    description: "",
    category: mentorCategoryEnum.MentorSpirit,
    ...(Echo.limit === "False" && { repeatable: true }),
    ...(bonus !== undefined && { bonus: bonus }),
    source: source,
    page: Echo.page,
  };
}
