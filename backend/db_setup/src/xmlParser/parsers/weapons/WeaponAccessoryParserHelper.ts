import {
  mathOperatorEnum,
  firearmAccessoryMountLocationEnum,
} from "@shadowrun/common";
import { ammoOptionEnum, ammoSourceEnum } from "@shadowrun/common/src/enums.js";
import {
  AmmoInformationType,
  weaponRequirementsType,
  weaponRestrictionsType,
} from "@shadowrun/common/src/schemas/weaponAccessorySchema.js";
import assert from "assert";
import equal from "fast-deep-equal";
import { parseCharacter, convertSpecial } from "../ParserHelper.js";
import {
  WeaponAccessoryRequiredXmlType,
  WeaponAccessoryForbiddenXmlType,
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
      if (ammoCapacityList.length > 1) {
        ammoCapacityList.splice(insertLocation.location + locationCounter, 0, {
          operator: operator,
        });
      } else {
        ammoCapacityList[0] = { operator: operator };
      }
      locationCounter++;
    } else if (replaceString === "Weapon") {
      const option = ammoOptionEnum.Weapon;
      if (ammoCapacityList.length > 1) {
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
  if (typeof ammoReplace === "number")
    return { ammoCount: ammoReplace, ammoSource: ammoSourceEnum.None };
  console.log(`Ammo Replace: ${ammoReplace}  ${name}`);
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
    if (ammoReplaceList.length > 1) {
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

export const convertRequirements = function (
  xmlRequirements: WeaponAccessoryRequiredXmlType | undefined,
  name: string
): weaponRequirementsType | undefined {
  // if (typeof xmlRequirements === "undefined") {
  console.log(`${xmlRequirements}  ${name}`);
  return undefined;
  // }
  // console.log("Requirements: " + JSON.stringify(xmlRequirements));
  // // if (Object.hasOwn(xmlRequirements, "weapondetails")){  //typescript doesn't yet support the type narrowing for this
  // if ("weapondetails" in xmlRequirements) {
  //   const weaponDetails = xmlRequirements.weapondetails;
  //   assert(weaponDetails);
  //   if ("name" in weaponDetails) {
  //     const weaponName = weaponDetails.name;
  //     const conceal = weaponDetails.conceal;
  //     if (weaponName && conceal !== undefined)
  //       assert(false, "only name or conceal should be defined");
  //     if (weaponName) {
  //       if (typeof weaponName === "object")
  //         return { weaponAllowed: weaponName.xmltext };
  //       else return { weaponAllowed: weaponName };
  //     } else if (conceal) {
  //       if (conceal._operation === "greaterthan")
  //         return { minimumHostConcealment: conceal.xmltext };
  //       else if (conceal._operation === "greaterthanorequals")
  //         return { minimumHostConcealment: conceal.xmltext - 1 };
  //       else return { maximumHostConcealment: conceal.xmltext };
  //     }
  //     assert(false, "neither name or conceal are defined for: " + name);
  //     return undefined;
  //   } else if ("OR" in weaponDetails) {
  //     return undefined;
  //   } else {
  //     assert(false);
  //     return undefined;
  //   }
  // } else if ("OR" in xmlRequirements) {
  //   if ("category" in xmlRequirements.OR) {
  //     const categories = Array.isArray(xmlRequirements.OR.category)
  //       ? xmlRequirements.OR.category
  //       : [xmlRequirements.OR.category];
  //     const skills = Array.isArray(xmlRequirements.OR.useskill)
  //       ? xmlRequirements.OR.useskill
  //       : [xmlRequirements.OR.useskill];
  //     // currently not using AND portion... should be handled by the skill fix
  //     // xmlRequirements.OR.AND
  //     return { categories: categories, skills: skills };
  //   } else {
  //     xmlRequirements.OR.weapondetails;
  //     const categories =
  //       xmlRequirements.OR.weapondetails.category !== undefined
  //         ? Array.isArray(xmlRequirements.OR.weapondetails.category)
  //           ? xmlRequirements.OR.weapondetails.category
  //           : [xmlRequirements.OR.weapondetails.category]
  //         : undefined;
  //     const skills =
  //       xmlRequirements.OR.weapondetails.useskill !== undefined
  //         ? Array.isArray(xmlRequirements.OR.weapondetails.useskill)
  //           ? xmlRequirements.OR.weapondetails.useskill
  //           : [xmlRequirements.OR.weapondetails.useskill]
  //         : undefined;
  //     // currently not using AND portion... should be handled by the skill fix
  //     // xmlRequirements.OR.AND
  //     const parsedCategories = categories
  //       ? categories?.map((category) => {
  //           if (typeof category === "object") {
  //             category = category.xmltext;
  //           }
  //           return category;
  //         })
  //       : undefined;
  //     return { categories: parsedCategories, skills: skills };
  //   }
  // } else {
  //   // if ("accessory" in xmlRequirements.oneof) {
  //   //   const accessories = Array.isArray(xmlRequirements.oneof.accessory)
  //   //     ? xmlRequirements.oneof.accessory
  //   //     : [xmlRequirements.oneof.accessory];
  //   //   return { requireAccessories: accessories };
  //   // } else {
  //   //   return {
  //   //     specialModificationLimit:
  //   //       xmlRequirements.oneof.specialmodificationlimit,
  //   //   };
  //   // }
  //   return undefined;
  // }
};

export const convertForbidden = function (
  xmlForbidden: WeaponAccessoryForbiddenXmlType | undefined,
  name: string
): weaponRestrictionsType | undefined {
  if (!xmlForbidden) {
    return undefined;
  }
  console.log("Forbidden" + xmlForbidden.toString() + " " + name);
  // if (Object.hasOwn(xmlForbidden, "weapondetails")){  //typescript doesn't yet support the type narrowing for this
  if ("weapondetails" in xmlForbidden) {
    assert(xmlForbidden.weapondetails !== undefined);
    if ("OR" in xmlForbidden.weapondetails) {
      const accessories = Array.isArray(xmlForbidden.weapondetails.OR)
        ? xmlForbidden.weapondetails.OR
        : [xmlForbidden.weapondetails.OR];
      const details = accessories[0];
      // TODO: implement these
      // if (details.ammo) {
      // }
      // if (details.ammocategory) {
      // }
      // if (details.category) {
      // }
      // if (details.name) {
      // }
      // if (details.spec) {
      // }
      // if (details.spec2) {
      // }
      let conceal = undefined;
      if (details.conceal) {
        if (details.conceal._operation === "greaterthan")
          conceal = { minimumHostConcealment: details.conceal.xmltext };
        else if (details.conceal._operation === "greaterthanorequals")
          conceal = { minimumHostConcealment: details.conceal.xmltext - 1 };
        else conceal = { maximumHostConcealment: details.conceal.xmltext };
      }
      let skills = undefined;
      if (details.useskill) {
        skills = { skills: [details.useskill] };
      }

      const OrFinal = {
        ...(conceal && conceal),
        ...(skills && skills),
      };
      if (equal(OrFinal, {})) return undefined;
      else return OrFinal;
    } else {
      if (xmlForbidden.weapondetails.name)
        return { weaponsForbidden: [xmlForbidden.weapondetails.name] };
      else if (xmlForbidden.weapondetails.type) {
        return { weaponsForbidden: [xmlForbidden.weapondetails.type] };
      } else {
        return undefined;
      }
    }
  } else {
    assert(xmlForbidden.oneof !== undefined);
    const accessories = Array.isArray(xmlForbidden.oneof.accessory)
      ? xmlForbidden.oneof.accessory
      : [xmlForbidden.oneof.accessory];
    return { requireAccessories: accessories };
  }
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
