import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VehicleListSchema } from "@shadowrun/common/build/schemas/riggerSchemas.js";
import type { VehicleListType } from "@shadowrun/common/build/schemas/riggerSchemas.js";
import {
  Aircrafts,
  Drones,
  Groundcrafts,
  Vehicles,
  Watercrafts,
} from "../../models/gear/riggerGear/vehicleModel.js";
import { vehicleTypeEnum } from "@shadowrun/common";

export const getVehicles = function () {
  const currentPath = import.meta.url;
  let vehicles: VehicleListType | undefined = undefined;
  let relativeConverterPath = "converter/jsonFiles/vehicles.json";
  const rootPath = "../../../../../";
  let jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  let rawJson = JSON.parse(jsonString);
  const vehicleListParsed = VehicleListSchema.safeParse(rawJson);
  if (vehicleListParsed.success) {
    console.log("vehicles all g");
    vehicles = vehicleListParsed.data;
  } else {
    console.log(vehicleListParsed.error.errors[0]);
    assert(false);
  }
  const stagedVehicles: Array<Vehicles> = [];
  vehicles.forEach((vehicle) => {
    switch (vehicle.type) {
      case vehicleTypeEnum.Groundcraft:
        stagedVehicles.push(new Groundcrafts(vehicle));
        break;
      case vehicleTypeEnum.Watercraft:
        stagedVehicles.push(new Watercrafts(vehicle));
        break;
      case vehicleTypeEnum.Aircraft:
        stagedVehicles.push(new Aircrafts(vehicle));
        break;
      case vehicleTypeEnum.Drone:
        stagedVehicles.push(new Drones(vehicle));
        break;
    }
    // console.log(vehicle.name);
  });
  return stagedVehicles;
};
