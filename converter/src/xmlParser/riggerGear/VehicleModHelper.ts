import {
  explosiveTypeEnum,
  firearmWeaponTypeEnum,
  mathOperatorEnum,
  meleeWeaponTypeEnum,
  restrictionEnum,
  vehicleModTypeEnum,
  vehicleModRatingEnum,
  vehicleModAttributeEnum,
  projectileWeaponTypeEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  SubsystemXmlType,
  VehicleModMaxRatingType,
} from "./VehicleModParserSchemas.js";
import { vehicleModXmlCategoryEnum } from "./VehicleModParserSchemas.js";
import VehicleModifications from "../../grammar/vehicleModifications.ohm-bundle.js";
const Rating = VehicleModifications.Rating;
const Slot = VehicleModifications.Slot;
const WeaponMountCategories = VehicleModifications.WeaponMountCategories;
const Availability = VehicleModifications.Availability;
const Cost = VehicleModifications.Cost;

export const convertVehicleModCategory = function (
  category: vehicleModXmlCategoryEnum
) {
  switch (category) {
    case vehicleModXmlCategoryEnum.Body:
      return vehicleModTypeEnum.Body;
    case vehicleModXmlCategoryEnum.Cosmetic:
      return vehicleModTypeEnum.Cosmetic;
    case vehicleModXmlCategoryEnum.Electromagnetic:
      return vehicleModTypeEnum.Electromagnetic;
    case vehicleModXmlCategoryEnum.ModelSpecific:
      return vehicleModTypeEnum.ModelSpecific;
    case vehicleModXmlCategoryEnum.Powertrain:
      return vehicleModTypeEnum.PowerTrain;
    case vehicleModXmlCategoryEnum.Protection:
      return vehicleModTypeEnum.Protection;
    case vehicleModXmlCategoryEnum.Weapons:
      return vehicleModTypeEnum.Weapons;
    case vehicleModXmlCategoryEnum.All:
      return vehicleModTypeEnum.All;
    case vehicleModXmlCategoryEnum.Handling:
      return vehicleModTypeEnum.Handling;
    case vehicleModXmlCategoryEnum.Speed:
      return vehicleModTypeEnum.Speed;
    case vehicleModXmlCategoryEnum.Acceleration:
      return vehicleModTypeEnum.Acceleration;
    case vehicleModXmlCategoryEnum.Armor:
      return vehicleModTypeEnum.Armour;
    case vehicleModXmlCategoryEnum.Sensor:
      return vehicleModTypeEnum.Sensor;
  }
};

export const convertVehicleModMaxRating = function (
  rating: VehicleModMaxRatingType
) {
  if (typeof rating === "number") {
    return rating;
  }
  switch (rating) {
    case "Seats":
      return { option: vehicleModRatingEnum.Seats };
    case "body":
      return { option: vehicleModRatingEnum.Body };
    case "qty":
      return { option: vehicleModRatingEnum.Quantity };
  }
};

const ratingSemantics = Rating.createSemantics();
ratingSemantics.addOperation("eval", {
  Rating_addition(str, _, range) {
    return [str.eval(), mathOperatorEnum.Add, range.eval()];
  },
  Rating_single(str) {
    return [str.eval()];
  },
  RatingValue(str) {
    return str.eval();
  },
  Handling(_): { option: vehicleModRatingEnum } {
    return { option: vehicleModRatingEnum.Handling };
  },
  Speed(_): { option: vehicleModRatingEnum } {
    return { option: vehicleModRatingEnum.Speed };
  },
  Acceleration(_): { option: vehicleModRatingEnum } {
    return { option: vehicleModRatingEnum.Acceleration };
  },
  Body(_): { option: vehicleModRatingEnum } {
    return { option: vehicleModRatingEnum.Body };
  },
  Armour(_): { option: vehicleModRatingEnum } {
    return { option: vehicleModRatingEnum.Armour };
  },
  Pilot(_): { option: vehicleModRatingEnum } {
    return { option: vehicleModRatingEnum.Pilot };
  },
  Sensor(_): { option: vehicleModRatingEnum } {
    return { option: vehicleModRatingEnum.Sensor };
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

const slotSemantics = Slot.createSemantics();
slotSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Exp_negative(_, slot) {
    return [-1, { operator: mathOperatorEnum.Multiply }].concat(slot.eval());
  },
  Inner_list(inner, _, cost) {
    return inner.eval().concat([cost.eval()]);
  },
  Inner_slot(cost) {
    return [cost.eval()];
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
  SubCalculation_parenthesis(_a, capacity, _b) {
    return [
      {
        subnumbers: capacity.eval(),
      },
    ];
  },
  NumberCalc_greaterOrEqual(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat(
            [{ operator: mathOperatorEnum.GreaterThanOrEqual }],
            damage2.eval()
          ),
      },
    ];
  },
  NumberCalc_greaterThan(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat([{ operator: mathOperatorEnum.GreaterThan }], damage2.eval()),
      },
    ];
  },
  SlotValue(val) {
    return [val.eval()];
  },
  Handling(_) {
    return { option: vehicleModAttributeEnum.Handling };
  },
  Speed(_) {
    return { option: vehicleModAttributeEnum.Speed };
  },
  Acceleration(_) {
    return { option: vehicleModAttributeEnum.Acceleration };
  },
  Body(_) {
    return { option: vehicleModAttributeEnum.Body };
  },
  Armour(_) {
    return { option: vehicleModAttributeEnum.Armour };
  },
  Pilot(_) {
    return { option: vehicleModAttributeEnum.Pilot };
  },
  Sensor(_) {
    return { option: vehicleModAttributeEnum.Sensor };
  },
  Rating(_) {
    return { option: vehicleModAttributeEnum.Rating };
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

export const convertSubsystems = function (
  subsystems: SubsystemXmlType | undefined
) {
  if (subsystems === undefined) {
    return subsystems;
  }
  const subsystemList = Array.isArray(subsystems.subsystem)
    ? subsystems.subsystem
    : [subsystems.subsystem];
  return subsystemList;
};

const weaponMountCategoriesSemantics = WeaponMountCategories.createSemantics();
weaponMountCategoriesSemantics.addOperation("eval", {
  Exp_list(list, _, category) {
    const listEvaled = list.eval();
    const categoryEvaled = category.eval();
    if (listEvaled === undefined && categoryEvaled == undefined) {
      return undefined;
    } else if (listEvaled === undefined) {
      return categoryEvaled;
    } else if (categoryEvaled === undefined) {
      return listEvaled;
    } else {
      listEvaled.concat(categoryEvaled);
    }
  },
  Tasers(_) {
    return [firearmWeaponTypeEnum.Tasers];
  },
  Holdouts(_) {
    return [firearmWeaponTypeEnum.HoldOuts];
  },
  LightPistols(_) {
    return [firearmWeaponTypeEnum.LightPistols];
  },
  HeavyPistols(_) {
    return [firearmWeaponTypeEnum.HeavyPistols];
  },
  MachinePistols(_) {
    return [firearmWeaponTypeEnum.MachinePistols];
  },
  SubmachineGuns(_) {
    return [firearmWeaponTypeEnum.SubmachineGuns];
  },
  AssaultRifles(_) {
    return [firearmWeaponTypeEnum.AssaultRifles];
  },
  Shotguns(_) {
    return [firearmWeaponTypeEnum.Shotguns];
  },
  SniperRifles(_) {
    return [firearmWeaponTypeEnum.SniperRifles];
  },
  // This is redundant as the specific machine gun types are mentioned
  MachineGuns(_) {
    return undefined;
  },
  LightMachineguns(_) {
    return [firearmWeaponTypeEnum.LightMachineguns];
  },
  MediumMachineguns(_) {
    return [firearmWeaponTypeEnum.MediumHeavyMachineguns];
  },
  HeavyMachineguns(_) {
    return [firearmWeaponTypeEnum.MediumHeavyMachineguns];
  },
  AssaultCannons(_) {
    return [firearmWeaponTypeEnum.AssaultCannons];
  },
  GrenadeLaunchers(_) {
    return [firearmWeaponTypeEnum.GrenadeLaunchers];
  },
  MissileLaunchers(_) {
    return [firearmWeaponTypeEnum.MissileLaunchers];
  },
  Crossbow(_) {
    return [projectileWeaponTypeEnum.Crossbows];
  },
  ExoticMeleeWeapons(_) {
    // assume exotic melee won't appear without exotic ranged
    return undefined;
  },
  ExoticRangedWeapons(_) {
    return [firearmWeaponTypeEnum.Exotic];
  },
  Cyberweapon(_) {
    return [firearmWeaponTypeEnum.Cyberguns];
  },
  Flamethrowers(_) {
    return [firearmWeaponTypeEnum.Flamethrowers];
  },
  LaserWeapons(_) {
    return [firearmWeaponTypeEnum.Lasers];
  },
  SportingRifles(_) {
    return [firearmWeaponTypeEnum.SportingRifles];
  },
  // These were removed
  SpecialWeapons(_) {
    return undefined;
  },
  Micro_DroneWeapons(_) {
    return [firearmWeaponTypeEnum.MicroDroneWeapons];
  },
  Grenades(_) {
    return [explosiveTypeEnum.Grenade];
  },
  Blades(_) {
    return [meleeWeaponTypeEnum.Blades];
  },
  Clubs(_) {
    return [meleeWeaponTypeEnum.Clubs];
  },
  ImprovisedWeapons(_) {
    // assume exotic melee won't appear without clubs (same category)
  },
  Bio_Weapon(_) {
    return [meleeWeaponTypeEnum.BioWeapons];
  },
  Unarmed(_) {
    return [meleeWeaponTypeEnum.Unarmed];
  },
});

const availabilityVehicleModificationSemantics = Availability.createSemantics();
availabilityVehicleModificationSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, availability) {
    return inner.eval().concat([availability.eval()]);
  },
  Inner_available(availability) {
    return [availability.eval()];
  },
  Availability_full(availability, restriction) {
    return { rating: availability.eval(), restriction: restriction.eval() };
  },
  Availability_partial(availability) {
    return {
      rating: availability.eval(),
      restriction: restrictionEnum.Legal,
    };
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
  SubCalculation_parenthesis(_a, capacity, _b) {
    return [
      {
        subnumbers: capacity.eval(),
      },
    ];
  },
  SubCalculation_greaterThan(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat([{ operator: mathOperatorEnum.GreaterThan }], damage2.eval()),
      },
    ];
  },
  AvailabilityValue(val) {
    return [val.eval()];
  },
  Handling(_) {
    return { option: vehicleModAttributeEnum.Handling };
  },
  Speed(_) {
    return { option: vehicleModAttributeEnum.Speed };
  },
  Acceleration(_) {
    return { option: vehicleModAttributeEnum.Acceleration };
  },
  Body(_) {
    return { option: vehicleModAttributeEnum.Body };
  },
  Armour(_) {
    return { option: vehicleModAttributeEnum.Armour };
  },
  Pilot(_) {
    return { option: vehicleModAttributeEnum.Pilot };
  },
  Sensor(_) {
    return { option: vehicleModAttributeEnum.Sensor };
  },
  Rating(_) {
    return { option: vehicleModAttributeEnum.Rating };
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
  Restriction(restriction) {
    return restriction.eval();
  },
  Restricted(_) {
    return restrictionEnum.Restricted;
  },
  Forbidden(_) {
    return restrictionEnum.Forbidden;
  },
});

const costVehicleModificationSemantics = Cost.createSemantics();
costVehicleModificationSemantics.addOperation("eval", {
  Exp_fixed(_a, inner, _b) {
    return {
      ratingLinked: inner.eval(),
    };
  },
  Inner_list(inner, _, cost) {
    return inner.eval().concat([cost.eval()]);
  },
  Inner_cost(cost) {
    return [cost.eval()];
  },
  Cost(cost) {
    return cost.eval();
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
  SubCalculation_equal(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat(
            [{ operator: mathOperatorEnum.GreaterThanOrEqual }],
            damage2.eval()
          ),
      },
    ];
  },
  SubCalculation_greaterOrEqual(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat(
            [{ operator: mathOperatorEnum.GreaterThanOrEqual }],
            damage2.eval()
          ),
      },
    ];
  },
  SubCalculation_greaterThan(_a, damage1, _b, damage2, _c) {
    return [
      {
        subnumbers: damage1
          .eval()
          .concat([{ operator: mathOperatorEnum.GreaterThan }], damage2.eval()),
      },
    ];
  },
  SubCalculation_parenthesis(_a, capacity, _b) {
    return [
      {
        subnumbers: capacity.eval(),
      },
    ];
  },
  CostValue(val) {
    return [val.eval()];
  },
  Handling(_) {
    return { option: vehicleModAttributeEnum.Handling };
  },
  Speed(_) {
    return { option: vehicleModAttributeEnum.Speed };
  },
  Acceleration(_) {
    return { option: vehicleModAttributeEnum.Acceleration };
  },
  Body(_) {
    return { option: vehicleModAttributeEnum.Body };
  },
  Armour(_) {
    return { option: vehicleModAttributeEnum.Armour };
  },
  Pilot(_) {
    return { option: vehicleModAttributeEnum.Pilot };
  },
  Sensor(_) {
    return { option: vehicleModAttributeEnum.Sensor };
  },
  Rating(_) {
    return { option: vehicleModAttributeEnum.Rating };
  },
  VehicleCost(_) {
    return { option: vehicleModAttributeEnum.VehicleCost };
  },
  // This is the Mod Point cost of the mount associated
  Slots(_) {
    return { option: vehicleModAttributeEnum.WeaponMountSlots };
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

export {
  ratingSemantics,
  slotSemantics,
  weaponMountCategoriesSemantics,
  availabilityVehicleModificationSemantics,
  costVehicleModificationSemantics,
};
