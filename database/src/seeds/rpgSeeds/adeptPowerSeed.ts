import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  AdeptPowerListSchema,
  type AdeptPowerListType,
} from "@neon-codex/common/build/schemas/abilities/magic/adeptPowerSchemas.js";
import { AdeptPowers } from "../../models/rpg/abilities/adeptPowerModel.js";

export const getAdeptPowers = function () {
  const currentPath = import.meta.url;
  let unlinkedAdeptPowers: AdeptPowerListType;
  const relativeConverterPath = "converter/jsonFiles/adeptPowers.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const adeptPowerListParsed = AdeptPowerListSchema.safeParse(rawJson);
  if (adeptPowerListParsed.success) {
    console.log("adept powers all g");
    unlinkedAdeptPowers = adeptPowerListParsed.data;
  } else {
    console.log(adeptPowerListParsed.error.errors[0]);
    assert(false, "adept powers is undefined");
  }
  const stagedAdeptPowers: Array<AdeptPowers> = [];
  unlinkedAdeptPowers.forEach((spell) => {
    stagedAdeptPowers.push(new AdeptPowers(spell));
    // console.log(armourMod.name);
  });
  return { unlinkedAdeptPowers, stagedAdeptPowers };
};
