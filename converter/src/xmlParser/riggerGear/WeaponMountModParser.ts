/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import type { VehicleModXmlType } from "./VehicleModParserSchemas.js";
import {
  availabilityVehicleModificationSemantics,
  convertVehicleModCategory,
  costVehicleModificationSemantics,
  slotSemantics,
} from "./VehicleModHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { ammoSemantics } from "../combat/WeaponParserHelper.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
const Ammo = Weapons.Ammo;
import { convertSource } from "../common/ParserHelper.js";
import { WeaponMountModSchema } from "@neon-codex/common/build/schemas/equipment/rigger/weaponMountModSchemas.js";
import VehicleModifications from "../../grammar/vehicleModifications.ohm-bundle.js";
import type { AmmunitionType } from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";
import { WeaponMountModListXmlSchema } from "./WeaponMountModParserSchemas.js";
const Slot = VehicleModifications.Slot;
const Availability = VehicleModifications.Availability;
const Cost = VehicleModifications.Cost;

export function ParseWeaponMountMods() {
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

  const weaponMountModListParsed = WeaponMountModListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weaponmountmods.mod
  );

  if (!weaponMountModListParsed.success) {
    console.log(weaponMountModListParsed.error.errors[0]);
    assert(false);
  } else {
    console.log("vehicles.xml (Weapon Mount Mods) initial zod parsed");
  }

  const weaponMountModListConverted = weaponMountModListParsed.data.map(
    (weaponMountMod) => {
      const convertedWeaponMountMod = convertWeaponMountMod(weaponMountMod);

      const check = WeaponMountModSchema.safeParse(convertedWeaponMountMod);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedWeaponMountMod, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    }
  );
  // console.log(vehicleListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/weaponMountMods.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(weaponMountModListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertWeaponMountMod = function (vehicleMod: VehicleModXmlType) {
  const type = convertVehicleModCategory(vehicleMod.category);

  const additionalAmmo = vehicleMod.ammobonus;
  const percentageAmmoIncrease = vehicleMod.ammobonus;

  let replaceAmmo: AmmunitionType | undefined;
  if (vehicleMod.ammoreplace !== undefined) {
    const match = Ammo.match(vehicleMod.ammoreplace);
    if (match.failed()) {
      assert(false, match.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const slotCost = slotSemantics(match).eval();

  match = Availability.match(vehicleMod.avail.toString());
  if (match.failed()) {
    console.log(vehicleMod.name);
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  let availability = availabilityVehicleModificationSemantics(match).eval();
  // TODO: do this properly
  availability = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    rating: availability.rating[0],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    restriction: availability.restriction,
  };

  match = Cost.match(vehicleMod.cost.toString());
  if (match.failed()) {
    console.log(vehicleMod.name);
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const cost = costVehicleModificationSemantics(match).eval();

  const source = convertSource(vehicleMod.source);
  const page = vehicleMod.page === "?" ? 0 : vehicleMod.page;

  return {
    name: vehicleMod.name,
    description: "",
    type: type,
    requirements: requirements,
    slotCost: slotCost,
    ...(additionalAmmo !== undefined && { additionalAmmo: additionalAmmo }),
    ...(percentageAmmoIncrease !== undefined && {
      percentageAmmoIncrease: percentageAmmoIncrease,
    }),
    ...(replaceAmmo !== undefined && { replaceAmmo: replaceAmmo }),
    availability: availability,
    cost: cost,
    source: source,
    page: page,
  };
};
