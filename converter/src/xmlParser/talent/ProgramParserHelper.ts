import {
  restrictionEnum,
  mathOperatorEnum,
  availabilityEnum,
  costEnum,
} from "@neon-codex/common/build/enums.js";
import Programs from "../../grammar/programs.ohm-bundle.js";
const Availability = Programs.Availability;
const Cost = Programs.Cost;

const availabilityProgramSemantics = Availability.createSemantics();

availabilityProgramSemantics.addOperation("eval", {
  Availability_full(availability, restriction) {
    return { rating: availability.eval(), restriction: restriction.eval() };
  },
  Availability_parenthesisFull(_a, availability, _b, restriction) {
    return { rating: availability.eval(), restriction: restriction.eval() };
  },
  Availability_partial(availability) {
    return {
      rating: availability.eval(),
      restriction: restrictionEnum.Legal,
    };
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
  AvailabilityValue(availability) {
    return [availability.eval()];
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
  Rating(_) {
    return { option: availabilityEnum.Rating };
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

const costProgramSemantics = Cost.createSemantics();
costProgramSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, cost) {
    return inner.eval().concat([cost.eval()]);
  },
  Inner_cost(cost) {
    return [cost.eval()];
  },
  Cost_fixed(_a, cost, _b) {
    return cost.eval();
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
  CostValue(cost) {
    return [cost.eval()];
  },
  Rating(_) {
    return { option: costEnum.Rating };
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
});

export { availabilityProgramSemantics, costProgramSemantics };
