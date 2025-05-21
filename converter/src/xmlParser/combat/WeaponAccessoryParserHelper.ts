import {
  ammoOptionEnum,
  ammoSourceEnum,
  availabilityEnum,
  costEnum,
  mathOperatorEnum,
  restrictionEnum,
  weaponAccessoryMountLocationEnum,
} from "@neon-codex/common/build/enums.js";
import assert from "assert";
import WeaponAccessories from "../../grammar/weaponAccessories.ohm-bundle.js";
import type { AccessoryMountType } from "@neon-codex/common/build/schemas/shared/weaponSharedSchemas.js";
const ModifyAmmoCapacity = WeaponAccessories.ModifyAmmoCapacity;
// const Accuracy = WeaponAccessories.Accuracy;
// const Damage = WeaponAccessories.Damage;
// const ArmourPenetration = WeaponAccessories.ArmourPenetration;
// const Mode = WeaponAccessories.Mode;
const Ammo = WeaponAccessories.Ammo;
const Availability = WeaponAccessories.Availability;
const Cost = WeaponAccessories.Cost;

const modifyAmmoCapacitySemantics = ModifyAmmoCapacity.createSemantics();
modifyAmmoCapacitySemantics.addOperation("eval", {
  FirstOperator_multiply(_, range) {
    return [{ operator: mathOperatorEnum.Multiply }].concat(range.eval());
  },
  FirstOperator_divide(_, range) {
    return [{ operator: mathOperatorEnum.Divide }].concat(range.eval());
  },
  FirstOperator_add(_, range) {
    return [{ operator: mathOperatorEnum.Add }].concat(range.eval());
  },
  FirstOperator_subtract(_, range) {
    return [{ operator: mathOperatorEnum.Subtract }].concat(range.eval());
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
    return str
      .eval()
      .concat([{ operator: mathOperatorEnum.Multiply }], range.eval());
  },
  MulDiv_divide(str, _, range) {
    return str
      .eval()
      .concat([{ operator: mathOperatorEnum.Divide }], range.eval());
  },
  SubCalculation_parenthesis(_a, damage, _b) {
    return [
      {
        subnumbers: damage.eval(),
      },
    ];
  },
  ModifyValue(value) {
    return [value.eval()];
  },
  Weapon(_) {
    return { option: ammoOptionEnum.Weapon };
  },
  Number(damage) {
    return damage.eval();
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

const ammoWeaponAccessorySemantics = Ammo.createSemantics();
ammoWeaponAccessorySemantics.addOperation("eval", {
  Ammo(ammo) {
    return ammo.eval();
  },
  Ammo_base(ammo, reloadMethod) {
    return {
      capacity: ammo.eval(),
      ...reloadMethod.eval(),
    };
  },
  Ammo_noReload(ammo) {
    return {
      capacity: ammo.eval(),
      reloadMethod: ammoSourceEnum.Special,
    };
  },
  Ammo_external(reloadMethod) {
    return reloadMethod.eval();
  },
  Ammo_multipleAmmoNeeded(ammo, _, holders, reloadMethod) {
    return {
      capacity: ammo.eval(),
      numberOfAmmunitionHolders: holders.eval(),
      ...reloadMethod.eval(),
    };
  },
  Ammo_multipleBarrels(ammo, reloadMethod, _, holders) {
    return {
      capacity: ammo.eval(),
      numberOfAmmunitionHolders: holders.eval(),
      ...reloadMethod.eval(),
    };
  },
  ReloadMethod(method) {
    return { reloadMethod: method.eval() };
  },
  Break(_) {
    return ammoSourceEnum.BreakAction;
  },
  Clip(_) {
    return ammoSourceEnum.Clip;
  },
  Drum(_) {
    return ammoSourceEnum.Drum;
  },
  MuzzleLoader(_) {
    return ammoSourceEnum.MuzzleLoader;
  },
  InternalMagazine(_) {
    return ammoSourceEnum.InternalMagazine;
  },
  Cylinder(_) {
    return ammoSourceEnum.Cylinder;
  },
  BeltFed(_) {
    return ammoSourceEnum.BeltFed;
  },
  Tank(_) {
    return ammoSourceEnum.Tank;
  },
  External(_) {
    return ammoSourceEnum.External;
  },
  Energy(_) {
    return ammoSourceEnum.Energy;
  },
  CapAndBall(_) {
    return ammoSourceEnum.CapAndBall;
  },
  Number(damage) {
    return damage.eval();
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

const availabilityWeaponAccessorySemantics = Availability.createSemantics();
availabilityWeaponAccessorySemantics.addOperation("eval", {
  Exp_addition(_, availability) {
    return { ...availability.eval(), modifier: mathOperatorEnum.Add };
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

const costWeaponAccessorySemantics = Cost.createSemantics();
costWeaponAccessorySemantics.addOperation("eval", {
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
  Weapon(_) {
    return { option: costEnum.WeaponCost };
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

export const getWeaponMounts = function (
  mounts: string | undefined
): AccessoryMountType | undefined {
  if (mounts === undefined || mounts === "") return undefined;
  // console.log("Mounts: " + mounts);
  const mountLocations = mounts.split("/");
  return mountLocations.map((mountLocation) => {
    switch (mountLocation) {
      case "Under":
        return weaponAccessoryMountLocationEnum.Underbarrel;
      case "Top":
        return weaponAccessoryMountLocationEnum.Top;
      case "Side":
        return weaponAccessoryMountLocationEnum.Side;
      case "Stock":
        return weaponAccessoryMountLocationEnum.Stock;
      case "Barrel":
        return weaponAccessoryMountLocationEnum.Barrel;
      case "Internal":
        return weaponAccessoryMountLocationEnum.Internal;
      default:
        assert(false, `mountLocation: ${mountLocation}`);
    }
  });
};

export {
  modifyAmmoCapacitySemantics,
  ammoWeaponAccessorySemantics,
  availabilityWeaponAccessorySemantics,
  costWeaponAccessorySemantics,
};
