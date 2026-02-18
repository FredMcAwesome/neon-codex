/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertXmlBonus } from "../common/BonusParserHelper.js";

import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { LifestyleListSchema, LifestyleSchema } from "@neon-codex/common";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import {
  gridCategoryEnum,
  lifestyleCostIncrementEnum,
} from "@neon-codex/common";
import { type } from "arktype";

const FreeGridXmlSchema = type({
  "+": "reject",
  _select: type.valueOf(gridCategoryEnum),
  xmltext: "'Grid Subscription'",
});
const FreeGridsXmlSchema = type({
  "+": "reject",
  freegrid: type.or(FreeGridXmlSchema, FreeGridXmlSchema.array()),
});
type FreeGridsXmlType = typeof FreeGridsXmlSchema.infer;
const LifestyleXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  cost: "number",
  // cost per what period (monthly if not specified)
  "increment?": "'day'",
  dice: "number",
  // Starting nuyen multiplier
  multiplier: "number",
  // Lifestyle points
  // only optional for error case
  "lp?": "number",
  // Can add an arbitrary number of extra lp
  // (only used for traveler)
  "allowbonuslp?": "'True'",
  // only optional for error case
  "freegrids?": FreeGridsXmlSchema,
  // increase cost per neighborhood level increase
  "costforarea?": "number",
  // increase cost per comfort level increase
  "costforcomforts?": "number",
  // increase cost per security level increase
  "costforsecurity?": "number",
  "bonus?": BonusXmlSchema,
  "required?": RequiredXmlSchema,
  source: type.valueOf(sourceBookXmlEnum),
  page: "number",
  "hide?": "''",
});
type LifestyleXmlType = typeof LifestyleXmlSchema.infer;

const LifeStyleAdvancedLevelXmlSchema = type({
  "+": "reject",
  name: "string",
  minimum: "number",
  limit: "number",
});
const LifeStyleAdvancedLevelListXmlSchema = type(
  LifeStyleAdvancedLevelXmlSchema
).array();
type LifeStyleAdvancedLevelListXmlType =
  typeof LifeStyleAdvancedLevelListXmlSchema.infer;

export const LifestyleListXmlSchema = type(LifestyleXmlSchema.array());

export function ParseLifestyles() {
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
  //   jObj.chummer.lifestyles.lifestyle[51]
  // );
  const lifestyleListParsed = LifestyleListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.lifestyles.lifestyle
  );
  const lifestyleComfortListParsed = LifeStyleAdvancedLevelListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.comforts.comfort
  );
  const lifestyleNeighborhoodListParsed = LifeStyleAdvancedLevelListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.neighborhoods.neighborhood
  );
  const lifestyleSecurityListParsed = LifeStyleAdvancedLevelListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.securities.security
  );

  if (lifestyleListParsed instanceof type.errors) {
    console.log(lifestyleListParsed.summary);
    assert(false);
  } else {
    console.log("lifestyle.xml initial arktype parsed");
  }
  if (lifestyleComfortListParsed instanceof type.errors) {
    console.log(lifestyleComfortListParsed.summary);
    assert(false);
  } else {
    console.log("lifestyle.xml (comforts) initial arktype parsed");
  }
  if (lifestyleNeighborhoodListParsed instanceof type.errors) {
    console.log(lifestyleNeighborhoodListParsed.summary);
    assert(false);
  } else {
    console.log("lifestyle.xml (neighborhoods) initial arktype parsed");
  }
  if (lifestyleSecurityListParsed instanceof type.errors) {
    console.log(lifestyleSecurityListParsed.summary);
    assert(false);
  } else {
    console.log("lifestyle.xml (securities) initial arktype parsed");
  }

  const lifestyleList = lifestyleListParsed;
  const lifestyleListConverted = lifestyleList
    .filter((lifestyle) => {
      return lifestyle.lp !== undefined && !lifestyle.name.includes("ID ERROR");
    })
    .map((lifestyle) => {
      assert(lifestyle.lp !== undefined, `${lifestyle.name} missing lp`);
      assert(
        lifestyle.freegrids !== undefined,
        `${lifestyle.name} missing freegrids`
      );
      const convertedLifestyle = convertLifestyle({
        xmlLifestyle: lifestyle as LifestyleXmlType & {
          lp: number;
          freegrids: FreeGridsXmlType;
        },
        comforts: lifestyleComfortListParsed,
        neighborhoods: lifestyleNeighborhoodListParsed,
        securities: lifestyleSecurityListParsed,
      });
      const check = LifestyleSchema(convertedLifestyle);
      if (check instanceof type.errors) {
        console.dir(convertedLifestyle, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
  const check = LifestyleListSchema(lifestyleListConverted);
  if (check instanceof type.errors) {
    throw new Error(check.summary);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/lifestyles.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(lifestyleListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertLifestyle = function ({
  xmlLifestyle,
  comforts,
  neighborhoods,
  securities,
}: {
  xmlLifestyle: LifestyleXmlType & { lp: number; freegrids: FreeGridsXmlType };
  comforts: LifeStyleAdvancedLevelListXmlType;
  neighborhoods: LifeStyleAdvancedLevelListXmlType;
  securities: LifeStyleAdvancedLevelListXmlType;
}) {
  let bonus;
  let requirements;

  if (xmlLifestyle.bonus !== undefined) {
    bonus = convertXmlBonus(xmlLifestyle.bonus);
  }
  if (xmlLifestyle.required !== undefined) {
    requirements = convertRequirements(xmlLifestyle.required);
  }
  let costIncrement = lifestyleCostIncrementEnum.Monthly;
  if (xmlLifestyle.increment !== undefined) {
    // assert here just in case other increments are added later
    // (so I don't forget to update this)
    assert(xmlLifestyle.increment === "day");
    costIncrement = lifestyleCostIncrementEnum.Daily;
  }
  let lifestyleCategoryDefaults;
  if (xmlLifestyle.lp > 0) {
    let comfortInfo;
    let neighborhoodInfo;
    let securityInfo;
    comfortInfo = comforts.filter((comfort) => {
      return comfort.name === xmlLifestyle.name;
    });
    assert(
      comfortInfo.length === 1,
      `comfortInfo length = ${comfortInfo.length}, ${xmlLifestyle.name}`
    );
    comfortInfo = comfortInfo[0];
    neighborhoodInfo = neighborhoods.filter((neighborhood) => {
      return neighborhood.name === xmlLifestyle.name;
    });
    assert(
      neighborhoodInfo.length === 1,
      `neighborhoodInfo length = ${neighborhoodInfo.length}, ${xmlLifestyle.name}`
    );
    neighborhoodInfo = neighborhoodInfo[0];
    securityInfo = securities.filter((security) => {
      return security.name === xmlLifestyle.name;
    });
    assert(
      securityInfo.length === 1,
      `securityInfo length = ${securityInfo.length}, ${xmlLifestyle.name}`
    );
    securityInfo = securityInfo[0];

    lifestyleCategoryDefaults = {
      comfortInfo: {
        minimum: comfortInfo.minimum,
        limit: comfortInfo.limit,
      },
      neighborhoodInfo: {
        minimum: neighborhoodInfo.minimum,
        limit: neighborhoodInfo.limit,
      },
      securityInfo: {
        minimum: securityInfo.minimum,
        limit: securityInfo.limit,
      },
    };
  }
  let costIncreasePerCategoryLevelIncrease;
  if (xmlLifestyle.costforarea !== undefined) {
    assert(xmlLifestyle.costforcomforts !== undefined);
    assert(xmlLifestyle.costforsecurity !== undefined);
    costIncreasePerCategoryLevelIncrease = {
      comfort: xmlLifestyle.costforcomforts,
      neighborhood: xmlLifestyle.costforarea,
      security: xmlLifestyle.costforsecurity,
    };
  }
  const allowBonusLifestylePoints =
    xmlLifestyle.allowbonuslp !== undefined ? (true as const) : undefined;
  const freegrids = Array.isArray(xmlLifestyle.freegrids.freegrid)
    ? xmlLifestyle.freegrids.freegrid
    : [xmlLifestyle.freegrids.freegrid];
  return {
    // id: xmlLifestyle.id,
    name: xmlLifestyle.name,
    cost: {
      cost: xmlLifestyle.cost,
      increment: costIncrement,
    },
    lifestylePoints: xmlLifestyle.lp,
    ...(allowBonusLifestylePoints !== undefined && {
      allowBonusLifestylePoints: allowBonusLifestylePoints,
    }),
    freegridList: freegrids.map((freegrid) => freegrid._select),
    dice: xmlLifestyle.dice,
    startingNuyenMultiplier: xmlLifestyle.multiplier,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(costIncreasePerCategoryLevelIncrease !== undefined && {
      costIncreasePerCategoryLevelIncrease:
        costIncreasePerCategoryLevelIncrease,
    }),
    ...(lifestyleCategoryDefaults !== undefined && {
      lifestyleCategoryDefaults: lifestyleCategoryDefaults,
    }),
    source: convertSource(xmlLifestyle.source),
    page: xmlLifestyle.page,
    description: "",
  };
};
