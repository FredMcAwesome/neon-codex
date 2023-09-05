import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  AccuracyType,
  ArmourPenetrationType,
  DamageType,
  RecoilCompensationType,
} from "@shadowrun/common";
import {
  WeaponXmlType,
  WeaponListXmlSchema,
  WeaponListXmlType,
} from "./WeaponParserSchemas.js";
import { sourceBookXmlEnum } from "../ParserCommonDefines.js";
import { convertSource } from "../ParserHelper.js";
import assert from "assert";
import { augmentationClassificationEnum } from "@shadowrun/common/build/enums.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/build/schemas/commonSchemas.js";
import {
  WeaponUnlinkedSummaryListType,
  WeaponUnlinkedSummaryType,
  ModeType,
  AmmunitionType,
  UnlinkedAccessoryListType,
  AccessoryMountType,
  WeaponUnlinkedSummaryListSchema,
  WeaponUnlinkedSummarySchema,
  FirearmOptionsType,
  AvailabilityWeaponType,
  CostWeaponType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import {
  getWeaponTypeInformation,
  accuracySemantics,
  damageSemantics,
  convertRecoilCompensation,
  convertAccessories,
  convertAccessoryMounts,
  convertAllowGear,
  convertRequirements,
  convertWeaponSkill,
  convertTypeInformation,
  armourPenetrationSemantics,
  modeSemantics,
  ammoSemantics,
  availabilityWeaponSemantics,
  costWeaponSemantics,
} from "./WeaponParserHelper.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
const Accuracy = Weapons.Accuracy;
const Damage = Weapons.Damage;
const ArmourPenetration = Weapons.ArmourPenetration;
const Mode = Weapons.Mode;
const Ammo = Weapons.Ammo;
const Availability = Weapons.Availability;
const Cost = Weapons.Cost;

export function ParseWeapons() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/weapons.xml"),
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
  //   jObj.chummer.weapons.weapon[0]
  // );

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
    const englishWeaponList: WeaponListXmlType = weaponList.filter(
      (weaponAccessory) => {
        let found = false;
        switch (weaponAccessory.source) {
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
      }
    );
    const weaponListNoAmmo = englishWeaponList.filter((weapon) => {
      return (
        // don't include minigrenades, torpedos, missiles, or rockets. These are ammo
        !weapon.name.toLowerCase().includes("minigrenade") &&
        !weapon.name.toLowerCase().includes("torpedo") &&
        !weapon.name.toLowerCase().includes("missile") &&
        !weapon.name.toLowerCase().includes("rocket")
      );
    });

    const weaponListConverted: WeaponUnlinkedSummaryListType = weaponListNoAmmo
      // .filter((weapon) => weapon.name === "Ares Thunderstruck Gauss Rifle")
      .map((weapon: WeaponXmlType) => {
        const convertedWeapon: WeaponUnlinkedSummaryType =
          convertWeapon(weapon);
        const check = WeaponUnlinkedSummarySchema.safeParse(convertedWeapon);
        if (!check.success) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log(convertedWeapon);
          throw new Error(check.error.message);
        }
        return convertedWeapon;
      });
    // console.log(weaponListConverted);
    const check =
      WeaponUnlinkedSummaryListSchema.safeParse(weaponListConverted);
    if (!check.success) {
      throw new Error(check.error.message);
    }
    const jsonFilePath = fileURLToPath(
      path.dirname(currentPath) + "../../../../jsonFiles/weapons.json"
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
}

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
  let match = Accuracy.match(weapon.accuracy.toString());
  if (match.failed()) {
    throw match.message;
  }
  const accuracy: AccuracyType = accuracySemantics(match).eval();
  console.log(`Accuracy: ${accuracy}`);
  match = Damage.match(weapon.damage.toString());
  if (match.failed()) {
    throw match.message;
  }
  const damage: DamageType = damageSemantics(match).eval();
  console.log(`Damage: ${damage}`);
  match = ArmourPenetration.match(weapon.ap.toString());
  if (match.failed()) {
    throw match.message;
  }
  const armourPenetration: ArmourPenetrationType =
    armourPenetrationSemantics(match).eval();
  console.log(`Armour Penetration: ${armourPenetration}`);
  match = Mode.match(weapon.mode.toString());
  if (match.failed()) {
    throw match.message;
  }
  const mode: ModeType = modeSemantics(match).eval();
  console.log(`Mode: ${mode}`);
  const recoilCompensation: RecoilCompensationType = convertRecoilCompensation(
    weapon.rc
  );
  match = Ammo.match(weapon.ammo.toString());
  if (match.failed()) {
    throw match.message;
  }
  const ammo: AmmunitionType | undefined = ammoSemantics(match).eval();
  console.log(`Ammo: ${ammo}`);
  match = Availability.match(weapon.avail.toString());
  if (match.failed()) {
    throw match.message;
  }
  const availability: AvailabilityWeaponType =
    availabilityWeaponSemantics(match).eval();
  console.log(`Availability: ${availability}`);
  match = Cost.match(weapon.cost.toString());
  if (match.failed()) {
    throw match.message;
  }
  const cost: CostWeaponType = costWeaponSemantics(match).eval();
  console.log(`Cost: ${cost}`);
  const accessories: UnlinkedAccessoryListType | undefined = convertAccessories(
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
  const unfilteredRanges = weapon.range
    ? weapon.alternaterange
      ? [weapon.range, weapon.alternaterange]
      : [weapon.range]
    : weapon.alternaterange
    ? [weapon.category, weapon.alternaterange]
    : [weapon.category];
  const ranges = unfilteredRanges.map((range) => {
    if (range === "Heavy Machine Guns" || range === "Medium Machine Guns") {
      return "Medium/Heavy Machinegun";
    }
    return range;
  });
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
  const firearmOptions: FirearmOptionsType = {
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
    ranges
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
