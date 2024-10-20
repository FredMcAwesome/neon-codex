import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { z as zod } from "zod";
import { BonusXmlSchema } from "../common/BonusParserSchemas.js";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import {
  MartialArtListSchema,
  MartialArtSchema,
} from "@neon-codex/common/build/schemas/abilities/martialArtSchemas.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";

const MartialArtXmlSchema = zod.union([
  zod
    .object({
      id: zod.string(),
      name: zod.string(),
      cost: zod.optional(zod.number()),
      bonus: zod.optional(BonusXmlSchema),
      required: zod.optional(RequiredXmlSchema),
      techniques: zod
        .object({
          technique: zod.array(
            zod
              .object({
                name: zod.string(),
              })
              .strict()
          ),
        })
        .strict(),
      source: zod.nativeEnum(sourceBookXmlEnum),
      page: zod.number(),
    })
    .strict(),
  zod
    .object({
      id: zod.string(),
      name: zod.string(),
      isquality: zod.literal("True"),
      alltechniques: zod.literal(""),
      source: zod.nativeEnum(sourceBookXmlEnum),
      page: zod.number(),
    })
    .strict(),
]);
type MartialArtXmlType = zod.infer<typeof MartialArtXmlSchema>;

export const MartialArtListXmlSchema = zod.array(MartialArtXmlSchema);

export function ParseMartialArts() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/martialarts.xml"
    ),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  const jObj: any = parser.parse(xml_string);

  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.martialarts.martialart[51]
  // );
  const martialArtListParsed = MartialArtListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.martialarts.martialart
  );

  if (martialArtListParsed.success)
    console.log("martialarts.xml initial zod parsed");
  else {
    console.log(martialArtListParsed.error.errors[0]);
    assert(false);
  }

  const martialArtList = martialArtListParsed.data;
  const martialArtListConverted = martialArtList.map(
    (martialArt: MartialArtXmlType) => {
      const convertedMartialArt = convertMartialArt(martialArt);
      const check = MartialArtSchema.safeParse(convertedMartialArt);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedMartialArt);
        throw new Error(check.error.message);
      }
      return convertedMartialArt;
    }
  );
  // console.log(qualityListConverted);
  const check = MartialArtListSchema.safeParse(martialArtListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/martialArts.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(martialArtListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertMartialArt = function (xmlMartialArt: MartialArtXmlType) {
  let bonus;
  let techniqueList;
  let requirements;
  let karmaCost;
  if ("techniques" in xmlMartialArt) {
    techniqueList = xmlMartialArt.techniques.technique.map((technique) => {
      return technique.name;
    });
    if (xmlMartialArt.bonus !== undefined) {
      bonus = convertXmlBonus(xmlMartialArt.bonus);
    }
    if (xmlMartialArt.required !== undefined) {
      requirements = convertRequirements(xmlMartialArt.required);
    }
    if (xmlMartialArt.cost !== undefined) {
      karmaCost = xmlMartialArt.cost;
    }
  } else {
    techniqueList = {
      allTechniques: true as const,
    };
  }

  return {
    // id: xmlMartialArt.id,
    name: xmlMartialArt.name,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(karmaCost !== undefined && { karmaCost: karmaCost }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(techniqueList !== undefined && { techniqueList: techniqueList }),
    source: convertSource(xmlMartialArt.source),
    page: xmlMartialArt.page,
    description: "",
  };
};
