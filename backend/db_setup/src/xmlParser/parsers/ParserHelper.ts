import { mathOperatorEnum } from "@shadowrun/common";
import assert from "assert";

export const parseCharacter = function (
  character: string,
  digitArray: Array<{ operator: mathOperatorEnum } | number | string>,
  simpleDivide: boolean
) {
  const parsedNumber = parseNumber(character, digitArray);
  digitArray = parsedNumber.digitArray;
  let lastIndex = digitArray.length - 1;
  if (lastIndex >= 0 && digitArray[lastIndex] === "/" && character !== "/") {
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
    assert(
      lastIndex >= 0 ||
        !(
          charcterIsOperator(character) &&
          charcterIsOperator(digitArray[lastIndex])
        ),
      "Two Operators in a row!"
    );

    if (character === mathOperatorEnum.Add) {
      digitArray.push({ operator: mathOperatorEnum.Add });
    } else if (character === mathOperatorEnum.Subtract) {
      digitArray.push({ operator: mathOperatorEnum.Subtract });
    } else if (character === mathOperatorEnum.Multiply) {
      digitArray.push({ operator: mathOperatorEnum.Multiply });
    } else if (
      lastIndex >= 0 &&
      `${digitArray[lastIndex] as string}${character}` === "//"
    ) {
      digitArray[lastIndex] = { operator: mathOperatorEnum.Divide };
    } else if (character === "/") {
      if (simpleDivide) digitArray.push({ operator: mathOperatorEnum.Divide });
      else digitArray.push("/");
    } else if (
      lastIndex >= 0 &&
      `${digitArray[lastIndex] as string}${character}` ===
        mathOperatorEnum.GreaterThan
    ) {
      digitArray[lastIndex] = { operator: mathOperatorEnum.GreaterThan };
    } else if (character === ">") {
      digitArray.push(">");
    } else {
      if (
        (lastIndex >= 0 &&
          charcterIsOperator(
            digitArray[lastIndex] as
              | { operator: mathOperatorEnum }
              | number
              | string
          )) ||
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

export const parseNumber = function <Type>(
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

export const charcterIsOperator = function (
  character: { operator: mathOperatorEnum } | number | string
) {
  if (typeof character === "object" && character.operator) {
    console.log("dda");
    return true;
  } else if (character === mathOperatorEnum.Add) {
    console.log("asd");
    return true;
  } else if (character === mathOperatorEnum.Subtract) {
    console.log("cxca");
    return true;
  } else if (character === mathOperatorEnum.Divide) {
    console.log("ag");
    return true;
  } else if (character === mathOperatorEnum.Multiply) {
    console.log("da");
    return true;
  } else {
    return false;
  }
};

export const removeStringFromArray = function <Type>(
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

export const convertSpecial = function <Type>(
  conversionInfo: {
    propertyList: Array<Type | string | number>;
    insertLocationList: Array<{ value: string; location: number }>;
  },
  replaceString: string
) {
  const { propertyList, insertLocationList } = conversionInfo;
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

const convertToOption = function <Type>(
  propertyList: Array<
    { option: Type } | { operator: mathOperatorEnum } | string | number
  >,
  optionPair: {
    value: string;
    option: Type;
  }
) {
  for (let i = 0; i < propertyList.length; i++) {
    const stringSplit = propertyList[i];
    if (
      typeof stringSplit === "string" &&
      stringSplit.indexOf(optionPair.value) !== -1
    ) {
      const index = stringSplit.indexOf(optionPair.value);
      const length = optionPair.value.length;
      let insertLocation = i;
      if (index > 0) {
        propertyList[i] = stringSplit.slice(0, index);
        insertLocation++;
      } else {
        propertyList.splice(i, 1);
      }
      propertyList.splice(insertLocation, 0, { option: optionPair.option });
      if (index + length < stringSplit.length) {
        propertyList.splice(
          insertLocation,
          0,
          stringSplit.slice(index + length)
        );
      }
    }
  }
  return propertyList;
};

export const convertStringToOperatorsAndOptions = function <Type>(
  unparsedString: string,
  optionList: Array<{ value: string; option: Type }>
) {
  let genericList: Array<{ operator: mathOperatorEnum } | number | string> = [];
  Array.from(unparsedString).forEach((character) => {
    genericList = parseCharacter(character, genericList, false);
  });
  let propertyList: Array<
    { option: Type } | { operator: mathOperatorEnum } | number | string
  > = genericList;
  optionList.forEach((optionPair) => {
    propertyList = convertToOption<Type>(propertyList, optionPair);
  });
  return propertyList;
};
