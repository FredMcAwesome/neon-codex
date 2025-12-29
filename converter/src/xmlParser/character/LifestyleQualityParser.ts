/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertXmlBonus } from "../common/BonusParserHelper.js";

import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  sourceBookXmlEnum,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import {
  LifestyleQualitySchema,
  LifestyleQualityListSchema,
} from "@neon-codex/common";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { lifestyleQualityCategoryEnum } from "@neon-codex/common";
import { type } from "arktype";

const LifestyleQualityXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  category: type.valueOf(lifestyleQualityCategoryEnum),
  "cost?": StringOrNumberSchema,
  // Lifestyle point cost
  lp: "number",
  // lifestyle cost multiplier (1 + multiplier)*cost
  "multiplier?": "number",
  // lifestyle cost multiplier before split with roommates
  // TODO: check if this is correct only used for Extra Secure
  "multiplierbaseonly?": "number",
  // restricted to these lifestyles
  "allowed?": "string",
  // can take this quality multiple times
  "allowmultiple?": "''",
  "security?": "number",
  "securitymaximum?": "number",
  "comforts?": "number",
  "comfortsmaximum?": "number",
  "neighborhood?": "number",
  "bonus?": BonusXmlSchema,
  "required?": RequiredXmlSchema,
  "forbidden?": RequiredXmlSchema,
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
  "hide?": "''",
});
type LifestyleQualityXmlType = typeof LifestyleQualityXmlSchema.infer;

export const LifestyleQualityListXmlSchema = type(
  LifestyleQualityXmlSchema.array()
);

export function ParseLifestyleQualities() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/lifestyles.xml"
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
  //   jObj.chummer.qualities.quality[46]
  // );
  const lifestyleQualityListParsed = LifestyleQualityListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.qualities.quality
  );

  if (lifestyleQualityListParsed instanceof type.errors) {
    console.log(lifestyleQualityListParsed.summary);
    assert(false);
  } else {
    console.log("lifestyle.xml (qualities) initial arktype parsed");
  }

  const lifestyleQualityList = lifestyleQualityListParsed;
  const lifestyleQualityListConverted = lifestyleQualityList.map(
    (lifestyle) => {
      const convertedLifestyleQuality = convertLifestyleQuality(lifestyle);
      const check = LifestyleQualitySchema(convertedLifestyleQuality);
      if (check instanceof type.errors) {
        console.dir(convertedLifestyleQuality, { depth: Infinity });
        throw new Error(check.summary);
      }
      return convertedLifestyleQuality;
    }
  );
  const check = LifestyleQualityListSchema(lifestyleQualityListConverted);
  if (check instanceof type.errors) {
    throw new Error(check.summary);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/lifestyleQualities.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(lifestyleQualityListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertLifestyleQuality = function (xmlQuality: LifestyleQualityXmlType) {
  let bonus;
  let requirements;
  let forbidden;

  if (xmlQuality.bonus !== undefined) {
    bonus = convertXmlBonus(xmlQuality.bonus);
  }
  if (xmlQuality.required !== undefined) {
    requirements = convertRequirements(xmlQuality.required);
  }
  if (xmlQuality.forbidden !== undefined) {
    requirements = convertRequirements(xmlQuality.forbidden);
  }

  return {
    // id: xmlLifestyle.id,
    name: xmlQuality.name,
    category: xmlQuality.category,
    monthlyCost: 0,
    lifestylePointCost: xmlQuality.lp,
    ...(xmlQuality.multiplier !== undefined && {
      lifestyleCostMultiplier: xmlQuality.multiplier,
    }),
    ...(xmlQuality.allowed !== undefined && {
      requiredLifestyleList: xmlQuality.allowed.split(","),
    }),
    ...(xmlQuality.allowmultiple !== undefined && {
      multipleAllowed: true as const,
    }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(forbidden !== undefined && { forbidden: forbidden }),
    source: convertSource(xmlQuality.source),
    page: xmlQuality.page,
    description: "",
  };
};
