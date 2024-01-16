import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type {
  AccuracyType,
  ArmourPenetrationType,
  DamageType,
  RecoilCompensationType,
} from "@shadowrun/common";
import type {
  WeaponXmlType,
  WeaponListXmlType,
} from "./WeaponParserSchemas.js";
import { WeaponListXmlSchema } from "./WeaponParserSchemas.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { convertAllowGear, convertSource } from "../common/ParserHelper.js";
import assert from "assert";
import {
  ammoSourceEnum,
  augmentationTypeEnum,
} from "@shadowrun/common/build/enums.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/build/schemas/commonSchemas.js";
import type {
  WeaponSummaryListType,
  WeaponSummaryType,
  ModeType,
  AmmunitionType,
  UnlinkedAccessoryListType,
  AccessoryMountType,
  FirearmOptionsType,
  AvailabilityWeaponType,
  CostWeaponType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import {
  WeaponSummaryListSchema,
  WeaponSummarySchema,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import {
  getWeaponTypeInformation,
  accuracySemantics,
  damageSemantics,
  convertRecoilCompensation,
  convertAccessories,
  convertAccessoryMounts,
  convertWeaponSkill,
  convertTypeInformation,
  armourPenetrationSemantics,
  modeSemantics,
  ammoSemantics,
  availabilityWeaponSemantics,
  costWeaponSemantics,
  convertExtraClassification,
} from "./WeaponParserHelper.js";
import { convertRequirements } from "../common/RequiredHelper.js";
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

  if (weaponListParsed.success) console.log("weapons.xml initial zod parsed");
  else {
    console.log(weaponListParsed.error.errors[0]);
    assert(false);
  }

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
  const weaponListNoAmmo = englishWeaponList;

  const weaponListConverted: WeaponSummaryListType = weaponListNoAmmo
    // .filter((weapon) => weapon.name === "Ares Thunderstruck Gauss Rifle")
    .map((weapon: WeaponXmlType) => {
      const convertedWeapon: WeaponSummaryType = convertWeapon(weapon);
      const check = WeaponSummarySchema.safeParse(convertedWeapon);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedWeapon);
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(weaponListConverted);
  const check = WeaponSummaryListSchema.safeParse(weaponListConverted);
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

function convertWeapon(weapon: WeaponXmlType) {
  // console.log(`\n${weapon.name}`);

  const { weaponType, weaponSubtype } = getWeaponTypeInformation(weapon);
  let augmentationType: augmentationTypeEnum | undefined = undefined;
  if (weapon.cyberware !== undefined) {
    augmentationType = augmentationTypeEnum.Cyberware;
  } else if (weapon.category === weaponXmlSubtypeEnum.BioWeapon) {
    augmentationType = augmentationTypeEnum.Bioware;
  }

  const source = convertSource(weapon.source);
  let match = Accuracy.match(weapon.accuracy.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const accuracy: AccuracyType = accuracySemantics(match).eval();
  // console.log(`Accuracy: ${accuracy}`);
  match = Damage.match(weapon.damage.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const damage: DamageType = damageSemantics(match).eval();
  // console.log(`Damage: ${damage}`);
  match = ArmourPenetration.match(weapon.ap.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const armourPenetration: ArmourPenetrationType =
    armourPenetrationSemantics(match).eval();
  // console.log(`Armour Penetration: ${armourPenetration}`);
  match = Mode.match(weapon.mode.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const mode: ModeType = modeSemantics(match).eval();
  // console.log(`Mode: ${mode}`);
  const recoilCompensation: RecoilCompensationType = convertRecoilCompensation(
    weapon.rc
  );
  match = Ammo.match(weapon.ammo.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const ammo: AmmunitionType = ammoSemantics(match).eval();
  // console.log(`Ammo: ${ammo}`);
  match = Availability.match(weapon.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability: AvailabilityWeaponType =
    availabilityWeaponSemantics(match).eval();
  // console.log(`Availability: ${availability}`);
  match = Cost.match(weapon.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const cost: CostWeaponType = costWeaponSemantics(match).eval();
  // console.log(`Cost: ${cost}`);
  const accessories: UnlinkedAccessoryListType | undefined = convertAccessories(
    weapon.accessories
  );
  const accessoryMounts: AccessoryMountType | undefined =
    convertAccessoryMounts(weapon.accessorymounts);
  const alternativeWeaponForms = weapon.addweapon
    ? Array.isArray(weapon.addweapon)
      ? weapon.addweapon
      : [weapon.addweapon]
    : undefined;
  const allowGear = convertAllowGear(weapon.allowgear);
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
    if (range === "Gear") {
      return "Grenade Launchers";
    }
    return range;
  });
  const weaponRequirements = convertRequirements(weapon.required);
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
  if (weapon.category === weaponXmlSubtypeEnum.UnderbarrelWeapons) {
    if (weapon.hide === undefined) {
      // TODO: renable
      // assert(
      //   weaponRequirements !== undefined,
      //   `No weaponRequirements: ${weapon.name}`
      // );
      assert(
        mountLocationsOnHostWeapon !== undefined,
        `No mountLocations: ${weapon.name}`
      );
    }
  } else {
    assert(
      weaponRequirements === undefined &&
        mountLocationsOnHostWeapon === undefined,
      weapon.name
    );
  }
  const initialSpecialisations = weapon.spec
    ? weapon.spec2
      ? [weapon.spec, weapon.spec2]
      : [weapon.spec]
    : weapon.spec2
    ? [weapon.spec2]
    : undefined;
  if (
    initialSpecialisations !== undefined &&
    ((initialSpecialisations.length == 1 &&
      weapon.useskillspec !== undefined &&
      weapon.useskillspec !== initialSpecialisations[0]) ||
      (initialSpecialisations.length > 1 && weapon.useskillspec !== undefined))
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

  if (weapon.type === "Melee") {
    if (weapon.ammo !== 0) {
      assert(weapon.requireammo === "False", weapon.name);
    }
    ammo.forEach((ammunition) => {
      assert(ammunition.reloadMethod === ammoSourceEnum.Special, weapon.name);
    });
  }
  const meleeOptions = { reach: weapon.reach };
  const firearmOptions: FirearmOptionsType = {
    mode: mode,
    recoilCompensation: recoilCompensation,
    ...(weapon.ammocategory !== undefined && {
      ammoCategory: weapon.ammocategory,
    }),
    ammoSlots: weapon.ammoslots || 1,
    ...(underbarrels !== undefined && { underbarrelWeapons: underbarrels }),
    ...(accessoryMounts !== undefined && { accessoryMounts: accessoryMounts }),
    ...(doubleCostAccessoryMounts !== undefined && {
      doubleCostAccessoryMounts: doubleCostAccessoryMounts,
    }),
  };

  const typeInformation = convertTypeInformation(
    weaponType,
    weaponSubtype,
    convertExtraClassification(weapon.weapontype),
    meleeOptions,
    firearmOptions,
    ranges
  );

  return {
    // id: weapon.id,
    name: weapon.name,
    description: "",
    ...typeInformation,
    concealability: weapon.conceal,
    accuracy: accuracy,
    damage: damage,
    armourPenetration: armourPenetration,
    ...(ammo !== undefined && { ammunition: ammo }),
    availability: availability,
    cost: cost,
    ...(allowGear !== undefined && { allowedGear: allowGear }),
    ...(accessories !== undefined && { accessories: accessories }),
    allowAccessories: weapon.allowaccessory !== "False",
    ...(weapon.hide !== undefined && { userSelectable: false as const }),
    ...(augmentationType !== undefined && {
      augmentationType: augmentationType,
    }),
    ...(alternativeWeaponForms !== undefined && {
      alternativeWeaponForms: alternativeWeaponForms,
    }),
    ...(hostWeaponRequirements !== undefined && {
      hostWeaponRequirements: hostWeaponRequirements,
    }),
    relatedSkill: skill,
    ...(specialisations !== undefined && {
      relatedSkillSpecialisations: specialisations,
    }),
    source: source,
    page: weapon.page,
  };
}
