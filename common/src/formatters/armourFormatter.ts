import type {
  AvailabilityArmourType,
  CostArmourType,
} from "../schemas/equipment/combat/armourSchemas.js";
import type { DamageReductionArmourType } from "../schemas/shared/commonSchemas.js";
import { formatRating } from "./commonFormatter.js";

export function formatArmourDamageReduction(
  unformattedDamageReduction: DamageReductionArmourType
): string {
  let damageReductionFormatted = "";
  if (typeof unformattedDamageReduction === "number") {
    damageReductionFormatted += unformattedDamageReduction.toString();
  } else if ("option" in unformattedDamageReduction) {
    damageReductionFormatted += unformattedDamageReduction.option;
  }

  return damageReductionFormatted;
}

export function formatArmourAvailability(availability: AvailabilityArmourType) {
  const modifier =
    availability.modifier !== undefined ? availability.modifier : "";
  return `${modifier}${formatRating(availability.rating)}${
    availability.restriction
  }`;
}

export function formatArmourCost(unformattedCost: CostArmourType): string {
  let costFormatted = "";
  if ("range" in unformattedCost) {
    const range = unformattedCost.range;
    return `${range.min}-${range.max}`;
  }
  for (const costValue of unformattedCost) {
    if (typeof costValue === "number") {
      costFormatted += costValue.toString();
    } else if ("option" in costValue) {
      costFormatted += costValue.option;
    } else if ("operator" in costValue) {
      costFormatted += costValue.operator;
    } else {
      costFormatted += formatArmourCost(costValue.subnumbers);
    }
  }
  return costFormatted;
}
