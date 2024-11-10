/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import {
  LifestyleListSchema,
  LifestyleSchema,
} from "@neon-codex/common/build/schemas/otherData/lifestyleSchemas.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import {
  gridCategoryEnum,
  lifestyleCostIncrementEnum,
} from "@neon-codex/common/build/enums.js";

const FreeGridXmlSchema = zod
  .object({
    _select: zod.nativeEnum(gridCategoryEnum),
    xmltext: zod.literal("Grid Subscription"),
  })
  .strict();
const FreeGridsXmlSchema = zod
  .object({
    freegrid: zod.union([FreeGridXmlSchema, zod.array(FreeGridXmlSchema)]),
  })
  .strict();
type FreeGridsXmlType = zod.infer<typeof FreeGridsXmlSchema>;
const LifestyleXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    cost: zod.number(),
    // cost per what period (monthly if not specified)
    increment: zod.optional(zod.literal("day")),
    dice: zod.number(),
    // Starting nuyen multiplier
    multiplier: zod.number(),
    // Lifestyle points
    // only optional for error case
    lp: zod.optional(zod.number()),
    // Can add an arbitrary number of extra lp
    // (only used for traveler)
    allowbonuslp: zod.optional(zod.literal("True")),
    // only optional for error case
    freegrids: zod.optional(FreeGridsXmlSchema),
    // increase cost per neighborhood level increase
    costforarea: zod.optional(zod.number()),
    // increase cost per comfort level increase
    costforcomforts: zod.optional(zod.number()),
    // increase cost per security level increase
    costforsecurity: zod.optional(zod.number()),
    bonus: zod.optional(BonusXmlSchema),
    required: zod.optional(RequiredXmlSchema),
    source: zod.nativeEnum(sourceBookXmlEnum),
    page: zod.number(),
    hide: zod.optional(zod.literal("")),
  })
  .strict();
type LifestyleXmlType = zod.infer<typeof LifestyleXmlSchema>;

const LifeStyleAdvancedLevelXmlSchema = zod
  .object({
    name: zod.string(),
    minimum: zod.number(),
    limit: zod.number(),
  })
  .strict();
const LifeStyleAdvancedLevelListXmlSchema = zod.array(
  LifeStyleAdvancedLevelXmlSchema
);
type LifeStyleAdvancedLevelListXmlType = zod.infer<
  typeof LifeStyleAdvancedLevelListXmlSchema
>;

export const LifestyleListXmlSchema = zod.array(LifestyleXmlSchema);

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
  const lifestyleListParsed = LifestyleListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.lifestyles.lifestyle
  );
  const lifestyleComfortListParsed =
    LifeStyleAdvancedLevelListXmlSchema.safeParse(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jObj.chummer.comforts.comfort
    );
  const lifestyleNeighborhoodListParsed =
    LifeStyleAdvancedLevelListXmlSchema.safeParse(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jObj.chummer.neighborhoods.neighborhood
    );
  const lifestyleSecurityListParsed =
    LifeStyleAdvancedLevelListXmlSchema.safeParse(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jObj.chummer.securities.security
    );

  if (lifestyleListParsed.success)
    console.log("lifestyle.xml initial zod parsed");
  else {
    console.log(lifestyleListParsed.error.errors[0]);
    assert(false);
  }
  if (lifestyleComfortListParsed.success)
    console.log("lifestyle.xml (comforts) initial zod parsed");
  else {
    console.log(lifestyleComfortListParsed.error.errors[0]);
    assert(false);
  }
  if (lifestyleNeighborhoodListParsed.success)
    console.log("lifestyle.xml (neighborhoods) initial zod parsed");
  else {
    console.log(lifestyleNeighborhoodListParsed.error.errors[0]);
    assert(false);
  }
  if (lifestyleSecurityListParsed.success)
    console.log("lifestyle.xml (securities) initial zod parsed");
  else {
    console.log(lifestyleSecurityListParsed.error.errors[0]);
    assert(false);
  }

  const lifestyleList = lifestyleListParsed.data;
  const lifestyleListConverted = lifestyleList
    .filter((lifestyle) => {
      return lifestyle.lp !== undefined;
    })
    .map((lifestyle) => {
      assert(lifestyle.lp !== undefined);
      assert(lifestyle.freegrids !== undefined);
      const convertedLifestyle = convertLifestyle({
        xmlLifestyle: lifestyle as LifestyleXmlType & {
          lp: number;
          freegrids: FreeGridsXmlType;
        },
        comforts: lifestyleComfortListParsed.data,
        neighborhoods: lifestyleNeighborhoodListParsed.data,
        securities: lifestyleSecurityListParsed.data,
      });
      const check = LifestyleSchema.safeParse(convertedLifestyle);
      if (!check.success) {
        console.dir(convertedLifestyle, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  const check = LifestyleListSchema.safeParse(lifestyleListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
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
    allowBonusLifestylePoints: allowBonusLifestylePoints,
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
