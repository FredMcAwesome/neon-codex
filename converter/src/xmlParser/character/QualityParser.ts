/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  QualityListSchema,
  QualitySchema,
  type QualityType,
} from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  QualityListXmlSchema,
  type QualityXmlType,
} from "./QualityParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { qualityLimitEnum } from "@neon-codex/common/build/enums.js";

export function ParseQualities() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/qualities.xml"),
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
  //   jObj.chummer.qualities.quality[698]
  // );
  const qualityListParsed = QualityListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.qualities.quality
  );

  if (qualityListParsed.success)
    console.log("qualities.xml initial zod parsed");
  else {
    console.log(qualityListParsed.error.errors[0]);
    assert(false);
  }

  const qualityList = qualityListParsed.data;
  const qualityListConverted = qualityList.map((skill: QualityXmlType) => {
    const convertedQuality = convertQuality(skill);
    const check = QualitySchema.safeParse(convertedQuality);
    if (!check.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.dir(convertedQuality, { depth: Infinity });
      throw new Error(check.error.message);
    }
    return convertedQuality;
  });
  // console.log(qualityListConverted);
  const check = QualityListSchema.safeParse(qualityListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/qualities.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(qualityListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertQuality = function (xmlQuality: QualityXmlType): QualityType {
  let limit;
  if (xmlQuality.limit !== undefined) {
    if (typeof xmlQuality.limit === "number") {
      limit = xmlQuality.limit;
    } else if (xmlQuality.limit === "False") {
      limit = { option: qualityLimitEnum.False };
    } else if (xmlQuality.limit === "{arm} - 1") {
      limit = { option: qualityLimitEnum.ArmCountSubOne };
    } else {
      assert(false, `Unknown limit: ${xmlQuality.limit}`);
    }
  }

  let sharedLimitQualityList;
  if (xmlQuality.includeinlimit !== undefined) {
    sharedLimitQualityList = Array.isArray(xmlQuality.includeinlimit.name)
      ? xmlQuality.includeinlimit.name
      : [xmlQuality.includeinlimit.name];
  }

  let karmaDiscount;
  if (xmlQuality.costdiscount != undefined) {
    karmaDiscount = {
      requirements: convertRequirements(xmlQuality.costdiscount.required),
      value: xmlQuality.costdiscount.value,
    };
  }

  let firstLevelBonus;
  if (xmlQuality.firstlevelbonus !== undefined) {
    if (
      "attributemaxclamp" in xmlQuality.firstlevelbonus &&
      xmlQuality.firstlevelbonus.attributemaxclamp !== undefined
    ) {
      const attributeMaxClamp = Array.isArray(
        xmlQuality.firstlevelbonus.attributemaxclamp
      )
        ? xmlQuality.firstlevelbonus.attributemaxclamp
        : [xmlQuality.firstlevelbonus.attributemaxclamp];
      firstLevelBonus = {
        attributeMaxClamp: attributeMaxClamp,
      };
    } else {
      assert(
        "notoriety" in xmlQuality.firstlevelbonus &&
          xmlQuality.firstlevelbonus.notoriety !== undefined
      );
      firstLevelBonus = {
        notoriety: xmlQuality.firstlevelbonus.notoriety,
      };
    }
  }

  const addWeaponList =
    xmlQuality.addweapon === undefined
      ? undefined
      : Array.isArray(xmlQuality.addweapon)
      ? xmlQuality.addweapon
      : [xmlQuality.addweapon];

  let bonus;
  if (xmlQuality.bonus !== undefined) {
    bonus = convertXmlBonus(xmlQuality.bonus);
  }
  let requirements;
  if (xmlQuality.required !== undefined) {
    requirements = convertRequirements(xmlQuality.required);
  }
  let forbidden;
  if (xmlQuality.forbidden !== undefined) {
    forbidden = convertRequirements(xmlQuality.forbidden);
  }

  return {
    // id: xmlSkill.id,
    name: xmlQuality.name,
    category: xmlQuality.category,
    karma: xmlQuality.karma,
    ...(xmlQuality.chargenonly !== undefined && {
      charGenOnly: true,
    }),
    ...(xmlQuality.chargenlimit !== undefined && {
      charGenLimit: xmlQuality.chargenlimit,
    }),
    ...(xmlQuality.contributetolimit !== undefined && {
      charGenDoNotContributeToKarmaLimit: true,
    }),
    ...(xmlQuality.contributetobp !== undefined && {
      charGenNoKarma: true,
    }),
    ...(xmlQuality.onlyprioritygiven !== undefined && {
      chargenQualityOnly_NotSelectableIfPriorityChargen: true,
    }),
    ...(xmlQuality.careeronly !== undefined && {
      careerOnly: true,
    }),
    ...(xmlQuality.doublecareer !== undefined && {
      charGenCostInCareer: true,
    }),
    limit: limit,
    sharedLimitQualityList: sharedLimitQualityList,
    karmaDiscount: karmaDiscount,
    ...(xmlQuality.nolevels !== undefined && {
      noLevels: true,
    }),
    firstLevelBonus: firstLevelBonus,
    addWeapons: addWeaponList,
    ...(xmlQuality.metagenic !== undefined && {
      isMetagenic: true,
    }),
    ...(xmlQuality.canbuywithspellpoints !== undefined && {
      canBuyWithSpellPoints: true,
    }),
    ...(xmlQuality.hide !== undefined && { userSelectable: false as const }),
    bonus: bonus,
    requirements: requirements,
    forbidden: forbidden,
    description: "",
    source: xmlQuality.source,
    page: xmlQuality.page,
  };
};
