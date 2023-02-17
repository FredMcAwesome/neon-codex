import equal from "fast-deep-equal";
import {
  AccuracyType,
  mathOperatorEnum,
  weaponTypeEnum,
  meleeWeaponTypeEnum,
  projectileWeaponTypeEnum,
  firearmWeaponTypeEnum,
  explosiveTypeEnum,
  BlastType,
  AvailabilityType,
} from "@shadowrun/common";
import {
  accuracyTypeEnum,
  armourPenetrationEnum,
  availabilityTypeEnum,
  blastTypeEnum,
  costTypeEnum,
  damageAnnotationEnum,
  damageCalculationOptionEnum,
  damageTypeEnum,
  firearmModeEnum,
  gearCategoryEnum,
  reloadMethodEnum,
  restrictionEnum,
} from "@shadowrun/common/src/enums.js";
import assert from "assert";
import {
  AccessoryXmlType,
  AccuracyXmlType,
  DamageXmlType,
  weaponSubtypeXmlEnum,
  WeaponXmlType,
  RequiredXmlType,
  WeaponSubtypeXmlType,
} from "./WeaponParserSchema.js";
import {
  AccessoryType,
  AmmunitionType,
  ArmourPenetrationType,
  DamageAmountType,
  DamageSubtypeType,
  DamageType,
  MountType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";
import {
  convertSpecial,
  getSplit,
  parseCharacter,
  parseNumber,
  removeStringFromArray,
} from "../ParserHelper.js";
import { GearCalculationType } from "@shadowrun/common/src/schemas/commonSchema.js";

export const convertAccuracy = function (
  accuracy: AccuracyXmlType,
  name: string
): AccuracyType {
  // console.log("Accuracy: " + accuracy.toString());
  let accuracyFinalArray: Array<
    { operator: mathOperatorEnum } | number | { option: accuracyTypeEnum }
  > = [];
  if (typeof accuracy === "number") {
    return [accuracy];
  } else if (accuracy.length >= 8 && accuracy.substring(0, 8) === "Physical") {
    if (accuracy.length === 8) {
      accuracyFinalArray = [{ option: accuracyTypeEnum.Physical }];
    } else {
      let accuracyArray: Array<
        { operator: mathOperatorEnum } | number | string
      > = [];
      Array.from(accuracy.substring(8)).forEach((character) => {
        accuracyArray = parseCharacter(character, accuracyArray, false);
      });
      accuracyFinalArray = [
        { option: accuracyTypeEnum.Physical },
        ...(accuracyArray as Array<
          { operator: mathOperatorEnum } | number | { option: accuracyTypeEnum }
        >),
      ];
    }
  } else if (accuracy.length >= 7 && accuracy.substring(0, 7) === "Missile") {
    if (accuracy.length === 7) {
      accuracyFinalArray = [{ option: accuracyTypeEnum.Missile }];
    } else {
      let accuracyArray: Array<
        { operator: mathOperatorEnum } | number | string
      > = [];
      Array.from(accuracy.substring(7)).forEach((character) => {
        accuracyArray = parseCharacter(character, accuracyArray, false);
      });
      return [
        { option: accuracyTypeEnum.Missile },
        ...(accuracyArray as Array<
          { operator: mathOperatorEnum } | number | { option: accuracyTypeEnum }
        >),
      ];
    }
  } else {
    assert(false, "Invalid Accuracy String");
  }
  // confirm we converted all strings into valid types
  accuracyFinalArray.forEach((accuracyItem, index) => {
    let check = false;
    if (typeof accuracyItem === "number") {
      check = true;
    } else {
      Object.values(accuracyTypeEnum).forEach((option) => {
        if (equal(accuracyItem, { option: option })) check = true;
      });
      Object.values(mathOperatorEnum).forEach((operator) => {
        if (equal(accuracyItem, { operator: operator })) check = true;
      });
    }
    // console.log(accuracyFinalArray);
    assert(
      check,
      `Weapon name: ${name}, list length: ${accuracyFinalArray.length}, failed item: ${accuracyItem} at index: ${index}`
    );
  });
  return accuracyFinalArray;
};

export const convertDamage = function (
  damage: DamageXmlType,
  name: string
): DamageType {
  // console.log("Damage: " + damage.toString());
  if (typeof damage === "number") {
    return [
      {
        damageAmount: [damage],
        type: damageTypeEnum.None,
      },
    ];
  } else {
    let damageSpecialList: Array<
      | { operator: mathOperatorEnum }
      | string
      | number
      | { option: damageCalculationOptionEnum }
      | DamageSubtypeType
    > = [];
    let genericList: Array<{ operator: mathOperatorEnum } | string | number> =
      [];
    Array.from(damage).forEach((character) => {
      genericList = parseCharacter(character, genericList, false);
    });

    let conversionInfo = convertSpecial(
      { propertyList: genericList, insertLocationList: [] },
      "Grenade"
    );
    conversionInfo = convertSpecial(conversionInfo, "As Drug/Toxin");
    conversionInfo = convertSpecial(conversionInfo, "Missile");
    conversionInfo = convertSpecial(conversionInfo, "As Pepper Punch");
    conversionInfo = convertSpecial(conversionInfo, "{STR}");
    conversionInfo = convertSpecial(conversionInfo, "MAG");
    conversionInfo = convertSpecial(conversionInfo, "Chemical");
    conversionInfo = convertSpecial(conversionInfo, "Rating");
    conversionInfo = convertSpecial(conversionInfo, "Torpedo");
    conversionInfo = convertSpecial(conversionInfo, "as Narcoject");
    damageSpecialList = conversionInfo.propertyList;
    let locationCounter = 0;
    conversionInfo.insertLocationList.forEach((insertLocation) => {
      const replaceString = insertLocation.value;
      let option: damageCalculationOptionEnum =
        damageCalculationOptionEnum.Strength;
      if (replaceString === "Grenade") {
        option = damageCalculationOptionEnum.Grenade;
      } else if (replaceString === "As Drug/Toxin") {
        option = damageCalculationOptionEnum.DrugToxin;
      } else if (replaceString === "Missile") {
        option = damageCalculationOptionEnum.Missile;
      } else if (replaceString === "As Pepper Punch") {
        option = damageCalculationOptionEnum.PepperPunch;
      } else if (replaceString === "{STR}") {
        option = damageCalculationOptionEnum.Strength;
      } else if (replaceString === "MAG") {
        option = damageCalculationOptionEnum.Magic;
      } else if (replaceString === "Chemical") {
        option = damageCalculationOptionEnum.Chemical;
      } else if (replaceString === "Rating") {
        option = damageCalculationOptionEnum.Rating;
      } else if (replaceString === "Torpedo") {
        option = damageCalculationOptionEnum.Torpedo;
      } else if (replaceString === "as Narcoject") {
        option = damageCalculationOptionEnum.Narcoject;
      } else {
        assert(false, "Special string not replaced!");
      }
      if (damageSpecialList.length > 1) {
        damageSpecialList.splice(insertLocation.location + locationCounter, 0, {
          option: option,
        });
      } else {
        damageSpecialList[0] = {
          option: option,
        };
      }
      locationCounter++;
    });

    // alternative damage types
    const tempList = getSplit(damageSpecialList, "/");
    assert(
      tempList.splitList.length < 2,
      "Need to add processing more than 1 split"
    );
    let damageList = [];
    const damageFinalList: DamageType = [];
    if (tempList.splitList.length > 0) {
      const firstList = damageSpecialList.splice(0, tempList.splitList[0]);
      damageList = [firstList, damageSpecialList];
    } else {
      damageList = [damageSpecialList];
    }

    damageList.forEach((damageSublist) => {
      let damageType: damageTypeEnum = damageTypeEnum.None;
      let damageAnnotation: damageAnnotationEnum | undefined;
      // get damage type
      let typeTemp = getDamageType(damageSublist, damageType, "Special");
      typeTemp = getDamageType(typeTemp.damageList, typeTemp.damageType, "S");
      typeTemp = getDamageType(typeTemp.damageList, typeTemp.damageType, "P");
      damageType = typeTemp.damageType;
      damageSublist = typeTemp.damageList;
      // get damage annotation
      let annotTemp = getDamageAnnotation(
        damageSublist,
        damageAnnotation,
        "(fire)"
      );
      annotTemp = getDamageAnnotation(damageSublist, damageAnnotation, "(f)");
      annotTemp = getDamageAnnotation(
        annotTemp.damageList,
        annotTemp.damageAnnotation,
        "(e)"
      );
      if (annotTemp.damageAnnotation)
        damageAnnotation = annotTemp.damageAnnotation;
      damageSublist = annotTemp.damageList;
      // get damage annotation
      const blastTemp = getDamageBlast(damageSublist);
      damageSublist = blastTemp.damageList;
      const blast = blastTemp.blastType;
      damageSublist = getSubnumbers(damageSublist);
      damageSublist = removeUnneededCharacters(damageSublist);

      // confirm we converted all strings into valid types
      damageSublist.forEach((damageItem, index) => {
        let check = false;
        if (typeof damageItem === "number") {
          check = true;
        } else {
          Object.values(damageCalculationOptionEnum).forEach((option) => {
            if (equal(damageItem, { option: option })) check = true;
          });
          Object.values(mathOperatorEnum).forEach((operator) => {
            if (equal(damageItem, { operator: operator })) check = true;
          });
        }
        // console.log(damageSublist);
        assert(
          check,
          `Weapon name: ${name}, list length: ${damageSublist.length}, failed item: ${damageItem} at index: ${index}`
        );
      });
      damageFinalList.push({
        damageAmount: damageSpecialList as DamageAmountType,
        type: damageType,
        ...(damageAnnotation && { annotation: damageAnnotation }),
        ...(blast && { blast: blast }),
      });
    });
    return damageFinalList;
  }
};

export const convertArmourPenetration = function (
  armourPenetration: number | string,
  name: string
) {
  // console.log("Armour Penetration: " + armourPenetration.toString());
  if (typeof armourPenetration === "number") {
    return [armourPenetration];
  } else {
    let armourPenetrationList: Array<
      | { operator: mathOperatorEnum }
      | string
      | number
      | { option: armourPenetrationEnum }
    > = [];
    let genericList: Array<{ operator: mathOperatorEnum } | string | number> =
      [];
    Array.from(armourPenetration).forEach((character) => {
      genericList = parseCharacter(character, genericList, true);
    });

    let conversionInfo = convertSpecial(
      { propertyList: genericList, insertLocationList: [] },
      "Rating"
    );
    conversionInfo = convertSpecial(conversionInfo, "Grenade");
    conversionInfo = convertSpecial(conversionInfo, "Missile");
    conversionInfo = convertSpecial(conversionInfo, "Special");
    conversionInfo = convertSpecial(conversionInfo, "{MAG}");
    armourPenetrationList = conversionInfo.propertyList;
    let locationCounter = 0;
    conversionInfo.insertLocationList.forEach((insertLocation) => {
      const replaceString = insertLocation.value;
      let option: armourPenetrationEnum = armourPenetrationEnum.Grenade;
      if (replaceString === "Grenade") {
        option = armourPenetrationEnum.Grenade;
      } else if (replaceString === "Rating") {
        option = armourPenetrationEnum.Rating;
      } else if (replaceString === "Missile") {
        option = armourPenetrationEnum.Missile;
      } else if (replaceString === "Special") {
        option = armourPenetrationEnum.Special;
      } else if (replaceString === "{MAG}") {
        option = armourPenetrationEnum.Magic;
      } else if (replaceString === "As Drug/Toxin") {
        option = armourPenetrationEnum.DrugToxin;
      } else {
        assert(false, "Special string not replaced!");
      }
      if (armourPenetrationList.length > 1) {
        armourPenetrationList.splice(
          insertLocation.location + locationCounter,
          0,
          {
            option: option,
          }
        );
      } else {
        armourPenetrationList[0] = {
          option: option,
        };
      }
      locationCounter++;
    });
    armourPenetrationList = removeUnneededCharacters(armourPenetrationList);
    armourPenetrationList.forEach((armourPentrationItem, index) => {
      let check = false;
      if (typeof armourPentrationItem === "number") {
        check = true;
      } else {
        Object.values(armourPenetrationEnum).forEach((option) => {
          if (equal(armourPentrationItem, { option: option })) check = true;
        });
        Object.values(mathOperatorEnum).forEach((operator) => {
          if (equal(armourPentrationItem, { operator: operator })) check = true;
        });
      }
      // console.log(armourPenetrationList);
      assert(
        check,
        `Weapon name: ${name}, list length: ${armourPenetrationList.length}, failed item: ${armourPentrationItem} at index: ${index}`
      );
    });
    return armourPenetrationList as ArmourPenetrationType;
  }
};

export const convertMode = function (mode: number | string, name: string) {
  // console.log("Mode: " + mode.toString());
  if (typeof mode === "number" || mode === "-") {
    return undefined;
  } else {
    let modeList: Array<
      | { operator: mathOperatorEnum }
      | string
      | number
      | { option: firearmModeEnum }
    > = [];
    const genericList: Array<string> = mode.split("/");

    let conversionInfo = convertSpecial(
      { propertyList: genericList, insertLocationList: [] },
      "SA"
    );
    conversionInfo = convertSpecial(conversionInfo, "BF");
    conversionInfo = convertSpecial(conversionInfo, "FA");
    conversionInfo = convertSpecial(conversionInfo, "SS");
    modeList = conversionInfo.propertyList;
    let locationCounter = 0;
    conversionInfo.insertLocationList.forEach((insertLocation) => {
      const replaceString = insertLocation.value;
      let option: firearmModeEnum = firearmModeEnum.BurstFire;
      if (replaceString === "SA") {
        option = firearmModeEnum.SemiAutomatic;
      } else if (replaceString === "BF") {
        option = firearmModeEnum.BurstFire;
      } else if (replaceString === "FA") {
        option = firearmModeEnum.FullAutomatic;
      } else if (replaceString === "SS") {
        option = firearmModeEnum.SingleShot;
      } else {
        assert(false, "Special string not replaced!");
      }
      if (modeList.length > 1) {
        modeList.splice(insertLocation.location + locationCounter, 0, {
          option: option,
        });
      } else {
        modeList[0] = {
          option: option,
        };
      }
      locationCounter++;
    });
    modeList.forEach((modeItem, index) => {
      let check = false;
      if (typeof modeItem === "number") {
        check = true;
      } else {
        Object.values(firearmModeEnum).forEach((option) => {
          if (equal(modeItem, { option: option })) check = true;
        });
        Object.values(mathOperatorEnum).forEach((operator) => {
          if (equal(modeItem, { operator: operator })) check = true;
        });
      }
      // console.log(modeItem);
      assert(
        check,
        `Weapon name: ${name}, list length: ${modeList.length}, failed item: ${modeItem} at index: ${index}`
      );
    });
    return modeList;
  }
};

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

export const convertAmmo = function (ammo: number | string, name: string) {
  // console.log("Ammo: " + ammo.toString());
  if (ammo === 0) {
    return undefined;
  } else if (typeof ammo === "number") {
    return [
      [
        {
          capacity: ammo,
          numberOfAmmunitionHolders: undefined,
          reloadMethod: reloadMethodEnum.None,
        },
      ],
    ];
  } else {
    // options split with '/' or 'or'
    const overallList: Array<string> = ammo.split(/\/|or/);
    const ammoList: AmmunitionType = [];
    overallList.forEach((ammoItem) => {
      let genericList: Array<string | number> = [];
      Array.from(ammoItem).forEach((character) => {
        genericList = parseNumber(character, genericList).digitArray;
      });
      const ammoParsingList = getAmmoType(genericList);
      ammoList.push(
        getNumberOfAmmunitionHolders(
          ammoParsingList.ammunition,
          ammoParsingList.reloadAtEndOfString
        )
      );
    });
    ammoList.forEach((ammoItem, index) => {
      let check = false;
      Object.values(reloadMethodEnum).forEach((option) => {
        if (equal(ammoItem.reloadMethod, option)) check = true;
      });
      // console.log(ammoItem);
      assert(
        check,
        `Weapon name: ${name}, list length: ${ammoList.length}, failed item: ${ammoItem} at index: ${index}`
      );
    });
    return ammoList;
  }
};

export const convertAvailability = function (
  availability: number | string,
  name: string
): AvailabilityType {
  // console.log("Availability: " + availability.toString());
  if (typeof availability === "number") {
    return { rating: [availability], restriction: restrictionEnum.Legal };
  } else {
    let availabilitySpecialList: Array<
      | { operator: mathOperatorEnum }
      | string
      | number
      | { option: availabilityTypeEnum }
    > = [];
    let restriction = restrictionEnum.Legal;
    let genericList: Array<{ operator: mathOperatorEnum } | string | number> =
      [];
    Array.from(availability).forEach((character) => {
      genericList = parseCharacter(character, genericList, false);
    });

    const conversionInfo = convertSpecial(
      { propertyList: genericList, insertLocationList: [] },
      "{Rating}"
    );
    availabilitySpecialList = conversionInfo.propertyList;
    let locationCounter = 0;
    conversionInfo.insertLocationList.forEach((insertLocation) => {
      const replaceString = insertLocation.value;
      let option: availabilityTypeEnum = availabilityTypeEnum.Rating;
      if (replaceString === "{Rating}") {
        option = availabilityTypeEnum.Rating;
      } else {
        assert(false, "Special string not replaced!");
      }
      if (availabilitySpecialList.length > 1) {
        availabilitySpecialList.splice(
          insertLocation.location + locationCounter,
          0,
          {
            option: option,
          }
        );
      } else {
        availabilitySpecialList[0] = {
          option: option,
        };
      }
      locationCounter++;
    });
    // get restriction
    let typeTemp = getAvailabilityRestriction(
      availabilitySpecialList,
      restriction,
      "R"
    );
    typeTemp = getAvailabilityRestriction(
      typeTemp.availabilityList,
      typeTemp.restrictionType,
      "F"
    );
    restriction = typeTemp.restrictionType;
    availabilitySpecialList = typeTemp.availabilityList;

    availabilitySpecialList = removeUnneededCharacters(availabilitySpecialList);

    // confirm we converted all strings into valid types
    availabilitySpecialList.forEach((availabilityItem, index) => {
      let check = false;
      if (typeof availabilityItem === "number") {
        check = true;
      } else {
        Object.values(availabilityTypeEnum).forEach((option) => {
          if (equal(availabilityItem, { option: option })) check = true;
        });
        Object.values(mathOperatorEnum).forEach((operator) => {
          if (equal(availabilityItem, { operator: operator })) check = true;
        });
      }
      // console.log(availabilitySpecialList);
      assert(
        check,
        `Weapon name: ${name}, list length: ${availabilitySpecialList.length}, failed item: ${availabilityItem} at index: ${index}`
      );
    });
    return {
      rating: availabilitySpecialList as GearCalculationType,
      restriction: restriction,
    };
  }
};

export const convertCost = function (cost: number | string, name: string) {
  // console.log("Cost: " + cost.toString());
  if (typeof cost === "number") {
    return [cost];
  } else {
    let costList: Array<
      | { operator: mathOperatorEnum }
      | string
      | number
      | { option: costTypeEnum }
    > = [];
    let genericList: Array<{ operator: mathOperatorEnum } | string | number> =
      [];
    Array.from(cost).forEach((character) => {
      genericList = parseCharacter(character, genericList, false);
    });

    const conversionInfo = convertSpecial(
      { propertyList: genericList, insertLocationList: [] },
      "{Rating}"
    );
    costList = conversionInfo.propertyList;
    let locationCounter = 0;
    conversionInfo.insertLocationList.forEach((insertLocation) => {
      const replaceString = insertLocation.value;
      let option: costTypeEnum = costTypeEnum.Rating;
      if (replaceString === "{Rating}") {
        option = costTypeEnum.Rating;
      } else {
        assert(false, "Special string not replaced!");
      }
      if (costList.length > 1) {
        costList.splice(insertLocation.location + locationCounter, 0, {
          option: option,
        });
      } else {
        costList[0] = {
          option: option,
        };
      }
      locationCounter++;
    });

    costList = removeUnneededCharacters(costList);

    // confirm we converted all strings into valid types
    costList.forEach((costItem, index) => {
      let check = false;
      if (typeof costItem === "number") {
        check = true;
      } else {
        Object.values(costTypeEnum).forEach((option) => {
          if (equal(costItem, { option: option })) check = true;
        });
        Object.values(mathOperatorEnum).forEach((operator) => {
          if (equal(costItem, { operator: operator })) check = true;
        });
      }
      // console.log(costList);
      assert(
        check,
        `Weapon name: ${name}, list length: ${costList.length}, failed item: ${costItem} at index: ${index}`
      );
    });
    return costList;
  }
};

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
    const accessory: AccessoryType = {
      name: xmlAccessory.name,
      mount: mount,
      rating: xmlAccessory.rating,
      gears: undefined,
    };
    if (xmlAccessory.gears) {
      const xmlUseGear = Array.isArray(xmlAccessory.gears.usegear)
        ? xmlAccessory.gears.usegear
        : [xmlAccessory.gears.usegear];
      accessory.gears = xmlUseGear.map((useGear) => {
        let category;
        if (useGear.category) {
          category = convertGearCategory(
            useGear.category,
            `weapon.name = ${name}`
          );
        }
        if (typeof useGear.name !== "string") {
          useGear.name = useGear.name.xmltext;
        }
        return {
          name: useGear.name,
          rating: useGear.rating,
          category: category,
        };
      });
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

export const convertRequirements = function (
  xmlRequirements: RequiredXmlType | undefined,
  name: string
) {
  if (!xmlRequirements) {
    return undefined;
  }
  // console.log("Requirements" + xmlRequirements.toString());
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
  } else {
    const categories = Array.isArray(xmlRequirements.OR.category)
      ? xmlRequirements.OR.category
      : [xmlRequirements.OR.category];
    const skills = Array.isArray(xmlRequirements.OR.useskill)
      ? xmlRequirements.OR.useskill
      : [xmlRequirements.OR.useskill];
    // currently not using AND portion... Not sure if we need it
    // xmlRequirements.OR.AND
    return { categories: categories, skills: skills };
  }
};

export const convertWeaponSkill = function (
  useSkill: string | undefined,
  category: WeaponSubtypeXmlType,
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

export const convertGearCategory = function (
  category: string,
  otherMessage: string
) {
  switch (category) {
    case "Alchemical Tools":
      return gearCategoryEnum.AlchemicalTools;
    case "Ammunition":
      return gearCategoryEnum.Ammunition;
    case "Armor Enhancements":
      return gearCategoryEnum.ArmorEnhancements;
    case "Audio Devices":
      return gearCategoryEnum.AudioDevices;
    case "Audio Enhancements":
      return gearCategoryEnum.AudioEnhancements;
    case "Autosofts":
      return gearCategoryEnum.Autosofts;
    case "Biotech":
      return gearCategoryEnum.Biotech;
    case "Breaking and Entering Gear":
      return gearCategoryEnum.BreakingAndEnteringGear;
    case "BTLs":
      return gearCategoryEnum.BTLs;
    case "Chemicals":
      return gearCategoryEnum.Chemicals;
    case "Commlinks":
      return gearCategoryEnum.Commlinks;
    case "Commlink/Cyberdeck Form Factors":
      return gearCategoryEnum.Commlink_CyberdeckFormFactors;
    case "Commlink Accessories":
      return gearCategoryEnum.CommlinkAccessories;
    case "Commlink Apps":
      return gearCategoryEnum.CommlinkApps;
    case "Common Programs":
      return gearCategoryEnum.CommonPrograms;
    case "Communications and Countermeasures":
      return gearCategoryEnum.CommunicationsAndCountermeasures;
    case "Contracts/Upkeep":
      return gearCategoryEnum.Contracts_Upkeep;
    case "Critter Gear":
      return gearCategoryEnum.CritterGear;
    case "Currency":
      return gearCategoryEnum.Currency;
    case "Custom":
      return gearCategoryEnum.Custom;
    case "Custom Cyberdeck Attributes":
      return gearCategoryEnum.CustomCyberdeckAttributes;
    case "Custom Drug":
      return gearCategoryEnum.CustomDrug;
    case "Cyberdeck Modules":
      return gearCategoryEnum.CyberdeckModules;
    case "Cyberdecks":
      return gearCategoryEnum.Cyberdecks;
    case "Cyberterminals":
      return gearCategoryEnum.Cyberterminals;
    case "Disguises":
      return gearCategoryEnum.Disguises;
    case "Drugs":
      return gearCategoryEnum.Drugs;
    case "Electronics Accessories":
      return gearCategoryEnum.ElectronicsAccessories;
    case "Electronic Modification":
      return gearCategoryEnum.ElectronicModification;
    case "Electronic Parts":
      return gearCategoryEnum.ElectronicParts;
    case "Entertainment":
      return gearCategoryEnum.Entertainment;
    case "Explosives":
      return gearCategoryEnum.Explosives;
    case "Extraction Devices":
      return gearCategoryEnum.ExtractionDevices;
    case "Foci":
      return gearCategoryEnum.Foci;
    case "Food":
      return gearCategoryEnum.Food;
    case "Formulae":
      return gearCategoryEnum.Formulae;
    case "Grapple Gun":
      return gearCategoryEnum.GrappleGun;
    case "Hacking Programs":
      return gearCategoryEnum.HackingPrograms;
    case "Housewares":
      return gearCategoryEnum.Housewares;
    case "ID/Credsticks":
      return gearCategoryEnum.ID_Credsticks;
    case "Magical Compounds":
      return gearCategoryEnum.MagicalCompounds;
    case "Magical Supplies":
      return gearCategoryEnum.MagicalSupplies;
    case "Metatype-Specific":
      return gearCategoryEnum.MetatypeSpecific;
    case "Miscellany":
      return gearCategoryEnum.Miscellany;
    case "Musical Instruments":
      return gearCategoryEnum.MusicalInstruments;
    case "Nanogear":
      return gearCategoryEnum.Nanogear;
    case "Paydata":
      return gearCategoryEnum.Paydata;
    case "PI-Tac":
      return gearCategoryEnum.PiTac;
    case "Printing":
      return gearCategoryEnum.Printing;
    case "Reporter Gear":
      return gearCategoryEnum.ReporterGear;
    case "RFID Tags":
      return gearCategoryEnum.RFIDTags;
    case "Rigger Command Consoles":
      return gearCategoryEnum.RiggerCommandConsoles;
    case "Security Devices":
      return gearCategoryEnum.SecurityDevices;
    case "Sensors":
      return gearCategoryEnum.Sensors;
    case "Sensor Functions":
      return gearCategoryEnum.SensorFunctions;
    case "Sensor Housings":
      return gearCategoryEnum.SensorHousings;
    case "Services":
      return gearCategoryEnum.Services;
    case "Skillsofts":
      return gearCategoryEnum.Skillsofts;
    case "Software":
      return gearCategoryEnum.Software;
    case "Software Tweaks":
      return gearCategoryEnum.SoftwareTweaks;
    case "Survival Gear":
      return gearCategoryEnum.SurvivalGear;
    case "Tailored Perfume/Cologne":
      return gearCategoryEnum.TailoredPerfume_Cologne;
    case "Tools":
      return gearCategoryEnum.Tools;
    case "Tools of the Trade":
      return gearCategoryEnum.ToolsOfTheTrade;
    case "Toxins":
      return gearCategoryEnum.Toxins;
    case "Vision Devices":
      return gearCategoryEnum.VisionDevices;
    case "Vision Enhancements":
      return gearCategoryEnum.VisionEnhancements;
    case "Matrix Accessories":
      return gearCategoryEnum.MatrixAccessories;
    case "Booster Chips":
      return gearCategoryEnum.BoosterChips;
    case "Appearance Modification":
      return gearCategoryEnum.AppearanceModification;
    case "Drug Grades":
      return gearCategoryEnum.DrugGrades;
  }
  assert(false, `Category not found ${category}, ${otherMessage}`);
};

const getDamageType = function (
  damageList: Array<
    | string
    | number
    | { option: damageCalculationOptionEnum }
    | { operator: mathOperatorEnum }
    | DamageSubtypeType
  >,
  damageType: damageTypeEnum,
  replaceString: string
) {
  if (damageType !== damageTypeEnum.None)
    return { damageList: damageList, damageType: damageType };
  for (let i = 0; i < damageList.length; i++) {
    const damageItem = damageList[i];
    if (typeof damageItem === "number" || typeof damageItem === "object") {
      continue;
    }
    if (damageItem.indexOf(replaceString) !== -1) {
      damageList = removeStringFromArray(
        damageItem,
        replaceString,
        damageList,
        i
      );
      if (replaceString === "Special")
        return { damageList: damageList, damageType: damageTypeEnum.None };
      else if (replaceString === "P")
        return { damageList: damageList, damageType: damageTypeEnum.Physical };
      else if (replaceString === "S")
        return { damageList: damageList, damageType: damageTypeEnum.Stun };
    }
  }
  return { damageList: damageList, damageType: damageTypeEnum.None };
};

const getDamageAnnotation = function (
  damageList: Array<
    | string
    | number
    | { option: damageCalculationOptionEnum }
    | { operator: mathOperatorEnum }
    | DamageSubtypeType
  >,
  damageAnnotation: damageAnnotationEnum | undefined,
  replaceString: string
) {
  if (damageAnnotation !== undefined)
    return { damageList: damageList, damageAnnotation: damageAnnotation };
  for (let i = 0; i < damageList.length; i++) {
    const damageItem = damageList[i];
    if (typeof damageItem === "number" || typeof damageItem === "object") {
      continue;
    }
    if (damageItem.indexOf(replaceString) !== -1) {
      damageList = removeStringFromArray(
        damageItem,
        replaceString,
        damageList,
        i
      );
      if (replaceString === "(fire)")
        return {
          damageList: damageList,
          damageAnnotation: damageAnnotationEnum.Fire,
        };
      else if (replaceString === "(f)")
        return {
          damageList: damageList,
          damageAnnotation: damageAnnotationEnum.Flechette,
        };
      else if (replaceString === "(e)")
        return {
          damageList: damageList,
          damageAnnotation: damageAnnotationEnum.Electrical,
        };
    }
  }
  return { damageList: damageList, damageAnnotation: undefined };
};

const getDamageBlast = function (
  damageList: Array<
    | string
    | number
    | { option: damageCalculationOptionEnum }
    | { operator: mathOperatorEnum }
    | DamageSubtypeType
  >
) {
  for (let i = 0; i < damageList.length; i++) {
    const damageItem = damageList[i];
    if (typeof damageItem === "number" || typeof damageItem === "object") {
      continue;
    }
    let blastType: BlastType | undefined;
    if (damageItem.indexOf("m Radius") !== -1) {
      const blastValue = damageList[i - 1];
      assert(typeof blastValue === "number");
      damageList.splice(i - 1, 3);
      blastType = {
        type: blastTypeEnum.Radius,
        value: blastValue,
      };
    } else if (damageItem.indexOf("m") !== -1) {
      const blastValue = damageList[i - 2];
      if (damageList[i - 1] !== "/") {
        break;
      }
      assert(typeof blastValue === "number");
      damageList.splice(i - 1, 2);
      blastType = {
        type: blastTypeEnum.Reducing,
        value: blastValue,
      };
    } else {
      continue;
    }
    return { damageList: damageList, blastType: blastType };
  }
  return { damageList: damageList, blastType: undefined };
};

const getAmmoType = function (capacityList: Array<string | number>): {
  ammunition: {
    capacity: Array<number | string>;
    numberOfAmmunitionHolders: number | undefined;
    reloadMethod: reloadMethodEnum;
  };
  reloadAtEndOfString: boolean;
} {
  const xmlReloadList = [
    "(b)",
    "(c)",
    "(d)",
    "(ml)",
    "(m)",
    "(cy)",
    "(belt)",
    "(tank)",
    "External Source",
  ];
  let reloadMethod: reloadMethodEnum = reloadMethodEnum.None;
  let reloadAtEndOfString = false;
  for (const replaceString of xmlReloadList) {
    for (let i = 0; i < capacityList.length; i++) {
      const ammoItem = capacityList[i];
      if (typeof ammoItem === "number" || typeof ammoItem === "object") {
        continue;
      }
      if (ammoItem.indexOf(replaceString) !== -1) {
        reloadAtEndOfString =
          ammoItem.indexOf(replaceString) === ammoItem.length - 1;
        capacityList = removeStringFromArray(
          ammoItem,
          replaceString,
          capacityList,
          i
        );
        if (replaceString === "(b)")
          reloadMethod = reloadMethodEnum.BreakAction;
        else if (replaceString === "(c)") reloadMethod = reloadMethodEnum.Clip;
        else if (replaceString === "(d)") reloadMethod = reloadMethodEnum.Drum;
        else if (replaceString === "(ml)")
          reloadMethod = reloadMethodEnum.MuzzleLoader;
        else if (replaceString === "(m)")
          reloadMethod = reloadMethodEnum.InternalMagazine;
        else if (replaceString === "(cy)")
          reloadMethod = reloadMethodEnum.Cylinder;
        else if (replaceString === "(belt)")
          reloadMethod = reloadMethodEnum.BeltFed;
        else if (replaceString === "(tank)")
          reloadMethod = reloadMethodEnum.Tank;
        else if (replaceString === "External Source")
          reloadMethod = reloadMethodEnum.External;
      }
    }
  }

  return {
    ammunition: {
      capacity: capacityList,
      numberOfAmmunitionHolders: undefined,
      reloadMethod: reloadMethod,
    },
    reloadAtEndOfString: reloadAtEndOfString,
  };
};

const getNumberOfAmmunitionHolders = function (
  capacityList: {
    capacity: Array<number | string>;
    numberOfAmmunitionHolders: number | undefined;
    reloadMethod: reloadMethodEnum;
  },
  reloadAtEndOfString: boolean
) {
  const conversionInfo = convertSpecial(
    { propertyList: capacityList.capacity, insertLocationList: [] },
    "x"
  );
  const numberList = conversionInfo.propertyList.map((item) => {
    assert(typeof item === "number");
    return item;
  });
  let ammunition: {
    capacity: number | undefined;
    numberOfAmmunitionHolders: number | undefined;
    reloadMethod: reloadMethodEnum;
  };
  // check if there are 2 ammunition holders
  if (conversionInfo.insertLocationList.length > 0) {
    assert(conversionInfo.insertLocationList.length == 1);
    assert(numberList.length == 2);
    const capacity = reloadAtEndOfString ? numberList[-1] : numberList[0];
    ammunition = {
      capacity: capacity,
      numberOfAmmunitionHolders: 2,
      reloadMethod: capacityList.reloadMethod,
    };
  } else {
    assert(numberList.length <= 1);
    if (numberList.length == 1) {
      ammunition = {
        capacity: numberList[0],
        numberOfAmmunitionHolders: 1,
        reloadMethod: capacityList.reloadMethod,
      };
    } else {
      ammunition = {
        capacity: undefined,
        numberOfAmmunitionHolders: undefined,
        reloadMethod: capacityList.reloadMethod,
      };
    }
  }
  return ammunition;
};

const getAvailabilityRestriction = function (
  availabilityList: Array<
    | string
    | number
    | { option: availabilityTypeEnum }
    | { operator: mathOperatorEnum }
  >,
  restrictionType: restrictionEnum,
  replaceString: string
) {
  if (restrictionType !== restrictionEnum.Legal)
    return {
      availabilityList: availabilityList,
      restrictionType: restrictionType,
    };
  for (let i = 0; i < availabilityList.length; i++) {
    const availabilityItem = availabilityList[i];
    if (
      typeof availabilityItem === "number" ||
      typeof availabilityItem === "object"
    ) {
      continue;
    }
    if (availabilityItem.indexOf(replaceString) !== -1) {
      availabilityList = removeStringFromArray(
        availabilityItem,
        replaceString,
        availabilityList,
        i
      );
      if (replaceString === "R")
        return {
          availabilityList: availabilityList,
          restrictionType: restrictionEnum.Restricted,
        };
      else if (replaceString === "F")
        return {
          availabilityList: availabilityList,
          restrictionType: restrictionEnum.Forbidden,
        };
    }
  }
  return {
    availabilityList: availabilityList,
    restrictionType: restrictionEnum.Legal,
  };
};

const getSubnumbers = function (
  damageList: Array<
    | string
    | number
    | { option: damageCalculationOptionEnum }
    | { operator: mathOperatorEnum }
    | DamageSubtypeType
  >
) {
  const replaceString = "number";
  // remove number and get index of first parenthesis
  for (let i = 0; i < damageList.length; i++) {
    const damageSplit = damageList[i];
    if (
      typeof damageSplit === "string" &&
      damageSplit.indexOf(replaceString) !== -1
    ) {
      const index = damageSplit.indexOf(replaceString);
      const length = replaceString.length;
      let insertLocation = i;
      if (index > 0) {
        damageList[i] = damageSplit.slice(0, index);
        insertLocation = i + 1;
      } else {
        damageList.splice(i, 1);
      }
      if (index + length < damageSplit.length) {
        damageList.splice(insertLocation, 0, damageSplit.slice(index + length));
        insertLocation++;
      }
      const damageSubnumbers: DamageSubtypeType = [];
      for (let j = insertLocation; j < damageList.length; j++) {
        const damageSplit = damageList[i];
        if (damageSplit === "(") continue;
        else if (damageSplit === ")") break;
        else if (
          typeof damageSplit !== "string" &&
          !Array.isArray(damageSplit)
        ) {
          damageSubnumbers.push(damageSplit);
          damageList.splice(i, 1);
          i--;
        } else {
          assert(
            false,
            `Subnumber element not processed: ${typeof damageSplit}`
          );
        }
      }
      if (damageSubnumbers.length > 0) {
        damageList.splice(insertLocation + 1, 0, damageSubnumbers);
        i = 0;
      }
    }
  }

  return damageList;
};

const removeUnneededCharacters = function <Type>(
  propertyList: Array<string | Type>
) {
  for (let i = 0; i < propertyList.length; i++) {
    const damageItem = propertyList[i];
    if (typeof damageItem === "string") {
      if (damageItem.indexOf("(") !== -1) {
        propertyList = removeStringFromArray(damageItem, "(", propertyList, i);
        i--;
      } else if (damageItem.indexOf(")") !== -1) {
        propertyList = removeStringFromArray(damageItem, ")", propertyList, i);
        i--;
      }
    }
  }
  // remove whitespace
  return propertyList.filter((damageItem) => {
    if (typeof damageItem !== "string") return true;
    return damageItem.trim() != "";
  });
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
    case weaponSubtypeXmlEnum.AssaultCannons:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.AssaultCannons;
      break;
    case weaponSubtypeXmlEnum.AssaultRifles:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.AssaultRifles;
      break;
    case weaponSubtypeXmlEnum.GrenadeLaunchers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.GrenadeLaunchers;
      break;
    case weaponSubtypeXmlEnum.LightMachineguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.LightMachineguns;
      break;
    case weaponSubtypeXmlEnum.SniperRifles:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.SniperRifles;
      break;
    case weaponSubtypeXmlEnum.Bows:
      weaponType = weaponTypeEnum.Projectile;
      weaponSubtype = projectileWeaponTypeEnum.Bows;
      break;
    case weaponSubtypeXmlEnum.Crossbows:
      weaponType = weaponTypeEnum.Projectile;
      weaponSubtype = projectileWeaponTypeEnum.Crossbows;
      break;
    case weaponSubtypeXmlEnum.ExoticRangedWeapons:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Exotic;
      break;
    case weaponSubtypeXmlEnum.Flamethrowers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Flamethrowers;
      break;
    case weaponSubtypeXmlEnum.Gear:
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
    case weaponSubtypeXmlEnum.HeavyMachineguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MediumHeavyMachineguns;
      break;
    case weaponSubtypeXmlEnum.HeavyPistols:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.HeavyPistols;
      break;
    case weaponSubtypeXmlEnum.Holduts:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.HoldOuts;
      break;
    case weaponSubtypeXmlEnum.LaserWeapons:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Lasers;
      break;
    case weaponSubtypeXmlEnum.LightPistols:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.LightPistols;
      break;
    case weaponSubtypeXmlEnum.MachinePistols:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MachinePistols;
      break;
    case weaponSubtypeXmlEnum.MediumMachineguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MediumHeavyMachineguns;
      break;
    case weaponSubtypeXmlEnum.MissileLaunchers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.MissileLaunchers;
      break;
    case weaponSubtypeXmlEnum.Shotguns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Shotguns;
      break;
    case weaponSubtypeXmlEnum.SportingRifles:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.SportingRifles;
      break;
    case weaponSubtypeXmlEnum.SubmachineGuns:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.SubmachineGuns;
      break;
    case weaponSubtypeXmlEnum.Tasers:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Tasers;
      break;
    case weaponSubtypeXmlEnum.UnderbarrelWeapons:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.WeaponAttachments;
      break;
    case weaponSubtypeXmlEnum.Cyberweapon:
      if (weapon.type === "Melee") {
        weaponType = weaponTypeEnum.Melee;
        weaponSubtype = meleeWeaponTypeEnum.Exotic;
      } else {
        weaponType = weaponTypeEnum.Firearm;
        weaponSubtype = firearmWeaponTypeEnum.Exotic;
      }
      break;
    case weaponSubtypeXmlEnum.BioWeapon:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.BioWeapons;
      break;
    case weaponSubtypeXmlEnum.Carbines:
      weaponType = weaponTypeEnum.Firearm;
      weaponSubtype = firearmWeaponTypeEnum.Carbines;
      break;
    // melee
    case weaponSubtypeXmlEnum.Blades:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Blades;
      break;
    case weaponSubtypeXmlEnum.Clubs:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Clubs;
      break;
    case weaponSubtypeXmlEnum.ExoticMeleeWeapons:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Exotic;
      break;
    case weaponSubtypeXmlEnum.ImprovisedWeapons:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Improvised;
      break;
    case weaponSubtypeXmlEnum.Unarmed:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.Unarmed;
      break;
    case weaponSubtypeXmlEnum.Quality:
      weaponType = weaponTypeEnum.Melee;
      weaponSubtype = meleeWeaponTypeEnum.MetagenicQuality;
      break;
  }
  return { weaponType, weaponSubtype };
};
