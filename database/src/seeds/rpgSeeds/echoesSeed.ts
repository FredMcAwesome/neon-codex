import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EchoListSchema } from "@neon-codex/common/build/schemas/abilities/talent/echoSchemas.js";
import type { EchoListType } from "@neon-codex/common/build/schemas/abilities/talent/echoSchemas.js";
import { Echoes } from "../../models/rpg/otherData/echoModel.js";
import { type } from "arktype";

export const getEchoes = function () {
  const currentPath = import.meta.url;
  let unlinkedEchoes: EchoListType;
  const relativeConverterPath = "converter/jsonFiles/echoes.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const echoListParsed = EchoListSchema(rawJson);
  if (echoListParsed instanceof type.errors) {
    console.log(echoListParsed.summary);
    assert(false, "echoes is undefined");
  } else {
    console.log("Echoes all g");
    unlinkedEchoes = echoListParsed;
  }
  const stagedEchoes: Array<Echoes> = [];
  unlinkedEchoes.forEach((echo) => {
    stagedEchoes.push(new Echoes(echo));
    // console.log(echo.name);
  });
  return stagedEchoes;
};
