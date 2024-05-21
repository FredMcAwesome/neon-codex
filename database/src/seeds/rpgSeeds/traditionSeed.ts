import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  TraditionListSchema,
  type TraditionListType,
} from "@neon-codex/common/build/schemas/abilities/magic/traditionSchemas.js";
import { Traditions } from "../../models/rpg/traits/traditionModel.js";

export const getTraditions = function () {
  const currentPath = import.meta.url;
  let unlinkedTraditions: TraditionListType;
  const relativeConverterPath = "converter/jsonFiles/traditions.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const traditionListParsed = TraditionListSchema.safeParse(rawJson);
  if (traditionListParsed.success) {
    console.log("traditions all g");
    unlinkedTraditions = traditionListParsed.data;
  } else {
    console.log(traditionListParsed.error.errors[0]);
    assert(false, "traditions is undefined");
  }
  const stagedTraditions: Array<Traditions> = [];
  unlinkedTraditions.forEach((spell) => {
    stagedTraditions.push(new Traditions(spell));
    // console.log(tradition.name);
  });
  return { unlinkedTraditions, stagedTraditions };
};
