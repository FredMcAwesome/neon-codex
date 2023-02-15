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
  gearXmlCategoryEnum,
  reloadMethodEnum,
  restrictionEnum,
} from "@shadowrun/common/src/enums.js";
import assert from "assert";
import {
  MountXmlType,
  AccessoryType,
  AccessoryXmlType,
  AccuracyXmlType,
  DamageXmlType,
  weaponSubtypeXmlEnum,
  WeaponXmlType,
} from "./WeaponParserSchema.js";
import {
  DamageAmountType,
  DamageSubtypeType,
  DamageType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";

export const convertAccuracy = function (
  accuracy: AccuracyXmlType,
  name: string
): AccuracyType {
  console.log("Accuracy: " + accuracy.toString());
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
    assert("Invalid Accuracy String");
    return [];
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
  console.log("Damage: " + damage.toString());
  if (typeof damage === "number") {
    return [
      {
        damageAmount: [damage],
        type: damageTypeEnum.None,
        annotation: undefined,
        blast: undefined,
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

    let conversionInfo = convertSpecial(genericList, "Grenade");
    conversionInfo = convertSpecial(
      conversionInfo.propertyList,
      "As Drug/Toxin"
    );
    conversionInfo = convertSpecial(conversionInfo.propertyList, "Missile");
    conversionInfo = convertSpecial(
      conversionInfo.propertyList,
      "As Pepper Punch"
    );
    conversionInfo = convertSpecial(conversionInfo.propertyList, "{STR}");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "MAG");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "Chemical");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "Rating");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "Torpedo");
    conversionInfo = convertSpecial(
      conversionInfo.propertyList,
      "as Narcoject"
    );
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
        assert("Special string not replaced!");
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
      const blast = blastTemp.blast;
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
        annotation: damageAnnotation,
        blast: blast,
      });
    });
    return damageFinalList;
  }
};

export const convertArmourPenetration = function (
  armourPenetration: number | string,
  name: string
) {
  console.log("Armour Penetration: " + armourPenetration.toString());
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

    let conversionInfo = convertSpecial(genericList, "Rating");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "Grenade");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "Missile");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "Special");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "{MAG}");
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
      } else if (replaceString === "{MAG}}") {
        option = armourPenetrationEnum.Magic;
      } else if (replaceString === "As Drug/Toxin") {
        option = armourPenetrationEnum.DrugToxin;
      } else {
        assert("Special string not replaced!");
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
    return armourPenetrationList;
  }
};

export const convertMode = function (mode: number | string, name: string) {
  console.log("Mode: " + mode.toString());
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

    let conversionInfo = convertSpecial(genericList, "SA");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "BF");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "FA");
    conversionInfo = convertSpecial(conversionInfo.propertyList, "SS");
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
        assert("Special string not replaced!");
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
  console.log("Recoil Compensation: " + recoilCompensation.toString());
  if (recoilCompensation === "-") {
    return 0;
  } else {
    return recoilCompensation;
  }
};

export const convertAmmo = function (ammo: number | string, name: string) {
  console.log("Ammo: " + ammo.toString());
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
    const ammoList: Array<{
      capacity: number | undefined;
      numberOfAmmunitionHolders: number | undefined;
      reloadMethod: reloadMethodEnum;
    }> = [];
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
) {
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

    const conversionInfo = convertSpecial(genericList, "{Rating}");
    availabilitySpecialList = conversionInfo.propertyList;
    let locationCounter = 0;
    conversionInfo.insertLocationList.forEach((insertLocation) => {
      const replaceString = insertLocation.value;
      let option: availabilityTypeEnum = availabilityTypeEnum.Rating;
      if (replaceString === "{Rating}") {
        option = availabilityTypeEnum.Rating;
      } else {
        assert("Special string not replaced!");
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
      console.log(availabilitySpecialList);
      assert(
        check,
        `Weapon name: ${name}, list length: ${availabilitySpecialList.length}, failed item: ${availabilityItem} at index: ${index}`
      );
    });
    return { rating: availabilitySpecialList, restriction: restriction };
  }
};

export const convertCost = function (cost: number | string, name: string) {
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

    const conversionInfo = convertSpecial(genericList, "{Rating}");
    costList = conversionInfo.propertyList;
    let locationCounter = 0;
    conversionInfo.insertLocationList.forEach((insertLocation) => {
      const replaceString = insertLocation.value;
      let option: costTypeEnum = costTypeEnum.Rating;
      if (replaceString === "{Rating}") {
        option = costTypeEnum.Rating;
      } else {
        assert("Special string not replaced!");
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
      console.log(costList);
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
  xmlAccessoryMountUndefined:
    | { mount: Array<MountXmlType> | MountXmlType }
    | undefined
) {
  if (!xmlAccessoryMountUndefined) {
    return undefined;
  }

  return Array.isArray(xmlAccessoryMountUndefined.mount)
    ? xmlAccessoryMountUndefined.mount
    : [xmlAccessoryMountUndefined.mount];
};

export const convertAllowGear = function (
  xmlAllowGear: { gearcategory: string | Array<string> } | undefined,
  name: string
) {
  if (!xmlAllowGear) {
    return undefined;
  }
  const gearCategories = Array.isArray(xmlAllowGear.gearcategory)
    ? xmlAllowGear.gearcategory
    : [xmlAllowGear.gearcategory];
  return gearCategories.map((gearCategory) =>
    convertGearCategory(gearCategory, `weapon.name: ${name}`)
  );
};

export const convertGearCategory = function (
  category: string,
  otherMessage: string
) {
  switch (category) {
    case "Alchemical Tools":
      return { option: gearXmlCategoryEnum.AlchemicalTools };
    case "Ammunition":
      return { option: gearXmlCategoryEnum.Ammunition };
    case "Armor Enhancements":
      return { option: gearXmlCategoryEnum.ArmorEnhancements };
    case "Audio Devices":
      return { option: gearXmlCategoryEnum.AudioDevices };
    case "Audio Enhancements":
      return { option: gearXmlCategoryEnum.AudioEnhancements };
    case "Autosofts":
      return { option: gearXmlCategoryEnum.Autosofts };
    case "Biotech":
      return { option: gearXmlCategoryEnum.Biotech };
    case "Breaking and Entering Gear":
      return { option: gearXmlCategoryEnum.BreakingAndEnteringGear };
    case "BTLs":
      return { option: gearXmlCategoryEnum.BTLs };
    case "Chemicals":
      return { option: gearXmlCategoryEnum.Chemicals };
    case "Commlinks":
      return { option: gearXmlCategoryEnum.Commlinks };
    case "Commlink/Cyberdeck Form Factors":
      return { option: gearXmlCategoryEnum.Commlink_CyberdeckFormFactors };
    case "Commlink Accessories":
      return { option: gearXmlCategoryEnum.CommlinkAccessories };
    case "Commlink Apps":
      return { option: gearXmlCategoryEnum.CommlinkApps };
    case "Common Programs":
      return { option: gearXmlCategoryEnum.CommonPrograms };
    case "Communications and Countermeasures":
      return { option: gearXmlCategoryEnum.CommunicationsAndCountermeasures };
    case "Contracts/Upkeep":
      return { option: gearXmlCategoryEnum.Contracts_Upkeep };
    case "Critter Gear":
      return { option: gearXmlCategoryEnum.CritterGear };
    case "Currency":
      return { option: gearXmlCategoryEnum.Currency };
    case "Custom":
      return { option: gearXmlCategoryEnum.Custom };
    case "Custom Cyberdeck Attributes":
      return { option: gearXmlCategoryEnum.CustomCyberdeckAttributes };
    case "Custom Drug":
      return { option: gearXmlCategoryEnum.CustomDrug };
    case "Cyberdeck Modules":
      return { option: gearXmlCategoryEnum.CyberdeckModules };
    case "Cyberdecks":
      return { option: gearXmlCategoryEnum.Cyberdecks };
    case "Cyberterminals":
      return { option: gearXmlCategoryEnum.Cyberterminals };
    case "Disguises":
      return { option: gearXmlCategoryEnum.Disguises };
    case "Drugs":
      return { option: gearXmlCategoryEnum.Drugs };
    case "Electronics Accessories":
      return { option: gearXmlCategoryEnum.ElectronicsAccessories };
    case "Electronic Modification":
      return { option: gearXmlCategoryEnum.ElectronicModification };
    case "Electronic Parts":
      return { option: gearXmlCategoryEnum.ElectronicParts };
    case "Entertainment":
      return { option: gearXmlCategoryEnum.Entertainment };
    case "Explosives":
      return { option: gearXmlCategoryEnum.Explosives };
    case "Extraction Devices":
      return { option: gearXmlCategoryEnum.ExtractionDevices };
    case "Foci":
      return { option: gearXmlCategoryEnum.Foci };
    case "Food":
      return { option: gearXmlCategoryEnum.Food };
    case "Formulae":
      return { option: gearXmlCategoryEnum.Formulae };
    case "Grapple Gun":
      return { option: gearXmlCategoryEnum.GrappleGun };
    case "Hacking Programs":
      return { option: gearXmlCategoryEnum.HackingPrograms };
    case "Housewares":
      return { option: gearXmlCategoryEnum.Housewares };
    case "ID/Credsticks":
      return { option: gearXmlCategoryEnum.ID_Credsticks };
    case "Magical Compounds":
      return { option: gearXmlCategoryEnum.MagicalCompounds };
    case "Magical Supplies":
      return { option: gearXmlCategoryEnum.MagicalSupplies };
    case "Metatype-Specific":
      return { option: gearXmlCategoryEnum.MetatypeSpecific };
    case "Miscellany":
      return { option: gearXmlCategoryEnum.Miscellany };
    case "Musical Instruments":
      return { option: gearXmlCategoryEnum.MusicalInstruments };
    case "Nanogear":
      return { option: gearXmlCategoryEnum.Nanogear };
    case "Paydata":
      return { option: gearXmlCategoryEnum.Paydata };
    case "PI-Tac":
      return { option: gearXmlCategoryEnum.PiTac };
    case "Printing":
      return { option: gearXmlCategoryEnum.Printing };
    case "Reporter Gear":
      return { option: gearXmlCategoryEnum.ReporterGear };
    case "RFID Tags":
      return { option: gearXmlCategoryEnum.RFIDTags };
    case "Rigger Command Consoles":
      return { option: gearXmlCategoryEnum.RiggerCommandConsoles };
    case "Security Devices":
      return { option: gearXmlCategoryEnum.SecurityDevices };
    case "Sensors":
      return { option: gearXmlCategoryEnum.Sensors };
    case "Sensor Functions":
      return { option: gearXmlCategoryEnum.SensorFunctions };
    case "Sensor Housings":
      return { option: gearXmlCategoryEnum.SensorHousings };
    case "Services":
      return { option: gearXmlCategoryEnum.Services };
    case "Skillsofts":
      return { option: gearXmlCategoryEnum.Skillsofts };
    case "Software":
      return { option: gearXmlCategoryEnum.Software };
    case "Software Tweaks":
      return { option: gearXmlCategoryEnum.SoftwareTweaks };
    case "Survival Gear":
      return { option: gearXmlCategoryEnum.SurvivalGear };
    case "Tailored Perfume/Cologne":
      return { option: gearXmlCategoryEnum.TailoredPerfume_Cologne };
    case "Tools":
      return { option: gearXmlCategoryEnum.Tools };
    case "Tools of the Trade":
      return { option: gearXmlCategoryEnum.ToolsOfTheTrade };
    case "Toxins":
      return { option: gearXmlCategoryEnum.Toxins };
    case "Vision Devices":
      return { option: gearXmlCategoryEnum.VisionDevices };
    case "Vision Enhancements":
      return { option: gearXmlCategoryEnum.VisionEnhancements };
    case "Matrix Accessories":
      return { option: gearXmlCategoryEnum.MatrixAccessories };
    case "Booster Chips":
      return { option: gearXmlCategoryEnum.BoosterChips };
    case "Appearance Modification":
      return { option: gearXmlCategoryEnum.AppearanceModification };
    case "Drug Grades":
      return { option: gearXmlCategoryEnum.DrugGrades };
  }
  assert(false, `Category not found ${category}, ${otherMessage}`);
};

export const convertSpecial = function <Type>(
  propertyList: Array<Type | string | number>,
  replaceString: string
) {
  const insertLocationList: Array<{ value: string; location: number }> = [];
  for (let i = 0; i < propertyList.length; i++) {
    const stringSplit = propertyList[i];
    if (
      typeof stringSplit === "string" &&
      stringSplit.indexOf(replaceString) !== -1
    ) {
      const index = stringSplit.indexOf(replaceString);
      const length = replaceString.length;
      let insertLocation = i;
      if (index > 0) {
        propertyList[i] = stringSplit.slice(0, index);
        insertLocation++;
      } else {
        propertyList.splice(i, 1);
      }
      if (index + length < stringSplit.length) {
        propertyList.splice(
          insertLocation,
          0,
          stringSplit.slice(index + length)
        );
      }
      insertLocationList.push({
        value: replaceString,
        location: insertLocation,
      });
    }
  }
  return { propertyList: propertyList, insertLocationList: insertLocationList };
};

export const getSplit = function <Type>(
  propertyList: Array<Type | string | number>,
  replaceString: string
) {
  const splitList: Array<number> = [];
  for (let i = 0; i < propertyList.length; i++) {
    const stringSplit = propertyList[i];
    if (
      typeof stringSplit === "string" &&
      stringSplit.indexOf(replaceString) !== -1
    ) {
      const index = stringSplit.indexOf(replaceString);
      // avoid /m as used in blast calculation
      if (propertyList.length > i) {
        const nextItem = propertyList[i + 1];
        if (typeof nextItem === "string" && nextItem.indexOf("m") >= 0)
          continue;
      }
      if (stringSplit.substring(index + 1, index + 2) === "m") continue;
      const length = replaceString.length;
      let splitIndex = i;
      if (index > 0) {
        propertyList[i] = stringSplit.slice(0, index);
        splitIndex++;
      } else {
        propertyList.splice(i, 1);
      }
      if (index + length < stringSplit.length) {
        propertyList.splice(splitIndex, 0, stringSplit.slice(index + length));
      }
      splitList.push(splitIndex);
    }
  }
  return { propertyList: propertyList, splitList: splitList };
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
  return { damageList: damageList, blast: undefined };
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
  let reloadAtEndOfString: boolean = false;
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
  const conversionInfo = convertSpecial(capacityList.capacity, "x");
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
          assert(`Subnumber element not processed: ${typeof damageSplit}`);
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

const parseCharacter = function (
  character: string,
  digitArray: Array<{ operator: mathOperatorEnum } | number | string>,
  simpleDivide: boolean
) {
  const parsedNumber = parseNumber(character, digitArray);
  digitArray = parsedNumber.digitArray;
  let lastIndex = digitArray.length - 1;
  if (digitArray[lastIndex] === "/" && character !== "/") {
    // restore / if not a divide
    if (typeof digitArray[lastIndex - 1] !== "number") {
      digitArray[lastIndex - 1] = `${digitArray[lastIndex - 1] as string}${
        digitArray[lastIndex] as string
      }`;
      digitArray.splice(lastIndex, 1);
      lastIndex = digitArray.length - 1;
    }
  }
  if (!parsedNumber.numberFound) {
    if (
      charcterIsOperator(character) &&
      charcterIsOperator(digitArray[lastIndex])
    ) {
      assert("Two Operators in a row!");
    }
    if (character === mathOperatorEnum.Add) {
      digitArray.push({ operator: mathOperatorEnum.Add });
    } else if (character === mathOperatorEnum.Subtract) {
      digitArray.push({ operator: mathOperatorEnum.Subtract });
    } else if (character === mathOperatorEnum.Multiply) {
      digitArray.push({ operator: mathOperatorEnum.Multiply });
    } else if (`${digitArray[lastIndex] as string}${character}` === "//") {
      digitArray[lastIndex] = { operator: mathOperatorEnum.Divide };
    } else if (character === "/") {
      if (simpleDivide) digitArray.push({ operator: mathOperatorEnum.Divide });
      else digitArray.push("/");
    } else if (
      `${digitArray[lastIndex] as string}${character}` ===
      mathOperatorEnum.GreaterThan
    ) {
      digitArray[lastIndex] = { operator: mathOperatorEnum.GreaterThan };
    } else if (character === ">") {
      digitArray.push(">");
    } else {
      if (
        charcterIsOperator(
          digitArray[lastIndex] as
            | { operator: mathOperatorEnum }
            | number
            | string
        ) ||
        typeof digitArray[lastIndex] === "number"
      ) {
        digitArray.push(character);
      } else {
        if (lastIndex >= 0) {
          digitArray[lastIndex] = `${
            digitArray[lastIndex] as string
          }${character}`;
        } else {
          digitArray.push(character);
        }
      }
    }
  }
  return digitArray;
};

const parseNumber = function <Type>(
  character: string,
  digitArray: Array<Type | number | string>
) {
  let numberFound = true;
  const lastIndex = digitArray.length - 1;
  if (!isNaN(parseInt(character))) {
    // if last character was also a number concat the 2 numbers
    if (typeof digitArray[lastIndex] === "number") {
      digitArray[lastIndex] = parseFloat(
        `${digitArray[lastIndex] as number}${character}`
      );
    } else if (digitArray[lastIndex] === ".") {
      digitArray[lastIndex - 1] = parseFloat(
        `${digitArray[lastIndex - 1] as number}.${character}`
      );
      digitArray.splice(lastIndex, 1);
    } else {
      digitArray.push(parseInt(character));
    }
  } else if (character === ".") {
    assert(
      typeof digitArray[lastIndex] === "number",
      "Last character was not a number, cannot be float."
    );
    digitArray.push(".");
  } else if (digitArray[lastIndex] === ".") {
    assert(
      false,
      "Last character was not a decimal point, this is not a character."
    );
  } else {
    numberFound = false;
  }
  return { digitArray, numberFound };
};

const charcterIsOperator = function (
  character: { operator: mathOperatorEnum } | number | string
) {
  if (typeof character === "object" && character.operator) {
    return true;
  } else if (character === mathOperatorEnum.Add) {
    return true;
  } else if (character === mathOperatorEnum.Subtract) {
    return true;
  } else if (character === mathOperatorEnum.Divide) {
    return true;
  } else if (character === mathOperatorEnum.Multiply) {
    return true;
  } else {
    return false;
  }
};

const removeStringFromArray = function <Type>(
  currentItem: string,
  removeString: string,
  itemList: Array<Type | string>,
  i: number
): Array<Type | string> {
  currentItem = currentItem.trim();
  const index = currentItem.indexOf(removeString);
  const length = removeString.length;
  if (currentItem.length > 1) {
    if (index > 0) {
      itemList[i] = currentItem.slice(0, index);
    } else {
      itemList.splice(i, 1);
    }
  } else {
    itemList.splice(i, 1);
  }
  if (currentItem.slice(index + length).length > 0)
    itemList.push(currentItem.slice(index + length));
  return itemList;
};
