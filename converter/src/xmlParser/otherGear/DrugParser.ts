/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../ParserCommonDefines.js";
import { DrugListXmlSchema, DrugListXmlType } from "./DrugParserSchemas.js";

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../../xmls/drugcomponents.xml"),
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
  jObj.chummer.drugs.drug[10]
);

const drugListParsed = DrugListXmlSchema.safeParse(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  jObj.chummer.drugs.drug
);

if (drugListParsed.success) console.log("all g");
else {
  console.log(drugListParsed.error.errors[0]);
}

if (drugListParsed.success) {
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

  console.log(englishDrugList);

  // const armourListConverted = englishArmourList
  //   // .filter((weapon) => weapon.name === "Osmium Mace")
  //   .map((armour) => {
  //     const convertedArmour = convertArmour(armour);
  //     return convertedArmour;
  //   });
  // // console.log(armourListConverted);
  // const jsonFilePath = fileURLToPath(
  //   path.dirname(currentPath) + "../../../../jsonFiles/armour.json"
  // );
  // fs.writeFile(
  //   jsonFilePath,
  //   JSON.stringify(armourListConverted, null, 2),
  //   (error) => {
  //     if (error) {
  //       console.error(error);
  //     } else {
  //       console.log(`File written! Saved to: ${jsonFilePath}`);
  //     }
  //   }
  // );
}
