/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import {
  SourceXmlSchema,
  StringOrNumberSchema,
} from "../common/ParserCommonDefines.js";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import {
  ProgramSchema,
  type AvailabilityProgramType,
  type CostProgramType,
} from "@neon-codex/common/build/schemas/abilities/talent/programSchemas.js";
import Programs from "../../grammar/programs.ohm-bundle.js";
import {
  availabilityProgramSemantics,
  costProgramSemantics,
} from "./ProgramParserHelper.js";
import { type } from "arktype";
const Availability = Programs.Availability;
const Cost = Programs.Cost;

const ProgramXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  category: "string",
  "rating?": "number",
  "minrating?": "number",
  avail: StringOrNumberSchema,
  cost: StringOrNumberSchema,
  "bonus?": BonusXmlSchema,
  "required?": RequiredXmlSchema,
  source: type.or(SourceXmlSchema, "2050"),
  page: "number",
});
type ProgramXmlType = typeof ProgramXmlSchema.infer;
export const ProgramListXmlSchema = type(ProgramXmlSchema.array());

export function ParsePrograms() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/programs.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jObj: any = parser.parse(xml_string);
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.programs.program[37]
  // );

  const programListParsed = ProgramListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.programs.program
  );

  if (programListParsed instanceof type.errors) {
    console.log(programListParsed.summary);
    assert(false);
  } else {
    console.log("programs.xml initial arktype parsed");
  }

  const programList = programListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const programListConverted = programList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((program) => {
      const convertedProgram = convertProgram(program);
      const check = ProgramSchema(convertedProgram);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedProgram, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
  // console.log(programListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/programs.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(programListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertProgram(program: ProgramXmlType) {
  // console.log(`\n${program.name}`);

  const rating =
    program.rating === undefined
      ? undefined
      : {
          maxRating: program.rating,
          minRating: program.minrating || 0,
        };

  let match = Availability.match(program.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability: AvailabilityProgramType =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    availabilityProgramSemantics(match).eval();
  match = Cost.match(program.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const cost: CostProgramType = costProgramSemantics(match).eval();

  const bonus =
    program.bonus !== undefined ? convertXmlBonus(program.bonus) : undefined;
  const requirements =
    program.required !== undefined
      ? convertRequirements(program.required)
      : undefined;
  const source = convertSource(program.source);

  return {
    name: program.name,
    description: "",
    category: program.category,
    ...(rating !== undefined && { rating: rating }),
    availability: availability,
    cost: cost,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    source: source,
    page: program.page,
  };
}
