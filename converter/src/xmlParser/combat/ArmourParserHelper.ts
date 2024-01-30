import {
  armourCategoryEnum,
  availabilityEnum,
  costArmourEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "@neon-codex/common/build/enums.js";
import Armours from "../../grammar/armours.ohm-bundle.js";
import { armourXmlCategoryEnum } from "./ArmourParserSchemas.js";
const Availability = Armours.Availability;
const Cost = Armours.Cost;

export const convertArmourCategory = function (
  category: armourXmlCategoryEnum
) {
  switch (category) {
    case armourXmlCategoryEnum.Armor:
      return armourCategoryEnum.Armour;
      break;
    case armourXmlCategoryEnum.Cloaks:
      return armourCategoryEnum.Cloaks;
      break;
    case armourXmlCategoryEnum.Clothing:
      return armourCategoryEnum.Clothing;
      break;
    case armourXmlCategoryEnum.FashionableArmor:
      return armourCategoryEnum.FashionableArmour;
      break;
    case armourXmlCategoryEnum.SpecialtyArmor:
      return armourCategoryEnum.SpecialtyArmour;
      break;
  }
};

const availabilityArmourSemantics = Availability.createSemantics();
availabilityArmourSemantics.addOperation("eval", {
  Availability_full(availability, restriction) {
    return { rating: availability.eval(), restriction: restriction.eval() };
  },
  Availability_partial(availability) {
    return {
      rating: availability.eval(),
      restriction: restrictionEnum.Legal,
    };
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
  Rating(_) {
    return { option: availabilityEnum.Rating };
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

const costArmourSemantics = Cost.createSemantics();
costArmourSemantics.addOperation("eval", {
  Variable(_a, inner, _b) {
    return inner.eval();
  },
  InnerVariable(min, _, max) {
    return { range: { min: min.eval(), max: max.eval() } };
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
  SubCalculation_parenthesis(_a, cost, _b) {
    return cost.eval();
  },
  CostValue(cost) {
    return [cost.eval()];
  },
  Rating(_) {
    return { option: costArmourEnum.Rating };
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

export { availabilityArmourSemantics, costArmourSemantics };
