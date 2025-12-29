import { ammoSourceEnum, mathOperatorEnum } from "@neon-codex/common";
import Bonus from "../../grammar/bonus.ohm-bundle.js";
const NumberFixedRating = Bonus.NumberFixedRating;
const SkillKarmaCost = Bonus.SkillKarmaCost;
const RatingCalculation = Bonus.RatingCalculation;

const NumberFixedRatingSemantics = NumberFixedRating.createSemantics();
NumberFixedRatingSemantics.addOperation("eval", {
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

const bonusSkillKarmaCostSemantics = SkillKarmaCost.createSemantics();
bonusSkillKarmaCostSemantics.addOperation("eval", {
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

const bonusWeaponDetailsSemantics = Bonus.WeaponDetails.createSemantics();
bonusWeaponDetailsSemantics.addOperation("eval", {
  Exp(inner) {
    return inner.eval();
  },
  Exp_and(inner1, _and, inner2) {
    return { ...inner1.eval(), ...inner2.eval() };
  },
  DisallowedWeaponList(_a, weaponList, _b) {
    return {
      disallowedWeaponList: [weaponList.eval()],
    };
  },
  ContainsList_multiple(_a, inner, _b, rest, _c) {
    return { reloadMethodList: [inner.eval(), rest.eval()] };
  },
  ContainsList_single(inner) {
    return { reloadMethodList: [inner.eval()] };
  },
  Contains(_a, inner, _b) {
    return inner.eval();
  },
  ReloadMethod(method) {
    return method.eval();
  },
  Break(_) {
    return ammoSourceEnum.BreakAction;
  },
  Clip(_) {
    return ammoSourceEnum.Clip;
  },
  Drum(_) {
    return ammoSourceEnum.Drum;
  },
  MuzzleLoader(_) {
    return ammoSourceEnum.MuzzleLoader;
  },
  InternalMagazine(_) {
    return ammoSourceEnum.InternalMagazine;
  },
  Cylinder(_) {
    return ammoSourceEnum.Cylinder;
  },
  BeltFed(_) {
    return ammoSourceEnum.BeltFed;
  },
  Tank(_) {
    return ammoSourceEnum.Tank;
  },
  External(_) {
    return ammoSourceEnum.External;
  },
  Energy(_) {
    return ammoSourceEnum.Energy;
  },
  CapAndBall(_) {
    return ammoSourceEnum.CapAndBall;
  },
  Node(name) {
    return name.sourceString;
  },
});

const bonusRatingCalculationSemantics = RatingCalculation.createSemantics();
bonusRatingCalculationSemantics.addOperation("eval", {
  Exp(inner) {
    const temp = inner.eval();
    return Array.isArray(temp) ? temp : [temp];
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
  SubCalculation_parenthesis(_a, inner, _b) {
    return [{ subnumbers: inner.eval() }];
  },
  Rating_base(_) {
    return [{ option: "Rating" as const }];
  },
  Rating_positive(_) {
    return [{ option: "Rating" as const }];
  },
  Rating_negative(_) {
    return [
      -1,
      { operator: mathOperatorEnum.Multiply },
      { option: "Rating" as const },
    ];
  },
  Seats_base(_) {
    return [{ option: "Seats" as const }];
  },
  Seats_positive(_) {
    return [{ option: "Seats" as const }];
  },
  NegativeNumber(_, num) {
    return -num.eval();
  },
  PositiveNumber_float(rangeInt, _, rangeDecimal) {
    return parseFloat(rangeInt.sourceString + "." + rangeDecimal.sourceString);
  },
  PositiveNumber_int(range) {
    return parseInt(range.sourceString);
  },
});

export {
  NumberFixedRatingSemantics,
  bonusSkillKarmaCostSemantics,
  bonusWeaponDetailsSemantics,
  bonusRatingCalculationSemantics,
};
