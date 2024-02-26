import type {
  AvailabilityVehicleType,
  CostVehicleType,
  VehicleOnOffRoadType,
} from "../schemas/equipment/rigger/vehicleSchemas.js";
import { formatRating } from "./commonFormatter.js";

export function formatOnOffRoad(onOffRoad: VehicleOnOffRoadType | undefined) {
  if (onOffRoad === undefined) {
    return "-";
  } else if (typeof onOffRoad === "number") {
    return onOffRoad;
  }
  return onOffRoad.onRoad + "/" + onOffRoad.offRoad;
}

export function formatVehicleAvailability(
  availability: AvailabilityVehicleType
): string {
  const modifier =
    availability.modifier !== undefined ? availability.modifier : "";
  return `${modifier}${formatRating(availability.rating)}${
    availability.restriction
  }`;
}

export function formatVehicleCost(unformattedCost: CostVehicleType): string {
  let costFormatted = "";
  if ("range" in unformattedCost) {
    const range = unformattedCost.range;
    const min = formatVehicleCost([range.min]);
    const max = formatVehicleCost([range.max]);
    return `${min}-${max}`;
  }
  for (const costValue of unformattedCost) {
    if (typeof costValue === "number") {
      costFormatted += costValue.toString();
    } else if ("option" in costValue) {
      costFormatted += costValue.option;
    } else if ("operator" in costValue) {
      costFormatted += costValue.operator;
    } else {
      costFormatted += formatVehicleCost(costValue.subnumbers);
    }
  }
  return costFormatted;
}
