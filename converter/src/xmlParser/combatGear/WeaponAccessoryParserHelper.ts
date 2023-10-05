import {
  mathOperatorEnum,
  firearmAccessoryMountLocationEnum,
  reloadMethodEnum,
} from "@shadowrun/common";
import {
  ammoOptionEnum,
  ammoSourceEnum,
  availabilityEnum,
  costWeaponAccessoryEnum,
  damageAnnotationEnum,
  damageTypeEnum,
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  restrictionEnum,
  weaponTypeEnum,
} from "@shadowrun/common/build/enums.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/build/schemas/commonSchemas.js";
import {
  WeaponDamageRequirementsType,
  AccessoryWeaponRequirementsType,
} from "@shadowrun/common/build/schemas/weaponAccessorySchemas.js";
import assert from "assert";
import {
  WeaponAccessoryRequiredXmlType,
  RequiredWeaponDetailsXmlType,
  XmlCategoryOrOperationType,
} from "./WeaponAccessoryParserSchemas.js";
import WeaponAccessories from "../../grammar/weaponAccessories.ohm-bundle.js";
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
    return { option: costWeaponAccessoryEnum.Rating };
  },
  Weapon(_) {
    return { option: costWeaponAccessoryEnum.Weapon };
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

export const convertWeaponDetails = function (
  weaponDetails: RequiredWeaponDetailsXmlType
): AccessoryWeaponRequirementsType {
  const requiredWeaponNames: Array<string> = [];
  let requiredAmmunitionDetails: Array<
    ammoSourceEnum | firearmWeaponTypeEnum | projectileWeaponTypeEnum
  > = [];
  let requiredCategory: Array<
    firearmWeaponTypeEnum | projectileWeaponTypeEnum | weaponTypeEnum.Melee
  > = [];
  const requiredSkills: Array<string> = [];
  const requiredAccessoryMountsArray: Array<firearmAccessoryMountLocationEnum> =
    [];
  let requiredDamage: WeaponDamageRequirementsType | undefined = undefined;

  const weaponName = weaponDetails.name;
  const ammo = weaponDetails.ammo;
  const ammoCategory = weaponDetails.ammocategory;
  const category = weaponDetails.category;
  const type = weaponDetails.type;
  const conceal = weaponDetails.conceal;
  const useSkill = weaponDetails.useskill;
  const accessoryMounts = weaponDetails.accessorymounts;
  const damage = weaponDetails.damage;
  let minimumHostConcealment: number | undefined = undefined;
  let maximumHostConcealment: number | undefined = undefined;
  if (weaponName) {
    const weaponNameArray = Array.isArray(weaponName)
      ? weaponName
      : [weaponName];
    weaponNameArray.forEach((weapon) => {
      if (typeof weapon === "object") {
        requiredWeaponNames.push(weapon.xmltext);
      } else requiredWeaponNames.push(weapon);
    });
  }
  if (ammo !== undefined) {
    const ammoArray = Array.isArray(ammo) ? ammo : [ammo];
    ammoArray.forEach((ammo) => {
      switch (ammo.xmltext) {
        case "(b)":
          requiredAmmunitionDetails.push(ammoSourceEnum.BreakAction);
          break;
        case "(c)":
          requiredAmmunitionDetails.push(ammoSourceEnum.Clip);
          break;
        case "(d)":
          requiredAmmunitionDetails.push(ammoSourceEnum.Drum);
          break;
        case "(ml)":
          requiredAmmunitionDetails.push(ammoSourceEnum.MuzzleLoader);
          break;
        case "(m)":
          requiredAmmunitionDetails.push(ammoSourceEnum.InternalMagazine);
          break;
        case "(cy)":
          requiredAmmunitionDetails.push(ammoSourceEnum.Cylinder);
          break;
        case "(belt)":
          requiredAmmunitionDetails.push(ammoSourceEnum.BeltFed);
          break;
        case "(tank)":
          requiredAmmunitionDetails.push(ammoSourceEnum.Tank);
          break;
        case "(cb)":
          requiredAmmunitionDetails.push(ammoSourceEnum.CapAndBall);
          break;
        case "Energy":
          requiredAmmunitionDetails.push(ammoSourceEnum.Energy);
          break;
        case "External Source":
          requiredAmmunitionDetails.push(ammoSourceEnum.External);
          break;
        default:
          assert(false, `ammo type not supported: ${ammo.xmltext}`);
      }
    });
  }
  if (ammoCategory) {
    const ammoCategoryArray = Array.isArray(ammoCategory)
      ? ammoCategory
      : [ammoCategory];
    requiredAmmunitionDetails = getCategories<ammoSourceEnum>(
      ammoCategoryArray,
      requiredAmmunitionDetails
    );
  }
  if (category) {
    const categoryArray = Array.isArray(category) ? category : [category];
    requiredCategory = getCategories<weaponTypeEnum.Melee>(
      categoryArray,
      requiredCategory
    );
  }
  if (type) {
    if (type === "Melee") {
      requiredCategory.push(weaponTypeEnum.Melee);
    }
  }
  if (conceal) {
    // console.log("conceal:" + conceal.xmltext);
    if (conceal._operation === "greaterthan")
      minimumHostConcealment = conceal.xmltext;
    else if (conceal._operation === "greaterthanorequals")
      minimumHostConcealment = conceal.xmltext - 1;
    else maximumHostConcealment = conceal.xmltext;
    // console.log(
    //   `minimumHostConcealment: ${minimumHostConcealment}, maximumHostConcealment: ${maximumHostConcealment}`
    // );
  }
  if (useSkill) {
    const useSkillArray = Array.isArray(useSkill) ? useSkill : [useSkill];
    useSkillArray.forEach((skill) => {
      // TODO: fix skills for object here
      if (typeof skill !== "object") requiredSkills.push(skill);
    });
  }
  if (accessoryMounts) {
    const accessoryMountsArray = Array.isArray(accessoryMounts.mount)
      ? accessoryMounts.mount
      : [accessoryMounts.mount];
    accessoryMountsArray.forEach((mount) => {
      if (
        mount === firearmAccessoryMountLocationEnum.Underbarrel ||
        mount === firearmAccessoryMountLocationEnum.Barrel ||
        mount === firearmAccessoryMountLocationEnum.Top ||
        mount === firearmAccessoryMountLocationEnum.Side ||
        mount === firearmAccessoryMountLocationEnum.Stock ||
        mount === firearmAccessoryMountLocationEnum.Internal
      ) {
        requiredAccessoryMountsArray.push(mount);
      } else {
        assert(false, mount);
      }
    });
  }
  if (damage) {
    let annotation = undefined;
    if (damage.xmltext.includes("(fire)")) {
      annotation = damageAnnotationEnum.Fire;
    } else if (damage.xmltext.includes("(f)")) {
      annotation = damageAnnotationEnum.Flechette;
    } else if (damage.xmltext.includes("(e)")) {
      annotation = damageAnnotationEnum.Electrical;
    }
    const damageType = damage.xmltext.includes("S")
      ? damageTypeEnum.Stun
      : damageTypeEnum.Physical;
    requiredDamage = {
      ...(annotation !== undefined && { annotation: annotation }),
      type: damageType,
    };
  }
  return {
    ...(requiredWeaponNames.length > 0 && { weaponNames: requiredWeaponNames }),
    ...(requiredAmmunitionDetails.length > 0 && {
      ammunitionDetails: requiredAmmunitionDetails,
    }),
    ...(requiredCategory.length > 0 && { categories: requiredCategory }),
    ...(requiredSkills.length > 0 && { skills: requiredSkills }),
    ...(requiredAccessoryMountsArray.length > 0 && {
      accessoryMounts: requiredAccessoryMountsArray,
    }),
    ...(requiredDamage !== undefined && { requiredDamage: requiredDamage }),
    ...(minimumHostConcealment !== undefined && {
      minimumHostConcealment: minimumHostConcealment,
    }),
    ...(maximumHostConcealment !== undefined && {
      maximumHostConcealment: maximumHostConcealment,
    }),
  };
};

// This function does NOT handle requirements properly
// TODO: put in lots of work here, after seeing what frontend needs
export const convertRequirements = function (
  xmlRequirements: WeaponAccessoryRequiredXmlType | undefined
): AccessoryWeaponRequirementsType | undefined {
  if (typeof xmlRequirements === "undefined") {
    return undefined;
  }
  // console.log("Requirements: " + JSON.stringify(xmlRequirements));
  let weaponRequirements: AccessoryWeaponRequirementsType | undefined =
    undefined;
  // if (Object.hasOwn(xmlRequirements, "weapondetails")){  //typescript doesn't yet support the type narrowing for this
  if ("weapondetails" in xmlRequirements) {
    const weaponDetails = xmlRequirements.weapondetails;
    assert(weaponDetails);
    if (!("OR" in weaponDetails) && !("AND" in weaponDetails)) {
      weaponRequirements = convertWeaponDetails(weaponDetails);
    } else if ("OR" in weaponDetails && weaponDetails.OR !== undefined) {
      const detailsOr = Array.isArray(weaponDetails.OR)
        ? weaponDetails.OR
        : [weaponDetails.OR];
      weaponRequirements = convertWeaponDetails(detailsOr[0]);
    } else {
      assert(false);
      weaponRequirements = undefined;
    }
  } else if ("OR" in xmlRequirements) {
    if ("category" in xmlRequirements.OR) {
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
          : // TODO: fix skills for object here
          typeof xmlRequirements.OR.useskill === "object"
          ? undefined
          : [xmlRequirements.OR.useskill];
      // currently not using AND portion... should be handled by the skill fix
      // xmlRequirements.OR.AND
      let parsedCategories: Array<
        firearmWeaponTypeEnum | projectileWeaponTypeEnum
      > = [];
      if (categories)
        parsedCategories = getCategories(categories, parsedCategories);
      weaponRequirements = { categories: parsedCategories, skills: skills };
    } else {
      const orDetails =
        "weapondetails" in xmlRequirements.OR
          ? xmlRequirements.OR.weapondetails
          : xmlRequirements.OR;
      const categories =
        orDetails.category !== undefined
          ? Array.isArray(orDetails.category)
            ? orDetails.category
            : [orDetails.category]
          : undefined;

      let parsedCategories: Array<
        firearmWeaponTypeEnum | projectileWeaponTypeEnum
      > = [];
      if (categories)
        parsedCategories = getCategories(categories, parsedCategories);

      // TODO: fix skills for object here
      const skills =
        orDetails.useskill !== undefined &&
        typeof orDetails.useskill !== "object"
          ? Array.isArray(orDetails.useskill)
            ? orDetails.useskill
            : [orDetails.useskill]
          : undefined;
      weaponRequirements = { categories: parsedCategories, skills: skills };
    }
  }
  if ("oneof" in xmlRequirements) {
    const oneof = xmlRequirements.oneof;
    assert(oneof);
    if ("accessory" in oneof) {
      const accessory = oneof.accessory;
      assert(accessory);
      const accessories = Array.isArray(accessory) ? accessory : [accessory];
      if (weaponRequirements) weaponRequirements.accessories = accessories;
      else weaponRequirements = { accessories: accessories };
    } else {
      if (weaponRequirements)
        weaponRequirements.specialModificationLimit =
          oneof.specialmodificationlimit;
      else
        weaponRequirements = {
          specialModificationLimit: oneof.specialmodificationlimit,
        };
    }
  }
  return weaponRequirements;
};

export const getWeaponMounts = function (mounts: string | undefined) {
  if (mounts === undefined || mounts === "") return undefined;
  // console.log("Mounts: " + mounts);
  const mountLocations = mounts.split("/");
  return mountLocations.map((mountLocation) => {
    switch (mountLocation) {
      case "Under":
        return firearmAccessoryMountLocationEnum.Underbarrel;
      case "Top":
        return firearmAccessoryMountLocationEnum.Top;
      case "Side":
        return firearmAccessoryMountLocationEnum.Side;
      case "Stock":
        return firearmAccessoryMountLocationEnum.Stock;
      case "Barrel":
        return firearmAccessoryMountLocationEnum.Barrel;
      case "Internal":
        return firearmAccessoryMountLocationEnum.Internal;
      default:
        assert(false, `mountLocation: ${mountLocation}`);
        return;
    }
  }) as Array<firearmAccessoryMountLocationEnum>;
};

function getCategories<Type>(
  categoryArray: Array<XmlCategoryOrOperationType>,
  requiredCategory: Array<
    firearmWeaponTypeEnum | projectileWeaponTypeEnum | Type
  >
) {
  categoryArray.forEach((category) => {
    let parsedCategory: weaponXmlSubtypeEnum;
    if (typeof category === "object" && "xmltext" in category) {
      parsedCategory = category.xmltext;
    } else {
      parsedCategory = category;
    }
    switch (parsedCategory) {
      case weaponXmlSubtypeEnum.AssaultCannons:
        requiredCategory.push(firearmWeaponTypeEnum.AssaultCannons);
        break;
      case weaponXmlSubtypeEnum.AssaultRifles:
        requiredCategory.push(firearmWeaponTypeEnum.AssaultRifles);
        break;
      case weaponXmlSubtypeEnum.GrenadeLaunchers:
        requiredCategory.push(firearmWeaponTypeEnum.GrenadeLaunchers);
        break;
      case weaponXmlSubtypeEnum.LightMachineguns:
        requiredCategory.push(firearmWeaponTypeEnum.LightMachineguns);
        break;
      case weaponXmlSubtypeEnum.SniperRifles:
        requiredCategory.push(firearmWeaponTypeEnum.SniperRifles);
        break;
      case weaponXmlSubtypeEnum.ExoticRangedWeapons:
        requiredCategory.push(firearmWeaponTypeEnum.Exotic);
        break;
      case weaponXmlSubtypeEnum.Flamethrowers:
        requiredCategory.push(firearmWeaponTypeEnum.Flamethrowers);
        break;
      case weaponXmlSubtypeEnum.HeavyMachineguns:
        requiredCategory.push(firearmWeaponTypeEnum.MediumHeavyMachineguns);
        break;
      case weaponXmlSubtypeEnum.HeavyPistols:
        requiredCategory.push(firearmWeaponTypeEnum.HeavyPistols);
        break;
      case weaponXmlSubtypeEnum.Holduts:
        requiredCategory.push(firearmWeaponTypeEnum.HoldOuts);
        break;
      case weaponXmlSubtypeEnum.LaserWeapons:
        requiredCategory.push(firearmWeaponTypeEnum.Lasers);
        break;
      case weaponXmlSubtypeEnum.LightPistols:
        requiredCategory.push(firearmWeaponTypeEnum.LightPistols);
        break;
      case weaponXmlSubtypeEnum.MachinePistols:
        requiredCategory.push(firearmWeaponTypeEnum.MachinePistols);
        break;
      case weaponXmlSubtypeEnum.MediumMachineguns:
        requiredCategory.push(firearmWeaponTypeEnum.MediumHeavyMachineguns);
        break;
      case weaponXmlSubtypeEnum.MissileLaunchers:
        requiredCategory.push(firearmWeaponTypeEnum.MissileLaunchers);
        break;
      case weaponXmlSubtypeEnum.Shotguns:
        requiredCategory.push(firearmWeaponTypeEnum.Shotguns);
        break;
      case weaponXmlSubtypeEnum.SportingRifles:
        requiredCategory.push(firearmWeaponTypeEnum.SportingRifles);
        break;
      case weaponXmlSubtypeEnum.SubmachineGuns:
        requiredCategory.push(firearmWeaponTypeEnum.SubmachineGuns);
        break;
      case weaponXmlSubtypeEnum.Tasers:
        requiredCategory.push(firearmWeaponTypeEnum.Tasers);
        break;
      case weaponXmlSubtypeEnum.UnderbarrelWeapons:
        requiredCategory.push(firearmWeaponTypeEnum.WeaponAttachments);
        break;
      case weaponXmlSubtypeEnum.Cyberweapon:
        requiredCategory.push(firearmWeaponTypeEnum.Exotic);
        break;
      case weaponXmlSubtypeEnum.BioWeapon:
        requiredCategory.push(firearmWeaponTypeEnum.BioWeapons);
        break;
      case weaponXmlSubtypeEnum.Carbines:
        requiredCategory.push(firearmWeaponTypeEnum.Carbines);
        break;
      case weaponXmlSubtypeEnum.Bows:
        requiredCategory.push(projectileWeaponTypeEnum.Bows);
        break;
      default:
        if (typeof category === "object") {
          if (category.xmltext === weaponXmlSubtypeEnum.Rifles) {
            requiredCategory.push(firearmWeaponTypeEnum.SniperRifles);
            requiredCategory.push(firearmWeaponTypeEnum.AssaultRifles);
            requiredCategory.push(firearmWeaponTypeEnum.SportingRifles);
            break;
          } else if (category.xmltext === weaponXmlSubtypeEnum.Pistol) {
            requiredCategory.push(firearmWeaponTypeEnum.HeavyPistols);
            requiredCategory.push(firearmWeaponTypeEnum.LightPistols);
            requiredCategory.push(firearmWeaponTypeEnum.MachinePistols);
            break;
          }
        }
        assert(false, `category invalid: ${JSON.stringify(category)}`);
    }
  });
  return requiredCategory;
}

export {
  modifyAmmoCapacitySemantics,
  ammoWeaponAccessorySemantics,
  availabilityWeaponAccessorySemantics,
  costWeaponAccessorySemantics,
};
