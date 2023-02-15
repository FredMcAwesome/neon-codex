import { CostType } from "@shadowrun/common";

export const costCalculation = function (cost: CostType) {
  if (typeof cost.base === "number") return cost.base;
  else if (cost.specialCalculation) {
    cost.specialCalculation.forEach((element) => {
      element;
    });
    return 0;
  } else {
    return 0;
  }
};
