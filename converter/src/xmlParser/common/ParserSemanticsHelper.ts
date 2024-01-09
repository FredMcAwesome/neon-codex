import Bonus from "../../grammar/bonus.ohm-bundle.js";
const Initiative = Bonus.Initiative;
const SkillKarmaCost = Bonus.SkillKarmaCost;

const initiativeSemantics = Initiative.createSemantics();
initiativeSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, capacity) {
    return inner.eval().concat(capacity.eval());
  },
  ArrayWrapper(inner) {
    return [inner.eval()];
  },
  Rating(_) {
    return { option: "Rating" as const };
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
});

const skillKarmaCostSemantics = SkillKarmaCost.createSemantics();
skillKarmaCostSemantics.addOperation("eval", {
  Exp(inner) {
    return inner.eval();
  },
  Calculation(_a, inner, _b) {
    return {
      RatingRequired: inner.eval(),
    };
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
});

export { initiativeSemantics, skillKarmaCostSemantics };
