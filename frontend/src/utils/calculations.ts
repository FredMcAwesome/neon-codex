import { CostType, costEnum, mathOperatorEnum } from "@shadowrun/common";
import { GearCalculationType } from "@shadowrun/common/src/schemas/commonSchema.js";

export const genericListCalculation = function (
  genericList: GearCalculationType,
  options: {
    rating?: number;
    weapon?: number;
    chemical?: number;
    sensor?: number;
    capacity?: number;
    force?: number;
  }
) {
  let cost = 0;
  let nextOperation = mathOperatorEnum.Add;
  genericList.forEach((item) => {
    if (typeof item === "object" && "operator" in item) {
      nextOperation = item.operator;
    } else {
      let nextValue = 0;
      if (typeof item === "number") {
        nextValue = item;
      } else {
        switch (item.option) {
          case "Rating":
            nextValue = options.rating || 0;
            break;
          case "Weapon":
            nextValue = options.weapon || 0;
            break;
          case "Chemical":
            nextValue = options.chemical || 0;
            break;
          case "Sensor":
            nextValue = options.sensor || 0;
            break;
          case "Capacity":
            nextValue = options.capacity || 0;
            break;
          case "Force":
            nextValue = options.force || 0;
            break;
        }
      }
      switch (nextOperation) {
        case mathOperatorEnum.Add:
          cost += nextValue;
          break;
        case mathOperatorEnum.Subtract:
          cost -= nextValue;
          break;
        case mathOperatorEnum.Multiply:
          cost *= nextValue;
          break;
        case mathOperatorEnum.Divide:
          cost /= nextValue;
          break;
      }
    }
  });
  return cost;
};

export const costCalculation = function (
  costArray: CostType,
  options: {
    rating?: number;
    weapon?: number;
    chemical?: number;
    sensor?: number;
    capacity?: number;
    force?: number;
  }
) {
  let cost = 0;
  let nextOperation = mathOperatorEnum.Add;
  costArray.forEach((costItem) => {
    if (typeof costItem === "object" && "operator" in costItem) {
      nextOperation = costItem.operator;
    } else {
      let nextValue = 0;
      if (typeof costItem === "number") {
        nextValue = costItem;
      } else {
        if (typeof costItem === "object" && "subnumbers" in costItem) {
          nextValue = costCalculation(costItem.subnumbers, options);
        } else {
          switch (costItem.option) {
            case costEnum.Rating:
              nextValue = options.rating || 0;
              break;
            case costEnum.Weapon:
              nextValue = options.weapon || 0;
              break;
            // case "Chemical":
            //   nextValue = options.chemical || 0;
            //   break;
            // case "Sensor":
            //   nextValue = options.sensor || 0;
            //   break;
            // case "Capacity":
            //   nextValue = options.capacity || 0;
            //   break;
            // case "Force":
            //   nextValue = options.force || 0;
            //   break;
          }
        }
      }
      switch (nextOperation) {
        case mathOperatorEnum.Add:
          cost += nextValue;
          break;
        case mathOperatorEnum.Subtract:
          cost -= nextValue;
          break;
        case mathOperatorEnum.Multiply:
          cost *= nextValue;
          break;
        case mathOperatorEnum.Divide:
          cost /= nextValue;
          break;
      }
    }
  });
  return cost;
};
