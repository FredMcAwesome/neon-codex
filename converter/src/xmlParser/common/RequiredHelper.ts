import {
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  weaponTypeEnum,
  firearmAccessoryMountLocationEnum,
  damageAnnotationEnum,
  damageTypeEnum,
} from "@shadowrun/common";
import { ammoSourceEnum } from "@shadowrun/common/build/enums.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/build/schemas/commonSchemas.js";
import {
  RequirementsType,
  WeaponDamageRequirementsType,
} from "@shadowrun/common/build/schemas/shared/requiredSchemas.js";
import assert from "assert";
import {
  containsType,
  RequiredWeaponDetailsXmlType,
  RequiredXmlType,
  XmlCategoryOrOperationType,
} from "./RequiredParserSchemas.js";

// This function does NOT handle requirements properly
// TODO: put in lots of work here, after seeing what frontend needs
export const convertRequirements = function (
  xmlRequirements: RequiredXmlType | undefined
): RequirementsType | undefined {
  if (typeof xmlRequirements === "undefined") {
    return undefined;
  }
  // console.log("Requirements: " + JSON.stringify(xmlRequirements));
  let requirements: RequirementsType = {};
  // if (Object.hasOwn(xmlRequirements, "weapondetails")){  //typescript doesn't yet support the type narrowing for this
  if (
    "weapondetails" in xmlRequirements &&
    xmlRequirements.weapondetails !== undefined
  ) {
    requirements = convertWeaponDetails(xmlRequirements.weapondetails);
  } else if ("OR" in xmlRequirements) {
    if ("weapondetails" in xmlRequirements.OR) {
      const orDetails = xmlRequirements.OR.weapondetails;
      // let parsedCategories: Array<
      //   firearmWeaponTypeEnum | projectileWeaponTypeEnum
      // > = [];
      let parsedCategories = convertWeaponDetails(orDetails);
      requirements = parsedCategories;
    } else {
      // let parsedCategories: Array<
      //   firearmWeaponTypeEnum | projectileWeaponTypeEnum
      // > = [];
      let parsedCategories = convertWeaponDetails(xmlRequirements.OR);
      requirements = parsedCategories;
    }
  }
  if ("oneof" in xmlRequirements) {
    const oneof = xmlRequirements.oneof;
    assert(oneof);
    if ("accessory" in oneof) {
      const accessory = oneof.accessory;
      assert(accessory);
      const accessories = Array.isArray(accessory) ? accessory : [accessory];
      if (requirements !== undefined && "accessories" in requirements)
        requirements.accessories = accessories;
      else requirements = { accessories: accessories };
    } else if (
      "specialmodificationlimit" in oneof &&
      oneof.specialmodificationlimit !== undefined
    ) {
      requirements.specialModificationLimit = oneof.specialmodificationlimit;
    } else if ("armormod" in oneof && oneof.armormod !== undefined) {
      requirements.requiredMod = oneof.armormod.xmltext;
    }
  }
  if (
    "parentdetails" in xmlRequirements &&
    xmlRequirements.parentdetails !== undefined
  ) {
    const parentdetails = xmlRequirements.parentdetails;
    requirements.hostArmour = parentdetails.name;
  }

  if (Object.keys(requirements).length === 0) {
    return undefined;
  }
  return requirements;
};

const convertWeaponDetails = function (
  weaponDetails: RequiredWeaponDetailsXmlType
) {
  let weaponRequirements;
  if (
    !("OR" in weaponDetails && weaponDetails.OR !== undefined) &&
    !("AND" in weaponDetails && weaponDetails.AND !== undefined)
  ) {
    weaponRequirements = convertWeaponDetailsInner(weaponDetails);
  } else if ("OR" in weaponDetails && weaponDetails.OR !== undefined) {
    assert(typeof weaponDetails.AND === "undefined");
    const detailsOr = Array.isArray(weaponDetails.OR)
      ? weaponDetails.OR
      : [weaponDetails.OR];
    weaponRequirements = convertWeaponDetailsInner(detailsOr[0]);
  } else if ("AND" in weaponDetails && weaponDetails.AND !== undefined) {
    assert(typeof weaponDetails.OR === "undefined");
    const detailsAnd = Array.isArray(weaponDetails.AND)
      ? weaponDetails.AND
      : [weaponDetails.AND];
    weaponRequirements = convertWeaponDetailsInner(detailsAnd[0]);
  } else {
    assert(false);
    weaponRequirements = undefined;
  }
  return weaponRequirements;
};

const convertWeaponDetailsInner = function (
  weaponDetails: RequiredWeaponDetailsXmlType
) {
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
        assert(typeof weapon.xmltext === "string");
        requiredWeaponNames.push(weapon.xmltext);
      } else {
        assert(typeof weapon === "string");
        requiredWeaponNames.push(weapon);
      }
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
    requiredAmmunitionDetails = getWeaponCategories<ammoSourceEnum>(
      ammoCategoryArray,
      requiredAmmunitionDetails
    );
  }
  if (category) {
    const categoryArray = Array.isArray(category) ? category : [category];
    requiredCategory = getWeaponCategories<weaponTypeEnum.Melee>(
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
    if (conceal._operation === "greaterthan") {
      minimumHostConcealment = conceal.xmltext;
    } else if (conceal._operation === "greaterthanorequals") {
      minimumHostConcealment = conceal.xmltext - 1;
    } else if (conceal._operation === "lessthanequals") {
      maximumHostConcealment = conceal.xmltext;
    }
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

    assert(typeof damage.xmltext === "string");
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

function getWeaponCategories<Type>(
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
          } else {
            assert(false, category.xmltext);
          }
        }
        assert(false, `category invalid: ${JSON.stringify(category)}`);
    }
  });
  return requiredCategory;
}

// TODO: incorporate these things
export const convertSpellRequired = function (required: RequiredXmlType) {
  if ("allof" in required && required.allof !== undefined) {
    convertSpellRequiredDetails(required.allof);
  }
  if ("oneof" in required && required.oneof !== undefined) {
    convertSpellRequiredDetails(required.oneof);
  }
};

export const convertSpellRequiredDetails = function (required: containsType) {
  if ("group" in required && required.group !== undefined) {
  }
  if ("metamagic" in required && required.metamagic !== undefined) {
  }
  if ("metamagicart" in required && required.metamagicart !== undefined) {
  }
  if ("quality" in required && required.quality !== undefined) {
  }
  if ("spell" in required && required.spell !== undefined) {
  }
};
