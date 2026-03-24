import { RangeListSchema } from "@neon-codex/common";
import type { RangeListType } from "@neon-codex/common";
import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WeaponRanges } from "../../models/rpg/equipment/combat/helperTables/weaponRangeModel.js";
import { type } from "arktype";

export const getRanges = function () {
  const currentPath = import.meta.url;
  let ranges: RangeListType;
  const relativeConverterPath = "converter/jsonFiles/ranges.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const rangeListParsed = RangeListSchema(rawJson);
  if (rangeListParsed instanceof type.errors) {
    console.log(rangeListParsed.summary);
    assert(false, "ranges is undefined");
  } else {
    console.log("ranges all g");
    ranges = rangeListParsed;
  }
  const stagedRanges: Array<WeaponRanges> = [];
  ranges.forEach((range) => {
    stagedRanges.push(new WeaponRanges(range));
    // console.log(range.name);
  });
  return {
    unlinkedRanges: ranges,
    stagedRanges,
  };
};
