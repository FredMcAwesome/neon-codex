/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../ParserCommonDefines.js";
import {
  CyberwareListXmlSchema,
  CyberwareListXmlType,
} from "./CyberwareParserSchemas.js";

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../../xmls/cyberware.xml"),
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
  jObj.chummer.cyberwares.cyberware[356]
);

const cyberwareListParsed = CyberwareListXmlSchema.safeParse(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  jObj.chummer.cyberwares.cyberware
);

if (cyberwareListParsed.success) console.log("all g");
else {
  console.log(cyberwareListParsed.error.errors[0]);
}

if (cyberwareListParsed.success) {
  const cyberwareList = cyberwareListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
  const englishCyberwareList: CyberwareListXmlType = cyberwareList.filter(
    (cyberware) => {
      let found = false;
      switch (cyberware.source) {
        case sourceBookXmlEnum.Shadowrun5:
        case sourceBookXmlEnum.Rigger5:
        case sourceBookXmlEnum.KillCode:
        case sourceBookXmlEnum.TheSeattleGambit:
        case sourceBookXmlEnum.ChromeFlesh:
        case sourceBookXmlEnum.BulletsAndBandages:
        case sourceBookXmlEnum.HardTargets:
        case sourceBookXmlEnum.Lockdown:
        case sourceBookXmlEnum.HowlingShadows:
        case sourceBookXmlEnum.TheCompleteTrog:
        case sourceBookXmlEnum.NoFuture:
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
        // Not containing Cyberware
        case sourceBookXmlEnum.DarkTerrors:
        case sourceBookXmlEnum.TheVladivostokGauntlet:
        case sourceBookXmlEnum.StolenSouls:
        case sourceBookXmlEnum.RunAndGun:
        case sourceBookXmlEnum.RunFaster:
        case sourceBookXmlEnum.CuttingAces:
        case sourceBookXmlEnum.StreetLethal:
        case sourceBookXmlEnum.AssassinPrimer:
        case sourceBookXmlEnum.DataTrails:
        case sourceBookXmlEnum.GunHeaven3:
        case sourceBookXmlEnum.KrimeKatalog:
        case sourceBookXmlEnum.SailAwaySweetSister:
        case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
        case sourceBookXmlEnum.StreetGrimoire:
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
        case sourceBookXmlEnum.BetterThanBad:
        case sourceBookXmlEnum.Aetherology:
        case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
        case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
        case sourceBookXmlEnum.ShadowrunQuickStartRules:
        case sourceBookXmlEnum.SprawlWilds:
          assert(false, cyberware.source);
          break;
      }
      return found;
    }
  );

  console.log(englishCyberwareList);

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
