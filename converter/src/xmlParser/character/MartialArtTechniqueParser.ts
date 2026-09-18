import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertXmlBonus } from "../common/BonusParserHelper.js";

import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import {
  MartialArtTechniqueListSchema,
  MartialArtTechniqueSchema,
} from "@neon-codex/common";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { type } from "arktype";
import { resolveDuplicateNames } from "../utilities.js";

const MartialArtTechniqueXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  "bonus?": BonusXmlSchema,
  "required?": RequiredXmlSchema,
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
});
type MartialArtTechniqueXmlType = typeof MartialArtTechniqueXmlSchema.infer;

export const MartialArtTechniqueListXmlSchema = type(
  MartialArtTechniqueXmlSchema
).array();

export function ParseMartialArtTechniques() {
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
  const jObj: any = parser.parse(xml_string);

  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.techniques.technique[51]
  // );
  const martialArtTechniqueListParsed = MartialArtTechniqueListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.techniques.technique
  );

  if (martialArtTechniqueListParsed instanceof type.errors) {
    console.log(martialArtTechniqueListParsed.summary);
    assert(false);
  } else {
    console.log("martialarts (techniques).xml initial arktype parsed");
  }

  const martialArtTechniqueListConverted = martialArtTechniqueListParsed.map(
    (technique: MartialArtTechniqueXmlType) => {
      const convertedMartialArtTechnique =
        convertMartialArtTechnique(technique);
      const check = MartialArtTechniqueSchema(convertedMartialArtTechnique);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedMartialArtTechnique);
        throw new Error(check.summary);
      }
      return convertedMartialArtTechnique;
    }
  );
  resolveDuplicateNames(
    martialArtTechniqueListConverted,
    "martialarts.xml (technique)"
  );
  // console.log(qualityListConverted);
  const check = MartialArtTechniqueListSchema(martialArtTechniqueListConverted);
  if (check instanceof type.errors) {
    throw new Error(check.summary);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) +
      "../../../../jsonFiles/martialArtTechniques.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(martialArtTechniqueListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertMartialArtTechnique = function (
  xmlMartialArtTechnique: MartialArtTechniqueXmlType
) {
  let bonus;

  if (xmlMartialArtTechnique.bonus !== undefined) {
    bonus = convertXmlBonus(xmlMartialArtTechnique.bonus);
  }

  let requirements;

  if (xmlMartialArtTechnique.required !== undefined) {
    requirements = convertRequirements(xmlMartialArtTechnique.required);
  }

  return {
    // id: xmlMartialArt.id,
    name: xmlMartialArtTechnique.name,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    source: convertSource(xmlMartialArtTechnique.source),
    page: xmlMartialArtTechnique.page,
    description: "",
  };
};
