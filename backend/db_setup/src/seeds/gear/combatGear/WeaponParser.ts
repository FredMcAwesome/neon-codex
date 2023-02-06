import {
  augmentationClassificationEnum,
  weaponTypeEnum,
} from "@shadowrun/common/src/enums.js";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  getWeaponTypeInformation,
  convertAccuracy,
  convertDamage,
} from "./ParserHelper.js";
import {
  WeaponXmlType,
  AccessoryXmlType,
  WeaponListXmlSchema,
  WeaponListXmlType,
  sourceBookXmlEnum,
  weaponSubtypeXmlEnum,
} from "./ParserSchema.js";

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "/weapons.xml"),
  "utf8"
);
const parser = new XMLParser();
const jObj: any = parser.parse(xml_string);
const weaponListParsed = WeaponListXmlSchema.safeParse(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  jObj.chummer.weapons.weapon
);

// console.log(jObj.chummer.weapons.weapon[356]);
if (weaponListParsed.success) console.log("all g");
else {
  console.log(weaponListParsed.error.errors[0]);
}

if (weaponListParsed.success) {
  const weaponList = weaponListParsed.data;
  const englishWeaponList: WeaponListXmlType = weaponList.filter((weapon) => {
    let found = false;
    switch (weapon.source) {
      case sourceBookXmlEnum.AssassinPrimer:
      case sourceBookXmlEnum.ChromeFlesh:
      case sourceBookXmlEnum.CuttingAces:
      case sourceBookXmlEnum.DataTrails:
      case sourceBookXmlEnum.GunHeaven3:
      case sourceBookXmlEnum.HardTargets:
      case sourceBookXmlEnum.KillCode:
      case sourceBookXmlEnum.KrimeKatalog:
      case sourceBookXmlEnum.Lockdown:
      case sourceBookXmlEnum.NoFuture:
      case sourceBookXmlEnum.Rigger5:
      case sourceBookXmlEnum.RunAndGun:
      case sourceBookXmlEnum.RunFaster:
      case sourceBookXmlEnum.SailAwaySweetSister:
      case sourceBookXmlEnum.Shadowrun5:
      case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
      case sourceBookXmlEnum.StolenSouls:
      case sourceBookXmlEnum.StreetGrimoire:
      case sourceBookXmlEnum.StreetLethal:
      case sourceBookXmlEnum.TheCompleteTrog:
      case sourceBookXmlEnum.TheSeattleGambit:
        found = true;
        break;
      // Not in english
      case sourceBookXmlEnum.StateOfTheArtADL:
      case sourceBookXmlEnum.Schattenhandbuch:
      case sourceBookXmlEnum.Schattenhandbuch2:
      case sourceBookXmlEnum.Hamburg:
      case sourceBookXmlEnum.DatapulsSOTA2080:
      case sourceBookXmlEnum.DatapulsVerschlusssache:
        break;
      // Not containing Weapons
      case sourceBookXmlEnum.StreetGrimoireErrata:
      case sourceBookXmlEnum.BulletsAndBandages:
      case sourceBookXmlEnum.ShadowSpells:
      case sourceBookXmlEnum.NothingPersonal:
      case sourceBookXmlEnum.BloodyBusiness:
      case sourceBookXmlEnum.DataTrailsDissonantEchoes:
      case sourceBookXmlEnum.Schattenhandbuch3:
      case sourceBookXmlEnum.HowlingShadows:
      case sourceBookXmlEnum.TheVladivostokGauntlet:
      case sourceBookXmlEnum.SplinteredState:
      case sourceBookXmlEnum.ShadowsInFocus_Butte:
      case sourceBookXmlEnum.HongKongSourcebook:
      case sourceBookXmlEnum.ShadowsInFocus_Metropole:
      case sourceBookXmlEnum.Shadowrun2050:
      case 2050:
      case sourceBookXmlEnum.BookOfTheLost:
      case sourceBookXmlEnum.ForbiddenArcana:
      case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
      case sourceBookXmlEnum.DarkTerrors:
      case sourceBookXmlEnum.BetterThanBad:
      case sourceBookXmlEnum.Aetherology:
      case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
      case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
      case sourceBookXmlEnum.ShadowrunQuickStartRules:
      case sourceBookXmlEnum.GrimmesErwachen:
      case sourceBookXmlEnum.SprawlWilds:
        break;
    }
    return found;
  });
  const weaponListNoAmmo = englishWeaponList.filter((weapon) => {
    return (
      (!weapon.name.toLowerCase().includes("missile") &&
        !weapon.name.toLowerCase().includes("rocket")) ||
      weapon.name.toLowerCase().includes("launcher")
    );
  });
  // const weaponListConverted: Array<RequiredEntityData<MeleeWeapons>> =
  const weaponListConverted = weaponListNoAmmo
    .filter((weapon) => {
      return weapon.type === weaponTypeEnum.Melee;
    })
    .map((weapon: WeaponXmlType) => {
      return convertWeapon(weapon);
    });
  console.log(weaponListConverted);
}

// function convertWeapon(weapon: WeaponType): RequiredEntityData<MeleeWeapons> {
function convertWeapon(weapon: WeaponXmlType) {
  const { weaponType, weaponSubtype } = getWeaponTypeInformation(weapon);
  let augmentationType: augmentationClassificationEnum =
    augmentationClassificationEnum.None;
  if (weapon.cyberware) {
    augmentationType = augmentationClassificationEnum.Cyberware;
  } else if (weapon.category === weaponSubtypeXmlEnum.BioWeapon) {
    augmentationType = augmentationClassificationEnum.Bioware;
  }

  const source =
    weapon.source === 2050 ? sourceBookXmlEnum.Shadowrun2050 : weapon.source;
  let accessories: AccessoryXmlType[] = [];
  if (weapon.accessories) {
    accessories = Array.isArray(weapon.accessories.accessory)
      ? weapon.accessories.accessory
      : [weapon.accessories.accessory];
  }

  const accuracy = convertAccuracy(weapon.accuracy, weapon.name);
  const damage = convertDamage(weapon.damage, weapon.name);
  // const armourPenetration = convertArmourPenetration();
  return {
    name: weapon.name,
    type: weaponType,
    subtype: weaponSubtype,
    concealability: weapon.conceal,
    accuracy: accuracy,
    reach: weapon.reach,
    damage: damage,
    relatedSkill: weapon.useskill,
    accessories: accessories,
    source: source,
    page: weapon.page,
    augmentationType: augmentationType,
  };
}
