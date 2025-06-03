import {
  EquipmentPackListSchema,
  type EquipmentPackListType,
} from "@neon-codex/common/build/schemas/equipment/equipmentPackSchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EquipmentPacks } from "../../models/rpg/equipment/equipmentPackModel.js";
import { type } from "arktype";
export const getEquipmentPacks = function () {
  const currentPath = import.meta.url;

  let unlinkedEquipmentPacks: EquipmentPackListType;
  const relativeConverterPath = "converter/jsonFiles/equipmentPacks.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const equipmentPackListParsed = EquipmentPackListSchema(rawJson);
  if (equipmentPackListParsed instanceof type.errors) {
    console.log(equipmentPackListParsed.summary);
    assert(false, "equipment packs is undefined");
  } else {
    console.log("equipment packs all g");
    unlinkedEquipmentPacks = equipmentPackListParsed;
  }
  const stagedEquipmentPacks: Array<EquipmentPacks> = [];

  unlinkedEquipmentPacks.forEach((equipmentPack) => {
    stagedEquipmentPacks.push(
      new EquipmentPacks(
        equipmentPack.name,
        equipmentPack.category,
        equipmentPack.nuyen,
        equipmentPack.description
      )
    );
  });

  return {
    unlinkedEquipmentPacks: unlinkedEquipmentPacks,
    stagedEquipmentPacks: stagedEquipmentPacks,
  };
};
