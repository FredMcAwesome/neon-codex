import {
  mathOperatorEnum,
  firearmAccessoryMountLocationEnum,
} from "@shadowrun/common";
import {
  ammoOptionEnum,
  ammoSourceEnum,
  damageAnnotationEnum,
  damageTypeEnum,
  firearmWeaponTypeEnum,
  projectileWeaponTypeEnum,
  weaponTypeEnum,
} from "@shadowrun/common/src/enums.js";
import { weaponXmlSubtypeEnum } from "@shadowrun/common/src/schemas/commonSchema.js";
import {
  AmmoInformationType,
  weaponDamageRequirementsType,
  accessoryWeaponRequirementsType,
} from "@shadowrun/common/src/schemas/weaponAccessorySchema.js";
import assert from "assert";
import equal from "fast-deep-equal";
import { parseCharacter, convertSpecial } from "../ParserHelper.js";
import {
  WeaponAccessoryRequiredXmlType,
  RequiredWeaponDetailsXmlType,
  XmlCategoryOrOperationType,
} from "./WeaponAccessoryParserSchema.js";
import { removeUnneededCharacters } from "./WeaponParserHelper.js";

export const convertModifyAmmoCapacity = function (
  modifyammocapacity: string,
  name: string
) {
  console.log(`Modify Ammo Capacity: ${modifyammocapacity}`);
  let genericList: Array<{ operator: mathOperatorEnum } | string | number> = [];
  let ammoCapacityList: Array<
    | { operator: mathOperatorEnum }
    | { option: ammoOptionEnum }
    | string
    | number
  > = [];
  Array.from(modifyammocapacity).forEach((character) => {
    genericList = parseCharacter(character, genericList, true);
  });

  let conversionInfo = convertSpecial(
    { propertyList: genericList, insertLocationList: [] },
    "div"
  );
  conversionInfo = convertSpecial(conversionInfo, "Weapon");
  ammoCapacityList = conversionInfo.propertyList;
  let locationCounter = 0;
  conversionInfo.insertLocationList.forEach((insertLocation) => {
    const replaceString = insertLocation.value;

    if (replaceString === "div") {
      const operator = mathOperatorEnum.Divide;
      if (ammoCapacityList.length > 0) {
        ammoCapacityList.splice(insertLocation.location + locationCounter, 0, {
          operator: operator,
        });
      } else {
        ammoCapacityList[0] = { operator: operator };
      }
      locationCounter++;
    } else if (replaceString === "Weapon") {
      const option = ammoOptionEnum.Weapon;
      if (ammoCapacityList.length > 0) {
        ammoCapacityList.splice(insertLocation.location + locationCounter, 0, {
          option: option,
        });
      } else {
        ammoCapacityList[0] = { option: option };
      }
    } else {
      assert(false, "Special string not replaced!");
    }
    locationCounter++;
  });

  ammoCapacityList = removeUnneededCharacters(ammoCapacityList);

  ammoCapacityList.forEach((ammoCapacity, index) => {
    let check = false;
    if (typeof ammoCapacity === "number") {
      check = true;
    } else {
      Object.values(mathOperatorEnum).forEach((operator) => {
        if (equal(ammoCapacity, { operator: operator })) check = true;
      });
      Object.values(ammoOptionEnum).forEach((option) => {
        if (equal(ammoCapacity, { option: option })) check = true;
      });
    }
    // console.log(
    //   ammoCapacityList[index]
    // );
    assert(
      check,
      `Weapon name: ${name}, list length: ${ammoCapacityList.length}, failed item: ${ammoCapacity} at index: ${index}`
    );
  });
  return ammoCapacityList as Array<
    { operator: mathOperatorEnum } | { option: ammoOptionEnum } | number
  >;
};

export const convertAmmoReplace = function (
  ammoReplace: string | number,
  name: string
): AmmoInformationType {
  console.log(`Ammo Replace: ${ammoReplace}`);
  if (typeof ammoReplace === "number")
    return { ammoCount: ammoReplace, ammoSource: ammoSourceEnum.None };
  let ammoReplaceList: Array<
    | { operator: mathOperatorEnum }
    | string
    | number
    | { option: ammoSourceEnum }
  > = [];

  let genericList: Array<{ operator: mathOperatorEnum } | string | number> = [];
  Array.from(ammoReplace).forEach((character) => {
    genericList = parseCharacter(character, genericList, true);
  });
  let conversionInfo = convertSpecial(
    { propertyList: genericList, insertLocationList: [] },
    "(belt)"
  );
  conversionInfo = convertSpecial(conversionInfo, "(d)");
  conversionInfo = convertSpecial(conversionInfo, "External Source");
  ammoReplaceList = conversionInfo.propertyList;
  let locationCounter = 0;
  conversionInfo.insertLocationList.forEach((insertLocation) => {
    const replaceString = insertLocation.value;
    let option: ammoSourceEnum = ammoSourceEnum.None;
    if (replaceString === "(belt)") {
      option = ammoSourceEnum.BeltFed;
    } else if (replaceString === "(d)") {
      option = ammoSourceEnum.Drum;
    } else if (replaceString === "External Source") {
      option = ammoSourceEnum.External;
    } else {
      assert(false, "Special string not replaced!");
    }
    if (ammoReplaceList.length > 0) {
      ammoReplaceList.splice(insertLocation.location + locationCounter, 0, {
        option: option,
      });
    } else {
      ammoReplaceList[0] = {
        option: option,
      };
    }
    locationCounter++;
  });
  let count = undefined;
  let source = undefined;

  // just take a shortcut here, fix it later if we assert fail
  ammoReplaceList.forEach((ammoReplace) => {
    let check = false;
    if (typeof ammoReplace === "number") {
      check = true;
      count = ammoReplace;
    } else {
      Object.values(ammoSourceEnum).forEach((option) => {
        if (equal(ammoReplace, { option: option })) {
          check = true;
          source = option;
        }
      });
    }
    assert(check, `name: ${name} ammoReplace: ${ammoReplace}`);
  });
  return { ammoCount: count, ammoSource: source };
};

export const convertWeaponDetails = function (
  weaponDetails: RequiredWeaponDetailsXmlType
): accessoryWeaponRequirementsType {
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
  let requiredDamage: weaponDamageRequirementsType | undefined = undefined;

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
  if (ammo) {
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
    console.log("conceal:" + conceal.xmltext);
    if (conceal._operation === "greaterthan")
      minimumHostConcealment = conceal.xmltext;
    else if (conceal._operation === "greaterthanorequals")
      minimumHostConcealment = conceal.xmltext - 1;
    else maximumHostConcealment = conceal.xmltext;
    console.log(
      `minimumHostConcealment: ${minimumHostConcealment}, maximumHostConcealment: ${maximumHostConcealment}`
    );
  }
  if (useSkill) {
    const useSkillArray = Array.isArray(useSkill) ? useSkill : [useSkill];
    useSkillArray.forEach((skill) => {
      requiredSkills.push(skill);
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
      ...(annotation && { annotation: annotation }),
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
    ...(minimumHostConcealment && {
      minimumHostConcealment: minimumHostConcealment,
    }),
    ...(maximumHostConcealment !== undefined && {
      maximumHostConcealment: maximumHostConcealment,
    }),
  };
};

export const convertRequirements = function (
  xmlRequirements: WeaponAccessoryRequiredXmlType | undefined,
  name: string
): accessoryWeaponRequirementsType | undefined {
  if (typeof xmlRequirements === "undefined") {
    return undefined;
  }
  console.log(name);
  console.log("Requirements: " + JSON.stringify(xmlRequirements));
  let weaponRequirements: accessoryWeaponRequirementsType | undefined =
    undefined;
  // if (Object.hasOwn(xmlRequirements, "weapondetails")){  //typescript doesn't yet support the type narrowing for this
  if ("weapondetails" in xmlRequirements) {
    const weaponDetails = xmlRequirements.weapondetails;
    assert(weaponDetails);
    if (!("OR" in weaponDetails)) {
      weaponRequirements = convertWeaponDetails(weaponDetails);
    } else if ("OR" in weaponDetails) {
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
      const categories = Array.isArray(xmlRequirements.OR.category)
        ? xmlRequirements.OR.category
        : [xmlRequirements.OR.category];
      const skills = Array.isArray(xmlRequirements.OR.useskill)
        ? xmlRequirements.OR.useskill
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
      xmlRequirements.OR.weapondetails;
      const categories =
        xmlRequirements.OR.weapondetails.category !== undefined
          ? Array.isArray(xmlRequirements.OR.weapondetails.category)
            ? xmlRequirements.OR.weapondetails.category
            : [xmlRequirements.OR.weapondetails.category]
          : undefined;

      let parsedCategories: Array<
        firearmWeaponTypeEnum | projectileWeaponTypeEnum
      > = [];
      if (categories)
        parsedCategories = getCategories(categories, parsedCategories);

      const skills =
        xmlRequirements.OR.weapondetails.useskill !== undefined
          ? Array.isArray(xmlRequirements.OR.weapondetails.useskill)
            ? xmlRequirements.OR.weapondetails.useskill
            : [xmlRequirements.OR.weapondetails.useskill]
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
  console.log("Mounts: " + mounts);
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
