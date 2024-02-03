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
  vehicleTypeEnum,
  watercraftSubtypeEnum,
} from "@neon-codex/common/build/enums.js";
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
  if (weaponMount.mods !== undefined) {
    mod = weaponMount.mods.mod;
  }
  return {
    control: weaponMount.control,
    flexibility: weaponMount.flexibility,
    size: weaponMount.size,
    visibility: weaponMount.visibility,
    includedWeapon: weaponMount.allowedweapons,
    includedMountMod: mod,
  };
};

export const convertVehicleCategory = function (
  category: vehicleXmlCategoryEnum
) {
  switch (category) {
    // Groundcrafts
    case vehicleXmlCategoryEnum.Bikes:
      return {
        type: vehicleTypeEnum.Groundcraft,
        subtype: groundcraftSubtypeEnum.Bike,
      };
    case vehicleXmlCategoryEnum.Cars:
      return {
        type: vehicleTypeEnum.Groundcraft,
        subtype: groundcraftSubtypeEnum.Car,
      };
    case vehicleXmlCategoryEnum.Trucks:
      return {
        type: vehicleTypeEnum.Groundcraft,
        subtype: groundcraftSubtypeEnum.Truck_Van,
      };
    case vehicleXmlCategoryEnum.Municipal:
      return {
        type: vehicleTypeEnum.Groundcraft,
        subtype: groundcraftSubtypeEnum.Municipal,
      };
    case vehicleXmlCategoryEnum.Corpsec:
      return {
        type: vehicleTypeEnum.Groundcraft,
        subtype: groundcraftSubtypeEnum.Corpsec,
      };
    // Watercraft
    case vehicleXmlCategoryEnum.Boats:
      return {
        type: vehicleTypeEnum.Watercraft,
        subtype: watercraftSubtypeEnum.Boat,
      };
    case vehicleXmlCategoryEnum.Submarines:
      return {
        type: vehicleTypeEnum.Watercraft,
        subtype: watercraftSubtypeEnum.Submarine,
      };
    case vehicleXmlCategoryEnum.Hovercraft:
      return {
        type: vehicleTypeEnum.Watercraft,
        subtype: watercraftSubtypeEnum.Hovercraft,
      };
    // Aircrafts
    case vehicleXmlCategoryEnum.FixedWing_Aircraft:
      return {
        type: vehicleTypeEnum.Aircraft,
        subtype: aircraftSubtypeEnum.FixedWing_Aircraft,
      };
    case vehicleXmlCategoryEnum.LTAV:
      return {
        type: vehicleTypeEnum.Aircraft,
        subtype: aircraftSubtypeEnum.LTAV,
      };
    case vehicleXmlCategoryEnum.Rotorcraft:
      return {
        type: vehicleTypeEnum.Aircraft,
        subtype: aircraftSubtypeEnum.Rotorcraft,
      };
    case vehicleXmlCategoryEnum.VTOL_VSTOL:
      return {
        type: vehicleTypeEnum.Aircraft,
        subtype: aircraftSubtypeEnum.VTOL_VSTOL,
      };
    // Drones
    case vehicleXmlCategoryEnum.Drones_Micro:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Micro,
      };
    case vehicleXmlCategoryEnum.Drones_Mini:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Mini,
      };
    case vehicleXmlCategoryEnum.Drones_Small:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Small,
      };
    case vehicleXmlCategoryEnum.Drones_Medium:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Medium,
      };
    case vehicleXmlCategoryEnum.Drones_Large:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Large,
      };
    case vehicleXmlCategoryEnum.Drones_Huge:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Huge,
      };
    case vehicleXmlCategoryEnum.Drones_Anthro:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Anthro,
      };
    case vehicleXmlCategoryEnum.Drones_Missile:
      return {
        type: vehicleTypeEnum.Drone,
        subtype: droneSubtypeEnum.Drones_Missile,
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
