import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { StringOrNumberSchema } from "../common/ParserCommonDefines.js";
import Range from "../../grammar/range.ohm-bundle.js";
import type { RangeIncrementType } from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import {
  RangeListSchema,
  RangeSchema,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import { mathOperatorEnum, rangeEnum } from "@neon-codex/common/build/enums.js";
import { type } from "arktype";

const RangeXmlSchema = type({
  name: "string",
  min: "number",
  short: StringOrNumberSchema,
  medium: StringOrNumberSchema,
  long: StringOrNumberSchema,
  extreme: StringOrNumberSchema,
});
const RangeListXmlSchema = type(RangeXmlSchema.array());
type RangeXmlType = typeof RangeXmlSchema.infer;

const semantics = Range.createSemantics();
semantics.addOperation("eval", {
  Range_multiply(recursive, _, range) {
    return recursive
      .eval()
      .concat([{ operator: mathOperatorEnum.Multiply }], range.eval());
  },
  Range_divide(recursive, _, range) {
    return recursive
      .eval()
      .concat([{ operator: mathOperatorEnum.Divide }], range.eval());
  },
  RangeValue(range) {
    return [range.eval()];
  },
  Strength(_) {
    return { option: rangeEnum.Strength };
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

export function ParseRanges() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/ranges.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  const jObj: any = parser.parse(xml_string);
  const rangeListParsed = RangeListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.ranges.range
  );

  if (rangeListParsed instanceof type.errors) {
    console.log(rangeListParsed.summary);
    assert(false);
  } else {
    console.log("ranges.xml initial arktype parsed");
  }

  const rangeList = rangeListParsed;

  const rangeListConverted = rangeList.map((range: RangeXmlType) => {
    const convertedRange = convertRange(range);
    const check = RangeSchema(convertedRange);
    if (check instanceof type.errors) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.dir(convertedRange, { depth: Infinity });
      throw new Error(check.summary);
    }
    return check;
  });
  // console.log(rangeListConverted);
  const check = RangeListSchema(rangeListConverted);
  if (check instanceof type.errors) {
    throw new Error(check.summary);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/ranges.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(rangeListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertRange(range: RangeXmlType) {
  let minList: RangeIncrementType = semantics(
    Range.match(range.min.toString())
  ).eval();
  let shortList: RangeIncrementType = semantics(
    Range.match(range.short.toString())
  ).eval();
  let mediumList: RangeIncrementType = semantics(
    Range.match(range.medium.toString())
  ).eval();
  let longList: RangeIncrementType = semantics(
    Range.match(range.long.toString())
  ).eval();
  let extremeList: RangeIncrementType = semantics(
    Range.match(range.extreme.toString())
  ).eval();

  return {
    name: range.name,
    min: minList,
    short: shortList,
    medium: mediumList,
    long: longList,
    extreme: extremeList,
  };
}
