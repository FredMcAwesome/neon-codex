import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Spells } from "../../models/rpg/abilities/spellModel.js";
import type { SpellListType } from "@neon-codex/common/build/schemas/abilities/magic/spellSchemas.js";
import { SpellListSchema } from "@neon-codex/common/build/schemas/abilities/magic/spellSchemas.js";

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
  const spellListParsed = SpellListSchema.safeParse(rawJson);
  if (spellListParsed.success) {
    console.log("spells all g");
    spells = spellListParsed.data;
  } else {
    console.log(spellListParsed.error.errors[0]);
    assert(false, "spells is undefined");
  }
  const stagedSpells: Array<Spells> = [];
  spells.forEach((spell) => {
    stagedSpells.push(new Spells(spell));
    // console.log(armourMod.name);
  });
  return stagedSpells;
};
