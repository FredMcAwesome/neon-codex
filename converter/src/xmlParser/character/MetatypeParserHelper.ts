import assert from "assert";
import { heritageCategoryEnum } from "@neon-codex/common/build/enums.js";

export const convertMetatypeCategory = function (category: string | undefined) {
  switch (category) {
    case "Metahuman":
      return heritageCategoryEnum.Metahuman;
    case "Metavariant":
      return heritageCategoryEnum.Metavariant;
    case "Metasapient":
      return heritageCategoryEnum.Metasapient;
    case "Shapeshifter":
      return heritageCategoryEnum.Shapeshifter;
    case undefined:
      return heritageCategoryEnum.Metavariant;
    default:
      assert(false);
  }
};
