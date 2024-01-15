import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VehicleModListSchema } from "@shadowrun/common/build/schemas/riggerModSchemas.js";
import type { VehicleModListType } from "@shadowrun/common/build/schemas/riggerModSchemas.js";
import {
  VehicleMods,
  VehicleChasisMods,
  WeaponMountMods,
} from "../../models/gear/riggerGear/VehicleModificationModel.js";
import { vehicleModTypeEnum } from "@shadowrun/common/build/enums.js";

export const getVehicleModifications = function () {
  const currentPath = import.meta.url;
  let vehicleMods: VehicleModListType | undefined = undefined;
  let relativeConverterPath = "converter/jsonFiles/vehicleMods.json";
  const rootPath = "../../../../../";
  let jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  let rawJson = JSON.parse(jsonString);
  const vehicleListParsed = VehicleModListSchema.safeParse(rawJson);
  if (vehicleListParsed.success) {
    console.log("vehicle Mods all g");
    vehicleMods = vehicleListParsed.data;
  } else {
    console.log(vehicleListParsed.error.errors[0]);
    assert(false);
  }
  const stagedVehicleMods: Array<VehicleMods> = [];
  vehicleMods.forEach((vehicleMod) => {
    switch (vehicleMod.type) {
      case vehicleModTypeEnum.Vehicle:
        stagedVehicleMods.push(new VehicleChasisMods(vehicleMod));
        break;
      case vehicleModTypeEnum.WeaponMount:
        stagedVehicleMods.push(new WeaponMountMods(vehicleMod));
        break;
    }
    // console.log(vehicleMod.name);
  });
  return stagedVehicleMods;
};
