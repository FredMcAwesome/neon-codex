/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../ParserCommonDefines.js";
import { SpellListXmlSchema, SpellListXmlType } from "./SpellsParserSchemas.js";

export function ParseSpells() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/spells.xml"),
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
  //   jObj.chummer.spells.spell[337].required
  // );

  const armourListParsed = SpellListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.spells.spell
  );

  if (armourListParsed.success) console.log("spells.xml initial zod parsed");
  else {
    console.log(armourListParsed.error.errors[0]);
    assert(false);
  }

  const armourList = armourListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
  const englishSpellsList: SpellListXmlType = armourList.filter((spell) => {
    let found = false;
    switch (spell.source) {
      case sourceBookXmlEnum.Shadowrun5:
      case sourceBookXmlEnum.StreetGrimoire:
      case sourceBookXmlEnum.BulletsAndBandages:
      case sourceBookXmlEnum.StolenSouls:
      case sourceBookXmlEnum.ShadowSpells:
      case sourceBookXmlEnum.HardTargets:
      case sourceBookXmlEnum.CuttingAces:
      case sourceBookXmlEnum.ForbiddenArcana:
      case sourceBookXmlEnum.BetterThanBad:
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
      // Not containing Spells
      case sourceBookXmlEnum.RunAndGun:
      case sourceBookXmlEnum.RunFaster:
      case sourceBookXmlEnum.HowlingShadows:
      case sourceBookXmlEnum.TheCompleteTrog:
      case sourceBookXmlEnum.StreetLethal:
      case sourceBookXmlEnum.KillCode:
      case sourceBookXmlEnum.NoFuture:
      case sourceBookXmlEnum.AssassinPrimer:
      case sourceBookXmlEnum.ChromeFlesh:
      case sourceBookXmlEnum.DataTrails:
      case sourceBookXmlEnum.GunHeaven3:
      case sourceBookXmlEnum.KrimeKatalog:
      case sourceBookXmlEnum.Lockdown:
      case sourceBookXmlEnum.Rigger5:
      case sourceBookXmlEnum.SailAwaySweetSister:
      case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
      case sourceBookXmlEnum.TheSeattleGambit:
      case sourceBookXmlEnum.StreetGrimoireErrata:
      case sourceBookXmlEnum.NothingPersonal:
      case sourceBookXmlEnum.BloodyBusiness:
      case sourceBookXmlEnum.DataTrailsDissonantEchoes:
      case sourceBookXmlEnum.TheVladivostokGauntlet:
      case sourceBookXmlEnum.SplinteredState:
      case sourceBookXmlEnum.ShadowsInFocus_Butte:
      case sourceBookXmlEnum.HongKongSourcebook:
      case sourceBookXmlEnum.ShadowsInFocus_Metropole:
      case sourceBookXmlEnum.BookOfTheLost:
      case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
      case sourceBookXmlEnum.DarkTerrors:
      case sourceBookXmlEnum.Aetherology:
      case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
      case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
      case sourceBookXmlEnum.ShadowrunQuickStartRules:
      case sourceBookXmlEnum.SprawlWilds:
        assert(false, spell.source);
        break;
    }
    return found;
  });

  console.log(englishSpellsList[0]);

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
