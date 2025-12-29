import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VehicleModListSchema } from "@neon-codex/common";
import type { VehicleModListType } from "@neon-codex/common";
import {
  VehicleChasisModifications,
  VehicleModifications,
} from "../../models/rpg/equipment/rigger/vehicleModificationModel.js";
import { type } from "arktype";

export const getVehicleModifications = function () {
  const currentPath = import.meta.url;
  let vehicleMods: VehicleModListType;
  const relativeConverterPath = "converter/jsonFiles/vehicleMods.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const vehicleListParsed = VehicleModListSchema(rawJson);
  if (vehicleListParsed instanceof type.errors) {
    console.log(vehicleListParsed.summary);
    assert(false, "vehicleMods is undefined");
  } else {
    console.log("vehicle Mods all g");
    vehicleMods = vehicleListParsed;
  }
  const stagedVehicleMods: Array<VehicleModifications> = [];
  vehicleMods.forEach((vehicleMod) => {
    stagedVehicleMods.push(new VehicleChasisModifications(vehicleMod));
    // console.log(vehicleMod.name);
  });
  return stagedVehicleMods;
};
