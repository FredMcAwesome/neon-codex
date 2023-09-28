import { mathOperatorEnum } from "@shadowrun/common/build/enums.js";
import Bonus from "../../grammar/bonus.ohm-bundle.js";
const EssenceCost = Bonus.EssenceCost;
const Initiative = Bonus.Initiative;
const SkillKarmaCost = Bonus.SkillKarmaCost;

const essenceCostSemantics = EssenceCost.createSemantics();
essenceCostSemantics.addOperation("eval", {
  MulDiv_multiply(str, _, range) {
    return [
      {
        subnumbers: str
          .eval()
          .concat([{ operator: mathOperatorEnum.Multiply }], range.eval()),
      },
    ];
  },
  MulDiv_divide(str, _, range) {
    return [
      {
        subnumbers: str
          .eval()
          .concat([{ operator: mathOperatorEnum.Divide }], range.eval()),
      },
    ];
  },
  AddSub_add(str, _, range) {
    return str
      .eval()
      .concat([{ operator: mathOperatorEnum.Add }], range.eval());
  },
  AddSub_subtract(str, _, range) {
    return str
      .eval()
      .concat([{ operator: mathOperatorEnum.Subtract }], range.eval());
  },
  EssenceValue(str) {
    return [str.eval()];
  },
  Rating(_) {
    return { option: "Rating" };
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

const initiativeSemantics = Initiative.createSemantics();
initiativeSemantics.addOperation("eval", {
  FixedValues(_a, inner, _b) {
    return inner.eval();
  },
  Inner(recursive, _, val) {
    return [val.eval()].concat(recursive.eval());
  },
  Rating(_) {
    return { option: "Rating" };
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

export { essenceCostSemantics, initiativeSemantics, skillKarmaCostSemantics };
