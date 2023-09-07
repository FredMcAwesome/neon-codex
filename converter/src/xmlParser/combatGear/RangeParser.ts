import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z as zod } from "zod";
import { StringOrNumberSchema } from "../ParserCommonDefines.js";
import { mathOperatorEnum } from "@shadowrun/common";
import Range from "../../grammar/range.ohm-bundle.js";
import {
  RangeIncrementType,
  RangeListSchema,
  RangeSchema,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { rangeEnum } from "@shadowrun/common/build/enums.js";

const RangeXmlSchema = zod
  .object({
    name: zod.string(),
    min: zod.number(),
    short: StringOrNumberSchema,
    medium: StringOrNumberSchema,
    long: StringOrNumberSchema,
    extreme: StringOrNumberSchema,
  })
  .strict();
const RangeListXmlSchema = zod.array(RangeXmlSchema);
type RangeXmlType = zod.infer<typeof RangeXmlSchema>;

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
  const rangeListParsed = RangeListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.ranges.range
  );

  if (rangeListParsed.success) console.log("ranges.xml initial zod parsed");
  else {
    console.log(rangeListParsed.error.errors[0]);
    assert(false);
  }

  const rangeList = rangeListParsed.data;

  const rangeListConverted = rangeList.map((range: RangeXmlType) => {
    const convertedRange = convertRange(range);
    const check = RangeSchema.safeParse(convertedRange);
    if (!check.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      // console.log(convertedRange);
      throw new Error(check.error.message);
    }
    return convertedRange;
  });
  // console.log(rangeListConverted);
  const check = RangeListSchema.safeParse(rangeListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
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
