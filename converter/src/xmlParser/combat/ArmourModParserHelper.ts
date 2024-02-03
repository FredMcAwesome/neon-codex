import {
  armourModCategoryEnum,
  availabilityEnum,
  capacityEnum,
  costEnum,
  mathOperatorEnum,
  restrictionEnum,
} from "@neon-codex/common/build/enums.js";
import { armourModXmlCategoryEnum } from "./ArmourModParserSchemas.js";
import ArmourModifications from "../../grammar/armourModifications.ohm-bundle.js";
const Availability = ArmourModifications.Availability;
const Cost = ArmourModifications.Cost;
const Capacity = ArmourModifications.Capacity;

export const convertArmourModCategory = function (
  category: armourModXmlCategoryEnum
) {
  switch (category) {
    case armourModXmlCategoryEnum.FullBodyArmorMods:
      return armourModCategoryEnum.FullBodyArmourMods;
      break;
    case armourModXmlCategoryEnum.CustomizedBallisticMask:
      return armourModCategoryEnum.CustomisedBallisticMask;
    case armourModXmlCategoryEnum.General:
      return armourModCategoryEnum.General;
      break;
    case armourModXmlCategoryEnum.GlobetrotterClothingLiners:
      return armourModCategoryEnum.GlobetrotterClothingLiners;
      break;
    case armourModXmlCategoryEnum.GlobetrotterJacketLiners:
      return armourModCategoryEnum.GlobetrotterJacketLiners;
      break;
    case armourModXmlCategoryEnum.GlobetrotterVestLiners:
      return armourModCategoryEnum.GlobetrotterVestLiners;
      break;
    case armourModXmlCategoryEnum.NightshadeIR:
      return armourModCategoryEnum.NightshadeIR;
      break;
    case armourModXmlCategoryEnum.RapidTransitDetailing:
      return armourModCategoryEnum.RapidTransitDetailing;
      break;
    case armourModXmlCategoryEnum.UrbanExplorerJumpsuitAccessories:
      return armourModCategoryEnum.UrbanExplorerJumpsuitAccessories;
      break;
    case armourModXmlCategoryEnum.VictoryLiners:
      return armourModCategoryEnum.VictoryLiners;
      break;
  }
};

const availabilityArmourModificationSemantics = Availability.createSemantics();
availabilityArmourModificationSemantics.addOperation("eval", {
  Exp_addition(_, availability) {
    return { ...availability.eval(), modifier: mathOperatorEnum.Add };
  },
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, availability) {
    return inner.eval().concat([availability.eval()]);
  },
  Inner_available(availability) {
    return [availability.eval()];
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

const costArmourModificationSemantics = Cost.createSemantics();
costArmourModificationSemantics.addOperation("eval", {
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
  Armour(_) {
    return { option: costEnum.ParentCost };
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

const capacityArmourModificationSemantics = Capacity.createSemantics();
capacityArmourModificationSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, capacity) {
    return inner.eval().concat(capacity.eval());
  },
  Inner(capacity) {
    return capacity.eval();
  },
  CapacityArray(_a, capacity, _b) {
    return capacity.eval();
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
  SubCalculation_numberCalc(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat([{ operator: mathOperatorEnum.Equals }], damage2.eval()),
      },
    ];
  },
  SubCalculation_parenthesis(_a, capacity, _b) {
    return [
      {
        subnumbers: capacity.eval(),
      },
    ];
  },
  SubCalculation_negativeParenthesis(_a, capacity, _b) {
    return [
      -1,
      { operator: mathOperatorEnum.Multiply },
      {
        subnumbers: capacity.eval(),
      },
    ];
  },
  CapacityValue(capacity) {
    return [capacity.eval()];
  },
  Rating(_) {
    return { option: capacityEnum.Rating };
  },
  Capacity(_) {
    return { option: capacityEnum.ParentCapacity };
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

export {
  availabilityArmourModificationSemantics,
  costArmourModificationSemantics,
  capacityArmourModificationSemantics,
};
