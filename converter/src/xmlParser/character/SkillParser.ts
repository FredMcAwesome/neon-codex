import {
  mathOperatorEnum,
  skillCategoryEnum,
  standardCalculationEnum,
} from "@neon-codex/common/build/enums.js";
import {
  SkillListSchema,
  SkillSchema,
} from "@neon-codex/common/build/schemas/skillSchemas.js";
import type { SkillType } from "@neon-codex/common/build/schemas/skillSchemas.js";
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z as zod } from "zod";
import {
  attributeXMLEnum,
  StringArrayOrStringSchema,
} from "../common/ParserCommonDefines.js";
import { convertAttribute } from "../common/ParserHelper.js";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const convertSkill = function (xmlSkill: SkillXmlType): SkillType {
  const attribute = convertAttribute(xmlSkill.attribute);

  return {
    // id: xmlSkill.id,
    name: xmlSkill.name,
    attribute: attribute,
    category: xmlSkill.category,
    default: xmlSkill.default == "True",
    exotic: xmlSkill.exotic == "True",
    skillGroup: xmlSkill.skillgroup !== "" ? xmlSkill.skillgroup : undefined,
    specialisations:
      xmlSkill.specs !== ""
        ? Array.isArray(xmlSkill.specs.spec)
          ? xmlSkill.specs.spec
          : [xmlSkill.specs.spec]
        : undefined,
    description: "",
    source: xmlSkill.source,
    page: xmlSkill.page,
  };
};

const SkillXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    // Related attribute
    attribute: zod.nativeEnum(attributeXMLEnum),
    // Category of skill
    category: zod.nativeEnum(skillCategoryEnum),
    // Able to use this skill without ranks
    default: zod.union([zod.literal("True"), zod.literal("False")]),
    // This skill is for one specific exotic thing e.g. exotic weapon
    exotic: zod.optional(zod.literal("True")),
    // Skillgroup this belongs to "" for none
    skillgroup: zod.string(),
    // Skills with these are related to the movement type
    requiresgroundmovement: zod.optional(zod.literal("True")),
    requiresswimmovement: zod.optional(zod.literal("True")),
    requiresflymovement: zod.optional(zod.literal("True")),
    // List of default specialisations, however custom ones are normally possible
    specs: zod.union([
      zod
        .object({
          spec: StringArrayOrStringSchema,
        })
        .strict(),
      zod.literal(""),
    ]),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();
const SkillListXmlSchema = zod.array(SkillXmlSchema);
type SkillXmlType = zod.infer<typeof SkillXmlSchema>;

export function ParseSkills() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/skills.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  const jObj: any = parser.parse(xml_string);
  // console.log(jObj.chummer.skills.skill[18]);
  const skillListParsed = SkillListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.skills.skill
  );

  // console.log(jObj.chummer.skills.skill[356]);
  if (skillListParsed.success) console.log("skills.xml initial zod parsed");
  else {
    console.log(skillListParsed.error.errors[0]);
    assert(false);
  }

  const skillList = skillListParsed.data;
  const skillListConverted = skillList.map((skill: SkillXmlType) => {
    const convertedSkill = convertSkill(skill);
    const check = SkillSchema.safeParse(convertedSkill);
    if (!check.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(convertedSkill);
      throw new Error(check.error.message);
    }
    return convertedSkill;
  });
  // console.log(skillListConverted);
  const check = SkillListSchema.safeParse(skillListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/skills.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(skillListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}
