import { mathOperatorEnum } from "@shadowrun/common";
import type { GearCalculationType } from "@shadowrun/common/build/schemas/commonSchemas.js";
import type { CostWeaponAccessoryType } from "@shadowrun/common/build/schemas/weaponAccessorySchemas.js";
import type { CostAmmunitionType } from "@shadowrun/common/build/schemas/ammunitionSchemas.js";
import type {
  CostArmourType,
  CostArmourModType,
} from "@shadowrun/common/build/schemas/armourSchemas.js";
import type { CostAugmentationType } from "@shadowrun/common/build/schemas/augmentationSchemas.js";
import type { CostElectronicType } from "@shadowrun/common/build/schemas/electronicSchemas.js";
import type { CostMagicalType } from "@shadowrun/common/build/schemas/magicalSchemas.js";
import type { CostGearType } from "@shadowrun/common/build/schemas/otherGearSchemas.js";
import type { CostRiggerType } from "@shadowrun/common/build/schemas/riggerSchemas.js";
import type { CostWeaponType } from "@shadowrun/common/build/schemas/weaponSchemas.js";

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

export const costCalculation = function <
  CostType extends
    | CostAmmunitionType
    | CostArmourType
    | CostArmourModType
    | CostAugmentationType
    | CostElectronicType
    | CostMagicalType
    | CostGearType
    | CostRiggerType
    | CostWeaponType
    | CostWeaponAccessoryType
>(
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
          // typescript isn't realising the recursive nature of these types
          // means subnumbers will always be the same type as costItem
          nextValue = costCalculation<CostType>(
            costItem.subnumbers as CostType,
            options
          );
        } else {
          switch (costItem.option) {
            case "Rating":
              nextValue = options.rating || 0;
              break;
            case "Weapon":
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
