/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import {
  VehicleListXmlSchema,
  VehicleListXmlType,
} from "./VehicleParserSchemas.js";

export function ParseVehicles() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/vehicles.xml"),
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
  //   jObj.chummer.vehicles.vehicle[230].mods
  // );

  const vehicleListParsed = VehicleListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.vehicles.vehicle
  );

  if (vehicleListParsed.success) console.log("vehicles.xml initial zod parsed");
  else {
    console.log(vehicleListParsed.error.errors[0]);
    assert(false);
  }

  const vehicleList = vehicleListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
  const englishVehicleList: VehicleListXmlType = vehicleList.filter(
    (vehicle) => {
      let found = false;
      switch (vehicle.source) {
        case sourceBookXmlEnum.Shadowrun5:
        case sourceBookXmlEnum.Rigger5:
        case sourceBookXmlEnum.StolenSouls:
        case sourceBookXmlEnum.NothingPersonal:
        case sourceBookXmlEnum.BulletsAndBandages:
        case sourceBookXmlEnum.HardTargets:
        case sourceBookXmlEnum.TheVladivostokGauntlet:
        case sourceBookXmlEnum.CuttingAces:
        case sourceBookXmlEnum.TheCompleteTrog:
        case sourceBookXmlEnum.ShadowsInFocus_Metropole:
        case sourceBookXmlEnum.TheSeattleGambit:
        case sourceBookXmlEnum.StreetLethal:
        case sourceBookXmlEnum.NoFuture:
        case sourceBookXmlEnum.KrimeKatalog:
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
        case sourceBookXmlEnum.KillCode:
        case sourceBookXmlEnum.ChromeFlesh:
        case sourceBookXmlEnum.Lockdown:
        case sourceBookXmlEnum.HowlingShadows:
        case sourceBookXmlEnum.DarkTerrors:
        case sourceBookXmlEnum.RunAndGun:
        case sourceBookXmlEnum.RunFaster:
        case sourceBookXmlEnum.AssassinPrimer:
        case sourceBookXmlEnum.DataTrails:
        case sourceBookXmlEnum.GunHeaven3:
        case sourceBookXmlEnum.SailAwaySweetSister:
        case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
        case sourceBookXmlEnum.StreetGrimoire:
        case sourceBookXmlEnum.StreetGrimoireErrata:
        case sourceBookXmlEnum.ShadowSpells:
        case sourceBookXmlEnum.BloodyBusiness:
        case sourceBookXmlEnum.DataTrailsDissonantEchoes:
        case sourceBookXmlEnum.SplinteredState:
        case sourceBookXmlEnum.ShadowsInFocus_Butte:
        case sourceBookXmlEnum.HongKongSourcebook:
        case sourceBookXmlEnum.BookOfTheLost:
        case sourceBookXmlEnum.ForbiddenArcana:
        case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
        case sourceBookXmlEnum.BetterThanBad:
        case sourceBookXmlEnum.Aetherology:
        case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
        case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
        case sourceBookXmlEnum.ShadowrunQuickStartRules:
        case sourceBookXmlEnum.SprawlWilds:
          assert(false, vehicle.source);
          break;
      }
      return found;
    }
  );

  console.log(englishVehicleList[0]);

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
