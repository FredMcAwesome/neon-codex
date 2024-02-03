import {
  ammoSourceEnum,
  blastTypeEnum,
  damageTypeEnum,
  firearmModeEnum,
} from "../enums.js";
import type {
  AccuracyType,
  AmmunitionType,
  ArmourPenetrationType,
  AvailabilityWeaponType,
  CostWeaponType,
  DamageAmountType,
  DamageType,
  SingleArmourPenetrationType,
} from "../schemas/weaponSchemas.js";
import { formatRating } from "./commonFormatter.js";

export function formatDamage(unformattedDamage: DamageType): string {
  let damageString = "";
  for (const damage of unformattedDamage) {
    const damageAmount = formatDamageAmount(damage.damageAmount);
    const multipleBarrels =
      damage.barrels !== undefined ? `X${damage.barrels}` : "";
    let damageType = "";
    switch (damage.type) {
      case damageTypeEnum.Physical:
        damageType = "P";
        break;
      case damageTypeEnum.Stun:
        damageType = "S";
        break;
      case damageTypeEnum.Special:
        damageType = "Special";
        break;
      case damageTypeEnum.None:
        break;
    }
    damageString += `(${damageAmount})` + damageType + multipleBarrels;
    if (damage.annotation !== undefined) {
      const damageAnnotation = damage.annotation;
      damageString += ` (${damageAnnotation})`;
    }
    if (damage.blast !== undefined) {
      const blast = damage.blast;
      switch (blast.type) {
        case blastTypeEnum.Radius:
          damageString += ` (${blast.value} Radius)`;
          break;
        case blastTypeEnum.Reducing:
          damageString += ` (${blast.value}/m)`;
          break;
      }
    }
  }
  return damageString;
}

function formatDamageAmount(unformattedDamageAmount: DamageAmountType): string {
  let damageAmount = "";
  for (const dmgValue of unformattedDamageAmount) {
    if (typeof dmgValue === "number") {
      damageAmount += dmgValue.toString();
    } else if ("option" in dmgValue) {
      damageAmount += dmgValue.option;
    } else if ("operator" in dmgValue) {
      damageAmount += dmgValue.operator;
    } else {
      damageAmount += formatDamageAmount(dmgValue.subnumbers);
    }
  }
  return damageAmount;
}

export function formatAccuracy(unformattedAccuracy: AccuracyType): string {
  let accuracyFormatted = "";
  for (const accuracyValue of unformattedAccuracy) {
    if (typeof accuracyValue === "number") {
      accuracyFormatted += accuracyValue.toString();
    } else if ("option" in accuracyValue) {
      accuracyFormatted += accuracyValue.option;
    } else if ("operator" in accuracyValue) {
      accuracyFormatted += accuracyValue.operator;
    } else {
      accuracyFormatted += formatAccuracy(accuracyValue.subnumbers);
    }
  }
  return accuracyFormatted;
}

export function formatArmourPenetration(
  unformattedArmourPenetrationList: ArmourPenetrationType
): string {
  if (unformattedArmourPenetrationList.length == 0) {
    return "-";
  }
  const armourPenetrationFormatted: Array<string> = [];
  for (const armourPenetrationSingle of unformattedArmourPenetrationList) {
    armourPenetrationFormatted.push(
      formatArmourPenetrationSingle(armourPenetrationSingle)
    );
  }
  return armourPenetrationFormatted.join("/");
}

export function formatArmourPenetrationSingle(
  unformattedArmourPenetration: SingleArmourPenetrationType
): string {
  let armourPenetrationFormatted = "";
  for (const armourPenetrationValue of unformattedArmourPenetration) {
    if (typeof armourPenetrationValue === "number") {
      if (armourPenetrationValue === 0) {
        armourPenetrationFormatted += "-";
      } else {
        armourPenetrationFormatted += armourPenetrationValue.toString();
      }
    } else if ("option" in armourPenetrationValue) {
      armourPenetrationFormatted += armourPenetrationValue.option;
    } else if ("operator" in armourPenetrationValue) {
      armourPenetrationFormatted += armourPenetrationValue.operator;
    } else {
      armourPenetrationFormatted += formatArmourPenetrationSingle(
        armourPenetrationValue.subnumbers
      );
    }
  }
  return armourPenetrationFormatted;
}

export function formatAmmunition(ammunition: AmmunitionType) {
  return ammunition
    .map((ammo) => {
      const capacity =
        ammo.capacity !== undefined ? ammo.capacity.toString() : "";
      const ammunitionHolders =
        ammo.numberOfAmmunitionHolders !== undefined
          ? "x" + ammo.numberOfAmmunitionHolders.toString()
          : "";
      const ammunitionFormatted = `${capacity}${ammunitionHolders} ${ammo.reloadMethod}`;
      return ammunitionFormatted;
    })
    .join(" or ");
}

export function formatWeaponAvailability(availability: AvailabilityWeaponType) {
  const modifier =
    availability.modifier !== undefined ? availability.modifier : "";
  return `${modifier}${formatRating(availability.rating)}${
    availability.restriction
  }`;
}

export function formatReloadMethodAltText(reloadMethod: ammoSourceEnum) {
  switch (reloadMethod) {
    case ammoSourceEnum.BreakAction:
      return "Break Action";
    case ammoSourceEnum.Clip:
      return "Clip";
    case ammoSourceEnum.Drum:
      return "Drum";
    case ammoSourceEnum.MuzzleLoader:
      return "Muzzle Loader";
    case ammoSourceEnum.InternalMagazine:
      return "Internal Magazine";
    case ammoSourceEnum.Cylinder:
      return "Cylinder";
    case ammoSourceEnum.BeltFed:
      return "Belt Fed";
    case ammoSourceEnum.Tank:
      return "Tank";
    case ammoSourceEnum.External:
      return "External";
    case ammoSourceEnum.Energy:
      return "Energy";
    case ammoSourceEnum.CapAndBall:
      return "Cap and Ball";
    case ammoSourceEnum.Special:
      return "Special";
  }
}

export function formatFirearmModeAltText(mode: firearmModeEnum) {
  switch (mode) {
    case firearmModeEnum.SingleShot:
      return "Single Shot";
    case firearmModeEnum.SemiAutomatic:
      return "Semi Automatic";
    case firearmModeEnum.BurstFire:
      return "Burst Fire";
    case firearmModeEnum.FullAutomatic:
      return "Full Automatic";
    case firearmModeEnum.None:
      return "None";
  }
}

export function formatWeaponCost(unformattedCost: CostWeaponType): string {
  let costFormatted = "";
  for (const costValue of unformattedCost) {
    if (typeof costValue === "number") {
      costFormatted += costValue.toString();
    } else if ("option" in costValue) {
      costFormatted += costValue.option;
    } else if ("operator" in costValue) {
      costFormatted += costValue.operator;
    } else {
      costFormatted += formatWeaponCost(costValue.subnumbers);
    }
  }
  return costFormatted;
}
