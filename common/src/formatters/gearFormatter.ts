import type {
  AvailabilityGearType,
  CostGearType,
} from "../schemas/equipment/other/gearSchemas.js";
import { formatRating } from "./commonFormatter.js";

export function formatGearAvailability(
  availability: AvailabilityGearType
): string {
  if ("ratingLinked" in availability) {
    return availability.ratingLinked
      .map((singleAvailability) => {
        return formatGearAvailability(singleAvailability);
      })
      .join(", ");
  }
  const modifier =
    availability.modifier !== undefined ? availability.modifier : "";
  return `${modifier}${formatRating(availability.rating)}${
    availability.restriction
  }`;
}

export function formatGearCost(unformattedCost: CostGearType): string {
  let costFormatted = "";
  if ("range" in unformattedCost) {
    const range = unformattedCost.range;
    return `${range.min}-${range.max}`;
  } else if ("ratingLinked" in unformattedCost) {
    return unformattedCost.ratingLinked
      .map((singleCost) => {
        return formatGearCost(singleCost);
      })
      .join(", ");
  }
  for (const costValue of unformattedCost) {
    if (typeof costValue === "number") {
      costFormatted += costValue.toString();
    } else if ("option" in costValue) {
      costFormatted += costValue.option;
    } else if ("operator" in costValue) {
      costFormatted += costValue.operator;
    } else {
      costFormatted += formatGearCost(costValue.subnumbers);
    }
  }
  return costFormatted;
}
