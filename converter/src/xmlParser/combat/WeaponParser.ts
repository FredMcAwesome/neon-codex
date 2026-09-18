import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { WeaponXmlType } from "./WeaponParserSchemas.js";
import { WeaponListXmlSchema } from "./WeaponParserSchemas.js";
import { convertAllowGear, convertSource } from "../common/ParserHelper.js";
import assert from "assert";
import {
  WeaponListSchema,
  WeaponSchema,
  ammoSourceEnum,
  augmentationCategoryEnum,
  weaponCategoryEnum,
  type AvailabilityWeaponType,
  type CostWeaponType,
  type FirearmOptionsType,
  type ModeType,
  type RecoilCompensationType,
  type WeaponListType,
  type WeaponType,
} from "@neon-codex/common";
import {
  convertXmlToWeaponTypeInformation,
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
import { convertRequirements } from "../common/RequiredParserHelper.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import type {
  DamageType,
  AmmunitionType,
  AccessoryMountType,
  AccuracyType,
  ArmourPenetrationType,
} from "@neon-codex/common";
import type { CustomisedWeaponAccessoryListType } from "@neon-codex/common";
import { type } from "arktype";
import { convertXmlWeaponBonus } from "../other/GearParserHelper.js";
import { resolveDuplicateNames } from "../utilities.js";
import { weaponSubtypeEnum } from "../common/ParserCommonDefines.js";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const jObj: any = parser.parse(xml_string);
  // console.dir(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.weapons.weapon[277],
  //   { depth: Infinity }
  // );

  const weaponListParsed = WeaponListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weapons.weapon
  );

  if (weaponListParsed instanceof type.errors) {
    console.log(weaponListParsed.summary);
    assert(false);
  } else {
    console.log("weapons.xml initial arktype parsed");
  }

  const weaponListConverted: WeaponListType = weaponListParsed.map(
    (weapon: WeaponXmlType) => {
      const convertedWeapon: WeaponType = convertWeapon(weapon);
      const check = WeaponSchema(convertedWeapon);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedWeapon, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    }
  );
  resolveDuplicateNames(weaponListConverted, "weapons.xml");
  // console.log(weaponListConverted);
  const check = WeaponListSchema(weaponListConverted);
  if (check instanceof type.errors) {
    throw new Error(check.summary);
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

function convertWeapon(weapon: WeaponXmlType): WeaponType {
  // console.log(`\n${weapon.name}`);

  const { category: weaponCategory, subtype: weaponSubtype } =
    convertXmlToWeaponTypeInformation({
      category: weapon.category,
      name: weapon.name,
      type: weapon.type,
    });
  let augmentationCategory: augmentationCategoryEnum | undefined = undefined;
  if (weapon.cyberware !== undefined) {
    augmentationCategory = augmentationCategoryEnum.Cyberware;
  } else if (weapon.category === weaponSubtypeEnum.BioWeapon) {
    augmentationCategory = augmentationCategoryEnum.Bioware;
  }

  const source = convertSource(weapon.source);
  let match = Accuracy.match(weapon.accuracy.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const accuracy: AccuracyType = accuracySemantics(match).eval();
  // console.log(`Accuracy: ${accuracy}`);
  match = Damage.match(weapon.damage.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const damage: DamageType = damageSemantics(match).eval();
  // console.log(`Damage: ${damage}`);
  match = ArmourPenetration.match(weapon.ap.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const armourPenetration: ArmourPenetrationType =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    armourPenetrationSemantics(match).eval();
  // console.log(`Armour Penetration: ${armourPenetration}`);
  match = Mode.match(weapon.mode.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const mode: ModeType = modeSemantics(match).eval();
  // console.log(`Mode: ${mode}`);
  const recoilCompensation: RecoilCompensationType = convertRecoilCompensation(
    weapon.rc
  );
  match = Ammo.match(weapon.ammo.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const ammo: AmmunitionType = ammoSemantics(match).eval();
  // console.log(`Ammo: ${ammo}`);
  match = Availability.match(weapon.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const availability: AvailabilityWeaponType =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    availabilityWeaponSemantics(match).eval();
  // console.log(`Availability: ${availability}`);
  match = Cost.match(weapon.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const cost: CostWeaponType = costWeaponSemantics(match).eval();
  // console.log(`Cost: ${cost}`);
  const includedAccessoryList: CustomisedWeaponAccessoryListType | undefined =
    convertAccessories(weapon.accessories);
  const accessoryMountList: AccessoryMountType | undefined =
    convertAccessoryMounts(weapon.accessorymounts);
  const alternativeWeaponForms =
    weapon.addweapon !== undefined
      ? Array.isArray(weapon.addweapon)
        ? weapon.addweapon
        : [weapon.addweapon]
      : undefined;
  const { allowedGearList, allowedGearCategories } = convertAllowGear(
    weapon.allowgear
  );
  const doubleCostAccessoryMountList = convertAccessoryMounts(
    weapon.doubledcostaccessorymounts
  );
  const unfilteredRanges =
    weapon.range !== undefined
      ? weapon.alternaterange !== undefined
        ? [weapon.range, weapon.alternaterange]
        : [weapon.range]
      : weapon.alternaterange !== undefined
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

  let wirelessWeaponBonus;
  if (weapon.wirelessweaponbonus !== undefined) {
    wirelessWeaponBonus = convertXmlWeaponBonus(weapon.wirelessweaponbonus);
  }

  let requirements;
  if (weapon.required !== undefined) {
    requirements = convertRequirements(weapon.required);
  }
  const mountLocationsOnHostWeapon =
    weapon.mount !== undefined
      ? weapon.extramount !== undefined
        ? [weapon.mount, weapon.extramount]
        : [weapon.mount]
      : weapon.extramount !== undefined
        ? [weapon.extramount]
        : undefined;
  if (requirements !== undefined || mountLocationsOnHostWeapon !== undefined) {
    assert(
      weapon.category === weaponSubtypeEnum.UnderbarrelWeapons,
      `Weapon underbarrel error: ${weapon.name}`
    );
  }
  if (weapon.category === weaponSubtypeEnum.UnderbarrelWeapons) {
    assert(
      requirements !== undefined || mountLocationsOnHostWeapon !== undefined
    );
  }
  if (weapon.category === weaponSubtypeEnum.UnderbarrelWeapons) {
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
      requirements === undefined && mountLocationsOnHostWeapon === undefined,
      weapon.name
    );
  }
  const initialSpecialisations =
    weapon.spec !== undefined
      ? weapon.spec2 !== undefined
        ? [weapon.spec, weapon.spec2]
        : [weapon.spec]
      : weapon.spec2 !== undefined
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
  const underbarrelWeaponList = weapon.underbarrels
    ? Array.isArray(weapon.underbarrels.underbarrel)
      ? weapon.underbarrels.underbarrel
      : [weapon.underbarrels.underbarrel]
    : undefined;

  const { skill, specialisations, overridenSkill } = convertWeaponSkill(
    weapon.useskill,
    weapon.category,
    weapon.useskillspec,
    initialSpecialisations
  );

  const meleeOptions = { reach: weapon.reach };
  const firearmOptions: FirearmOptionsType = {
    mode: mode,
    recoilCompensation: recoilCompensation,
    ...(weapon.ammocategory !== undefined && {
      ammoWeaponClassification: convertXmlToWeaponTypeInformation({
        category: weapon.ammocategory,
      }),
    }),
    ammoSlots: weapon.ammoslots !== undefined ? weapon.ammoslots : 1,
    ...(underbarrelWeaponList !== undefined && {
      underbarrelWeaponList: underbarrelWeaponList,
    }),
    ...(accessoryMountList !== undefined && {
      accessoryMountList: accessoryMountList,
    }),
    ...(doubleCostAccessoryMountList !== undefined && {
      doubleCostAccessoryMountList: doubleCostAccessoryMountList,
    }),
  };

  const typeInformation = convertTypeInformation(
    weaponCategory,
    weaponSubtype,
    convertExtraClassification(weapon.weapontype),
    meleeOptions,
    firearmOptions,
    ranges
  );

  if (weapon.type === "Melee") {
    if (weapon.ammo !== 0) {
      assert(weapon.requireammo === "False", weapon.name);
    }
    ammo.forEach((ammunition) => {
      assert(ammunition.reloadMethod === ammoSourceEnum.Special, weapon.name);
    });
    assert(typeInformation.category === weaponCategoryEnum.Melee);
  } else {
    assert(typeInformation.category !== weaponCategoryEnum.Melee);
  }

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
    ...(allowedGearList !== undefined && { allowedGearList: allowedGearList }),
    ...(allowedGearCategories !== undefined && {
      allowedGearCategories: allowedGearCategories,
    }),
    ...(includedAccessoryList !== undefined && {
      includedAccessoryList: includedAccessoryList,
    }),
    allowAccessories: weapon.allowaccessory !== "False",
    ...(weapon.hide !== undefined && { userSelectable: false as const }),
    ...(augmentationCategory !== undefined && {
      augmentationCategory: augmentationCategory,
    }),
    ...(alternativeWeaponForms !== undefined && {
      alternativeWeaponForms: alternativeWeaponForms,
    }),
    ...(mountLocationsOnHostWeapon !== undefined && {
      hostWeaponMountsRequired: mountLocationsOnHostWeapon,
    }),
    ...(requirements !== undefined && {
      requirements: requirements,
    }),
    relatedSkill: skill,
    ...(overridenSkill != undefined && { overridenSkill: overridenSkill }),
    ...(specialisations !== undefined && {
      relatedSkillSpecialisationList: specialisations,
    }),
    ...(wirelessWeaponBonus !== undefined && {
      wirelessWeaponBonus: wirelessWeaponBonus,
    }),
    source: source,
    page: weapon.page,
  };
}
