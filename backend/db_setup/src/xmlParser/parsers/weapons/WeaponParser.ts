/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  AccuracyType,
  ArmourPenetrationType,
  AvailabilityType,
  CostType,
  DamageType,
} from "@shadowrun/common";
import { augmentationClassificationEnum } from "@shadowrun/common/src/enums.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/src/schemas/commonSchema.js";
import type {
  PredbAccessoriesType,
  AccessoryMountType,
  AmmunitionType,
  ModeType,
  RecoilCompensationType,
  WeaponPreDBSummaryListType,
  WeaponPreDBSummaryType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
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
  convertRequirements,
  convertWeaponSkill,
  convertSource,
  convertTypeInformation,
} from "./WeaponParserHelper.js";
import {
  WeaponXmlType,
  WeaponListXmlSchema,
  WeaponListXmlType,
  sourceBookXmlEnum,
} from "./WeaponParserSchema.js";
import * as fs from "fs";

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../../xmls/weapons.xml"),
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
  jObj.chummer.weapons.weapon[275].required.OR // ) //   (weapon: { name: string }) => weapon.name == "Ontario Arms Sling-Shot" // .filter(
);

const weaponListParsed = WeaponListXmlSchema.safeParse(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  jObj.chummer.weapons.weapon
);

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
        assert(false);
        break;
    }
    return found;
  });
  const weaponListNoAmmo = englishWeaponList.filter((weapon) => {
    return (
      // don't include grenades, torpedos, missiles, or rockets. These are ammo
      weapon.category !== weaponXmlSubtypeEnum.Gear ||
      (!weapon.name.toLowerCase().includes("minigrenade") &&
        !weapon.name.toLowerCase().includes("torpedo") &&
        !weapon.name.toLowerCase().includes("missile") &&
        !weapon.name.toLowerCase().includes("rocket"))
    );
  });

  // const weaponListConverted: Array<RequiredEntityData<MeleeWeapons>> =
  const weaponListConverted: WeaponPreDBSummaryListType = weaponListNoAmmo
    // .filter((weapon) => weapon.name === "Ares Thunderstruck Gauss Rifle")
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((weapon: WeaponXmlType) => {
      const convertedWeapon: WeaponPreDBSummaryType = convertWeapon(weapon);
      return convertedWeapon;
    });
  // console.log(weaponListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../seeds/gear/combatGear/weapons.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(weaponListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

// function convertWeapon(weapon: WeaponType): RequiredEntityData<MeleeWeapons> {
function convertWeapon(weapon: WeaponXmlType) {
  console.log(`\n${weapon.name}`);

  const { weaponType, weaponSubtype } = getWeaponTypeInformation(weapon);
  let augmentationType: augmentationClassificationEnum =
    augmentationClassificationEnum.None;
  if (weapon.cyberware) {
    augmentationType = augmentationClassificationEnum.Cyberware;
  } else if (weapon.category === weaponXmlSubtypeEnum.BioWeapon) {
    augmentationType = augmentationClassificationEnum.Bioware;
  }

  const source = convertSource(weapon.source);
  const accuracy: AccuracyType = convertAccuracy(weapon.accuracy, weapon.name);
  const damage: DamageType = convertDamage(weapon.damage, weapon.name);
  const armourPenetration: ArmourPenetrationType = convertArmourPenetration(
    weapon.ap,
    weapon.name
  );
  const mode: ModeType = convertMode(weapon.mode, weapon.name);
  const recoilCompensation: RecoilCompensationType = convertRecoilCompensation(
    weapon.rc
  );
  const ammo: AmmunitionType | undefined = convertAmmo(
    weapon.ammo,
    weapon.name
  );
  const availability: AvailabilityType = convertAvailability(
    weapon.avail,
    weapon.name
  );
  const cost: CostType = convertCost(weapon.cost, weapon.name);
  const accessories: PredbAccessoriesType | undefined = convertAccessories(
    weapon.accessories,
    weapon.name
  );
  const accessoryMounts: AccessoryMountType | undefined =
    convertAccessoryMounts(weapon.accessorymounts);
  const addWeapons = weapon.addweapon
    ? Array.isArray(weapon.addweapon)
      ? weapon.addweapon
      : [weapon.addweapon]
    : undefined;
  const allowGear = convertAllowGear(weapon.allowgear, weapon.name);
  const doubleCostAccessoryMounts = convertAccessoryMounts(
    weapon.doubledcostaccessorymounts
  );
  const range = weapon.range
    ? weapon.alternaterange
      ? [weapon.range, weapon.alternaterange]
      : [weapon.range]
    : weapon.alternaterange
    ? [weapon.category, weapon.alternaterange]
    : [weapon.category];
  const weaponRequirements = convertRequirements(weapon.required, weapon.name);
  const mountLocationsOnHostWeapon = weapon.mount
    ? weapon.extramount
      ? [weapon.mount, weapon.extramount]
      : [weapon.mount]
    : weapon.extramount
    ? [weapon.extramount]
    : undefined;
  const hostWeaponRequirements =
    weapon.category === weaponXmlSubtypeEnum.UnderbarrelWeapons
      ? {
          weaponRequirements: weaponRequirements,
          hostWeaponMountsRequired: mountLocationsOnHostWeapon,
        }
      : undefined;
  const initialSpecialisations = weapon.spec
    ? weapon.spec2
      ? [weapon.spec, weapon.spec2]
      : [weapon.spec]
    : weapon.spec2
    ? [weapon.spec2]
    : undefined;
  if (
    initialSpecialisations !== undefined &&
    initialSpecialisations.length == 1 &&
    weapon.useskillspec !== undefined &&
    weapon.useskillspec !== initialSpecialisations[0]
  )
    assert(
      false,
      `only one specialisation source should be defined: ${weapon.name}`
    );
  const underbarrels = weapon.underbarrels
    ? Array.isArray(weapon.underbarrels.underbarrel)
      ? weapon.underbarrels.underbarrel
      : [weapon.underbarrels.underbarrel]
    : undefined;

  const { skill, specialisations } = convertWeaponSkill(
    weapon.useskill,
    weapon.category,
    weapon.useskillspec,
    initialSpecialisations
  );

  const meleeOptions = { reach: weapon.reach };
  const firearmOptions = {
    mode: mode,
    recoilCompensation: recoilCompensation,
    ...(weapon.ammocategory && { ammoCategory: weapon.ammocategory }),
    ammoSlots: weapon.ammoslots || 1,
    ...(hostWeaponRequirements && {
      hostWeaponRequirements: hostWeaponRequirements,
    }),
    ...(underbarrels && { underbarrelWeapons: underbarrels }),
    ...(addWeapons && { addWeapons: addWeapons }),
    ...(accessoryMounts && { accessoryMounts: accessoryMounts }),
    ...(doubleCostAccessoryMounts && {
      doubleCostAccessoryMounts: doubleCostAccessoryMounts,
    }),
  };

  const typeInformation = convertTypeInformation(
    weaponType,
    weaponSubtype,
    meleeOptions,
    firearmOptions,
    range
  );

  return {
    // id: weapon.id,
    name: weapon.name,
    description: "",
    typeInformation: typeInformation,
    concealability: weapon.conceal,
    accuracy: accuracy,
    damage: damage,
    armourPenetration: armourPenetration,
    ...(ammo && { ammunition: ammo }),
    availability: availability,
    cost: cost,
    ...(allowGear && { allowedGear: allowGear }),
    ...(accessories && { accessories: accessories }),
    allowAccessories: weapon.allowaccessory !== "False",
    isCyberware: weapon.cyberware === "True",
    // hide: weapon.hide === "", // I don't understand what hide means...
    augmentationType: augmentationType,
    relatedSkill: skill,
    ...(specialisations && { relatedSkillSpecialisations: specialisations }),
    source: source,
    page: weapon.page,
  };
}
