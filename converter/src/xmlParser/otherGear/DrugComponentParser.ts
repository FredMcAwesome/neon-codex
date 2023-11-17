/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import {
  DrugComponentListXmlSchema,
  DrugComponentListXmlType,
  DrugComponentXmlType,
} from "./DrugComponentParserSchemas.js";
import { availabilityDrugSemantics } from "./DrugHelper.js";
import Drug from "../../grammar/drug.ohm-bundle.js";
import { convertSource } from "../common/ParserHelper.js";
import { DrugComponentSchema } from "@shadowrun/common/build/schemas/drugSchemas.js";
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
  console.log(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.drugcomponents.drugcomponent[20]
  );

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
  const englishDrugComponentList: DrugComponentListXmlType =
    drugComponentList.filter((drugComponent) => {
      let found = false;
      switch (drugComponent.source) {
        case sourceBookXmlEnum.TheVladivostokGauntlet:
        case sourceBookXmlEnum.Shadowrun5:
        case sourceBookXmlEnum.BulletsAndBandages:
        case sourceBookXmlEnum.Lockdown:
        case sourceBookXmlEnum.StolenSouls:
        case sourceBookXmlEnum.ChromeFlesh:
          found = true;
          break;
        // Not in english
        case sourceBookXmlEnum.StateOfTheArtADL:
        case sourceBookXmlEnum.Schattenhandbuch:
        case sourceBookXmlEnum.Schattenhandbuch2:
        case sourceBookXmlEnum.Schattenhandbuch3:
        case sourceBookXmlEnum.Hamburg:
        case sourceBookXmlEnum.DatapulsSOTA2080:
        case sourceBookXmlEnum.DatapulsVerschlusssache:
        case sourceBookXmlEnum.Shadowrun2050:
        case 2050:
        case sourceBookXmlEnum.GrimmesErwachen:
          break;
        // Not containing Drugs
        case sourceBookXmlEnum.RunAndGun:
        case sourceBookXmlEnum.RunFaster:
        case sourceBookXmlEnum.HardTargets:
        case sourceBookXmlEnum.HowlingShadows:
        case sourceBookXmlEnum.CuttingAces:
        case sourceBookXmlEnum.TheCompleteTrog:
        case sourceBookXmlEnum.StreetLethal:
        case sourceBookXmlEnum.KillCode:
        case sourceBookXmlEnum.NoFuture:
        case sourceBookXmlEnum.AssassinPrimer:
        case sourceBookXmlEnum.DataTrails:
        case sourceBookXmlEnum.GunHeaven3:
        case sourceBookXmlEnum.KrimeKatalog:
        case sourceBookXmlEnum.Rigger5:
        case sourceBookXmlEnum.SailAwaySweetSister:
        case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
        case sourceBookXmlEnum.StreetGrimoire:
        case sourceBookXmlEnum.TheSeattleGambit:
        case sourceBookXmlEnum.StreetGrimoireErrata:
        case sourceBookXmlEnum.ShadowSpells:
        case sourceBookXmlEnum.NothingPersonal:
        case sourceBookXmlEnum.BloodyBusiness:
        case sourceBookXmlEnum.DataTrailsDissonantEchoes:
        case sourceBookXmlEnum.SplinteredState:
        case sourceBookXmlEnum.ShadowsInFocus_Butte:
        case sourceBookXmlEnum.HongKongSourcebook:
        case sourceBookXmlEnum.ShadowsInFocus_Metropole:
        case sourceBookXmlEnum.BookOfTheLost:
        case sourceBookXmlEnum.ForbiddenArcana:
        case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
        case sourceBookXmlEnum.DarkTerrors:
        case sourceBookXmlEnum.BetterThanBad:
        case sourceBookXmlEnum.Aetherology:
        case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
        case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
        case sourceBookXmlEnum.ShadowrunQuickStartRules:
        case sourceBookXmlEnum.SprawlWilds:
          assert(false, drugComponent.source);
          break;
      }
      return found;
    });

  const drugComponentListConverted = englishDrugComponentList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((drug) => {
      const convertedDrugComponent = convertDrugComponent(drug);
      const check = DrugComponentSchema.safeParse(convertedDrugComponent);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedDrugComponent);
        throw new Error(check.error.message);
      }
      return convertedDrugComponent;
    });
  // console.log(armourListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/drugs.json"
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
  let match = Availability.match(drugComponent.availability.toString());
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
