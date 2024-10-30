/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertDuration, convertSource } from "../common/ParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import {
  ComplexFormListXmlSchema,
  type ComplexFormXmlType,
} from "./ComplexFormParserSchemas.js";
import { ComplexFormSchema } from "@neon-codex/common/build/schemas/abilities/talent/complexFormSchemas.js";
import ComplexForms from "../../grammar/complexForms.ohm-bundle.js";
const FadingValue = ComplexForms.FadingValue;

export function ParseComplexForms() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/complexforms.xml"
    ),
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
  //   jObj.chummer.complexforms.complexform[37]
  // );

  const complexFormListParsed = ComplexFormListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.complexforms.complexform
  );

  if (complexFormListParsed.success)
    console.log("complexforms.xml initial zod parsed");
  else {
    console.log(complexFormListParsed.error.errors[0]);
    assert(false);
  }

  const complexFormList = complexFormListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const complexFormListConverted = complexFormList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((complexForm) => {
      const convertedComplexForm = convertComplexForm(complexForm);
      const check = ComplexFormSchema.safeParse(convertedComplexForm);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedComplexForm, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(complexFormListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/complexForms.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(complexFormListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertComplexForm(complexForm: ComplexFormXmlType) {
  // console.log(`\n${complexForm.name}`);

  const duration = convertDuration(complexForm.duration);

  const match = FadingValue.match(complexForm.fv);
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const fadingValue = fadingValueSemantics(match).eval();

  const bonus =
    complexForm.bonus !== undefined
      ? convertXmlBonus(complexForm.bonus)
      : undefined;
  const requirements =
    complexForm.required !== undefined
      ? convertRequirements(complexForm.required)
      : undefined;
  const source = convertSource(complexForm.source);

  return {
    name: complexForm.name,
    description: "",
    target: complexForm.target,
    duration: duration,
    fadingValue: fadingValue,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    source: source,
    page: complexForm.page,
  };
}

const fadingValueSemantics = FadingValue.createSemantics();
fadingValueSemantics.addOperation("eval", {
  Exp(fadingValue) {
    return fadingValue.eval();
  },
  FadingValue_add(_, fadingValue) {
    return parseInt(fadingValue.sourceString);
  },
  FadingValue_minus(_, fadingValue) {
    return parseInt(fadingValue.sourceString);
  },
  FadingValue_base(_) {
    return 0;
  },
  Special(_) {
    return { option: "Special" };
  },
});
