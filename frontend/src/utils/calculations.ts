import type { GearCalculationType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import type { CostWeaponAccessoryType } from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import type { CostArmourType } from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import type { CostArmourModType } from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas.js";
import type { CostAugmentationType } from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type { CostGearType } from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type { CostWeaponType } from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import type { CostVehicleType } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";
import { costEnum, mathOperatorEnum } from "@neon-codex/common/build/enums.js";
import type { CostVehicleModType } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";

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
    | CostArmourType
    | CostArmourModType
    | CostAugmentationType
    | CostGearType
    | CostVehicleType
    | CostVehicleModType
    | CostWeaponType
    | CostWeaponAccessoryType
>(
  costArray: CostType,
  options: {
    rating?: number;
    minimumRating?: number;
    parentCost?: number;
    childrenCost?: number;
    gearCost?: number;
    weaponCost?: number;
  }
) {
  let finalCost = 0;
  let nextOperation = mathOperatorEnum.Add;
  if (Array.isArray(costArray)) {
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
            if ("option" in costItem) {
              switch (costItem.option) {
                case costEnum.Rating:
                  if (options.rating === undefined) {
                    console.error("Rating is undefined for this cost");
                    options.rating = 0;
                  }
                  nextValue = options.rating;
                  break;
                case costEnum.MinimumRating:
                  if (options.minimumRating === undefined) {
                    console.error("Minimum Rating is undefined for this cost");
                    options.minimumRating = 0;
                  }
                  nextValue = options.minimumRating;
                  break;
                case costEnum.ParentCost:
                  if (options.parentCost === undefined) {
                    console.error("Parent Cost is undefined for this cost");
                    options.parentCost = 0;
                  }
                  nextValue = options.parentCost;
                  break;
                case costEnum.ChildrenCost:
                  if (options.childrenCost === undefined) {
                    console.error("Children Cost is undefined for this cost");
                    options.childrenCost = 0;
                  }
                  nextValue = options.childrenCost;
                  break;
                case costEnum.GearCost:
                  if (options.gearCost === undefined) {
                    console.error("Gear Cost is undefined for this cost");
                    options.gearCost = 0;
                  }
                  nextValue = options.gearCost;
                  break;
                case costEnum.WeaponCost:
                  if (options.weaponCost === undefined) {
                    console.error("Weapon Cost is undefined for this cost");
                    options.weaponCost = 0;
                  }
                  nextValue = options.weaponCost;
                  break;
              }
            }
          }
        }
        switch (nextOperation) {
          case mathOperatorEnum.Add:
            finalCost += nextValue;
            break;
          case mathOperatorEnum.Subtract:
            finalCost -= nextValue;
            break;
          case mathOperatorEnum.Multiply:
            finalCost *= nextValue;
            break;
          case mathOperatorEnum.Divide:
            finalCost /= nextValue;
            break;
        }
      }
    });
  } else {
    costArray;
  }
  return finalCost;
};
