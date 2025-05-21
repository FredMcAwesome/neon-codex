import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VehicleModListSchema } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";
import type { VehicleModListType } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";
import {
  VehicleChasisModifications,
  VehicleModifications,
} from "../../models/rpg/equipment/rigger/vehicleModificationModel.js";

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
  const vehicleListParsed = VehicleModListSchema.safeParse(rawJson);
  if (vehicleListParsed.success) {
    console.log("vehicle Mods all g");
    vehicleMods = vehicleListParsed.data;
  } else {
    console.log(vehicleListParsed.error.errors[0]);
    assert(false, "vehicleMods is undefined");
  }
  const stagedVehicleMods: Array<VehicleModifications> = [];
  vehicleMods.forEach((vehicleMod) => {
    stagedVehicleMods.push(new VehicleChasisModifications(vehicleMod));
    // console.log(vehicleMod.name);
  });
  return stagedVehicleMods;
};
