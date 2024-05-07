/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { DrugListXmlSchema } from "./DrugParserSchemas.js";
import type { DrugXmlType } from "./DrugParserSchemas.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { availabilityDrugSemantics } from "./DrugParserHelper.js";
import { DrugSchema } from "@neon-codex/common/build/schemas/equipment/other/drugSchemas.js";
import Drug from "../../grammar/drug.ohm-bundle.js";
const Availability = Drug;

export function ParseDrugs() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/drugcomponents.xml"
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
  //   jObj.chummer.drugs.drug[6].bonus
  // );

  const drugListParsed = DrugListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.drugs.drug
  );

  if (drugListParsed.success)
    console.log("drugcomponents.xml initial zod parsed");
  else {
    console.log(drugListParsed.error.errors[0]);
    assert(false);
  }

  const drugList = drugListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const drugListConverted = drugList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((drug) => {
      const convertedDrug = convertDrug(drug);
      const check = DrugSchema.safeParse(convertedDrug);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedDrug);
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(armourListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/drugs.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(drugListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertDrug(drug: DrugXmlType) {
  let match = Availability.match(drug.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const availability = availabilityDrugSemantics(match).eval();

  const bonus =
    drug.bonus === undefined ? undefined : convertXmlBonus(drug.bonus);
  const source = convertSource(drug.source);

  return {
    name: drug.name,
    description: "",
    category: drug.category,
    availability: availability,
    cost: drug.cost,
    speed: drug.speed,
    bonus: bonus,
    source: source,
    page: drug.page,
  };
}
