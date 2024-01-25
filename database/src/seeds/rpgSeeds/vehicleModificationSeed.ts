import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VehicleModListSchema } from "@shadowrun/common/build/schemas/riggerModSchemas.js";
import type { VehicleModListType } from "@shadowrun/common/build/schemas/riggerModSchemas.js";
import {
  VehicleChasisModifications,
  VehicleModifications,
  WeaponMountModifications,
} from "../../models/rpg/gear/riggerGear/vehicleModificationModel.js";
import { vehicleModTypeEnum } from "@shadowrun/common/build/enums.js";

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
    switch (vehicleMod.type) {
      case vehicleModTypeEnum.Vehicle:
        stagedVehicleMods.push(new VehicleChasisModifications(vehicleMod));
        break;
      case vehicleModTypeEnum.WeaponMount:
        stagedVehicleMods.push(new WeaponMountModifications(vehicleMod));
        break;
    }
    // console.log(vehicleMod.name);
  });
  return stagedVehicleMods;
};
