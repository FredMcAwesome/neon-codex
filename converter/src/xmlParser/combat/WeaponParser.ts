import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { WeaponXmlType } from "./WeaponParserSchemas.js";
import { WeaponListXmlSchema } from "./WeaponParserSchemas.js";
import { convertAllowGear, convertSource } from "../common/ParserHelper.js";
import assert from "assert";
import {
  ammoSourceEnum,
  augmentationTypeEnum,
} from "@neon-codex/common/build/enums.js";
import { weaponXmlSubtypeEnum } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import type {
  WeaponListType,
  WeaponType,
  ModeType,
  FirearmOptionsType,
  AvailabilityWeaponType,
  CostWeaponType,
  AccuracyType,
  ArmourPenetrationType,
  RecoilCompensationType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import {
  WeaponListSchema,
  WeaponSchema,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
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
import { convertRequirements } from "../common/RequiredParserHelper.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import type {
  DamageType,
  AmmunitionType,
  AccessoryMountType,
} from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";
import type { CustomisedWeaponAccessoryListType } from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
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
  //   jObj.chummer.weapons.weapon[637],
  //   { depth: Infinity }
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

  const weaponListConverted: WeaponListType = weaponList
    // .filter((weapon) => weapon.name === "Ares Thunderstruck Gauss Rifle")
    .map((weapon: WeaponXmlType) => {
      const convertedWeapon: WeaponType = convertWeapon(weapon);
      const check = WeaponSchema.safeParse(convertedWeapon);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedWeapon, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(weaponListConverted);
  const check = WeaponListSchema.safeParse(weaponListConverted);
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
  const accessoryMounts: AccessoryMountType | undefined =
    convertAccessoryMounts(weapon.accessorymounts);
  const alternativeWeaponForms = weapon.addweapon
    ? Array.isArray(weapon.addweapon)
      ? weapon.addweapon
      : [weapon.addweapon]
    : undefined;
  const { allowedGearList, allowedGearCategories } = convertAllowGear(
    weapon.allowgear
  );
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
  let requirements;
  if (weapon.required) {
    requirements = convertRequirements(weapon.required);
  }
  const mountLocationsOnHostWeapon = weapon.mount
    ? weapon.extramount
      ? [weapon.mount, weapon.extramount]
      : [weapon.mount]
    : weapon.extramount
    ? [weapon.extramount]
    : undefined;
  if (requirements !== undefined || mountLocationsOnHostWeapon !== undefined) {
    assert(
      weapon.category === weaponXmlSubtypeEnum.UnderbarrelWeapons,
      `Weapon underbarrel error: ${weapon.name}`
    );
  }
  const hostWeaponRequirements =
    weapon.category === weaponXmlSubtypeEnum.UnderbarrelWeapons
      ? {
          weaponRequirements: requirements,
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
      requirements === undefined && mountLocationsOnHostWeapon === undefined,
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
    ...(allowedGearList !== undefined && { allowedGearList: allowedGearList }),
    ...(allowedGearCategories !== undefined && {
      allowedGearCategories: allowedGearCategories,
    }),
    ...(includedAccessoryList !== undefined && {
      includedAccessoryList: includedAccessoryList,
    }),
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
