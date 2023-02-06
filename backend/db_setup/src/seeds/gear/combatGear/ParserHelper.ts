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
  blastTypeEnum,
  damageAnnotationEnum,
  damageCalculationOptionEnum,
  damageTypeEnum,
} from "@shadowrun/common/src/enums.js";
import assert from "assert";
import {
  AccuracyXmlType,
  DamageXmlType,
  weaponSubtypeXmlEnum,
  WeaponXmlType,
} from "./ParserSchema.js";
import {
  DamageAmountType,
  DamageSubtypeType,
  DamageType,
} from "@shadowrun/common/src/schemas/weaponSchemas.js";

export const convertAccuracy = function (
  accuracy: AccuracyXmlType,
  name: string
): AccuracyType {
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
        accuracyArray = convertCharacter(character, accuracyArray);
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
        accuracyArray = convertCharacter(character, accuracyArray);
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
  if (typeof damage === "number") {
    return {
      damageAmount: [damage],
      type: damageTypeEnum.None,
      annotation: undefined,
      blast: undefined,
    };
  } else {
    let damageType: damageTypeEnum = damageTypeEnum.None;
    let damageAnnotation: damageAnnotationEnum | undefined;
    let damageList: Array<
      | { operator: mathOperatorEnum }
      | string
      | number
      | { option: damageCalculationOptionEnum }
      | DamageSubtypeType
    > = [];
    Array.from(damage).forEach((character) => {
      damageList = convertCharacter(
        character,
        damageList as Array<{ operator: mathOperatorEnum } | number>
      );
    });
    damageList = convertSpecial(damageList, "Grenade");
    damageList = convertSpecial(damageList, "As Drug/Toxin");
    damageList = convertSpecial(damageList, "Missile");
    damageList = convertSpecial(damageList, "As Pepper Punch");
    damageList = convertSpecial(damageList, "{STR}");
    damageList = convertSpecial(damageList, "MAG");
    // get damage type
    let typeTemp = getDamageType(damageList, damageType, "Special");
    typeTemp = getDamageType(typeTemp.damageList, typeTemp.damageType, "S");
    typeTemp = getDamageType(typeTemp.damageList, typeTemp.damageType, "P");
    damageType = typeTemp.damageType;
    damageList = typeTemp.damageList;
    // get damage annotation
    let annotTemp = getDamageAnnotation(damageList, damageAnnotation, "(fire)");
    annotTemp = getDamageAnnotation(damageList, damageAnnotation, "(f)");
    annotTemp = getDamageAnnotation(
      annotTemp.damageList,
      annotTemp.damageAnnotation,
      "(e)"
    );
    if (annotTemp.damageAnnotation)
      damageAnnotation = annotTemp.damageAnnotation;
    damageList = annotTemp.damageList;
    // get damage annotation
    const blastTemp = getDamageBlast(damageList);
    damageList = blastTemp.damageList;
    const blast = blastTemp.blast;
    // get subnumber calculations
    damageList = getSubnumbers(damageList);
    // remove unneeded
    damageList = removeUnneededCharacters(damageList);
    // confirm we converted all strings into valid types
    damageList.forEach((damageItem, index) => {
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
      // console.log(damageList)
      assert(
        check,
        `Weapon name: ${name}, list length: ${damageList.length}, failed item: ${damageItem} at index: ${index}`
      );
    });
    return {
      damageAmount: damageList as DamageAmountType,
      type: damageType,
      annotation: damageAnnotation,
      blast: blast,
    };
  }
};

export const convertArmourPenetration = function () {
  return 0;
};

export const convertSpecial = function (
  damageList: Array<
    | string
    | number
    | { option: damageCalculationOptionEnum }
    | { operator: mathOperatorEnum }
    | DamageSubtypeType
  >,
  replaceString: string
) {
  for (let i = 0; i < damageList.length; i++) {
    const damageSplit = damageList[i];
    if (
      typeof damageSplit === "string" &&
      damageSplit.indexOf(replaceString) !== -1
    ) {
      const index = damageSplit.indexOf(replaceString);
      const length = replaceString.length;
      let insertLocation = i;
      // TODO: is this right?
      if (index > 0) {
        damageList[i] = damageSplit.slice(0, index);
        insertLocation = i + 1;
      } else {
        damageList.splice(i, 1);
      }
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
      } else {
        assert("Special string not replaced!");
      }
      if (damageList.length > 1) {
        damageList.splice(insertLocation, 0, {
          option: option,
        });
      } else {
        damageList[0] = {
          option: option,
        };
      }
      if (index + length < damageSplit.length) {
        damageList.splice(
          insertLocation + 1,
          0,
          damageSplit.slice(index + length)
        );
      }
    }
  }
  return damageList;
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
    const regexRadius = new RegExp("(.*m Radius)");
    const regexReducing = new RegExp("(-./m)");
    if (damageItem.search(regexRadius) > 0) {
      const radius = damageItem.split(regexRadius)[1];
      const radiusValue = parseInt(radius.split(/(\d)/)[1]);
      damageList[i] = damageItem.replace(regexRadius, "");
      blastType = {
        type: blastTypeEnum.Radius,
        value: radiusValue,
      };
    } else if (damageItem.search(regexReducing) > 0) {
      const reducing = damageItem.split(regexReducing)[1];
      const reducingValue = parseInt(reducing.split(/(\d)/)[1]);
      damageList[i] = damageItem.replace(regexReducing, "");
      blastType = {
        type: blastTypeEnum.Reducing,
        value: reducingValue,
      };
    }
    return { damageList: damageList, blastType: blastType };
  }
  return { damageList: damageList, blast: undefined };
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

const removeUnneededCharacters = function (
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
    if (typeof damageItem === "string") {
      if (damageItem.indexOf("(") !== -1) {
        damageList = removeStringFromArray(damageItem, "(", damageList, i);
        i--;
      } else if (damageItem.indexOf(")") !== -1) {
        damageList = removeStringFromArray(damageItem, ")", damageList, i);
        i--;
      }
    }
  }
  // remove whitespace
  return damageList.filter((damageItem) => {
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
      weaponSubtype = firearmWeaponTypeEnum.Laser;
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
      weaponSubtype = firearmWeaponTypeEnum.WeaponAttachment;
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
      weaponSubtype = firearmWeaponTypeEnum.BioWeapon;
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

const convertCharacter = function (
  character: string,
  digitArray: Array<{ operator: mathOperatorEnum } | number | string>
) {
  const lastIndex = digitArray.length - 1;
  if (!isNaN(parseInt(character))) {
    // if last character was also a number concat the 2 numbers
    if (typeof digitArray[lastIndex] === "number") {
      digitArray[lastIndex] = parseInt(
        `${digitArray[lastIndex] as number}${character}`
      );
    } else {
      digitArray.push(parseInt(character));
    }
  } else {
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
    } else if (character === ">") {
      digitArray.push(">");
    } else if (
      `${digitArray[lastIndex] as string}${character}` ===
      mathOperatorEnum.GreaterThan
    ) {
      digitArray[lastIndex] = { operator: mathOperatorEnum.GreaterThan };
    }
    // no divide in weapons
    else {
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
        if (lastIndex >= 0)
          digitArray[lastIndex] = `${
            digitArray[lastIndex] as string
          }${character}`;
        else digitArray.push(character);
      }
    }
  }
  return digitArray;
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

const removeStringFromArray = function (
  damageItem: string,
  replaceString: string,
  damageList: (
    | string
    | number
    | { option: damageCalculationOptionEnum }
    | { operator: mathOperatorEnum }
    | DamageSubtypeType
  )[],
  i: number
) {
  damageItem = damageItem.trim();
  const index = damageItem.indexOf(replaceString);
  const length = replaceString.length;
  if (damageItem.length > 1) {
    if (index > 0) {
      damageList[i] = damageItem.slice(0, index);
    } else {
      damageList.splice(i, 1);
    }
  } else {
    damageList.splice(i, 1);
  }
  if (damageItem.slice(index + length).length > 0)
    damageList.push(damageItem.slice(index + length));
  return damageList;
};
