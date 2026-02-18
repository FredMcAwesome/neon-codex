import {
  accuracyEnum,
  blastTypeEnum,
  damageAnnotationEnum,
  damageCalculationOptionEnum,
  damageTypeEnum,
  firearmModeEnum,
  ammoSourceEnum,
  restrictionEnum,
  armourPenetrationEnum,
  costEnum,
  availabilityEnum,
  weaponExtraClassificationEnum,
  explosiveTypeEnum,
  firearmWeaponTypeEnum,
  mathOperatorEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  weaponCategoryEnum,
} from "@neon-codex/common";
import assert from "assert";
import type { AccessoryXmlType, WeaponXmlType } from "./WeaponParserSchemas.js";
import { weaponTypeXmlEnum } from "./WeaponParserSchemas.js";
import type {
  FirearmOptionsType,
  MeleeOptionsType,
  WeaponCategoryType,
} from "@neon-codex/common";
import { weaponSubtypeEnum } from "@neon-codex/common";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import { convertIncludedXmlGears } from "../common/ParserHelper.js";
import type { CustomisedWeaponAccessoryType } from "@neon-codex/common";
import type { MountType } from "@neon-codex/common";
const Accuracy = Weapons.Accuracy;
const Damage = Weapons.Damage;
const ArmourPenetration = Weapons.ArmourPenetration;
const Mode = Weapons.Mode;
const Ammo = Weapons.Ammo;
const Availability = Weapons.Availability;
const Cost = Weapons.Cost;

export const convertExtraClassification = function (
  weaponExtraClassification: weaponTypeXmlEnum | undefined
) {
  switch (weaponExtraClassification) {
    case undefined:
    case weaponTypeXmlEnum.Melee:
    case weaponTypeXmlEnum.Exotic:
    case weaponTypeXmlEnum.Bow:
    case weaponTypeXmlEnum.Crossbow:
    case weaponTypeXmlEnum.Taser:
    case weaponTypeXmlEnum.Gun:
    case weaponTypeXmlEnum.Cannon:
    case weaponTypeXmlEnum.Flame:
    case weaponTypeXmlEnum.Energy:
    case weaponTypeXmlEnum.GLauncher:
    case weaponTypeXmlEnum.MLauncher:
      return undefined;
    case weaponTypeXmlEnum.Squirtgun:
      return weaponExtraClassificationEnum.SquirtGun;
    case weaponTypeXmlEnum.Gasgun:
      return weaponExtraClassificationEnum.GasGun;
    case weaponTypeXmlEnum.Trackstopper:
      return weaponExtraClassificationEnum.Trackstopper;
    case weaponTypeXmlEnum.Harpoongun:
      return weaponExtraClassificationEnum.HarpoonGun;
    case weaponTypeXmlEnum.Netgun:
      return weaponExtraClassificationEnum.NetGun;
    case weaponTypeXmlEnum.Netgunxl:
      return weaponExtraClassificationEnum.NetGunLarge;
    case weaponTypeXmlEnum.Gyrojet:
      return weaponExtraClassificationEnum.Gyrojet;
    case weaponTypeXmlEnum.Bola:
      return weaponExtraClassificationEnum.Bola;
    case weaponTypeXmlEnum.Torpglauncher:
      return weaponExtraClassificationEnum.TorpedoGrenadeLauncher;
    case weaponTypeXmlEnum.Microtorpedo:
      return weaponExtraClassificationEnum.Microtorpedo;
    case weaponTypeXmlEnum.Flaregun:
      return weaponExtraClassificationEnum.Flaregun;
    case weaponTypeXmlEnum.Supermach:
      return weaponExtraClassificationEnum.Supermach;
    case weaponTypeXmlEnum.FirefightingCannons:
      return weaponExtraClassificationEnum.FirefightingCannons;
    case weaponTypeXmlEnum.Pepperpunch:
      return weaponExtraClassificationEnum.PepperPunch;
    case weaponTypeXmlEnum.Spraypen:
      return weaponExtraClassificationEnum.Spraypen;
    case weaponTypeXmlEnum.Slingshot:
      return weaponExtraClassificationEnum.Slingshot;
    case weaponTypeXmlEnum.Grapplegun:
      return weaponExtraClassificationEnum.GrappleGun;
    case weaponTypeXmlEnum.Dartgun:
      return weaponExtraClassificationEnum.DartGun;
    case weaponTypeXmlEnum.Man_Catcher:
      return weaponExtraClassificationEnum.Man_Catcher;
    case weaponTypeXmlEnum.Spinstorm:
      return weaponExtraClassificationEnum.Spinstorm;
    case weaponTypeXmlEnum.MicroGrenadeLauncher:
      return weaponExtraClassificationEnum.MicroGrenadeLauncher;
    case weaponTypeXmlEnum.SfwMainWeapon:
      return weaponExtraClassificationEnum.SfwMainWeapon;
    case weaponTypeXmlEnum.SfwUnderbarrelWeapon:
      return weaponExtraClassificationEnum.SfwUnderbarrelWeapon;
    default:
      assert(false, `Missing extra Classification for: ${weaponTypeXmlEnum}`);
  }
};

export const convertTypeInformation = function (
  weaponCategory: weaponCategoryEnum,
  weaponSubtype:
    | meleeWeaponTypeEnum
    | projectileWeaponTypeEnum
    | firearmWeaponTypeEnum
    | explosiveTypeEnum,
  weaponExtraClassification: weaponExtraClassificationEnum | undefined,
  meleeOptions: MeleeOptionsType,
  firearmOptions: FirearmOptionsType,
  ranges: Array<string>
) {
  let check = false;
  switch (weaponCategory) {
    case weaponCategoryEnum.Melee:
      Object.values(meleeWeaponTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        category: weaponCategoryEnum.Melee as const,
        subtype: weaponSubtype as meleeWeaponTypeEnum,
        meleeOptions: meleeOptions,
      };

    case weaponCategoryEnum.Projectile:
      Object.values(projectileWeaponTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        category: weaponCategoryEnum.Projectile as const,
        subtype: weaponSubtype as projectileWeaponTypeEnum,
        ...(weaponExtraClassification !== undefined && {
          extraClassification: weaponExtraClassification,
        }),
        rangeList: ranges,
      };
    case weaponCategoryEnum.Firearm:
      Object.values(firearmWeaponTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        category: weaponCategoryEnum.Firearm as const,
        subtype: weaponSubtype as firearmWeaponTypeEnum,
        ...(weaponExtraClassification !== undefined && {
          extraClassification: weaponExtraClassification,
        }),
        firearmOptions: firearmOptions,
        rangeList: ranges,
      };
    case weaponCategoryEnum.Explosive:
      Object.values(explosiveTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        category: weaponCategoryEnum.Explosive as const,
        subtype: weaponSubtype as explosiveTypeEnum,
        rangeList: ranges,
      };
  }
};

const accuracySemantics = Accuracy.createSemantics();
accuracySemantics.addOperation("eval", {
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
  SubCalculation_numberCalc(_a, accuracy1, _b, accuracy2, _c) {
    return [
      {
        subnumbers: accuracy1
          .eval()
          .concat(
            [{ operator: mathOperatorEnum.GreaterThanOrEqual }],
            accuracy2.eval()
          ),
      },
    ];
  },
  // TODO: is this array check needed anymore with subnumbers implemented?
  SubCalculation_parenthesis(_a, accuracy, _b) {
    let inner = accuracy.eval();
    if (!Array.isArray(inner)) inner = [inner];
    return inner;
  },
  AccuracyValue(str) {
    return [str.eval()];
  },
  Physical(_) {
    return { option: accuracyEnum.Physical };
  },
  Missile(_) {
    return { option: accuracyEnum.Missile };
  },
  Strength(_) {
    return { option: accuracyEnum.Strength };
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

const damageSemantics = Damage.createSemantics();
damageSemantics.addOperation("eval", {
  Exp_multipleDamage(damage1, _, damage2) {
    return [damage1.eval(), damage2.eval()];
  },
  Exp_splitDamage(damage1, _, damage2) {
    return [damage1.eval(), damage2.eval()];
  },
  Exp_special(_damage, _a, _b, _C) {
    return [
      {
        damageAmount: [{ option: damageCalculationOptionEnum.Special }],
        type: damageTypeEnum.None,
      },
    ];
  },
  Exp_multipleBarrels(damage, _, barrels) {
    return [
      {
        ...damage.eval(),
        barrels: barrels.eval(),
      },
    ];
  },
  Exp_base(damage) {
    return [damage.eval()];
  },
  Total_annotation(damage, annotation) {
    return { ...damage.eval(), ...annotation.eval() };
  },
  Total_radius(damage, radius) {
    return { ...damage.eval(), ...radius.eval() };
  },
  Total_range(damage, range) {
    return { ...damage.eval(), ...range.eval() };
  },
  Total_annotationRadius(damage, annotation, radius) {
    return { ...damage.eval(), ...annotation.eval(), ...radius.eval() };
  },
  Total_annotationRange(damage, annotation, range) {
    return { ...damage.eval(), ...annotation.eval(), ...range.eval() };
  },
  Total_radiusNoDamage(radius) {
    return { damageAmount: [0], type: damageTypeEnum.None, ...radius.eval() };
  },
  Annotation_electrical(_) {
    return { annotation: damageAnnotationEnum.Electrical };
  },
  Annotation_fire(_) {
    return { annotation: damageAnnotationEnum.Fire };
  },
  Annotation_flechette(_) {
    return { annotation: damageAnnotationEnum.Flechette };
  },
  Overall_typed(damage, damageType) {
    return { damageAmount: damage.eval(), ...damageType.eval() };
  },
  Overall_untyped(damage) {
    return { damageAmount: damage.eval(), type: damageTypeEnum.None };
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
  SubCalculation_numberCalc(_a, damage1, _b, damage2, _c) {
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
  // TODO: is this array check needed anymore with subnumbers implemented?
  SubCalculation_parenthesis(_a, damage, _b) {
    let inner = damage.eval();
    if (!Array.isArray(inner)) inner = [inner];
    return inner;
  },
  DamageValue(damage) {
    return [damage.eval()];
  },
  DamageType_physical(_) {
    return { type: damageTypeEnum.Physical };
  },
  DamageType_stun(_) {
    return { type: damageTypeEnum.Stun };
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
  DrugToxin(_) {
    return { option: damageCalculationOptionEnum.DrugToxin };
  },
  Missile(_) {
    return { option: damageCalculationOptionEnum.Missile };
  },
  PepperPunch(_) {
    return { option: damageCalculationOptionEnum.PepperPunch };
  },
  Strength(_) {
    return { option: damageCalculationOptionEnum.Strength };
  },
  Body(_) {
    return { option: damageCalculationOptionEnum.Body };
  },
  Magic(_) {
    return { option: damageCalculationOptionEnum.Magic };
  },
  Chemical(_) {
    return { option: damageCalculationOptionEnum.Chemical };
  },
  Rating(_) {
    return { option: damageCalculationOptionEnum.Rating };
  },
  Torpedo(_) {
    return { option: damageCalculationOptionEnum.Torpedo };
  },
  Narcoject(_) {
    return { option: damageCalculationOptionEnum.Narcoject };
  },
  Grenade(_) {
    return { option: damageCalculationOptionEnum.Grenade };
  },
  Special(_) {
    return { option: damageCalculationOptionEnum.Special };
  },
  Radius(_a, radius, _b) {
    return {
      blast: {
        type: blastTypeEnum.Radius,
        value: radius.eval(),
      },
    };
  },
  Range(_a, reducing, _b) {
    return {
      blast: {
        type: blastTypeEnum.Reducing,
        value: reducing.eval(),
      },
    };
  },
});

const armourPenetrationSemantics = ArmourPenetration.createSemantics();
armourPenetrationSemantics.addOperation("eval", {
  Total_multiple(ap1, _, ap2) {
    return [ap1.eval(), ap2.eval()];
  },
  Total_single(ap) {
    return [ap.eval()];
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
  NegativeAP_negative(_, ap) {
    return [
      {
        subnumbers: [-1, { operator: mathOperatorEnum.Multiply }].concat(
          ap.eval()
        ),
      },
    ];
  },
  NegativeAP(ap) {
    return ap.eval();
  },
  SubCalculation_parenthesis(_a, ap, _b) {
    return [
      {
        subnumbers: ap.eval(),
      },
    ];
  },
  APValue(ap) {
    return [ap.eval()];
  },
  Nil(_) {
    return 0;
  },
  Number(damage) {
    return damage.eval();
  },
  Number_negative(_, range) {
    return -range.eval();
  },
  Number_positive(_, range) {
    return range.eval();
  },
  PositiveNumber_float(rangeInt, _, rangeDecimal) {
    return parseFloat(rangeInt.sourceString + "." + rangeDecimal.sourceString);
  },
  PositiveNumber_int(range) {
    return parseInt(range.sourceString);
  },
  Missile(_) {
    return { option: armourPenetrationEnum.Missile };
  },
  Rating(_) {
    return { option: armourPenetrationEnum.Rating };
  },
  Grenade(_) {
    return { option: armourPenetrationEnum.Grenade };
  },
  Special(_) {
    return { option: armourPenetrationEnum.Special };
  },
  Magic(_) {
    return { option: armourPenetrationEnum.Magic };
  },
});

const modeSemantics = Mode.createSemantics();
modeSemantics.addOperation("eval", {
  Total_multiple(mode1, _, mode2) {
    return mode1.eval().concat(mode2.eval());
  },
  Total_single(mode) {
    return [mode.eval()];
  },
  Mode(mode) {
    return mode.eval();
  },
  BF(_) {
    return firearmModeEnum.BurstFire;
  },
  FA(_) {
    return firearmModeEnum.FullAutomatic;
  },
  SS(_) {
    return firearmModeEnum.SingleShot;
  },
  SA(_) {
    return firearmModeEnum.SemiAutomatic;
  },
  Nil(_) {
    return firearmModeEnum.None;
  },
});

export const convertRecoilCompensation = function (
  recoilCompensation: number | string
) {
  // console.log("Recoil Compensation: " + recoilCompensation.toString());
  if (typeof recoilCompensation === "string") {
    return 0;
  } else {
    return recoilCompensation;
  }
};

const ammoSemantics = Ammo.createSemantics();
ammoSemantics.addOperation("eval", {
  Multiple(ammo1, _, ammo2) {
    return ammo1.eval().concat(ammo2.eval());
  },
  Ammo(ammo) {
    return [ammo.eval()];
  },
  Ammo_base(ammo, reloadMethod) {
    const capacity = ammo.eval();
    return {
      ...(capacity !== 0 && { capacity: capacity }),
      ...reloadMethod.eval(),
    };
  },
  Ammo_noReload(ammo) {
    const capacity = ammo.eval();
    return {
      ...(capacity !== 0 && { capacity: capacity }),
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

const availabilityWeaponSemantics = Availability.createSemantics();
availabilityWeaponSemantics.addOperation("eval", {
  Availability_full(availability, restriction) {
    return { rating: availability.eval(), restriction: restriction.eval() };
  },
  Availability_partial(availability) {
    return {
      rating: availability.eval(),
      restriction: restrictionEnum.Legal,
    };
  },
  Next_parenthesis(_a, str, _b) {
    return str.eval();
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

const costWeaponSemantics = Cost.createSemantics();
costWeaponSemantics.addOperation("eval", {
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

export const convertAccessories = function (
  xmlAccessoriesUndefined:
    | { accessory: Array<AccessoryXmlType> | AccessoryXmlType }
    | undefined
) {
  if (xmlAccessoriesUndefined === undefined) {
    return undefined;
  }
  // console.log("Accessories: " + xmlAccessoriesUndefined.toString());

  const xmlAccessories: Array<AccessoryXmlType> = Array.isArray(
    xmlAccessoriesUndefined.accessory
  )
    ? xmlAccessoriesUndefined.accessory
    : [xmlAccessoriesUndefined.accessory];

  return xmlAccessories.map((xmlAccessory) => {
    let mountList;
    if (xmlAccessory.mount)
      mountList = Array.isArray(xmlAccessory.mount)
        ? xmlAccessory.mount
        : [xmlAccessory.mount];
    const accessory: CustomisedWeaponAccessoryType = {
      baseAccessory: xmlAccessory.name,
      mountList: mountList || [],
      ...(xmlAccessory.rating !== undefined && { rating: xmlAccessory.rating }),
      gearList: [],
    };
    if (xmlAccessory.gears !== undefined) {
      accessory.gearList = convertIncludedXmlGears(xmlAccessory.gears);
    }
    return accessory;
  });
};

export const convertAccessoryMounts = function (
  xmlAccessoryMountsUndefined:
    | { mount: Array<MountType> | MountType }
    | undefined
) {
  if (!xmlAccessoryMountsUndefined) {
    return undefined;
  }
  // console.log("Accessory Mounts: " + xmlAccessoryMountsUndefined.toString());

  return Array.isArray(xmlAccessoryMountsUndefined.mount)
    ? xmlAccessoryMountsUndefined.mount
    : [xmlAccessoryMountsUndefined.mount];
};

export const convertWeaponSkill = function (
  useSkill: string | undefined,
  category: weaponSubtypeEnum,
  useSkillSpecialisation: string | undefined,
  previousSpecialisations: Array<string> | undefined
) {
  let skill = "";
  let specialisations = previousSpecialisations;
  if (useSkillSpecialisation !== undefined) {
    if (specialisations !== undefined && specialisations.length > 0) {
      let check = false;
      for (const specialisation of specialisations) {
        if (specialisation === useSkillSpecialisation) {
          check = true;
        }
      }
      assert(check, `Specialisation not included: ${useSkillSpecialisation}`);
    } else {
      specialisations = [useSkillSpecialisation];
    }
  }
  if (useSkill !== undefined) {
    return { skill: useSkill, specialisations: specialisations };
  }
  switch (category) {
    case weaponSubtypeEnum.Bows:
    case weaponSubtypeEnum.Crossbows:
      skill = "Archery";
      break;

    case weaponSubtypeEnum.AssaultRifles:
    case weaponSubtypeEnum.Carbines:
    case weaponSubtypeEnum.MachinePistols:
    case weaponSubtypeEnum.SubmachineGuns:
      skill = "Automatics";
      break;

    case weaponSubtypeEnum.Blades:
      skill = "Blades";
      break;

    case weaponSubtypeEnum.Clubs:
    case weaponSubtypeEnum.ImprovisedWeapons:
      skill = "Clubs";
      break;

    case weaponSubtypeEnum.ExoticMeleeWeapons:
      skill = "Exotic Melee Weapon";
      break;

    case weaponSubtypeEnum.ExoticRangedWeapons:
      skill = "Exotic Ranged Weapon";
      break;

    case weaponSubtypeEnum.Flamethrowers:
      skill = "Exotic Ranged Weapon";
      specialisations = ["Flamethrowers"];
      break;

    case weaponSubtypeEnum.LaserWeapons:
      skill = "Exotic Ranged Weapon";
      specialisations = ["Laser Weapons"];
      break;

    // Explosive Ammo skill defaults here though unused
    case weaponSubtypeEnum.Gear:
    case weaponSubtypeEnum.AssaultCannons:
    case weaponSubtypeEnum.GrenadeLaunchers:
    case weaponSubtypeEnum.MissileLaunchers:
    case weaponSubtypeEnum.LightMachineguns:
    case weaponSubtypeEnum.MediumMachineguns:
    case weaponSubtypeEnum.HeavyMachineguns:
      skill = "Heavy Weapons";
      break;

    case weaponSubtypeEnum.Shotguns:
    case weaponSubtypeEnum.SniperRifles:
    case weaponSubtypeEnum.SportingRifles:
      skill = "Longarms";
      break;

    case weaponSubtypeEnum.Unarmed:
      skill = "Unarmed Combat";
      break;

    case weaponSubtypeEnum.HeavyPistols:
    case weaponSubtypeEnum.Holdouts:
    case weaponSubtypeEnum.LightPistols:
    case weaponSubtypeEnum.Tasers:
      skill = "Pistols";
      break;

    default:
      assert(false, `Unknown skill category: ${category}`);
  }
  return { skill: skill, specialisations: specialisations };
};

export const convertXmlToWeaponTypeInformation = function ({
  category,
  name,
  type,
}: {
  category: weaponSubtypeEnum;
  name?: string;
  type?: "Ranged" | "Melee";
}): WeaponCategoryType {
  switch (category) {
    // ranged
    case weaponSubtypeEnum.AssaultCannons:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.AssaultCannons,
      };
    case weaponSubtypeEnum.AssaultRifles:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.AssaultRifles,
      };
    case weaponSubtypeEnum.GrenadeLaunchers:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.GrenadeLaunchers,
      };
    case weaponSubtypeEnum.LightMachineguns:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.LightMachineguns,
      };
    case weaponSubtypeEnum.SniperRifles:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.SniperRifles,
      };
    case weaponSubtypeEnum.Bows:
      return {
        category: weaponCategoryEnum.Projectile,
        subtype: projectileWeaponTypeEnum.Bows,
      };
    case weaponSubtypeEnum.Crossbows:
      return {
        category: weaponCategoryEnum.Projectile,
        subtype: projectileWeaponTypeEnum.Crossbows,
      };
    case weaponSubtypeEnum.ExoticRangedWeapons:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.Exotic,
      };
    case weaponSubtypeEnum.Flamethrowers:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.Flamethrowers,
      };
    case weaponSubtypeEnum.Gear:
      assert(name !== undefined);
      if (
        name.toLowerCase().includes("missile") ||
        name.toLowerCase().includes("rocket") ||
        name.toLowerCase().includes("torpedo") ||
        name.toLowerCase().includes("minigrenade")
      ) {
        return {
          category: weaponCategoryEnum.Explosive,
          subtype: explosiveTypeEnum.Rocket,
        };
      } else if (name.toLowerCase().includes("grenade")) {
        return {
          category: weaponCategoryEnum.Explosive,
          subtype: explosiveTypeEnum.Grenade,
        };
      } else {
        return {
          category: weaponCategoryEnum.Projectile,
          subtype: projectileWeaponTypeEnum.ThrowingWeapons,
        };
      }
    case weaponSubtypeEnum.HeavyMachineguns:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.MediumHeavyMachineguns,
      };
    case weaponSubtypeEnum.HeavyPistols:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.HeavyPistols,
      };
    case weaponSubtypeEnum.Holdouts:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.HoldOuts,
      };
    case weaponSubtypeEnum.LaserWeapons:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.Lasers,
      };
    case weaponSubtypeEnum.LightPistols:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.LightPistols,
      };
    case weaponSubtypeEnum.MachinePistols:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.MachinePistols,
      };
    case weaponSubtypeEnum.MediumMachineguns:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.MediumHeavyMachineguns,
      };
    case weaponSubtypeEnum.MissileLaunchers:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.MissileLaunchers,
      };
    case weaponSubtypeEnum.Shotguns:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.Shotguns,
      };
    case weaponSubtypeEnum.SportingRifles:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.SportingRifles,
      };
    case weaponSubtypeEnum.SubmachineGuns:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.SubmachineGuns,
      };
    case weaponSubtypeEnum.Tasers:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.Tasers,
      };
    case weaponSubtypeEnum.UnderbarrelWeapons:
      assert(type !== undefined);
      if (type === "Melee") {
        return {
          category: weaponCategoryEnum.Melee,
          subtype: meleeWeaponTypeEnum.WeaponAttachments,
        };
      } else {
        return {
          category: weaponCategoryEnum.Firearm,
          subtype: firearmWeaponTypeEnum.WeaponAttachments,
        };
      }
    case weaponSubtypeEnum.Cyberweapon:
      assert(type !== undefined);
      if (type === "Melee") {
        return {
          category: weaponCategoryEnum.Melee,
          subtype: meleeWeaponTypeEnum.Exotic,
        };
      } else {
        return {
          category: weaponCategoryEnum.Firearm,
          subtype: firearmWeaponTypeEnum.Exotic,
        };
      }
    case weaponSubtypeEnum.Carbines:
      return {
        category: weaponCategoryEnum.Firearm,
        subtype: firearmWeaponTypeEnum.Carbines,
      };
    // melee
    case weaponSubtypeEnum.BioWeapon:
      assert(type !== undefined);
      if (type === "Melee") {
        return {
          category: weaponCategoryEnum.Melee,
          subtype: meleeWeaponTypeEnum.BioWeapons,
        };
      } else {
        assert(false, "Bio-weapons not expected to be ranged");
      }
    case weaponSubtypeEnum.Blades:
      return {
        category: weaponCategoryEnum.Melee,
        subtype: meleeWeaponTypeEnum.Blades,
      };
    case weaponSubtypeEnum.Clubs:
      return {
        category: weaponCategoryEnum.Melee,
        subtype: meleeWeaponTypeEnum.Clubs,
      };
    case weaponSubtypeEnum.ExoticMeleeWeapons:
      return {
        category: weaponCategoryEnum.Melee,
        subtype: meleeWeaponTypeEnum.Exotic,
      };
    case weaponSubtypeEnum.ImprovisedWeapons:
      return {
        category: weaponCategoryEnum.Melee,
        subtype: meleeWeaponTypeEnum.Improvised,
      };
    case weaponSubtypeEnum.Unarmed:
      return {
        category: weaponCategoryEnum.Melee,
        subtype: meleeWeaponTypeEnum.Unarmed,
      };
    case weaponSubtypeEnum.Quality:
      return {
        category: weaponCategoryEnum.Melee,
        subtype: meleeWeaponTypeEnum.MetagenicQuality,
      };
    case weaponSubtypeEnum.Rifles:
    case weaponSubtypeEnum.Pistol:
      assert(
        false,
        "We should be converting these first before calling this function"
      );
    default:
      assert(false, `Category does not exist: ${category}`);
  }
};

export {
  accuracySemantics,
  damageSemantics,
  armourPenetrationSemantics,
  modeSemantics,
  ammoSemantics,
  availabilityWeaponSemantics,
  costWeaponSemantics,
};
