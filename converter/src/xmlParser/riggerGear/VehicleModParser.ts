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
} from "./VehicleModHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertRatingMeaning, convertSource } from "../common/ParserHelper.js";
import { VehicleModSchema } from "@neon-codex/common";
import VehicleModifications from "../../grammar/vehicleModifications.ohm-bundle.js";
import { type } from "arktype";
const Rating = VehicleModifications.Rating;
const Slot = VehicleModifications.Slot;
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

  const vehicleModListParsed = VehicleModListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mods.mod
  );

  if (vehicleModListParsed instanceof type.errors) {
    console.log(vehicleModListParsed.summary);
    assert(false);
  } else {
    console.log("vehicles.xml (Mods) initial arktype parsed");
  }

  const vehicleModListConverted = vehicleModListParsed.map((vehicleMod) => {
    const convertedVehicleMod = convertVehicleMod(vehicleMod);

    const check = VehicleModSchema(convertedVehicleMod);
    if (check instanceof type.errors) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.dir(convertedVehicleMod, { depth: Infinity });
      throw new Error(check.summary);
    }
    return check;
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
  const category = convertVehicleModCategory(vehicleMod.category);
  const maxRating = [convertVehicleModMaxRating(vehicleMod.rating)];
  let minRating;
  if (vehicleMod.minrating !== undefined) {
    const match = Rating.match(vehicleMod.minrating);
    if (match.failed()) {
      assert(false, match.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    minRating = ratingSemantics(match).eval();
  }
  const ratingMeaning = convertRatingMeaning(vehicleMod.ratinglabel);

  const bonus =
    vehicleMod.bonus !== undefined
      ? convertXmlBonus(vehicleMod.bonus)
      : undefined;

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

  const allowedSubsystemList = convertSubsystems(vehicleMod.subsystems);

  match = Availability.match(vehicleMod.avail.toString());
  if (match.failed()) {
    console.log(vehicleMod.name);
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const availability = availabilityVehicleModificationSemantics(match).eval();

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
    category: category,
    maxRating: maxRating,
    ...(minRating !== undefined && { minRating: minRating }),
    ...(ratingMeaning !== undefined && { ratingMeaning: ratingMeaning }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(vehicleMod.capacity && { capacity: vehicleMod.capacity }),
    ...(vehicleMod.conditionmonitor && {
      addPhysicalBoxes: vehicleMod.conditionmonitor,
    }),
    ...(vehicleMod.downgrade !== undefined && { isDowngrade: true as const }),
    ...(vehicleMod.optionaldrone !== undefined && {
      requiresDroneParent: true as const,
    }),
    ...(requirements !== undefined && { requirements: requirements }),
    slotCost: slotCost,
    ...(allowedSubsystemList !== undefined && {
      allowedSubsystemList: allowedSubsystemList,
    }),
    ...(vehicleMod.hide !== undefined && { userSelectable: false as const }),
    availability: availability,
    cost: cost,
    source: source,
    page: page,
  };
};
