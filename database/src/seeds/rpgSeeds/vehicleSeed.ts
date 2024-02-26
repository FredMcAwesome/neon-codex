import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  vehicleTypeEnum,
  weaponMountControlEnum,
  weaponMountFlexibilityEnum,
  weaponMountSizeEnum,
  weaponMountVisibilityEnum,
} from "@neon-codex/common/build/enums.js";
import {
  Vehicles,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
} from "../../models/rpg/equipment/rigger/vehicleModel.js";
import { WeaponMounts } from "../../models/rpg/equipment/rigger/weaponMountModel.js";
import {
  type VehicleListType,
  VehicleListSchema,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";

export const getVehicles = function () {
  const currentPath = import.meta.url;
  let unlinkedVehicles: VehicleListType;
  const relativeConverterPath = "converter/jsonFiles/vehicles.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const vehicleListParsed = VehicleListSchema.safeParse(rawJson);
  if (vehicleListParsed.success) {
    console.log("vehicles all g");
    unlinkedVehicles = vehicleListParsed.data;
  } else {
    console.log(vehicleListParsed.error.errors[0]);
    assert(false, "vehicles is undefined");
  }
  const stagedVehicles: Array<Vehicles> = [];
  unlinkedVehicles.forEach((vehicle) => {
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
  return { unlinkedVehicles, stagedVehicles };
};

export const createVehicleWeaponMounts = function () {
  const WeaponMountList = [];

  for (const control of Object.values(weaponMountControlEnum)) {
    for (const flexibility of Object.values(weaponMountFlexibilityEnum)) {
      for (const size of Object.values(weaponMountSizeEnum)) {
        for (const visibility of Object.values(weaponMountVisibilityEnum)) {
          const weaponMount = {
            control: control,
            flexibility: flexibility,
            size: size,
            visibility: visibility,
          };
          WeaponMountList.push(new WeaponMounts(weaponMount));
        }
      }
    }
  }
  console.log(
    `Number of weapon mount combinations = ${WeaponMountList.length}`
  );
  return WeaponMountList;
};
