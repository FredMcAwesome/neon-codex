/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import {
  AdeptPowerSchema,
  type AdeptPowerType,
} from "@neon-codex/common/build/schemas/abilities/talent/adeptPowerSchemas.js";
import {
  AdeptPowerListXmlSchema,
  type AdeptPowerXmlType,
} from "./AdeptPowerParserSchemas.js";

export function ParseAdeptPowers() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/powers.xml"),
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
  //   jObj.chummer.powers.power[95]
  // );

  const adeptPowerListParsed = AdeptPowerListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.powers.power
  );

  if (adeptPowerListParsed.success)
    console.log("powers.xml initial zod parsed");
  else {
    console.log(adeptPowerListParsed.error.errors[0]);
    assert(false);
  }

  const adeptPowerList = adeptPowerListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const adeptPowerListConverted = adeptPowerList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((adeptPower) => {
      const convertedAdeptPower = convertAdeptPower(adeptPower);
      const check = AdeptPowerSchema.safeParse(convertedAdeptPower);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedAdeptPower);
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(spellListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/adeptPowers.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(adeptPowerListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertAdeptPower(adeptPower: AdeptPowerXmlType): AdeptPowerType {
  // console.log(`\n${adeptPower.name}`);

  const adeptWayRequirements =
    adeptPower.adeptwayrequires !== undefined &&
    "required" in adeptPower.adeptwayrequires
      ? convertRequirements(adeptPower.adeptwayrequires.required)
      : undefined;
  assert(
    adeptWayRequirements === undefined ||
      adeptPower.adeptway != undefined ||
      // Some powers are listed under an adept way even though they can't be reduced
      adeptPower.points <= 0.25,
    `Adept Way Requirements without an Adept Way for power: ${adeptPower.name}`
  );
  let adeptWay;
  if (adeptPower.adeptway !== undefined) {
    adeptWay = {
      pointCost: adeptPower.adeptway,
      ...(adeptWayRequirements !== undefined && {
        requirements: adeptWayRequirements,
      }),
    };
  }

  const sharedLimitAdeptPowerList =
    adeptPower.includeinlimit !== undefined
      ? Array.isArray(adeptPower.includeinlimit)
        ? adeptPower.includeinlimit.map((include) => {
            return include.name;
          })
        : [adeptPower.includeinlimit.name]
      : undefined;

  const bonus =
    adeptPower.bonus !== undefined
      ? convertXmlBonus(adeptPower.bonus)
      : undefined;
  const requirements =
    adeptPower.required !== undefined
      ? convertRequirements(adeptPower.required)
      : undefined;
  const forbidden =
    adeptPower.forbidden !== undefined
      ? convertRequirements(adeptPower.forbidden)
      : undefined;
  const source = convertSource(adeptPower.source);

  return {
    name: adeptPower.name,
    description: "",
    pointCost: adeptPower.points,
    extraFirstLevelPointCost: adeptPower.extrapointcost,
    levels: adeptPower.levels === "True",
    limit: adeptPower.limit,
    sharedLimitAdeptPowerList: sharedLimitAdeptPowerList,
    action: adeptPower.action,
    adeptWay: adeptWay,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(forbidden !== undefined && { forbidden: forbidden }),
    source: source,
    page: adeptPower.page,
  };
}
