/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../ParserCommonDefines.js";
import {
  ArmourListXmlSchema,
  ArmourListXmlType,
  ArmourXmlType,
} from "./ArmourParserSchema.js";

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../../xmls/armor.xml"),
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
  jObj.chummer.armors.armor[193].gears.usegear
);

const armourListParsed = ArmourListXmlSchema.safeParse(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  jObj.chummer.armors.armor
);

if (armourListParsed.success) console.log("all g");
else {
  console.log(armourListParsed.error.errors[0]);
}

if (armourListParsed.success) {
  const armourList = armourListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
  const englishArmourList: ArmourListXmlType = armourList.filter((armour) => {
    let found = false;
    switch (armour.source) {
      case sourceBookXmlEnum.BulletsAndBandages:
      case sourceBookXmlEnum.Shadowrun5:
      case sourceBookXmlEnum.RunAndGun:
      case sourceBookXmlEnum.RunFaster:
      case sourceBookXmlEnum.HardTargets:
      case sourceBookXmlEnum.HowlingShadows:
      case sourceBookXmlEnum.CuttingAces:
      case sourceBookXmlEnum.TheCompleteTrog:
      case sourceBookXmlEnum.StreetLethal:
      case sourceBookXmlEnum.KillCode:
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
      // Not containing Armour
      case sourceBookXmlEnum.AssassinPrimer:
      case sourceBookXmlEnum.ChromeFlesh:
      case sourceBookXmlEnum.DataTrails:
      case sourceBookXmlEnum.GunHeaven3:
      case sourceBookXmlEnum.KrimeKatalog:
      case sourceBookXmlEnum.Lockdown:
      case sourceBookXmlEnum.Rigger5:
      case sourceBookXmlEnum.SailAwaySweetSister:
      case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
      case sourceBookXmlEnum.StolenSouls:
      case sourceBookXmlEnum.StreetGrimoire:
      case sourceBookXmlEnum.TheSeattleGambit:
      case sourceBookXmlEnum.StreetGrimoireErrata:
      case sourceBookXmlEnum.ShadowSpells:
      case sourceBookXmlEnum.NothingPersonal:
      case sourceBookXmlEnum.BloodyBusiness:
      case sourceBookXmlEnum.DataTrailsDissonantEchoes:
      case sourceBookXmlEnum.TheVladivostokGauntlet:
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
        assert(false, armour.source);
        break;
    }
    return found;
  });

  console.log(englishArmourList);

  const armourListConverted = englishArmourList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((armour) => {
      const convertedArmour = convertArmour(armour);
      return convertedArmour;
    });
  // console.log(armourListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/armour.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(armourListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertArmour(armour: ArmourXmlType) {
  console.log(`\n${armour.name}`);

  const availability = "convertAvailability(armour.avail, armour.name);";
  const cost = "convertCost(armour.cost, armour.name);";

  return {
    name: armour.name,
    description: "",
    category: armour.category,
    ...(armour.rating && { maxRating: armour.rating }),
    rating: armour.armor,
    capacity: armour.armorcapacity,
    availability: availability,
    cost: cost,
    source: armour.source,
    page: armour.page,
  };
}
