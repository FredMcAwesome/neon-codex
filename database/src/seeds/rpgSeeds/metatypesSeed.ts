import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MetatypeListSchema,
  type MetatypeListType,
} from "@neon-codex/common/build/schemas/abilities/metatypeSchemas.js";
import {
  Metahumans,
  Metasapients,
  Metatypes,
  Metavariants,
  Shapeshifters,
} from "../../models/rpg/traits/metatypeModel.js";
import { metatypeCategoryEnum } from "@neon-codex/common/build/enums.js";

export const getMetatypes = function () {
  const currentPath = import.meta.url;
  let unlinkedMetatypes: MetatypeListType;
  const relativeConverterPath = "converter/jsonFiles/metatypes.json";
  const rootPath = "../../../../../";
  const jsonString = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + rootPath + relativeConverterPath),
    "utf8"
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rawJson = JSON.parse(jsonString);
  const metatypeListParsed = MetatypeListSchema.safeParse(rawJson);
  if (metatypeListParsed.success) {
    console.log("metatypes all g");
    unlinkedMetatypes = metatypeListParsed.data;
  } else {
    console.log(metatypeListParsed.error.errors[0]);
    assert(false, "metatypes is undefined");
  }
  const stagedMetatypes: Array<Metatypes> = [];
  unlinkedMetatypes.forEach((metatype) => {
    let stagedMetahuman: Metahumans;
    switch (metatype.category) {
      case metatypeCategoryEnum.Metahuman:
        stagedMetahuman = new Metahumans(metatype);
        if (metatype.metavariantList !== undefined) {
          metatype.metavariantList.forEach((metavariant) => {
            stagedMetahuman.subSpecies.add(new Metavariants(metavariant));
          });
        }
        stagedMetatypes.push(stagedMetahuman);
        break;
      case metatypeCategoryEnum.Metasapient:
        stagedMetatypes.push(new Metasapients(metatype));
        break;
      case metatypeCategoryEnum.Shapeshifter:
        stagedMetatypes.push(new Shapeshifters(metatype));
        break;
      case metatypeCategoryEnum.Metavariant:
        assert(false, "This shouldn't occur here");
    }
    // console.log(metatype.name);
  });
  stagedMetatypes.forEach((metatype) => {
    if (metatype instanceof Metahumans) {
      metatype.subSpecies;
    }
  });
  return { unlinkedMetatypes, stagedMetatypes };
};
