import type {
  PartialSlotCostType,
  SlotCostType,
} from "../schemas/equipment/rigger/vehicleModSchemas.js";
import type {
  AvailabilityVehicleType,
  CostVehicleType,
  VehicleOnOffRoadType,
  VehicleSeatsType,
  VehicleType,
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

export function formatVehicleModSlotCount({
  body,
  modSlots,
  powerTrainModSlots,
  protectionModSlots,
  weaponModSlots,
  bodyModSlots,
  electromagneticModSlots,
  cosmeticModSlots,
}: VehicleType) {
  const base = modSlots !== undefined ? modSlots : body;
  return `Power Train Mod Slots: ${
    powerTrainModSlots !== undefined ? body + powerTrainModSlots : base
  }, Protection Mod Slots: ${
    protectionModSlots !== undefined ? body + protectionModSlots : base
  }, Weapon Mod Slots: ${
    weaponModSlots !== undefined ? body + weaponModSlots : base
  }, Body Mod Slots: ${
    bodyModSlots !== undefined ? body + bodyModSlots : base
  }, Electromagnetic Mod Slots: ${
    electromagneticModSlots !== undefined
      ? body + electromagneticModSlots
      : base
  }, Cosmetic Mod Slots: ${
    cosmeticModSlots !== undefined ? body + cosmeticModSlots : base
  }`;
}

export function formatVehicleSeats(seats: VehicleSeatsType) {
  if (typeof seats === "number") {
    return seats.toString();
  }
  return `${seats.min}-${seats.max}`;
}

export function formatWeaponMountSlotCost(slotCost: SlotCostType) {
  if (Array.isArray(slotCost)) {
    return PartialWeaponMountSlotCost(slotCost);
  } else {
    return slotCost.ratingLinked.reduce((totalCost, cost) => {
      return `${totalCost} ${PartialWeaponMountSlotCost(cost)}`;
    }, "");
  }
}
function PartialWeaponMountSlotCost(slotCost: PartialSlotCostType): string {
  return slotCost.reduce((totalCost, cost) => {
    if (typeof cost === "object") {
      if ("subnumbers" in cost) {
        return `${totalCost} ${PartialWeaponMountSlotCost(cost.subnumbers)}`;
      } else if ("option" in cost) {
        return `${totalCost} ${cost.option}`;
      } else {
        return `${totalCost} ${cost.operator}`;
      }
    } else {
      return `${totalCost} + ${cost.toString()}`;
    }
  }, "");
}
