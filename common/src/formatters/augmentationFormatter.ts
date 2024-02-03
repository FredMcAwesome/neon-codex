import type {
  AvailabilityAugmentationType,
  CapacityAugmentationType,
  CostAugmentationType,
} from "../schemas/augmentationSchemas.js";
import type { EssenceCostType } from "../schemas/commonSchemas.js";
import { formatRating } from "./commonFormatter.js";

export function formatEssenceCost(unformattedCost: EssenceCostType): string {
  let costFormatted = "";
  if ("ratingLinked" in unformattedCost) {
    return unformattedCost.ratingLinked
      .map((singleCost) => {
        return formatEssenceCost(singleCost);
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
      costFormatted += formatEssenceCost(costValue.subnumbers);
    }
  }
  return costFormatted;
}

export function formatAugmentationCapacity(
  unformattedCapacity: CapacityAugmentationType
): string {
  let capacityFormatted = "";
  if ("ratingLinked" in unformattedCapacity) {
    return unformattedCapacity.ratingLinked
      .map((singleCapacity) => {
        return formatAugmentationCapacity(singleCapacity);
      })
      .join(", ");
  }
  for (const costValue of unformattedCapacity) {
    if (typeof costValue === "number") {
      capacityFormatted += costValue.toString();
    } else if ("option" in costValue) {
      capacityFormatted += costValue.option;
    } else if ("operator" in costValue) {
      capacityFormatted += costValue.operator;
    } else {
      capacityFormatted += formatAugmentationCapacity(costValue.subnumbers);
    }
  }
  return capacityFormatted;
}

export function formatAugmentationAvailability(
  availability: AvailabilityAugmentationType
): string {
  if ("ratingLinked" in availability) {
    return availability.ratingLinked
      .map((singleAvailability) => {
        return formatAugmentationAvailability(singleAvailability);
      })
      .join(", ");
  }
  const modifier =
    availability.modifier !== undefined ? availability.modifier : "";
  return `${modifier}${formatRating(availability.rating)}${
    availability.restriction
  }`;
}

export function formatAugmentationCost(
  unformattedCost: CostAugmentationType
): string {
  let costFormatted = "";
  if ("range" in unformattedCost) {
    const range = unformattedCost.range;
    const min = formatAugmentationCost([range.min]);
    const max = formatAugmentationCost([range.max]);
    return `${min}-${max}`;
  } else if ("ratingLinked" in unformattedCost) {
    return unformattedCost.ratingLinked
      .map((singleCost) => {
        return formatAugmentationCost(singleCost);
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
      costFormatted += formatAugmentationCost(costValue.subnumbers);
    }
  }
  return costFormatted;
}
