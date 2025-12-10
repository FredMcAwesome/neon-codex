/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { VehicleListXmlSchema } from "./VehicleParserSchemas.js";
import { VehicleSchema } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";
import type { VehicleXmlType } from "./VehicleParserSchemas.js";
import {
  convertSource,
  convertIncludedXmlGears,
  convertXmlVehicleModList,
} from "../common/ParserHelper.js";
import {
  accelerationSemantics,
  availabilitySemantics,
  convertVehicleCategory,
  convertWeaponMount,
  costSemantics,
  speedSemantics,
  handlingSemantics,
} from "./VehicleParserHelper.js";
import Vehicles from "../../grammar/vehicles.ohm-bundle.js";
import { type } from "arktype";
const Acceleration = Vehicles.Acceleration;
const Speed = Vehicles.Speed;
const Availability = Vehicles.Availability;
const Cost = Vehicles.Cost;
const Handling = Vehicles.Handling;

export function ParseVehicles() {
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
  // console.dir(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.vehicles.vehicle[142],
  //   { depth: Infinity }
  // );

  const vehicleListParsed = VehicleListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.vehicles.vehicle
  );

  if (vehicleListParsed instanceof type.errors) {
    console.log(vehicleListParsed.summary);
    assert(false);
  } else {
    console.log("vehicles.xml initial arktype parsed");
  }

  const vehicleList = vehicleListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const vehicleListConverted = vehicleList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((vehicle) => {
      const convertedVehicle = convertVehicle(vehicle);
      const check = VehicleSchema(convertedVehicle);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedVehicle, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
  // console.log(vehicleListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/vehicles.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(vehicleListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertVehicle = function (vehicle: VehicleXmlType) {
  let match = Acceleration.match(vehicle.accel.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const acceleration = accelerationSemantics(match).eval();
  match = Speed.match(vehicle.speed.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const speed = speedSemantics(match).eval();

  const { category, subtype } = convertVehicleCategory(vehicle.category);
  match = Availability.match(vehicle.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const availability = availabilitySemantics(match).eval();
  match = Cost.match(vehicle.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const cost = costSemantics(match).eval();

  match = Handling.match(vehicle.handling.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const handling = handlingSemantics(match).eval();

  const includedGearList =
    vehicle.gears !== undefined
      ? // switch gear to usegear (as it should be in xml...)
        convertIncludedXmlGears({ usegear: vehicle.gears.gear })
      : undefined;
  const includedModList =
    vehicle.mods !== undefined
      ? convertXmlVehicleModList(vehicle.mods)
      : undefined;

  const weaponXmlList =
    vehicle.weapons !== undefined
      ? Array.isArray(vehicle.weapons.weapon)
        ? vehicle.weapons.weapon
        : [vehicle.weapons.weapon]
      : undefined;
  let weaponList: Array<string> = [];
  if (weaponXmlList !== undefined) {
    weaponList = weaponXmlList.map((weapon) => {
      return weapon.name;
    });
  }
  const weaponMountXmlList =
    vehicle.weaponmounts !== undefined
      ? Array.isArray(vehicle.weaponmounts.weaponmount)
        ? vehicle.weaponmounts.weaponmount
        : [vehicle.weaponmounts.weaponmount]
      : undefined;
  let includedWeaponMountList;
  if (weaponMountXmlList !== undefined) {
    includedWeaponMountList = weaponMountXmlList.map((weaponMount) => {
      return convertWeaponMount(weaponMount);
    });
  }
  for (const weapon of weaponList) {
    assert(includedWeaponMountList !== undefined);
    assert(
      includedWeaponMountList.find((mount) => {
        return (
          mount.weaponMounted !== undefined &&
          mount.weaponMounted.baseWeapon === weapon
        );
      }) !== undefined,
      `Weapon ${weapon} not found in weapon mount list`
    );
  }
  const source = convertSource(vehicle.source);

  const typeInformation = {
    category: category,
    subtype: subtype,
  };

  return {
    name: vehicle.name,
    description: "",
    ...typeInformation,
    handling: handling,
    speed: speed,
    acceleration: acceleration,
    body: vehicle.body,
    armour: vehicle.armor,
    pilot: vehicle.pilot,
    sensor: vehicle.sensor,
    ...(includedGearList !== undefined && {
      includedGearList: includedGearList,
    }),
    ...(includedModList !== undefined && { includedModList: includedModList }),
    ...(vehicle.modslots !== undefined && { modSlots: vehicle.modslots }),
    ...(vehicle.powertrainmodslots !== undefined && {
      powerTrainModSlots: vehicle.powertrainmodslots,
    }),
    ...(vehicle.protectionmodslots !== undefined && {
      protectionModSlots: vehicle.protectionmodslots,
    }),
    ...(vehicle.weaponmodslots !== undefined && {
      weaponModSlots: vehicle.weaponmodslots,
    }),
    ...(vehicle.bodymodslots !== undefined && {
      bodyModSlots: vehicle.bodymodslots,
    }),
    ...(vehicle.electromagneticmodslots !== undefined && {
      electromagneticModSlots: vehicle.electromagneticmodslots,
    }),
    ...(vehicle.cosmeticmodslots !== undefined && {
      cosmeticModSlots: vehicle.cosmeticmodslots,
    }),
    ...(vehicle.seats !== undefined && { seats: vehicle.seats }),
    ...(includedWeaponMountList !== undefined && {
      includedWeaponMountList: includedWeaponMountList,
    }),
    ...(vehicle.hide !== undefined && { userSelectable: false as const }),
    availability: availability,
    cost: cost,
    source: source,
    page: vehicle.page,
  };
};
