import { augmentationClassificationEnum } from "@shadowrun/common/src/enums.js";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  getWeaponTypeInformation,
  convertAccuracy,
  convertDamage,
  convertArmourPenetration,
  convertMode,
  convertRecoilCompensation,
  convertAmmo,
  convertAvailability,
  convertCost,
  convertAccessories,
  convertAccessoryMounts,
  convertAllowGear,
} from "./WeaponParserHelper.js";
import {
  WeaponXmlType,
  WeaponListXmlSchema,
  WeaponListXmlType,
  sourceBookXmlEnum,
  weaponSubtypeXmlEnum,
} from "./WeaponParserSchema.js";

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../xmls/weapons.xml"),
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
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
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
      case sourceBookXmlEnum.Schattenhandbuch3:
      case sourceBookXmlEnum.Hamburg:
      case sourceBookXmlEnum.DatapulsSOTA2080:
      case sourceBookXmlEnum.DatapulsVerschlusssache:
      case sourceBookXmlEnum.Shadowrun2050:
      case 2050:
      case sourceBookXmlEnum.GrimmesErwachen:
        break;
      // Not containing Weapons
      case sourceBookXmlEnum.StreetGrimoireErrata:
      case sourceBookXmlEnum.BulletsAndBandages:
      case sourceBookXmlEnum.ShadowSpells:
      case sourceBookXmlEnum.NothingPersonal:
      case sourceBookXmlEnum.BloodyBusiness:
      case sourceBookXmlEnum.DataTrailsDissonantEchoes:
      case sourceBookXmlEnum.HowlingShadows:
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
        break;
    }
    return found;
  });
  const weaponListNoAmmo = englishWeaponList.filter((weapon) => {
    return (
      // don't include grenades, torpedos, missiles, or rockets. These are ammo
      weapon.category !== weaponSubtypeXmlEnum.Gear ||
      (!weapon.name.toLowerCase().includes("minigrenade") &&
        !weapon.name.toLowerCase().includes("torpedo") &&
        !weapon.name.toLowerCase().includes("missile") &&
        !weapon.name.toLowerCase().includes("rocket"))
    );
  });
  // const weaponListConverted: Array<RequiredEntityData<MeleeWeapons>> =
  const weaponListConverted = weaponListNoAmmo.map((weapon: WeaponXmlType) => {
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

  console.log(weapon.name);
  const accuracy = convertAccuracy(weapon.accuracy, weapon.name);
  const damage = convertDamage(weapon.damage, weapon.name);
  const armourPenetration = convertArmourPenetration(weapon.ap, weapon.name);
  const mode = convertMode(weapon.mode, weapon.name);
  const recoilCompensation = convertRecoilCompensation(weapon.rc);
  const ammo = convertAmmo(weapon.ammo, weapon.name);
  const availability = convertAvailability(weapon.avail, weapon.name);
  const cost = convertCost(weapon.cost, weapon.name);
  const accessories = convertAccessories(weapon.accessories, weapon.name);
  const accessoryMounts = convertAccessoryMounts(weapon.accessorymounts);
  const addWeapons = weapon.addweapon
    ? Array.isArray(weapon.addweapon)
      ? weapon.addweapon
      : [weapon.addweapon]
    : undefined;
  const allowGear = convertAllowGear(weapon.allowgear, weapon.name);
  const doubleCostAccessoryMounts = convertAccessoryMounts(
    weapon.doubledcostaccessorymounts
  );
  const mountLocationsOnHostWeapon = weapon.mount
    ? weapon.extramount
      ? [weapon.mount, weapon.extramount]
      : [weapon.mount]
    : weapon.extramount
    ? [weapon.extramount]
    : undefined;
  const range = weapon.range
    ? weapon.alternaterange
      ? [weapon.range, weapon.alternaterange]
      : [weapon.range]
    : weapon.alternaterange
    ? [weapon.alternaterange]
    : undefined;
  return {
    id: weapon.id,
    name: weapon.name,
    type: weaponType,
    subtype: weaponSubtype,
    concealability: weapon.conceal,
    accuracy: accuracy,
    armourPenetration: armourPenetration,
    mode: mode,
    recoilCompensation: recoilCompensation,
    ammunition: ammo,
    availability: availability,
    cost: cost,
    reach: weapon.reach,
    damage: damage,
    relatedSkill: weapon.useskill,
    accessories: accessories,
    accessoryMounts: accessoryMounts,
    doubleCostAccessoryMounts: doubleCostAccessoryMounts,
    hostWeaponMountsRequired: mountLocationsOnHostWeapon,
    addWeapons: addWeapons,
    allowAccessory: weapon.allowaccessory === "True",
    allowGear: allowGear,
    ammoCategory: weapon.ammocategory,
    ammoSlots: weapon.ammoslots,
    cyberware: weapon.cyberware === "True",
    hide: weapon.hide === "",
    range: range,
    source: source,
    page: weapon.page,
    augmentationType: augmentationType,
  };
}
