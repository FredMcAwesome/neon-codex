import { restrictionEnum } from "@shadowrun/common";

import Drug from "../../grammar/drug.ohm-bundle.js";
import { DrugEffectXmlListType } from "./DrugComponentParserSchemas.js";
const Availability = Drug;

export const convertDrugEffects = function (effectList: DrugEffectXmlListType) {
  const effectArray = Array.isArray(effectList.effect)
    ? effectList.effect
    : [effectList.effect];
  return effectArray.map((effect) => {
    let attributeXmlList =
      effect.attribute === undefined
        ? undefined
        : Array.isArray(effect.attribute)
        ? effect.attribute
        : [effect.attribute];
    let limitXmlList =
      effect.limit === undefined
        ? undefined
        : Array.isArray(effect.limit)
        ? effect.limit
        : [effect.limit];
    return {
      level: effect.level,
      attributeModificationList: attributeXmlList,
      limitModificationList: limitXmlList,
      crashDamage: effect.crashdamage,
      duration: effect.duration,
      initiativeDice: effect.initiativedice,
      additionalNotes: effect.info,
      addQuality: effect.quality,
      speed: effect.speed,
    };
  });
};

const availabilityDrugSemantics = Availability.createSemantics();
availabilityDrugSemantics.addOperation("eval", {
  Exp_add(_, inner) {
    return inner.eval();
  },
  Exp(inner) {
    return inner.eval();
  },
  Availability_full(availability, restriction) {
    return { rating: availability.eval(), restriction: restriction.eval() };
  },
  Availability_partial(availability) {
    return {
      rating: availability.eval(),
      restriction: restrictionEnum.Legal,
    };
  },
  Number(availability) {
    return availability.eval();
  },
  Number_negative(_, range) {
    return -range.eval();
  },
  PositiveNumber_float(rangeInt, _, rangeDecimal) {
    return parseFloat(rangeInt.sourceString + "." + rangeDecimal.sourceString);
  },
  PositiveNumber_int(range) {
    return parseInt(range.sourceString);
  },
  Restriction(restriction) {
    return restriction.eval();
  },
  Restricted(_) {
    return restrictionEnum.Restricted;
  },
  Forbidden(_) {
    return restrictionEnum.Forbidden;
  },
});

export { availabilityDrugSemantics };
