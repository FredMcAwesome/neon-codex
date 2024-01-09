import assert from "assert";
import {
  attributeTypeEnum,
  availabilityEnum,
  costGearEnum,
  firearmWeaponTypeEnum,
  gearDeviceRatingEnum,
  gearRatingEnum,
  mathOperatorEnum,
  parentGearEnum,
  projectileWeaponTypeEnum,
  restrictionEnum,
  weaponExtraClassificationEnum,
  weaponTypeEnum,
} from "@shadowrun/common/build/enums.js";
import type {
  AddWeaponType,
  AmmoForWeaponTypeXmlType,
  DeviceRatingXmlType,
  GearXmlRatingType,
  WeaponXmlBonusType,
} from "./GenericGearParserSchemas.js";
import type { WeaponBonusType } from "@shadowrun/common/build/schemas/shared/bonusSchemas.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import { damageSemantics } from "../combatGear/WeaponParserHelper.js";
import { weaponTypeXmlEnum } from "../combatGear/WeaponParserSchemas.js";
const Damage = Weapons.Damage;
import Gears from "../../grammar/gears.ohm-bundle.js";
import type { ammoForWeaponTypeType } from "@shadowrun/common/build/schemas/otherGearSchemas.js";
const Program = Gears.Program;
const Capacity = Gears.Capacity;
const Availability = Gears.Availability;
const Cost = Gears.Cost;

export const convertGearMaxRating = function (gearRating: GearXmlRatingType) {
  if (typeof gearRating === "number") {
    return gearRating;
  }
  assert(gearRating === "{Parent Rating}");
  return { option: gearRatingEnum.ParentRating };
};

export const convertGearAddWeapon = function (weapon: AddWeaponType) {
  if (typeof weapon === "string") {
    return { name: weapon };
  }
  assert(weapon._rating === "{Rating}");
  return {
    name: weapon.xmltext,
    rating: { option: gearRatingEnum.ParentRating },
  };
};

export const convertXmlWeaponBonus = function (bonus: WeaponXmlBonusType) {
  const bonusObject: WeaponBonusType = {};
  if (bonus.ap !== undefined) {
    bonusObject.ap = bonus.ap;
  }
  if (bonus.apreplace !== undefined) {
    bonusObject.apReplace = bonus.apreplace;
  }
  if (bonus.damage !== undefined) {
    const match = Damage.match(bonus.damage.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    bonusObject.damage = damageSemantics(match).eval();
  }
  if (bonus.damagereplace !== undefined) {
    bonusObject.damageReplace = bonus.damagereplace;
  }
  if (bonus.damagetype !== undefined) {
    bonusObject.damageType = bonus.damagetype;
  }
  if (bonus.modereplace !== undefined) {
    bonusObject.modeReplace = bonus.modereplace;
  }
  if (bonus.userange !== undefined) {
    bonusObject.useRange = bonus.userange;
  }
  if (bonus.accuracy !== undefined) {
    bonusObject.accuracy = bonus.accuracy;
  }
  if (bonus.accuracyreplace !== undefined) {
    bonusObject.accuracyReplace = bonus.accuracyreplace;
  }
  if (Object.keys(bonusObject).length === 0) {
    return undefined;
  }
  return bonusObject;
};

export const convertAmmoForWeaponType = function (
  type: AmmoForWeaponTypeXmlType
) {
  let typeListProcessing;
  if (typeof type === "string") {
    typeListProcessing = type.split(",").map((type) => {
      return { name: type, categorySpecific: true };
    });
  } else {
    typeListProcessing = [
      {
        name: type.xmltext,
        categorySpecific: type._noextra === undefined,
      },
    ];
  }

  // Convert these to the types WeaponParserHelper::getWeaponTypeInformation()
  // converts the weapon category to
  const typeListConverted: Array<Array<ammoForWeaponTypeType>> =
    typeListProcessing.map((type) => {
      switch (type.name) {
        case weaponTypeXmlEnum.Melee:
          assert(false, "Melee ammo shouldn't occur");
          break;
        case weaponTypeXmlEnum.Exotic:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Exotic,
            },
          ];
        case weaponTypeXmlEnum.Bow:
          return [
            {
              type: weaponTypeEnum.Projectile,
              subtype: projectileWeaponTypeEnum.Bows,
            },
          ];
        case weaponTypeXmlEnum.Crossbow:
          return [
            {
              type: weaponTypeEnum.Projectile,
              subtype: projectileWeaponTypeEnum.Crossbows,
            },
          ];
        case weaponTypeXmlEnum.Taser:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Tasers,
            },
          ];
        case weaponTypeXmlEnum.Gun:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.HoldOuts,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.LightPistols,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.HeavyPistols,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.MachinePistols,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.SubmachineGuns,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.AssaultRifles,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Carbines,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.SportingRifles,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.SniperRifles,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Shotguns,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.LightMachineguns,
            },
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.MediumHeavyMachineguns,
            },
          ];
        case weaponTypeXmlEnum.Cannon:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.AssaultCannons,
            },
          ];
        case weaponTypeXmlEnum.Flame:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Flamethrowers,
            },
          ];
        case weaponTypeXmlEnum.Energy:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Lasers,
            },
          ];
        case weaponTypeXmlEnum.GLauncher:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.GrenadeLaunchers,
            },
          ];
        case weaponTypeXmlEnum.MLauncher:
          return [
            {
              type: weaponTypeEnum.Firearm,
              subtype: firearmWeaponTypeEnum.MissileLaunchers,
            },
          ];
        case weaponTypeXmlEnum.Squirtgun:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.SquirtGun,
            },
          ];
        case weaponTypeXmlEnum.Gasgun:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.GasGun,
            },
          ];
        case weaponTypeXmlEnum.Trackstopper:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Trackstopper,
            },
          ];
        case weaponTypeXmlEnum.Harpoongun:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.HarpoonGun,
            },
          ];
        case weaponTypeXmlEnum.Netgun:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.NetGun,
            },
          ];
        case weaponTypeXmlEnum.Netgunxl:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.NetGunLarge,
            },
          ];
        case weaponTypeXmlEnum.Gyrojet:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Gyrojet,
            },
          ];
        case weaponTypeXmlEnum.Bola:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Bola,
            },
          ];
        case weaponTypeXmlEnum.Torpglauncher:
          return [
            {
              extraClassification:
                weaponExtraClassificationEnum.TorpedoGrenadeLauncher,
            },
          ];
        case weaponTypeXmlEnum.Microtorpedo:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Microtorpedo,
            },
          ];
        case weaponTypeXmlEnum.Flaregun:
          return [
            { extraClassification: weaponExtraClassificationEnum.Flaregun },
          ];
        case weaponTypeXmlEnum.Supermach:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Supermach,
            },
          ];
        case weaponTypeXmlEnum.FirefightingCannons:
          return [
            {
              extraClassification:
                weaponExtraClassificationEnum.FirefightingCannons,
            },
          ];
        case weaponTypeXmlEnum.Pepperpunch:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.PepperPunch,
            },
          ];
        case weaponTypeXmlEnum.Spraypen:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Spraypen,
            },
          ];
        case weaponTypeXmlEnum.Slingshot:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Slingshot,
            },
          ];
        case weaponTypeXmlEnum.Grapplegun:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.GrappleGun,
            },
          ];
        case weaponTypeXmlEnum.Dartgun:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.DartGun,
            },
          ];
        case weaponTypeXmlEnum.Man_Catcher:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Man_Catcher,
            },
          ];
        // TODO: This weapon doesn't exist in chummer yet, check this works when it is added
        case weaponTypeXmlEnum.Spinstorm:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.Spinstorm,
            },
          ];
        default:
          assert(false, `Weapon type: ${type.name} is not expected`);
      }
    });
  // Flatten 2d array to 1d
  return typeListConverted.reduce((prev, next) => {
    return prev.concat(next);
  });
};

export const convertDeviceRating = function (rating: DeviceRatingXmlType) {
  if (typeof rating === "number") {
    return rating;
  }
  switch (rating) {
    case "Rating":
    case "{Rating}":
      return { option: gearDeviceRatingEnum.Rating };
    case "{RES}":
      return { option: gearDeviceRatingEnum.Resonance };
  }
};

const programGearSemantics = Program.createSemantics();
programGearSemantics.addOperation("eval", {
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
  ProgramValue(program) {
    return [program.eval()];
  },
  Rating(_) {
    return { option: parentGearEnum.Rating };
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

const capacityGearSemantics = Capacity.createSemantics();
capacityGearSemantics.addOperation("eval", {
  Exp_mixCapacity(capacity, _, capacityArray) {
    return {
      ...capacity.eval(),
      ...capacityArray.eval(),
    };
  },
  Capacity(capacity) {
    return {
      capacity: capacity.eval(),
    };
  },
  CapacityArray(_a, capacityCost, _b) {
    return {
      capacityCost: capacityCost.eval(),
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
  CapacityValue(capacity) {
    return [capacity.eval()];
  },
  Rating(_) {
    return { option: parentGearEnum.Rating };
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

export const convertDeviceAttributes = function (
  attribute:
    | number
    | "{CHA}"
    | "{INT}"
    | "{LOG}"
    | "{WIL}"
    | "Rating"
    | "{Rating}"
) {
  if (typeof attribute === "number") {
    return attribute;
  }
  switch (attribute) {
    case "{CHA}":
      return { option: attributeTypeEnum.Charisma };
    case "{INT}":
      return { option: attributeTypeEnum.Intuition };
    case "{LOG}":
      return { option: attributeTypeEnum.Logic };
    case "{WIL}":
      return { option: attributeTypeEnum.Willpower };
    case "Rating":
    case "{Rating}":
      return { option: parentGearEnum.Rating };
  }
};

const availabilityGearSemantics = Availability.createSemantics();
availabilityGearSemantics.addOperation("eval", {
  Exp_addition(_, availability) {
    return { ...availability.eval(), modifier: mathOperatorEnum.Add };
  },
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
  SubCalculation_parenthesis(_a, availability, _b) {
    return [
      {
        subnumbers: availability.eval(),
      },
    ];
  },
  AvailabilityValue(availability) {
    return [availability.eval()];
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
});

const costGearSemantics = Cost.createSemantics();
costGearSemantics.addOperation("eval", {
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
  SubCalculation_parenthesis(_a, cost, _b) {
    return [
      {
        subnumbers: cost.eval(),
      },
    ];
  },
  CostValue(cost) {
    return [cost.eval()];
  },
  Rating(_) {
    return { option: costGearEnum.Rating };
  },
  ParentCost(_) {
    return { option: costGearEnum.ParentCost };
  },
  ChildrenCost(_) {
    return { option: costGearEnum.ChildrenCost };
  },
  GearCost(_) {
    return { option: costGearEnum.GearCost };
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
  programGearSemantics,
  capacityGearSemantics,
  availabilityGearSemantics,
  costGearSemantics,
};
