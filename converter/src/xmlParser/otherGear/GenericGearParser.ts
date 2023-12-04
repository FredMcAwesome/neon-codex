/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import {
  GenericGearListXmlSchema,
  GenericGearListXmlType,
} from "./GenericGearParserSchemas.js";

export function ParseGear() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/gear.xml"),
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
  //   jObj.chummer.gears.gear[480].bonus.limitmodifier
  // );

  const genericGearListParsed = GenericGearListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.gears.gear
  );

  if (genericGearListParsed.success) console.log("gear.xml initial zod parsed");
  else {
    console.log(genericGearListParsed.error.errors[0]);
    assert(false);
  }

  const genericGearList = genericGearListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
  const englishGenericGearList: GenericGearListXmlType = genericGearList.filter(
    (gear) => {
      let found = false;
      switch (gear.source) {
        case sourceBookXmlEnum.StreetLethal:
        case sourceBookXmlEnum.RunAndGun:
        case sourceBookXmlEnum.Shadowrun5:
        case sourceBookXmlEnum.HardTargets:
        case sourceBookXmlEnum.TheSeattleGambit:
        case sourceBookXmlEnum.KillCode:
        case sourceBookXmlEnum.KrimeKatalog:
        case sourceBookXmlEnum.Rigger5:
        case sourceBookXmlEnum.StolenSouls:
        case sourceBookXmlEnum.BookOfTheLost:
        case sourceBookXmlEnum.RunFaster:
        case sourceBookXmlEnum.DataTrails:
        case sourceBookXmlEnum.ChromeFlesh:
        case sourceBookXmlEnum.Lockdown:
        case sourceBookXmlEnum.SplinteredState:
        case sourceBookXmlEnum.HongKongSourcebook:
        case sourceBookXmlEnum.CuttingAces:
        case sourceBookXmlEnum.TheCompleteTrog:
        case sourceBookXmlEnum.BulletsAndBandages:
        case sourceBookXmlEnum.StreetGrimoire:
        case sourceBookXmlEnum.ForbiddenArcana:
        case sourceBookXmlEnum.ShadowSpells:
        case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
        case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
        case sourceBookXmlEnum.TheVladivostokGauntlet:
        case sourceBookXmlEnum.ShadowrunQuickStartRules:
        case sourceBookXmlEnum.HowlingShadows:
        case sourceBookXmlEnum.DarkTerrors:
        case sourceBookXmlEnum.BetterThanBad:
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
        // Not containing Generic Gear
        case sourceBookXmlEnum.AssassinPrimer:
        case sourceBookXmlEnum.GunHeaven3:
        case sourceBookXmlEnum.SailAwaySweetSister:
        case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
        case sourceBookXmlEnum.StreetGrimoireErrata:
        case sourceBookXmlEnum.NothingPersonal:
        case sourceBookXmlEnum.BloodyBusiness:
        case sourceBookXmlEnum.DataTrailsDissonantEchoes:
        case sourceBookXmlEnum.ShadowsInFocus_Butte:
        case sourceBookXmlEnum.ShadowsInFocus_Metropole:
        case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
        case sourceBookXmlEnum.Aetherology:
        case sourceBookXmlEnum.SprawlWilds:
          assert(false, gear.source);
          break;
      }
      return found;
    }
  );

  console.log(englishGenericGearList[0]);

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
