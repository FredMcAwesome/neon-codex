import { RangeListSchema } from "@shadowrun/common/build/schemas/weaponSchemas.js";
import type { RangeListType } from "@shadowrun/common/build/schemas/weaponSchemas.js";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WeaponRanges } from "../../models/gear/combatGear/helperTables/weaponRangeModel.js";

export const getRanges = function () {
  const currentPath = import.meta.url;
  let ranges: RangeListType | undefined = undefined;
  const relativeConverterPath = "converter/jsonFiles/ranges.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  const rawJson = JSON.parse(jsonString);
  const rangeListParsed = RangeListSchema.safeParse(rawJson);
  if (rangeListParsed.success) {
    console.log("ranges all g");
    ranges = rangeListParsed.data;
  } else {
    console.log(rangeListParsed.error.errors[0]);
  }
  if (ranges === undefined) {
    assert(false);
  }
  const stagedRanges: Array<WeaponRanges> = [];
  ranges.forEach((range) => {
    stagedRanges.push(new WeaponRanges(range));
    // console.log(range.name);
  });
  return stagedRanges;
};
