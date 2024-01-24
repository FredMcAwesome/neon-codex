import {
  mathOperatorEnum,
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  firearmWeaponTypeEnum,
  explosiveTypeEnum,
  reloadMethodEnum,
} from "@shadowrun/common";
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
  costWeaponEnum,
  availabilityEnum,
  weaponExtraClassificationEnum,
} from "@shadowrun/common/build/enums.js";
import assert from "assert";
import type { AccessoryXmlType, WeaponXmlType } from "./WeaponParserSchemas.js";
import { weaponTypeXmlEnum } from "./WeaponParserSchemas.js";
import type {
  UnlinkedAccessoryType,
  FirearmOptionsType,
  MeleeOptionsType,
  MountType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/build/schemas/commonSchemas.js";
import type { WeaponXmlSubtypeType } from "@shadowrun/common/build/schemas/commonSchemas.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import { convertXmlGears } from "../common/ParserHelper.js";
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
  }
};

export const convertTypeInformation = function (
  weaponType: weaponTypeEnum,
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
  switch (weaponType) {
    case weaponTypeEnum.Melee:
      Object.values(meleeWeaponTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        type: weaponTypeEnum.Melee as const,
        subtype: weaponSubtype as meleeWeaponTypeEnum,
        meleeOptions: meleeOptions,
      };

    case weaponTypeEnum.Projectile:
      Object.values(projectileWeaponTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        type: weaponTypeEnum.Projectile as const,
        subtype: weaponSubtype as projectileWeaponTypeEnum,
        extraClassification: weaponExtraClassification,
        rangeList: ranges,
      };
    case weaponTypeEnum.Firearm:
      Object.values(firearmWeaponTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        type: weaponTypeEnum.Firearm as const,
        subtype: weaponSubtype as firearmWeaponTypeEnum,
        extraClassification: weaponExtraClassification,
        firearmOptions: firearmOptions,
        rangeList: ranges,
      };
    case weaponTypeEnum.Explosive:
      Object.values(explosiveTypeEnum).forEach((enumValue) => {
        if (enumValue === weaponSubtype) {
          check = true;
        }
      });
      assert(check, `weaponSubtype: ${weaponSubtype}`);
      return {
        type: weaponTypeEnum.Explosive as const,
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
    return {
      capacity: ammo.eval(),
      ...reloadMethod.eval(),
    };
  },
  Ammo_noReload(ammo) {
    return {
      capacity: ammo.eval(),
      reloadMethod: reloadMethodEnum.Special,
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
    return { option: costWeaponEnum.Rating };
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
    let mount;
    if (xmlAccessory.mount)
      mount = Array.isArray(xmlAccessory.mount)
        ? xmlAccessory.mount
        : [xmlAccessory.mount];
    const accessory: UnlinkedAccessoryType = {
      name: xmlAccessory.name,
      mount: mount,
      rating: xmlAccessory.rating,
      gears: undefined,
    };
    if (xmlAccessory.gears) {
      accessory.gears = convertXmlGears(xmlAccessory.gears);
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
  category: WeaponXmlSubtypeType,
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
    case weaponXmlSubtypeEnum.Bows:
    case weaponXmlSubtypeEnum.Crossbows:
      skill = "Archery";
      break;

    case weaponXmlSubtypeEnum.AssaultRifles:
    case weaponXmlSubtypeEnum.Carbines:
    case weaponXmlSubtypeEnum.MachinePistols:
    case weaponXmlSubtypeEnum.SubmachineGuns:
      skill = "Automatics";
      break;

    case weaponXmlSubtypeEnum.Blades:
      skill = "Blades";
      break;

    case weaponXmlSubtypeEnum.Clubs:
    case weaponXmlSubtypeEnum.ImprovisedWeapons:
      skill = "Clubs";
      break;

    case weaponXmlSubtypeEnum.ExoticMeleeWeapons:
      skill = "Exotic Melee Weapon";
      break;

    case weaponXmlSubtypeEnum.ExoticRangedWeapons:
      skill = "Exotic Ranged Weapon";
      break;

    case weaponXmlSubtypeEnum.Flamethrowers:
      skill = "Exotic Ranged Weapon";
      specialisations = ["Flamethrowers"];
      break;

    case weaponXmlSubtypeEnum.LaserWeapons:
      skill = "Exotic Ranged Weapon";
      specialisations = ["Laser Weapons"];
      break;

    // Explosive Ammo skill defaults here though unused
    case weaponXmlSubtypeEnum.Gear:
    case weaponXmlSubtypeEnum.AssaultCannons:
    case weaponXmlSubtypeEnum.GrenadeLaunchers:
    case weaponXmlSubtypeEnum.MissileLaunchers:
    case weaponXmlSubtypeEnum.LightMachineguns:
    case weaponXmlSubtypeEnum.MediumMachineguns:
    case weaponXmlSubtypeEnum.HeavyMachineguns:
      skill = "Heavy Weapons";
      break;

    case weaponXmlSubtypeEnum.Shotguns:
    case weaponXmlSubtypeEnum.SniperRifles:
    case weaponXmlSubtypeEnum.SportingRifles:
      skill = "Longarms";
      break;

    case weaponXmlSubtypeEnum.Unarmed:
      skill = "Unarmed Combat";
      break;

    case weaponXmlSubtypeEnum.HeavyPistols:
    case weaponXmlSubtypeEnum.Holdouts:
    case weaponXmlSubtypeEnum.LightPistols:
    case weaponXmlSubtypeEnum.Tasers:
      skill = "Pistols";
      break;

    default:
      assert(false, `Unknown skill category: ${category}`);
  }
  return { skill: skill, specialisations: specialisations };
};

export const getWeaponTypeInformation = function (weapon: WeaponXmlType) {
  let weaponType: weaponTypeEnum;
  let weaponSubtype:
    | meleeWeaponTypeEnum
    | projectileWeaponTypeEnum
    | firearmWeaponTypeEnum
    | explosiveTypeEnum;
  switch (weapon.category) {
    // ranged
    case weaponXmlSubtypeEnum.AssaultCannons:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.AssaultCannons;
      break;
    case weaponXmlSubtypeEnum.AssaultRifles:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.AssaultRifles;
      break;
    case weaponXmlSubtypeEnum.GrenadeLaunchers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.GrenadeLaunchers;
      break;
    case weaponXmlSubtypeEnum.LightMachineguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.LightMachineguns;
      break;
    case weaponXmlSubtypeEnum.SniperRifles:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.SniperRifles;
      break;
    case weaponXmlSubtypeEnum.Bows:
      weaponType = weaponTypeEnum.Projectile;
      weaponSubtype = projectileWeaponTypeEnum.Bows;
      break;
    case weaponXmlSubtypeEnum.Crossbows:
      weaponType = weaponTypeEnum.Projectile;
      weaponSubtype = projectileWeaponTypeEnum.Crossbows;
      break;
    case weaponXmlSubtypeEnum.ExoticRangedWeapons:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Exotic;
      break;
    case weaponXmlSubtypeEnum.Flamethrowers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Flamethrowers;
      break;
    case weaponXmlSubtypeEnum.Gear:
      if (
        weapon.name.toLowerCase().includes("missile") ||
        weapon.name.toLowerCase().includes("rocket") ||
        weapon.name.toLowerCase().includes("torpedo") ||
        weapon.name.toLowerCase().includes("minigrenade")
      ) {
        weaponType = weaponTypeEnum.Explosive;
        weaponSubtype = explosiveTypeEnum.Rocket;
      } else if (weapon.name.toLowerCase().includes("grenade")) {
        weaponType = weaponTypeEnum.Explosive;
        weaponSubtype = explosiveTypeEnum.Grenade;
      } else {
        weaponType = weaponTypeEnum.Projectile;
        weaponSubtype = projectileWeaponTypeEnum.ThrowingWeapons;
      }
      break;
    case weaponXmlSubtypeEnum.HeavyMachineguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MediumHeavyMachineguns;
      break;
    case weaponXmlSubtypeEnum.HeavyPistols:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.HeavyPistols;
      break;
    case weaponXmlSubtypeEnum.Holdouts:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.HoldOuts;
      break;
    case weaponXmlSubtypeEnum.LaserWeapons:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Lasers;
      break;
    case weaponXmlSubtypeEnum.LightPistols:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.LightPistols;
      break;
    case weaponXmlSubtypeEnum.MachinePistols:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MachinePistols;
      break;
    case weaponXmlSubtypeEnum.MediumMachineguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MediumHeavyMachineguns;
      break;
    case weaponXmlSubtypeEnum.MissileLaunchers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MissileLaunchers;
      break;
    case weaponXmlSubtypeEnum.Shotguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Shotguns;
      break;
    case weaponXmlSubtypeEnum.SportingRifles:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.SportingRifles;
      break;
    case weaponXmlSubtypeEnum.SubmachineGuns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.SubmachineGuns;
      break;
    case weaponXmlSubtypeEnum.Tasers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Tasers;
      break;
    case weaponXmlSubtypeEnum.UnderbarrelWeapons:
      if (weapon.type === "Melee") {
        weaponType = weaponTypeEnum.Melee;
        weaponSubtype = meleeWeaponTypeEnum.WeaponAttachments;
      } else {
        weaponType = weaponTypeEnum.Firearm;
        weaponSubtype = firearmWeaponTypeEnum.WeaponAttachments;
      }
      break;
    case weaponXmlSubtypeEnum.Cyberweapon:
      if (weapon.type === "Melee") {
        weaponType = weaponTypeEnum.Melee;
        weaponSubtype = meleeWeaponTypeEnum.Exotic;
      } else {
        weaponType = weaponTypeEnum.Firearm;
        weaponSubtype = firearmWeaponTypeEnum.Exotic;
      }
      break;
    case weaponXmlSubtypeEnum.Carbines:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Carbines;
      break;
    // melee
    case weaponXmlSubtypeEnum.BioWeapon:
      if (weapon.type === "Melee") {
        weaponType = weaponTypeEnum.Melee;
        weaponSubtype = meleeWeaponTypeEnum.BioWeapons;
      } else {
        assert(false, "Bio-weapons not expected to be ranged");
      }
      break;
    case weaponXmlSubtypeEnum.Blades:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Blades;
      break;
    case weaponXmlSubtypeEnum.Clubs:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Clubs;
      break;
    case weaponXmlSubtypeEnum.ExoticMeleeWeapons:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Exotic;
      break;
    case weaponXmlSubtypeEnum.ImprovisedWeapons:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Improvised;
      break;
    case weaponXmlSubtypeEnum.Unarmed:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Unarmed;
      break;
    case weaponXmlSubtypeEnum.Quality:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.MetagenicQuality;
      break;
    case weaponXmlSubtypeEnum.Rifles:
    case weaponXmlSubtypeEnum.Pistol:
      assert(false);
  }
  return { weaponType, weaponSubtype };
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
