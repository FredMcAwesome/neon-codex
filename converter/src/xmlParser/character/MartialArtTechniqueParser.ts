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
  MartialArtTechniqueListSchema,
  MartialArtTechniqueSchema,
} from "@neon-codex/common/build/schemas/abilities/martialArtSchemas.js";
import { RequiredXmlSchema } from "../common/RequiredParserSchemas.js";
import { convertSource } from "../common/ParserHelper.js";

const MartialArtTechniqueXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    bonus: zod.optional(BonusXmlSchema),
    required: zod.optional(RequiredXmlSchema),
    source: zod.nativeEnum(sourceBookXmlEnum),
    page: zod.number(),
  })
  .strict();
type MartialArtTechniqueXmlType = zod.infer<
  typeof MartialArtTechniqueXmlSchema
>;

export const MartialArtTechniqueListXmlSchema = zod.array(
  MartialArtTechniqueXmlSchema
);

export function ParseMartialArtTechniques() {
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
  //   jObj.chummer.techniques.technique[51]
  // );
  const martialArtTechniqueListParsed =
    MartialArtTechniqueListXmlSchema.safeParse(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      jObj.chummer.techniques.technique
    );

  if (martialArtTechniqueListParsed.success)
    console.log("martialarts (techniques).xml initial zod parsed");
  else {
    console.log(martialArtTechniqueListParsed.error.errors[0]);
    assert(false);
  }

  const martialArtTechniqueList = martialArtTechniqueListParsed.data;
  const martialArtTechniqueListConverted = martialArtTechniqueList.map(
    (technique: MartialArtTechniqueXmlType) => {
      const convertedMartialArtTechnique =
        convertMartialArtTechnique(technique);
      const check = MartialArtTechniqueSchema.safeParse(
        convertedMartialArtTechnique
      );
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedMartialArtTechnique);
        throw new Error(check.error.message);
      }
      return convertedMartialArtTechnique;
    }
  );
  // console.log(qualityListConverted);
  const check = MartialArtTechniqueListSchema.safeParse(
    martialArtTechniqueListConverted
  );
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) +
      "../../../../jsonFiles/martialArtTechniques.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(martialArtTechniqueListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertMartialArtTechnique = function (
  xmlMartialArtTechnique: MartialArtTechniqueXmlType
) {
  let bonus;

  if (xmlMartialArtTechnique.bonus !== undefined) {
    bonus = convertXmlBonus(xmlMartialArtTechnique.bonus);
  }

  return {
    // id: xmlMartialArt.id,
    name: xmlMartialArtTechnique.name,
    ...(bonus !== undefined && { bonus: bonus }),
    source: convertSource(xmlMartialArtTechnique.source),
    page: xmlMartialArtTechnique.page,
    description: "",
  };
};
