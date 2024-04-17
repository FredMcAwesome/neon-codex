import type { BonusQualityListType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type {
  MetatypeXmlMovementType,
  MetatypeXmlQualitiesSingularType,
  MetatypeXmlQualitiesType,
} from "./MetatypeParserSchemas.js";
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

export const convertMovement = function (movement: MetatypeXmlMovementType) {
  let movementString;
  if (typeof movement === "object") {
    movementString = movement.xmltext;
  } else {
    movementString = movement;
  }
  const movementArray = movementString.split("/").map((movement) => {
    const movementNumber = parseInt(movement);
    assert(!isNaN(movementNumber));
    return movementNumber;
  });
  assert(movementArray.length === 3);
  return {
    ground: movementArray[2],
    water: movementArray[1],
    air: movementArray[0],
  };
};

export const convertMetatypeQualities = function (
  qualities: MetatypeXmlQualitiesType
) {
  assert(
    !(qualities.positive === undefined && qualities.negative === undefined)
  );
  let qualityList: BonusQualityListType = [];
  if (qualities.positive !== undefined) {
    qualityList = qualityList.concat(
      convertMetatypeQuality(qualities.positive)
    );
  }
  if (qualities.negative !== undefined) {
    qualityList = qualityList.concat(
      convertMetatypeQuality(qualities.negative)
    );
  }
  assert(
    qualityList.length > 0,
    `Metatype quality list is empty, ${qualities.positive}, ${qualities.negative}`
  );
  return qualityList;
};

const convertMetatypeQuality = function (
  qualitySingular: MetatypeXmlQualitiesSingularType
) {
  const qualityList = Array.isArray(qualitySingular.quality)
    ? qualitySingular.quality
    : [qualitySingular.quality];
  assert(
    qualityList.length > 0,
    `Metatype quality list is empty, ${qualitySingular.quality}`
  );
  return qualityList.map((quality) => {
    if (typeof quality === "object") {
      return { name: quality.xmltext };
    }
    return { name: quality };
  });
};
