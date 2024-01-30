import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Spells } from "../../models/rpg/abilities/spellModel.js";
import type { SpellListType } from "@neon-codex/common/build/schemas/spellSchemas.js";
import { SpellListSchema } from "@neon-codex/common/build/schemas/spellSchemas.js";

export const getSpells = function () {
  const currentPath = import.meta.url;
  let spells: SpellListType;
  const relativeConverterPath = "converter/jsonFiles/spells.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const armourModListParsed = SpellListSchema.safeParse(rawJson);
  if (armourModListParsed.success) {
    console.log("spells all g");
    spells = armourModListParsed.data;
  } else {
    console.log(armourModListParsed.error.errors[0]);
    assert(false, "spells is undefined");
  }
  const stagedArmourMods: Array<Spells> = [];
  spells.forEach((armourMod) => {
    stagedArmourMods.push(new Spells(armourMod));
    // console.log(armourMod.name);
  });
  return stagedArmourMods;
};
