import { mathOperatorEnum } from "@shadowrun/common";
import { standardCalculationEnum } from "@shadowrun/common/src/enums.js";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z as zod } from "zod";
import { xmlStandardMapping } from "../../utils/xmlData.js";
import { convertStringToOperatorsAndOptions } from "../ParserHelper.js";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const convertRange = function (range: RangeXmlType) {
  let short, medium, long, extreme: GenericArrayXmlParsingType;
  if (typeof range.short == "number") {
    short = [range.short];
  } else {
    short = convertStringToOperatorsAndOptions<standardCalculationEnum>(
      range.short,
      xmlStandardMapping
    );
  }
  if (typeof range.medium == "number") {
    medium = [range.medium];
  } else {
    medium = convertStringToOperatorsAndOptions<standardCalculationEnum>(
      range.medium,
      xmlStandardMapping
    );
  }
  if (typeof range.long == "number") {
    long = [range.long];
  } else {
    long = convertStringToOperatorsAndOptions<standardCalculationEnum>(
      range.long,
      xmlStandardMapping
    );
  }
  if (typeof range.extreme == "number") {
    extreme = [range.extreme];
  } else {
    extreme = convertStringToOperatorsAndOptions<standardCalculationEnum>(
      range.extreme,
      xmlStandardMapping
    );
  }
  return {
    name: range.name,
    min: range.min,
    short: short,
    medium: medium,
    long: long,
    extreme: extreme,
  };
};

const RangeXmlSchema = zod
  .object({
    name: zod.string(),
    min: zod.number(),
    short: zod.union([zod.number(), zod.string()]),
    medium: zod.union([zod.number(), zod.string()]),
    long: zod.union([zod.number(), zod.string()]),
    extreme: zod.union([zod.number(), zod.string()]),
  })
  .strict();
const RangeListXmlSchema = zod.array(RangeXmlSchema);
type RangeXmlType = zod.infer<typeof RangeXmlSchema>;

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../../xmls/ranges.xml"),
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

// console.log(jObj.chummer.weapons.weapon[356]);
if (rangeListParsed.success) console.log("all g");
else {
  console.log(rangeListParsed.error.errors[0]);
}

if (rangeListParsed.success) {
  const rangeList = rangeListParsed.data;

  const rangeListConverted = rangeList.map((range: RangeXmlType) => {
    return convertRange(range);
  });
  console.log(rangeListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../seeds/gear/combatGear/range.json"
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
