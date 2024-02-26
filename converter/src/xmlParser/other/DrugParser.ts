/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { DrugListXmlSchema } from "./DrugParserSchemas.js";
import type { DrugListXmlType, DrugXmlType } from "./DrugParserSchemas.js";
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
  const englishDrugList: DrugListXmlType = drugList.filter((drug) => {
    let found = false;
    switch (drug.source) {
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
        assert(false, drug.source);
        break;
    }
    return found;
  });

  const drugListConverted = englishDrugList
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
