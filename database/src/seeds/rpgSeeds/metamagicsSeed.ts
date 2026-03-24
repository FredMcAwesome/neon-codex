import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MetamagicListSchema } from "@neon-codex/common";
import type { MetamagicListType } from "@neon-codex/common";
import { Metamagics } from "../../models/rpg/otherData/metamagicModel.js";
import { type } from "arktype";

export const getMetamagics = function () {
  const currentPath = import.meta.url;
  let unlinkedMetamagics: MetamagicListType;
  const relativeConverterPath = "converter/jsonFiles/metamagics.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const metamagicListParsed = MetamagicListSchema(rawJson);
  if (metamagicListParsed instanceof type.errors) {
    console.log(metamagicListParsed.summary);
    assert(false, "metamagics is undefined");
  } else {
    console.log("Metamagics all g");
    unlinkedMetamagics = metamagicListParsed;
  }
  const stagedMetamagics: Array<Metamagics> = [];
  unlinkedMetamagics.forEach((metamagic) => {
    stagedMetamagics.push(new Metamagics(metamagic));
    // console.log(metamagic.name);
  });
  return {
    unlinkedMetamagics,
    stagedMetamagics,
  };
};
