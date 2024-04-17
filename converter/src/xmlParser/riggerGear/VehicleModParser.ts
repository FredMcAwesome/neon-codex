/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { VehicleModListXmlSchema } from "./VehicleModParserSchemas.js";
import type {
  VehicleModListXmlType,
  VehicleModXmlType,
} from "./VehicleModParserSchemas.js";
import {
  availabilityVehicleModificationSemantics,
  convertSubsystems,
  convertVehicleModCategory,
  convertVehicleModMaxRating,
  costVehicleModificationSemantics,
  ratingSemantics,
  slotSemantics,
  weaponMountCategoriesSemantics,
} from "./VehicleModHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { ammoSemantics } from "../combat/WeaponParserHelper.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
const Ammo = Weapons.Ammo;
import type { AmmunitionType } from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import { firearmWeaponTypeEnum } from "@neon-codex/common/build/enums.js";

import { convertRatingMeaning, convertSource } from "../common/ParserHelper.js";
import { VehicleModSchema } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";
import VehicleModifications from "../../grammar/vehicleModifications.ohm-bundle.js";
const Rating = VehicleModifications.Rating;
const Slot = VehicleModifications.Slot;
const WeaponMountCategories = VehicleModifications.WeaponMountCategories;
const Availability = VehicleModifications.Availability;
const Cost = VehicleModifications.Cost;

export function ParseVehicleMods() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/vehicles.xml"),
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
  //   jObj.chummer.mods.mod[96]
  // );

  const vehicleModListParsed = VehicleModListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mods.mod
  );
  const vehicleWeaponMountModListParsed = VehicleModListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weaponmountmods.mod
  );

  if (!vehicleModListParsed.success) {
    console.log(vehicleModListParsed.error.errors[0]);
    assert(false);
  } else if (!vehicleWeaponMountModListParsed.success) {
    console.log(vehicleWeaponMountModListParsed.error.errors[0]);
    assert(false);
  } else {
    console.log("vehicles.xml (Mods) initial zod parsed");
  }

  const vehicleChassisModList: VehicleModListXmlType =
    vehicleModListParsed.data.map((vehicle) => {
      return { ...vehicle, modType: "Vehicle" as const };
    });
  const vehicleModList = vehicleChassisModList.concat(
    vehicleWeaponMountModListParsed.data.map((vehicle) => {
      return { ...vehicle, modType: "Weapon Mount" as const };
    })
  );
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const vehicleModListConverted = vehicleModList.map((vehicleMod) => {
    const convertedVehicleMod = convertVehicleMod(vehicleMod);

    const check = VehicleModSchema.safeParse(convertedVehicleMod);
    if (!check.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(convertedVehicleMod);
      throw new Error(check.error.message);
    }
    return check.data;
  });
  // console.log(vehicleListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/vehicleMods.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(vehicleModListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertVehicleMod = function (vehicleMod: VehicleModXmlType) {
  const subtype = convertVehicleModCategory(vehicleMod.category);
  const maxRating = [convertVehicleModMaxRating(vehicleMod.rating)];
  let minRating;
  if (vehicleMod.minrating !== undefined) {
    const match = Rating.match(vehicleMod.minrating);
    if (match.failed()) {
      assert(false, match.message);
    }
    minRating = ratingSemantics(match).eval();
  }
  const ratingMeaning = convertRatingMeaning(vehicleMod.ratinglabel);

  const bonus =
    vehicleMod.bonus !== undefined
      ? convertXmlBonus(vehicleMod.bonus)
      : undefined;
  const additionalAmmo = vehicleMod.ammobonus;
  const percentageAmmoIncrease = vehicleMod.ammobonus;

  let replaceAmmo: AmmunitionType | undefined;
  if (vehicleMod.ammoreplace !== undefined) {
    const match = Ammo.match(vehicleMod.ammoreplace);
    if (match.failed()) {
      assert(false, match.message);
    }
    replaceAmmo = ammoSemantics(match).eval();
  }
  let requirements;
  if (vehicleMod.required) {
    requirements = convertRequirements(vehicleMod.required);
  }
  let match = Slot.match(vehicleMod.slots.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const slotCost = slotSemantics(match).eval();

  const subsystemList = convertSubsystems(vehicleMod.subsystems);
  let weaponMountValidCategoryList: Array<firearmWeaponTypeEnum> | undefined;
  if (vehicleMod.weaponmountcategories !== undefined) {
    match = WeaponMountCategories.match(vehicleMod.weaponmountcategories);
    if (match.failed()) {
      assert(false, match.message);
    }
    weaponMountValidCategoryList = weaponMountCategoriesSemantics(match).eval();
  }

  match = Availability.match(vehicleMod.avail.toString());
  if (match.failed()) {
    console.log(vehicleMod.name);
    assert(false, match.message);
  }
  const availability = availabilityVehicleModificationSemantics(match).eval();

  match = Cost.match(vehicleMod.cost.toString());
  if (match.failed()) {
    console.log(vehicleMod.name);
    assert(false, match.message);
  }
  const cost = costVehicleModificationSemantics(match).eval();

  const source = convertSource(vehicleMod.source);
  const page = vehicleMod.page === "?" ? 0 : vehicleMod.page;

  assert(vehicleMod.modType !== undefined);

  return {
    name: vehicleMod.name,
    description: "",
    subtype: subtype,
    maxRating: maxRating,
    minRating: minRating,
    ratingMeaning: ratingMeaning,
    bonus: bonus,
    capacity: vehicleMod.capacity,
    addPhysicalBoxes: vehicleMod.conditionmonitor,
    isDowngrade:
      vehicleMod.downgrade !== undefined ? (true as const) : undefined,
    requiresDroneParent:
      vehicleMod.optionaldrone !== undefined ? (true as const) : undefined,
    requirements: requirements,
    slotCost: slotCost,
    subsystemList: subsystemList,
    ...(vehicleMod.hide !== undefined && { userSelectable: false as const }),
    availability: availability,
    cost: cost,
    source: source,
    page: page,
    type: vehicleMod.modType,
    // Weapon mount mod details
    ...(weaponMountValidCategoryList !== undefined && {
      weaponMountValidCategoryList: weaponMountValidCategoryList,
    }),
    ...(additionalAmmo !== undefined && { additionalAmmo: additionalAmmo }),
    ...(percentageAmmoIncrease !== undefined && {
      percentageAmmoIncrease: percentageAmmoIncrease,
    }),
    ...(replaceAmmo !== undefined && { replaceAmmo: replaceAmmo }),
  };
};
