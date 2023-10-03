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
} from "@shadowrun/common/build/enums.js";
import assert from "assert";
import {
  AccessoryXmlType,
  WeaponXmlType,
  RequiredXmlType,
} from "./WeaponParserSchemas.js";
import {
  UnlinkedAccessoryType,
  FirearmOptionsType,
  MeleeOptionsType,
  MountType,
  UnlinkedWeaponTypeInformationType,
  weaponRequirementsType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import {
  weaponXmlSubtypeEnum,
  WeaponXmlSubtypeType,
} from "@shadowrun/common/build/schemas/commonSchemas.js";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import {
  convertXmlGears,
  convertGearCategory,
} from "../common/ParserHelper.js";
const Accuracy = Weapons.Accuracy;
const Damage = Weapons.Damage;
const ArmourPenetration = Weapons.ArmourPenetration;
const Mode = Weapons.Mode;
const Ammo = Weapons.Ammo;
const Availability = Weapons.Availability;
const Cost = Weapons.Cost;

export const convertTypeInformation = function (
  weaponType: weaponTypeEnum,
  weaponSubtype:
    | meleeWeaponTypeEnum
    | projectileWeaponTypeEnum
    | firearmWeaponTypeEnum
    | explosiveTypeEnum,
  meleeOptions: MeleeOptionsType,
  firearmOptions: FirearmOptionsType,
  ranges: Array<string>
): UnlinkedWeaponTypeInformationType {
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
        type: weaponTypeEnum.Melee,
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
        type: weaponTypeEnum.Projectile,
        subtype: weaponSubtype as projectileWeaponTypeEnum,
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
        type: weaponTypeEnum.Firearm,
        subtype: weaponSubtype as firearmWeaponTypeEnum,
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
        type: weaponTypeEnum.Explosive,
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
  AccuracyValue(str) {
    return [str.eval()];
  },
  Physical(_) {
    return { option: accuracyEnum.Physical };
  },
  Missile(_) {
    return { option: accuracyEnum.Missile };
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
          .concat([{ operator: mathOperatorEnum.GreaterThan }], damage2.eval()),
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
      reloadMethod: reloadMethodEnum.None,
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
    | undefined,
  name: string
) {
  if (!xmlAccessoriesUndefined) {
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
      accessory.gears = convertXmlGears(xmlAccessory.gears, name);
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

export const convertAllowGear = function (
  xmlAllowGear: { gearcategory: string | Array<string> } | undefined,
  name: string
) {
  if (!xmlAllowGear) {
    return undefined;
  }
  // console.log("Allow Gear: " + xmlAllowGear.toString());
  const gearCategories = Array.isArray(xmlAllowGear.gearcategory)
    ? xmlAllowGear.gearcategory
    : [xmlAllowGear.gearcategory];
  return gearCategories.map((gearCategory) =>
    convertGearCategory(gearCategory, `weapon.name: ${name}`)
  );
};

// This function does NOT handle requirements properly
// TODO: put in lots of work here, after seeing what frontend needs
export const convertRequirements = function (
  xmlRequirements: RequiredXmlType | undefined,
  name: string
): weaponRequirementsType | undefined {
  if (!xmlRequirements) {
    return undefined;
  }
  // console.log("Requirements" + xmlRequirements.toString());
  assert(typeof xmlRequirements === "object");
  // if (Object.hasOwn(xmlRequirements, "weapondetails")){  //typescript doesn't yet support the type narrowing for this
  if ("weapondetails" in xmlRequirements) {
    const weaponName = xmlRequirements.weapondetails.name;
    const conceal = xmlRequirements.weapondetails.conceal;
    if (weaponName && conceal !== undefined)
      assert(false, "only name or conceal should be defined");
    if (weaponName) {
      return { weaponAllowed: weaponName };
    } else if (conceal) {
      if (conceal._operation === "greaterthan")
        return { minimumHostConcealment: conceal.xmltext };
      else return { maximumHostConcealment: conceal.xmltext };
    }
    assert(false, "neither name or conceal are defined for: " + name);
    return undefined;
  } else if ("OR" in xmlRequirements) {
    const categories =
      xmlRequirements.OR.category === undefined
        ? undefined
        : Array.isArray(xmlRequirements.OR.category)
        ? xmlRequirements.OR.category
        : [xmlRequirements.OR.category];
    const skills =
      xmlRequirements.OR.useskill === undefined
        ? undefined
        : Array.isArray(xmlRequirements.OR.useskill)
        ? xmlRequirements.OR.useskill
        : [xmlRequirements.OR.useskill];
    return {
      categories: categories,
      skills: skills,
    };
  } else {
    // skip the AND portion
    return undefined;
  }
};

export const convertWeaponSkill = function (
  useSkill: string | undefined,
  category: WeaponXmlSubtypeType,
  useSkillSpecialisation: string | undefined,
  previousSpecialisations: Array<string> | undefined
) {
  let skill = "";
  let specialisations = previousSpecialisations;
  if (useSkillSpecialisation) specialisations = [useSkillSpecialisation];
  if (useSkill) {
    return { skill: useSkill, specialisations: specialisations };
  }
  switch (category) {
    case "Bows":
    case "Crossbows":
      skill = "Archery";
      break;

    case "Assault Rifles":
    case "Carbines":
    case "Machine Pistols":
    case "Submachine Guns":
      skill = "Automatics";
      break;

    case "Blades":
      skill = "Blades";
      break;

    case "Clubs":
    case "Improvised Weapons":
      skill = "Clubs";
      break;

    case "Exotic Melee Weapons":
      skill = "Exotic Melee Weapon";
      break;

    case "Exotic Ranged Weapons":
      skill = "Exotic Ranged Weapon";
      break;

    case "Flamethrowers":
      skill = "Exotic Ranged Weapon";
      specialisations = ["Flamethrowers"];
      break;

    case "Laser Weapons":
      skill = "Exotic Ranged Weapon";
      specialisations = ["Laser Weapons"];
      break;

    case "Assault Cannons":
    case "Grenade Launchers":
    case "Missile Launchers":
    case "Light Machine Guns":
    case "Medium Machine Guns":
    case "Heavy Machine Guns":
      skill = "Heavy Weapons";
      break;

    case "Shotguns":
    case "Sniper Rifles":
    case "Sporting Rifles":
      skill = "Longarms";
      break;

    case "Unarmed":
      skill = "Unarmed Combat";
      break;

    case "Heavy Pistols":
    case "Holdouts":
    case "Light Pistols":
    case "Tasers":
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
      assert(
        !weapon.name.toLowerCase().includes("missile") &&
          !weapon.name.toLowerCase().includes("rocket")
      );
      if (weapon.name.toLowerCase().includes("grenade")) {
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
    case weaponXmlSubtypeEnum.Holduts:
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
    case weaponXmlSubtypeEnum.BioWeapon:
      if (weapon.type === "Melee") {
        weaponType = weaponTypeEnum.Melee;
        weaponSubtype = meleeWeaponTypeEnum.BioWeapons;
      } else {
        assert(false, "Bio-weapons not expected to be ranged");
      }
      break;
    case weaponXmlSubtypeEnum.Carbines:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Carbines;
      break;
    // melee
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
