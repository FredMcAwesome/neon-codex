/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { VehicleListXmlSchema } from "./VehicleParserSchemas.js";
import type {
  VehicleListXmlType,
  VehicleXmlType,
} from "./VehicleParserSchemas.js";
import {
  convertSource,
  convertXmlGears,
  convertXmlModList,
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
import { RiggerSchema } from "@shadowrun/common/build/schemas/riggerSchemas.js";
import Vehicles from "../../grammar/vehicles.ohm-bundle.js";
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
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.vehicles.vehicle[305]
  // );

  const vehicleListParsed = VehicleListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.vehicles.vehicle
  );

  if (vehicleListParsed.success) console.log("vehicles.xml initial zod parsed");
  else {
    console.log(vehicleListParsed.error.errors[0]);
    assert(false);
  }

  const vehicleList = vehicleListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
  const englishVehicleList: VehicleListXmlType = vehicleList.filter(
    (vehicle) => {
      let found = false;
      switch (vehicle.source) {
        case sourceBookXmlEnum.Shadowrun5:
        case sourceBookXmlEnum.Rigger5:
        case sourceBookXmlEnum.StolenSouls:
        case sourceBookXmlEnum.NothingPersonal:
        case sourceBookXmlEnum.BulletsAndBandages:
        case sourceBookXmlEnum.HardTargets:
        case sourceBookXmlEnum.TheVladivostokGauntlet:
        case sourceBookXmlEnum.CuttingAces:
        case sourceBookXmlEnum.TheCompleteTrog:
        case sourceBookXmlEnum.ShadowsInFocus_Metropole:
        case sourceBookXmlEnum.TheSeattleGambit:
        case sourceBookXmlEnum.StreetLethal:
        case sourceBookXmlEnum.NoFuture:
        case sourceBookXmlEnum.KrimeKatalog:
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
        // Not containing Cyberware
        case sourceBookXmlEnum.KillCode:
        case sourceBookXmlEnum.ChromeFlesh:
        case sourceBookXmlEnum.Lockdown:
        case sourceBookXmlEnum.HowlingShadows:
        case sourceBookXmlEnum.DarkTerrors:
        case sourceBookXmlEnum.RunAndGun:
        case sourceBookXmlEnum.RunFaster:
        case sourceBookXmlEnum.AssassinPrimer:
        case sourceBookXmlEnum.DataTrails:
        case sourceBookXmlEnum.GunHeaven3:
        case sourceBookXmlEnum.SailAwaySweetSister:
        case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
        case sourceBookXmlEnum.StreetGrimoire:
        case sourceBookXmlEnum.StreetGrimoireErrata:
        case sourceBookXmlEnum.ShadowSpells:
        case sourceBookXmlEnum.BloodyBusiness:
        case sourceBookXmlEnum.DataTrailsDissonantEchoes:
        case sourceBookXmlEnum.SplinteredState:
        case sourceBookXmlEnum.ShadowsInFocus_Butte:
        case sourceBookXmlEnum.HongKongSourcebook:
        case sourceBookXmlEnum.BookOfTheLost:
        case sourceBookXmlEnum.ForbiddenArcana:
        case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
        case sourceBookXmlEnum.BetterThanBad:
        case sourceBookXmlEnum.Aetherology:
        case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
        case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
        case sourceBookXmlEnum.ShadowrunQuickStartRules:
        case sourceBookXmlEnum.SprawlWilds:
          assert(false, vehicle.source);
          break;
      }
      return found;
    }
  );

  const vehicleListConverted = englishVehicleList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((vehicle) => {
      const convertedVehicle = convertVehicle(vehicle);
      const check = RiggerSchema.safeParse(convertedVehicle);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedVehicle);
        throw new Error(check.error.message);
      }
      return check.data;
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
  const acceleration = accelerationSemantics(match).eval();
  match = Speed.match(vehicle.speed.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const speed = speedSemantics(match).eval();

  const { type, subtype } = convertVehicleCategory(vehicle.category);
  match = Availability.match(vehicle.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability = availabilitySemantics(match).eval();
  match = Cost.match(vehicle.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const cost = costSemantics(match).eval();

  match = Handling.match(vehicle.handling.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const handling = handlingSemantics(match).eval();

  const includedGear =
    vehicle.gears !== undefined
      ? // switch gear to usegear (as it should be in xml...)
        convertXmlGears({ usegear: vehicle.gears.gear })
      : undefined;
  const includedMods =
    vehicle.mods !== undefined ? convertXmlModList(vehicle.mods) : undefined;

  const weaponXmlList =
    vehicle.weapons !== undefined
      ? Array.isArray(vehicle.weapons.weapon)
        ? vehicle.weapons.weapon
        : [vehicle.weapons.weapon]
      : undefined;
  let weaponList;
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
  let weaponMountList;
  if (weaponMountXmlList !== undefined) {
    weaponMountList = weaponMountXmlList.map((weaponMount) => {
      return convertWeaponMount(weaponMount);
    });
  }
  const source = convertSource(vehicle.source);

  return {
    name: vehicle.name,
    description: "",
    type: type,
    subtype: subtype,
    handling: handling,
    speed: speed,
    acceleration: acceleration,
    body: vehicle.body,
    armour: vehicle.armor,
    pilot: vehicle.pilot,
    sensor: vehicle.sensor,
    includedGear: includedGear,
    includedMods: includedMods,
    modSlots: vehicle.modslots,
    powerTrainModSlots: vehicle.powertrainmodslots,
    protectionModSlots: vehicle.protectionmodslots,
    weaponModSlots: vehicle.weaponmodslots,
    bodyModSlots: vehicle.bodymodslots,
    electromagneticModSlots: vehicle.electromagneticmodslots,
    cosmeticModSlots: vehicle.cosmeticmodslots,
    seats: vehicle.seats,
    weaponList: weaponList,
    weaponMountList: weaponMountList,
    ...(vehicle.hide !== undefined && { userSelectable: false as const }),
    availability: availability,
    cost: cost,
    source: source,
    page: vehicle.page,
  };
};
