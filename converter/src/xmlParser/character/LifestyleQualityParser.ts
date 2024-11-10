/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import {
  sourceBookXmlEnum,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import {
  LifestyleQualitySchema,
  LifestyleQualityListSchema,
} from "@neon-codex/common/build/schemas/otherData/lifestyleSchemas.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { lifestyleQualityCategoryEnum } from "@neon-codex/common/build/enums.js";

const LifestyleQualityXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    category: zod.nativeEnum(lifestyleQualityCategoryEnum),
    cost: zod.optional(StringOrNumberSchema),
    // Lifestyle point cost
    lp: zod.number(),
    // lifestyle cost multiplier (1 + multiplier)*cost
    multiplier: zod.optional(zod.number()),
    // lifestyle cost multiplier before split with roommates
    // TODO: check if this is correct only used for Extra Secure
    multiplierbaseonly: zod.optional(zod.number()),
    // restricted to these lifestyles
    allowed: zod.optional(zod.string()),
    // can take this quality multiple times
    allowmultiple: zod.optional(zod.literal("")),
    security: zod.optional(zod.number()),
    securitymaximum: zod.optional(zod.number()),
    comforts: zod.optional(zod.number()),
    comfortsmaximum: zod.optional(zod.number()),
    neighborhood: zod.optional(zod.number()),
    bonus: zod.optional(BonusXmlSchema),
    required: zod.optional(RequiredXmlSchema),
    forbidden: zod.optional(RequiredXmlSchema),
    source: zod.nativeEnum(sourceBookXmlEnum),
    page: zod.number(),
    hide: zod.optional(zod.literal("")),
  })
  .strict();
type LifestyleQualityXmlType = zod.infer<typeof LifestyleQualityXmlSchema>;

export const LifestyleQualityListXmlSchema = zod.array(
  LifestyleQualityXmlSchema
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
  const lifestyleQualityListParsed = LifestyleQualityListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.qualities.quality
  );

  if (lifestyleQualityListParsed.success)
    console.log("lifestyle.xml (qualities) initial zod parsed");
  else {
    console.log(lifestyleQualityListParsed.error.errors[0]);
    assert(false);
  }

  const lifestyleQualityList = lifestyleQualityListParsed.data;
  const lifestyleQualityListConverted = lifestyleQualityList.map(
    (lifestyle) => {
      const convertedLifestyleQuality = convertLifestyleQuality(lifestyle);
      const check = LifestyleQualitySchema.safeParse(convertedLifestyleQuality);
      if (!check.success) {
        console.dir(convertedLifestyleQuality, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return convertedLifestyleQuality;
    }
  );
  const check = LifestyleQualityListSchema.safeParse(
    lifestyleQualityListConverted
  );
  if (!check.success) {
    throw new Error(check.error.message);
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
    lifestyleCostMultiplier: xmlQuality.multiplier,
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
