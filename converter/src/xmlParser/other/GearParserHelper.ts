import assert from "assert";
import {
  attributeTypeEnum,
  availabilityEnum,
  costEnum,
  firearmWeaponTypeEnum,
  gearDeviceRatingEnum,
  gearRatingEnum,
  mathOperatorEnum,
  parentGearEnum,
  projectileWeaponTypeEnum,
  restrictionEnum,
  weaponExtraClassificationEnum,
  weaponCategoryEnum,
} from "@neon-codex/common";
import type { AmmoForWeaponTypeType } from "@neon-codex/common";
import type {
  AddWeaponType,
  AmmoForWeaponTypeXmlType,
  DeviceRatingXmlType,
  GearXmlRatingType,
} from "./GearParserSchemas.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import { damageSemantics } from "../combat/WeaponParserHelper.js";
import { weaponTypeXmlEnum } from "../combat/WeaponParserSchemas.js";
const Damage = Weapons.Damage;
import Gears from "../../grammar/gears.ohm-bundle.js";
import type { WeaponBonusType } from "@neon-codex/common";
import type { WeaponXmlBonusType } from "../common/BonusParserSchemas.js";
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
  if (bonus.smartlinkpool !== undefined) {
    bonusObject.extraDiceIfSmartlinkEnabled = bonus.smartlinkpool;
  }
  if (Object.keys(bonusObject).length === 0) {
    return undefined;
  }
  return bonusObject;
};

export const convertAmmoForWeaponType = function (
  ammoType: AmmoForWeaponTypeXmlType
) {
  let typeListProcessing;
  if (typeof ammoType === "string") {
    typeListProcessing = ammoType.split(",").map((type) => {
      return { name: type, categorySpecific: true };
    });
  } else {
    if (ammoType.xmltext.includes(",")) {
      typeListProcessing = ammoType.xmltext.split(",").map((type) => {
        return {
          name: type,
          categorySpecific: ammoType._noextra === undefined,
        };
      });
    } else {
      typeListProcessing = [
        {
          name: ammoType.xmltext,
          categorySpecific: ammoType._noextra === undefined,
        },
      ];
    }
  }

  // Convert these to the types WeaponParserHelper::convertXmlToWeaponTypeInformation()
  // converts the weapon category to
  const typeListConverted: Array<Array<AmmoForWeaponTypeType>> =
    typeListProcessing.map((listAmmoType) => {
      switch (listAmmoType.name as weaponTypeXmlEnum) {
        case weaponTypeXmlEnum.Melee:
          assert(false, "Melee ammo shouldn't occur");
          return [];
        case weaponTypeXmlEnum.Exotic:
          assert(
            false,
            "Exotic ammo shouldn't occur if it does its not specific enough"
          );
          return [
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Exotic,
            },
          ];
        case weaponTypeXmlEnum.Bow:
          return [
            {
              category: weaponCategoryEnum.Projectile,
              subtype: projectileWeaponTypeEnum.Bows,
            },
          ];
        case weaponTypeXmlEnum.Crossbow:
          return [
            {
              category: weaponCategoryEnum.Projectile,
              subtype: projectileWeaponTypeEnum.Crossbows,
            },
          ];
        case weaponTypeXmlEnum.Taser:
          return [
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Tasers,
            },
          ];
        case weaponTypeXmlEnum.Gun:
          return [
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.HoldOuts,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.LightPistols,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.HeavyPistols,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.MachinePistols,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.SubmachineGuns,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.AssaultRifles,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Carbines,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.SportingRifles,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.SniperRifles,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Shotguns,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.LightMachineguns,
            },
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.MediumHeavyMachineguns,
            },
          ];
        case weaponTypeXmlEnum.Cannon:
          return [
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.AssaultCannons,
            },
          ];
        case weaponTypeXmlEnum.Flame:
          return [
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Flamethrowers,
            },
          ];
        case weaponTypeXmlEnum.Energy:
          return [
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.Lasers,
            },
          ];
        case weaponTypeXmlEnum.GLauncher:
          return [
            {
              category: weaponCategoryEnum.Firearm,
              subtype: firearmWeaponTypeEnum.GrenadeLaunchers,
            },
          ];
        case weaponTypeXmlEnum.MLauncher:
          return [
            {
              category: weaponCategoryEnum.Firearm,
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
        case weaponTypeXmlEnum.MicroGrenadeLauncher:
          return [
            {
              extraClassification:
                weaponExtraClassificationEnum.MicroGrenadeLauncher,
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
        case weaponTypeXmlEnum.SfwMainWeapon:
          return [
            {
              extraClassification: weaponExtraClassificationEnum.SfwMainWeapon,
            },
          ];
        case weaponTypeXmlEnum.SfwUnderbarrelWeapon:
          return [
            {
              extraClassification:
                weaponExtraClassificationEnum.SfwUnderbarrelWeapon,
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
          assert(false, `Weapon type: ${listAmmoType.name} is not expected`);
          return [];
      }
    });
  // Flatten 2d array to 1d
  return typeListConverted.reduce((prev, next) => {
    return prev.concat(next);
  });
};

export const convertWeight = function (weight: number | "Rating") {
  if (typeof weight === "string") {
    return { option: "Rating" };
  } else {
    return weight;
  }
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
    return { option: costEnum.Rating };
  },
  ParentCost(_) {
    return { option: costEnum.ParentCost };
  },
  ChildrenCost(_) {
    return { option: costEnum.ChildrenCost };
  },
  GearCost(_) {
    return { option: costEnum.GearCost };
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
