/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { gearXmlCategoryEnum } from "../common/ParserCommonDefines.js";
import { GearListXmlSchema } from "./GearParserSchemas.js";
import type { GearXmlType } from "./GearParserSchemas.js";
import {
  convertGearCategory,
  convertRatingMeaning,
  convertSource,
  convertIncludedXmlGears,
} from "../common/ParserHelper.js";
import {
  availabilityGearSemantics,
  capacityGearSemantics,
  convertAmmoForWeaponType,
  convertDeviceAttributes,
  convertDeviceRating,
  convertGearAddWeapon,
  convertGearMaxRating,
  convertWeight,
  convertXmlWeaponBonus,
  costGearSemantics,
  programGearSemantics,
} from "./GearParserHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import Gears from "../../grammar/gears.ohm-bundle.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { GearSchema } from "@neon-codex/common";
import { type } from "arktype";
import { resolveDuplicateNames } from "../utilities.js";
const Program = Gears.Program;
const Capacity = Gears.Capacity;
const Cost = Gears.Cost;
const Availability = Gears.Availability;

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
  // console.dir(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.gears.gear[1590],
  //   { depth: Infinity }
  // );

  const gearListParsed = GearListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.gears.gear
  );

  if (gearListParsed instanceof type.errors) {
    console.log(gearListParsed.summary);
    assert(false);
  } else {
    console.log("gear.xml initial arktype parsed");
  }
  // console.log(
  //   `Find index: ${JSON.stringify(
  //     gearListParsed.find((gear) => gear.name === "Evo Sublime")
  //   )}`
  // );

  const gearListConverted = gearListParsed
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((gear) => {
      const convertedGear = convertGear(gear);
      if (convertedGear === undefined) {
        return undefined;
      }
      const check = GearSchema(convertedGear);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedGear, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    })
    .filter((gear) => gear !== undefined);
  // resolveDuplicateNames(gearListConverted, "gear.xml");
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/gears.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(gearListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertGear = function (gear: GearXmlType) {
  const category = convertGearCategory(gear.category);
  const maxRating =
    gear.rating === undefined ? undefined : convertGearMaxRating(gear.rating);
  const ratingMeaning = convertRatingMeaning(gear.ratinglabel);
  const includedWeapon =
    gear.addweapon === undefined
      ? undefined
      : convertGearAddWeapon(gear.addweapon);
  const allowCategoryList =
    gear.addoncategory === undefined
      ? undefined
      : Array.isArray(gear.addoncategory)
        ? gear.addoncategory.map((gear) => convertGearCategory(gear))
        : [convertGearCategory(gear.addoncategory)];
  const purchaseQuantity =
    gear.costfor !== undefined && gear.costfor !== 1 ? gear.costfor : undefined;
  const bonus =
    gear.bonus === undefined ? undefined : convertXmlBonus(gear.bonus);
  const weaponBonus =
    gear.weaponbonus === undefined
      ? undefined
      : convertXmlWeaponBonus(gear.weaponbonus);
  const isFlechetteAmmo =
    gear.isflechetteammo !== undefined ? (true as const) : undefined;
  const flechetteWeaponBonus =
    gear.flechetteweaponbonus === undefined
      ? undefined
      : convertXmlWeaponBonus(gear.flechetteweaponbonus);
  const ammoForWeaponType =
    gear.ammoforweapontype === undefined
      ? undefined
      : convertAmmoForWeaponType(gear.ammoforweapontype);
  assert(
    isFlechetteAmmo === undefined || ammoForWeaponType !== undefined,
    gear.name
  );

  const weight =
    gear.weight === undefined ? undefined : convertWeight(gear.weight);

  const allowedGearList =
    gear.allowgear === undefined
      ? undefined
      : Array.isArray(gear.allowgear.name)
        ? gear.allowgear.name
        : [gear.allowgear.name];
  const includedGearList =
    gear.gears === undefined ? undefined : convertIncludedXmlGears(gear.gears);

  const deviceRating =
    gear.devicerating === undefined
      ? undefined
      : convertDeviceRating(gear.devicerating);

  let programs;
  if (gear.programs !== undefined) {
    const match = Program.match(gear.programs.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    programs = programGearSemantics(match).eval();
  }
  const attributeArray =
    gear.attributearray === undefined
      ? undefined
      : gear.attributearray.split(",").map((attributeString) => {
          const attribute = Number(attributeString);
          assert(!isNaN(attribute));
          return attribute;
        });
  const attack =
    gear.attack === undefined
      ? undefined
      : convertDeviceAttributes(gear.attack);
  const sleaze =
    gear.sleaze === undefined
      ? undefined
      : convertDeviceAttributes(gear.sleaze);
  const dataProcessing =
    gear.dataprocessing === undefined
      ? undefined
      : convertDeviceAttributes(gear.dataprocessing);
  const firewall =
    gear.firewall === undefined
      ? undefined
      : convertDeviceAttributes(gear.firewall);

  let capacityInformation;
  if (gear.capacity !== undefined) {
    const match = Capacity.match(gear.capacity.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    capacityInformation = capacityGearSemantics(match).eval();
  }

  let armourCapacityInformation;
  if (gear.armorcapacity !== undefined) {
    const match = Capacity.match(gear.armorcapacity.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    armourCapacityInformation = capacityGearSemantics(match).eval();
  }
  let requirements;
  if ("required" in gear) {
    requirements = convertRequirements(gear.required);
  }
  let forbidden;
  if ("forbidden" in gear) {
    forbidden = convertRequirements(gear.forbidden);
  }
  const requireParent =
    gear.requireparent === undefined
      ? gear.category === gearXmlCategoryEnum.ArmorEnhancements
        ? (true as const)
        : undefined
      : (true as const);

  const modifyAttributeArray =
    gear.modattributearray === undefined
      ? undefined
      : gear.modattributearray.split(",").map((attributeString) => {
          const attribute = Number(attributeString);
          assert(!isNaN(attribute));
          return attribute;
        });
  const modifyAttack =
    gear.modattack === undefined
      ? undefined
      : convertDeviceAttributes(gear.modattack);
  const modifySleaze =
    gear.modsleaze === undefined
      ? undefined
      : convertDeviceAttributes(gear.modsleaze);
  const modifyDataProcessing =
    gear.moddataprocessing === undefined
      ? undefined
      : convertDeviceAttributes(gear.moddataprocessing);
  const modifyFirewall =
    gear.modfirewall === undefined
      ? undefined
      : convertDeviceAttributes(gear.modfirewall);

  let renameCustomLabel;
  if (gear.allowrename !== undefined) {
    assert(gear.bonus !== undefined && gear.bonus !== "");
    const select =
      gear.bonus.selecttext !== undefined ||
      gear.bonus.selectrestricted !== undefined;
    // if assert fail here, check if item has a different select
    assert(select, gear.name);
    renameCustomLabel = true as const;
  }

  let match = Cost.match(gear.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const cost = costGearSemantics(match).eval();

  match = Availability.match(gear.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const availability = availabilityGearSemantics(match).eval();

  const source = convertSource(gear.source);

  return {
    name: gear.name,
    description: "",
    category: category,
    ...(gear.minrating !== undefined && { minRating: gear.minrating }),
    ...(maxRating !== undefined && { maxRating: maxRating }),
    ...(ratingMeaning !== undefined && { ratingMeaning: ratingMeaning }),
    ...(includedWeapon !== undefined && { includedWeapon: includedWeapon }),
    ...(allowCategoryList !== undefined && {
      allowCategoryList: allowCategoryList,
    }),
    ...(purchaseQuantity !== undefined && {
      purchaseQuantity: purchaseQuantity,
    }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(weaponBonus !== undefined && { weaponBonus: weaponBonus }),
    ...(isFlechetteAmmo !== undefined && { isFlechetteAmmo: isFlechetteAmmo }),
    ...(flechetteWeaponBonus !== undefined && {
      flechetteWeaponBonus: flechetteWeaponBonus,
    }),
    ...(ammoForWeaponType !== undefined && {
      ammoForWeaponType: ammoForWeaponType,
    }),
    ...(weight !== undefined && { explosiveWeight: weight }),
    ...(gear.hide !== undefined && { userSelectable: false as const }),
    ...(allowedGearList !== undefined && { allowedGearList: allowedGearList }),
    ...(includedGearList !== undefined && {
      includedGearList: includedGearList,
    }),
    ...(deviceRating !== undefined && { deviceRating: deviceRating }),
    ...(programs !== undefined && { programs: programs }),
    ...(attributeArray !== undefined && { attributeArray: attributeArray }),
    // ignore 0 values
    ...(attack !== undefined &&
      (typeof attack === "object" || attack > 0) && { attack: attack }),
    ...(sleaze !== undefined &&
      (typeof sleaze === "object" || sleaze > 0) && { sleaze: sleaze }),
    ...(dataProcessing !== undefined &&
      (typeof dataProcessing === "object" || dataProcessing > 0) && {
        dataProcessing: dataProcessing,
      }),
    ...(firewall !== undefined &&
      (typeof firewall === "object" || firewall > 0) && { firewall: firewall }),
    ...(gear.canformpersona !== undefined && {
      canFormPersona: gear.canformpersona,
    }),
    ...(capacityInformation !== undefined && {
      capacityInformation: capacityInformation,
    }),
    ...(armourCapacityInformation !== undefined && {
      armourCapacityInformation: armourCapacityInformation,
    }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(requireParent !== undefined && { requireParent: requireParent }),
    ...(forbidden !== undefined && { forbidden: forbidden }),
    ...(modifyAttributeArray !== undefined && {
      modifyAttributeArray: modifyAttributeArray,
    }),
    ...(modifyAttack !== undefined && { modifyAttack: modifyAttack }),
    ...(modifySleaze !== undefined && { modifySleaze: modifySleaze }),
    ...(modifyDataProcessing !== undefined && {
      modifyDataProcessing: modifyDataProcessing,
    }),
    ...(modifyFirewall !== undefined && { modifyFirewall: modifyFirewall }),
    ...(gear.matrixcmbonus !== undefined && {
      addMatrixBoxes: gear.matrixcmbonus,
    }),
    ...(renameCustomLabel !== undefined && {
      renameCustomLabel: renameCustomLabel,
    }),
    cost: cost,
    availability: availability,
    source: source,
    page: gear.page,
  };
};
