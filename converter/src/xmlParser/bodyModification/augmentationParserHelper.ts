import {
  availabilityEnum,
  capacityEnum,
  costEnum,
  mathOperatorEnum,
  augmentationMountSlotEnum,
  restrictionEnum,
} from "@neon-codex/common/build/enums.js";
import assert from "assert";
import { mountLocationXmlEnum } from "./CyberwareParserSchemas.js";
import Augmentation from "../../grammar/augmentation.ohm-bundle.js";
const EssenceCost = Augmentation.EssenceCost;
const Availability = Augmentation.Availability;
const Cost = Augmentation.Cost;
const MountList = Augmentation.MountList;
const Capacity = Augmentation.Capacity;

const essenceCostSemantics = EssenceCost.createSemantics();
essenceCostSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, essence) {
    return inner.eval().concat([essence.eval()]);
  },
  Inner_essence(essence) {
    return [essence.eval()];
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
  SubCalculation_parenthesis(_a, essence, _b) {
    return [{ subnumbers: essence.eval() }];
  },
  EssenceValue(str) {
    return [str.eval()];
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

const availabilityAugmentationSemantics = Availability.createSemantics();
availabilityAugmentationSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Exp_addition(_, availability) {
    return { ...availability.eval(), modifier: mathOperatorEnum.Add };
  },
  Exp_gear(availability, _) {
    return { ...availability.eval(), modifier: availabilityEnum.Gear };
  },
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
  Availability_parenthesisPartial(_a, availability, _b) {
    return {
      rating: availability.eval(),
      restriction: restrictionEnum.Legal,
    };
  },
  Inner_list(inner, _, availability) {
    return inner.eval().concat(availability.eval());
  },
  Inner_availability(availability) {
    return [availability.eval()];
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
  MinRating(_) {
    return { option: availabilityEnum.MinimumRating };
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

const costAugmentationSemantics = Cost.createSemantics();
costAugmentationSemantics.addOperation("eval", {
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
  SubCalculation_parenthesis(_a, inner, _b) {
    return [
      {
        subnumbers: inner.eval(),
      },
    ];
  },
  SubCalculation_numberCalc(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat([{ operator: mathOperatorEnum.GreaterThan }], damage2.eval()),
      },
    ];
  },
  CostValue(cost) {
    return [cost.eval()];
  },
  Rating(_) {
    return { option: costEnum.Rating };
  },
  MinRating(_) {
    return { option: costEnum.MinimumRating };
  },
  Parent(_) {
    return { option: costEnum.ParentCost };
  },
  Gear(_) {
    return { option: costEnum.GearCost };
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

const mountsAugmentationSemantics = MountList.createSemantics();
mountsAugmentationSemantics.addOperation("eval", {
  Mount_list(inner, _, mount) {
    return inner.eval().concat(mount.eval());
  },
  Mount_base(mount) {
    return [mount.eval()];
  },
  MountValue(mount) {
    switch (mount.sourceString) {
      case mountLocationXmlEnum.WRIST:
        return augmentationMountSlotEnum.Wrist;
      case mountLocationXmlEnum.ANKLE:
        return augmentationMountSlotEnum.Ankle;
      case mountLocationXmlEnum.ELBOW:
        return augmentationMountSlotEnum.Elbow;
      case mountLocationXmlEnum.KNEE:
        return augmentationMountSlotEnum.Knee;
      case mountLocationXmlEnum.SHOULDER:
        return augmentationMountSlotEnum.Shoulder;
      case mountLocationXmlEnum.HIP:
        return augmentationMountSlotEnum.Hip;
      default:
        assert(false, mount.sourceString);
    }
  },
});

const capacityCyberwareSemantics = Capacity.createSemantics();
capacityCyberwareSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, capacity) {
    return inner.eval().concat([capacity.eval()]);
  },
  Inner_capacity(capacity) {
    return [capacity.eval()];
  },
  CapacityArray_base(_a, capacity, _b) {
    return { cost: capacity.eval() };
  },
  CapacityArray_all(_) {
    return { cost: [{ option: capacityEnum.IncludedInParent }] };
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
    return capacity.eval();
  },
  Rating_base(_) {
    return [{ option: capacityEnum.Rating }];
  },
  Rating_negative(_, rating) {
    return [-1, { operator: mathOperatorEnum.Multiply }].concat(rating.eval());
  },
  Number(availability) {
    return [availability.eval()];
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
  essenceCostSemantics,
  availabilityAugmentationSemantics,
  costAugmentationSemantics,
  mountsAugmentationSemantics,
  capacityCyberwareSemantics,
};
