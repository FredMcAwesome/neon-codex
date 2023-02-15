import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z as zod } from "zod";
const RangeXmlSchema = zod
  .object({
    name: zod.string(),
    min: zod.number(),
    short: zod.string(),
    medium: zod.string(),
    long: zod.string(),
    extreme: zod.string(),
  })
  .strict();
type RangeXmlType = zod.infer<typeof RangeXmlSchema>;

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../xmls/ranges.xml"),
  "utf8"
);
const parser = new XMLParser();
const jObj: any = parser.parse(xml_string);
const rangeListParsed = RangeXmlSchema.safeParse(
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
}
