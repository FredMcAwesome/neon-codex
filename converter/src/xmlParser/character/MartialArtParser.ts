/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertXmlBonus } from "../common/BonusParserHelper.js";

import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { MartialArtListSchema, MartialArtSchema } from "@neon-codex/common";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { type } from "arktype";
import { resolveDuplicateNames } from "../utilities.js";

const MartialArtXmlSchema = type.or(
  type({
    "+": "reject",
    id: "string",
    name: "string",
    "cost?": "number",
    "bonus?": BonusXmlSchema,
    "required?": RequiredXmlSchema,
    techniques: {
      technique: type({ "+": "reject", name: "string" }).array(),
    },
    source: type.valueOf(sourceBookXmlEnum),
    page: "number",
  }),
  type({
    "+": "reject",
    id: "string",
    name: "string",
    isquality: "'True'",
    alltechniques: "''",
    source: type.valueOf(sourceBookXmlEnum),
    page: "number",
  })
);
type MartialArtXmlType = typeof MartialArtXmlSchema.infer;

export const MartialArtListXmlSchema = type(MartialArtXmlSchema.array());

export function ParseMartialArts() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/martialarts.xml"
    ),
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
  //   jObj.chummer.martialarts.martialart[51]
  // );
  const martialArtListParsed = MartialArtListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.martialarts.martialart
  );

  if (martialArtListParsed instanceof type.errors) {
    console.log(martialArtListParsed.summary);
    assert(false);
  } else {
    console.log("martialarts.xml initial arktype parsed");
  }

  const martialArtListConverted = martialArtListParsed.map(
    (martialArt: MartialArtXmlType) => {
      const convertedMartialArt = convertMartialArt(martialArt);
      const check = MartialArtSchema(convertedMartialArt);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedMartialArt, { depth: Infinity });
        throw new Error(check.summary);
      }
      return convertedMartialArt;
    }
  );
  resolveDuplicateNames(martialArtListConverted, "martialarts.xml");
  // console.log(qualityListConverted);
  const check = MartialArtListSchema(martialArtListConverted);
  if (check instanceof type.errors) {
    throw new Error(check.summary);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/martialArts.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(martialArtListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertMartialArt = function (xmlMartialArt: MartialArtXmlType) {
  let bonus;
  let techniqueList;
  let requirements;
  let karmaCost;
  if ("techniques" in xmlMartialArt) {
    techniqueList = xmlMartialArt.techniques.technique.map((technique) => {
      return technique.name;
    });
    if (xmlMartialArt.bonus !== undefined) {
      bonus = convertXmlBonus(xmlMartialArt.bonus);
    }
    if (xmlMartialArt.required !== undefined) {
      requirements = convertRequirements(xmlMartialArt.required);
    }
    if (xmlMartialArt.cost !== undefined) {
      karmaCost = xmlMartialArt.cost;
    }
  } else {
    techniqueList = {
      allTechniques: true as const,
    };
  }

  return {
    // id: xmlMartialArt.id,
    name: xmlMartialArt.name,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(karmaCost !== undefined && { karmaCost: karmaCost }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(techniqueList !== undefined && { techniqueList: techniqueList }),
    source: convertSource(xmlMartialArt.source),
    page: xmlMartialArt.page,
    description: "",
  };
};
