import type { IncludedWeaponMountXmlType } from "./VehicleParserSchemas.js";
import { vehicleXmlCategoryEnum } from "./VehicleParserSchemas.js";
import {
  aircraftSubtypeEnum,
  availabilityEnum,
  costEnum,
  droneSubtypeEnum,
  groundcraftSubtypeEnum,
  mathOperatorEnum,
  restrictionEnum,
  vehicleCategoryEnum,
  watercraftSubtypeEnum,
} from "@neon-codex/common";
import Vehicles from "../../grammar/vehicles.ohm-bundle.js";
const Acceleration = Vehicles.Acceleration;
const Speed = Vehicles.Speed;
const Availability = Vehicles.Availability;
const Cost = Vehicles.Cost;
const Handling = Vehicles.Handling;
const Seats = Vehicles.Seats;

export const convertWeaponMount = function (
  weaponMount: IncludedWeaponMountXmlType
) {
  let mod;
  if ("mods" in weaponMount && weaponMount.mods !== undefined) {
    mod = weaponMount.mods.mod;
  }
  return {
    control: weaponMount.control,
    flexibility: weaponMount.flexibility,
    size: weaponMount.size,
    visibility: weaponMount.visibility,
    ...("allowedweapons" in weaponMount && {
      ...(weaponMount.allowedweapons !== undefined && {
        weaponMounted: { baseWeapon: weaponMount.allowedweapons },
        weaponExchangeable: false as const,
      }),
    }),
    ...(mod !== undefined && { weaponMountModList: [mod] }),
  };
};

export const convertVehicleCategory = function (
  category: vehicleXmlCategoryEnum
) {
  switch (category) {
    // Groundcrafts
    case vehicleXmlCategoryEnum.Bikes:
      return {
        category: vehicleCategoryEnum.Groundcraft as const,
        subtype: groundcraftSubtypeEnum.Bike as const,
      };
    case vehicleXmlCategoryEnum.Cars:
      return {
        category: vehicleCategoryEnum.Groundcraft as const,
        subtype: groundcraftSubtypeEnum.Car as const,
      };
    case vehicleXmlCategoryEnum.Trucks:
      return {
        category: vehicleCategoryEnum.Groundcraft as const,
        subtype: groundcraftSubtypeEnum.Truck_Van as const,
      };
    case vehicleXmlCategoryEnum.Municipal:
      return {
        category: vehicleCategoryEnum.Groundcraft as const,
        subtype: groundcraftSubtypeEnum.Municipal as const,
      };
    case vehicleXmlCategoryEnum.Corpsec:
      return {
        category: vehicleCategoryEnum.Groundcraft as const,
        subtype: groundcraftSubtypeEnum.Corpsec as const,
      };
    // Watercraft
    case vehicleXmlCategoryEnum.Boats:
      return {
        category: vehicleCategoryEnum.Watercraft as const,
        subtype: watercraftSubtypeEnum.Boat as const,
      };
    case vehicleXmlCategoryEnum.Submarines:
      return {
        category: vehicleCategoryEnum.Watercraft as const,
        subtype: watercraftSubtypeEnum.Submarine as const,
      };
    case vehicleXmlCategoryEnum.Hovercraft:
      return {
        category: vehicleCategoryEnum.Watercraft as const,
        subtype: watercraftSubtypeEnum.Hovercraft as const,
      };
    // Aircrafts
    case vehicleXmlCategoryEnum.FixedWing_Aircraft:
      return {
        category: vehicleCategoryEnum.Aircraft as const,
        subtype: aircraftSubtypeEnum.FixedWing_Aircraft as const,
      };
    case vehicleXmlCategoryEnum.LTAV:
      return {
        category: vehicleCategoryEnum.Aircraft as const,
        subtype: aircraftSubtypeEnum.LTAV as const,
      };
    case vehicleXmlCategoryEnum.Rotorcraft:
      return {
        category: vehicleCategoryEnum.Aircraft as const,
        subtype: aircraftSubtypeEnum.Rotorcraft as const,
      };
    case vehicleXmlCategoryEnum.VTOL_VSTOL:
      return {
        category: vehicleCategoryEnum.Aircraft as const,
        subtype: aircraftSubtypeEnum.VTOL_VSTOL as const,
      };
    // Drones
    case vehicleXmlCategoryEnum.Drones_Micro:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Micro as const,
      };
    case vehicleXmlCategoryEnum.Drones_Mini:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Mini as const,
      };
    case vehicleXmlCategoryEnum.Drones_Small:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Small as const,
      };
    case vehicleXmlCategoryEnum.Drones_Medium:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Medium as const,
      };
    case vehicleXmlCategoryEnum.Drones_Large:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Large as const,
      };
    case vehicleXmlCategoryEnum.Drones_Huge:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Huge as const,
      };
    case vehicleXmlCategoryEnum.Drones_Anthro:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Anthro as const,
      };
    case vehicleXmlCategoryEnum.Drones_Missile:
      return {
        category: vehicleCategoryEnum.Drone as const,
        subtype: droneSubtypeEnum.Drones_Missile as const,
      };
  }
};

const accelerationSemantics = Acceleration.createSemantics();
accelerationSemantics.addOperation("eval", {
  Exp(str): number | { onRoad: number; offRoad: number } {
    return str.eval();
  },
  Acceleration_multiple(str, _, range): { onRoad: number; offRoad: number } {
    return { onRoad: str.eval(), offRoad: range.eval() };
  },
  Acceleration(str): number {
    return str.eval();
  },
  Number_negative(_, range): number {
    return -range.eval();
  },
  PositiveNumber_float(rangeInt, _, rangeDecimal): number {
    return parseFloat(rangeInt.sourceString + "." + rangeDecimal.sourceString);
  },
  PositiveNumber_int(range): number {
    return parseInt(range.sourceString);
  },
});

const speedSemantics = Speed.createSemantics();
speedSemantics.addOperation("eval", {
  Speed_multiple(str, _, range): { onRoad: number; offRoad: number } {
    return { onRoad: str.eval(), offRoad: range.eval() };
  },
  Speed(str) {
    return str.eval();
  },
  Number_negative(_, range): number {
    return -range.eval();
  },
  PositiveNumber_float(rangeInt, _, rangeDecimal): number {
    return parseFloat(rangeInt.sourceString + "." + rangeDecimal.sourceString);
  },
  PositiveNumber_int(range): number {
    return parseInt(range.sourceString);
  },
});

const availabilitySemantics = Availability.createSemantics();
availabilitySemantics.addOperation("eval", {
  Availability_full(availability, restriction) {
    return { rating: availability.eval(), restriction: restriction.eval() };
  },
  Availability_partial(availability) {
    return {
      rating: availability.eval(),
      restriction: restrictionEnum.Legal,
    };
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
  AvailabilityValue(value) {
    return [value.eval()];
  },
  Rating(_) {
    return { option: availabilityEnum.Rating };
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

const costSemantics = Cost.createSemantics();
costSemantics.addOperation("eval", {
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
  CostValue(cost) {
    return [cost.eval()];
  },
  Rating(_) {
    return { option: costEnum.Rating };
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

const handlingSemantics = Handling.createSemantics();
handlingSemantics.addOperation("eval", {
  Handling_multiple(str, _, range) {
    return { onRoad: str.eval(), offRoad: range.eval() };
  },
  Handling(str) {
    return str.eval();
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

const seatsSemantics = Seats.createSemantics();
seatsSemantics.addOperation("eval", {
  Seats_variable(str, _, range): { min: number; max: number } {
    return { min: str.eval(), max: range.eval() };
  },
  Seats_single(str) {
    return str.eval();
  },
  Number_negative(_, range): number {
    return -range.eval();
  },
  PositiveNumber_float(rangeInt, _, rangeDecimal): number {
    return parseFloat(rangeInt.sourceString + "." + rangeDecimal.sourceString);
  },
  PositiveNumber_int(range): number {
    return parseInt(range.sourceString);
  },
});

export {
  accelerationSemantics,
  speedSemantics,
  availabilitySemantics,
  costSemantics,
  handlingSemantics,
  seatsSemantics,
};
