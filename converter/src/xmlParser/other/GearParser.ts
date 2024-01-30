/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import {
  GearXmlCategoryEnum,
  sourceBookXmlEnum,
} from "../common/ParserCommonDefines.js";
import { GearListXmlSchema } from "./GearParserSchemas.js";
import type { GearListXmlType, GearXmlType } from "./GearParserSchemas.js";
import {
  convertGearCategory,
  convertRatingMeaning,
  convertSource,
  convertXmlGears,
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
import { GearSchema } from "@shadowrun/common/build/schemas/gearSchemas.js";
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
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.gears.gear[480].bonus.limitmodifier
  // );

  const gearListParsed = GearListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.gears.gear
  );

  if (gearListParsed.success) console.log("gear.xml initial zod parsed");
  else {
    console.log(gearListParsed.error.errors[0]);
    assert(false);
  }

  const gearList = gearListParsed.data;
  // .filter((gear) => {
  //   return gear.name === "Detonating Cord, High Yield";
  // });
  const englishGearList: GearListXmlType = gearList.filter((gear) => {
    let found = false;
    switch (gear.source) {
      case sourceBookXmlEnum.StreetLethal:
      case sourceBookXmlEnum.RunAndGun:
      case sourceBookXmlEnum.Shadowrun5:
      case sourceBookXmlEnum.HardTargets:
      case sourceBookXmlEnum.TheSeattleGambit:
      case sourceBookXmlEnum.KillCode:
      case sourceBookXmlEnum.KrimeKatalog:
      case sourceBookXmlEnum.Rigger5:
      case sourceBookXmlEnum.StolenSouls:
      case sourceBookXmlEnum.BookOfTheLost:
      case sourceBookXmlEnum.RunFaster:
      case sourceBookXmlEnum.DataTrails:
      case sourceBookXmlEnum.ChromeFlesh:
      case sourceBookXmlEnum.Lockdown:
      case sourceBookXmlEnum.SplinteredState:
      case sourceBookXmlEnum.HongKongSourcebook:
      case sourceBookXmlEnum.CuttingAces:
      case sourceBookXmlEnum.TheCompleteTrog:
      case sourceBookXmlEnum.BulletsAndBandages:
      case sourceBookXmlEnum.StreetGrimoire:
      case sourceBookXmlEnum.ForbiddenArcana:
      case sourceBookXmlEnum.ShadowSpells:
      case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
      case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
      case sourceBookXmlEnum.TheVladivostokGauntlet:
      case sourceBookXmlEnum.ShadowrunQuickStartRules:
      case sourceBookXmlEnum.HowlingShadows:
      case sourceBookXmlEnum.DarkTerrors:
      case sourceBookXmlEnum.BetterThanBad:
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
      // Not containing Generic Gear
      case sourceBookXmlEnum.AssassinPrimer:
      case sourceBookXmlEnum.GunHeaven3:
      case sourceBookXmlEnum.SailAwaySweetSister:
      case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
      case sourceBookXmlEnum.StreetGrimoireErrata:
      case sourceBookXmlEnum.NothingPersonal:
      case sourceBookXmlEnum.BloodyBusiness:
      case sourceBookXmlEnum.DataTrailsDissonantEchoes:
      case sourceBookXmlEnum.ShadowsInFocus_Butte:
      case sourceBookXmlEnum.ShadowsInFocus_Metropole:
      case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
      case sourceBookXmlEnum.Aetherology:
      case sourceBookXmlEnum.SprawlWilds:
        assert(false, gear.source);
        break;
    }
    return found;
  });

  const gearListConverted = englishGearList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((gear) => {
      const convertedGear = convertGear(gear);
      if (convertedGear === undefined) {
        return undefined;
      }
      const check = GearSchema.safeParse(convertedGear);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedGear);
        throw new Error(check.error.message);
      }
      return check.data;
    })
    .filter((gear) => gear !== undefined);
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
  const quantity =
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
    gear.gears === undefined ? undefined : convertXmlGears(gear.gears);

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
    programs = programGearSemantics(match).eval();
  }
  const attributeArray =
    gear.attributearray === undefined
      ? undefined
      : gear.attributearray.split(",").map((attributeString) => {
          const attribute = Number(attributeString);
          assert(!isNaN(attribute));
          return attribute as number;
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
    capacityInformation = capacityGearSemantics(match).eval();
  }

  let armourCapacityInformation;
  if (gear.armorcapacity !== undefined) {
    const match = Capacity.match(gear.armorcapacity.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    armourCapacityInformation = capacityGearSemantics(match).eval();
  }
  const requirements = convertRequirements(gear.required);
  const requireParent =
    gear.requireparent === undefined
      ? gear.category === GearXmlCategoryEnum.ArmorEnhancements
        ? (true as const)
        : undefined
      : (true as const);
  const forbidden = convertRequirements(gear.forbidden);

  const modifyAttributeArray =
    gear.modattributearray === undefined
      ? undefined
      : gear.modattributearray.split(",").map((attributeString) => {
          const attribute = Number(attributeString);
          assert(!isNaN(attribute));
          return attribute as number;
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
  const cost = costGearSemantics(match).eval();

  match = Availability.match(gear.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability = availabilityGearSemantics(match).eval();

  const source = convertSource(gear.source);

  return {
    name: gear.name,
    description: "",
    category: category,
    minRating: gear.minrating,
    maxRating: maxRating,
    ratingMeaning: ratingMeaning,
    includedWeapon: includedWeapon,
    allowCategoryList: allowCategoryList,
    quantity: quantity,
    bonus: bonus,
    weaponBonus: weaponBonus,
    isFlechetteAmmo: isFlechetteAmmo,
    flechetteWeaponBonus: flechetteWeaponBonus,
    ammoForWeaponType: ammoForWeaponType,
    explosiveWeight: weight,
    ...(gear.hide !== undefined && { userSelectable: false as const }),
    allowedGearList: allowedGearList,
    includedGearList: includedGearList,
    deviceRating: deviceRating,
    programs: programs,
    attributeArray: attributeArray,
    attack: attack,
    sleaze: sleaze,
    dataProcessing: dataProcessing,
    firewall: firewall,
    canFormPersona: gear.canformpersona,
    capacityInformation: capacityInformation,
    armourCapacityInformation: armourCapacityInformation,
    requirements: requirements,
    requireParent: requireParent,
    forbidden: forbidden,
    modifyAttributeArray: modifyAttributeArray,
    modifyAttack: modifyAttack,
    modifySleaze: modifySleaze,
    modifyDataProcessing: modifyDataProcessing,
    modifyFirewall: modifyFirewall,
    addMatrixBoxes: gear.matrixcmbonus,
    renameCustomLabel: renameCustomLabel,
    cost: cost,
    availability: availability,
    source: source,
    page: gear.page,
  };
};
