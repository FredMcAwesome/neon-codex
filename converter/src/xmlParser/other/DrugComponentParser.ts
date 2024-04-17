/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { DrugComponentListXmlSchema } from "./DrugComponentParserSchemas.js";
import type { DrugComponentXmlType } from "./DrugComponentParserSchemas.js";
import { availabilityDrugSemantics } from "./DrugParserHelper.js";
import Drug from "../../grammar/drug.ohm-bundle.js";
import { convertSource } from "../common/ParserHelper.js";
import { DrugComponentSchema } from "@neon-codex/common/build/schemas/equipment/other/drugSchemas.js";
const Availability = Drug;

export function ParseDrugComponents() {
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
  //   jObj.chummer.drugcomponents.drugcomponent[20]
  // );

  const drugComponentListParsed = DrugComponentListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.drugcomponents.drugcomponent
  );

  if (drugComponentListParsed.success)
    console.log("drugcomponents.xml (Components) initial zod parsed");
  else {
    console.log(drugComponentListParsed.error.errors[0]);
    assert(false);
  }

  const drugComponentList = drugComponentListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const drugComponentListConverted = drugComponentList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((drug) => {
      const convertedDrugComponent = convertDrugComponent(drug);
      const check = DrugComponentSchema.safeParse(convertedDrugComponent);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedDrugComponent);
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(armourListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/drugComponents.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(drugComponentListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertDrugComponent(drugComponent: DrugComponentXmlType) {
  const match = Availability.match(drugComponent.availability.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability = availabilityDrugSemantics(match).eval();

  const source = convertSource(drugComponent.source);

  return {
    name: drugComponent.name,
    description: "",
    category: drugComponent.category,
    availability: availability,
    cost: drugComponent.cost,
    appliedLimit: drugComponent.limit,
    addictionRating: drugComponent.rating,
    addictionThreshold: drugComponent.threshold,
    source: source,
    page: drugComponent.page,
  };
}
