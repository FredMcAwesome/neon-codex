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
  TraditionSchema,
  type TraditionType,
} from "@neon-codex/common/build/schemas/abilities/talent/traditionSchemas.js";
import {
  TraditionListXmlSchema,
  traditionXmlDrainAttributeEnum,
  type TraditionXmlType,
} from "./TraditionParserSchemas.js";
import { traditionDrainAttributeEnum } from "@neon-codex/common/build/enums.js";
import { type } from "arktype";

export function ParseTraditions() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/traditions.xml"
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
  //   jObj.chummer.traditions.tradition[95]
  // );

  const traditionListParsed = TraditionListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.traditions.tradition
  );

  if (traditionListParsed instanceof type.errors) {
    console.log(traditionListParsed.summary);
    assert(false);
  } else {
    console.log("traditions.xml initial arktype parsed");
  }

  const traditionList = traditionListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const traditionListConverted = traditionList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((tradition) => {
      const convertedTradition = convertTradition(tradition);
      const check = TraditionSchema(convertedTradition);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedTradition, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
  // console.log(spellListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/traditions.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(traditionListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertTradition(tradition: TraditionXmlType): TraditionType {
  // console.log(`\n${tradition.name}`);

  let drain;
  switch (tradition.drain) {
    case traditionXmlDrainAttributeEnum.WilCha:
      drain = traditionDrainAttributeEnum.WillpowerAndCharisma;
      break;
    case traditionXmlDrainAttributeEnum.WilInt:
      drain = traditionDrainAttributeEnum.WillpowerAndIntuition;
      break;
    case traditionXmlDrainAttributeEnum.WilLog:
      drain = traditionDrainAttributeEnum.WillpowerAndLogic;
      break;
    case traditionXmlDrainAttributeEnum.WilMag:
      drain = traditionDrainAttributeEnum.WillpowerAndMagic;
      break;
    case traditionXmlDrainAttributeEnum.WilWil:
      drain = traditionDrainAttributeEnum.WillpowerAndWillpower;
      break;
    case "":
      drain = traditionDrainAttributeEnum.WillpowerAndSelect;
      break;
  }

  let spirits;
  if (typeof tradition.spirits === "object") {
    if (tradition.spirits.spiritcombat === "All") {
      assert(
        tradition.spirits.spiritdetection === "All" &&
          tradition.spirits.spirithealth === "All" &&
          tradition.spirits.spiritillusion === "All" &&
          tradition.spirits.spiritmanipulation === "All"
      );
      spirits = "All" as const;
    } else {
      spirits = {
        spiritCombat: tradition.spirits.spiritcombat,
        spiritDetection: tradition.spirits.spiritdetection,
        spiritHealth: tradition.spirits.spirithealth,
        spiritIllusion: tradition.spirits.spiritillusion,
        spiritManipulation: tradition.spirits.spiritmanipulation,
      };
    }
  } else {
    spirits = "Select Spirits" as const;
  }

  const bonus =
    tradition.bonus !== undefined
      ? convertXmlBonus(tradition.bonus)
      : undefined;
  const requirements =
    tradition.required !== undefined
      ? convertRequirements(tradition.required)
      : undefined;
  const source = convertSource(tradition.source);

  return {
    name: tradition.name,
    description: "",
    drain: drain,
    ...(tradition.spiritform !== undefined && {
      spiritForm: tradition.spiritform,
    }),
    spiritTypes: spirits,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    source: source,
    page: tradition.page,
  };
}
