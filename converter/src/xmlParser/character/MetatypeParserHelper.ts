import assert from "assert";
import { heritageCategoryEnum } from "@neon-codex/common/build/enums.js";
import type { XmlPowerListType } from "../common/ParserCommonDefines.js";
import type { IncludedPowerListType } from "@neon-codex/common/build/schemas/abilities/heritageSchemas.js";

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

export const convertIncludedPowers = function (
  powers: XmlPowerListType
): IncludedPowerListType | undefined {
  if (powers.length === 1) {
    if (powers[0] === "") {
      return undefined;
    }
  }
  return powers.map((power) => {
    if (typeof power !== "object") {
      assert(power !== "");
      return {
        name: power,
      };
    }
    let rating;
    if ("_rating" in power && power._rating !== undefined) {
      rating = parseInt(power._rating);
      assert(!isNaN(rating));
    }
    return {
      name: power.xmltext,
      ...("_select" in power && { selectText: power._select }),
      ...(rating !== undefined && { rating: rating }),
    };
  });
};
