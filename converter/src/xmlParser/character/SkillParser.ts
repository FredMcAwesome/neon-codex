/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  mathOperatorEnum,
  skillCategoryEnum,
  sourceBookEnum,
  standardCalculationEnum,
} from "@neon-codex/common";
import { SkillListSchema, SkillSchema } from "@neon-codex/common";
import type { SkillType } from "@neon-codex/common";
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  attributeXMLEnum,
  StringArrayOrStringSchema,
} from "../common/ParserCommonDefines.js";
import { convertAttribute } from "../common/ParserHelper.js";
import { type } from "arktype";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const convertSkill = function (
  xmlSkill: SkillXmlType,
  isKnowledgeSkill: boolean
): SkillType {
  const attribute = convertAttribute(xmlSkill.attribute);

  return {
    // id: xmlSkill.id,
    name: xmlSkill.name,
    isKnowledgeSkill: isKnowledgeSkill,
    attribute: attribute,
    category: xmlSkill.category,
    default: xmlSkill.default == "True",
    exotic: xmlSkill.exotic == "True",
    ...(xmlSkill.skillgroup !== "" && { skillGroup: xmlSkill.skillgroup }),
    ...(xmlSkill.specs !== "" && {
      specialisations: Array.isArray(xmlSkill.specs.spec)
        ? xmlSkill.specs.spec
        : [xmlSkill.specs.spec],
    }),
    description: "",
    // TODO: fix this once all page numbers add to knowledge skills
    source: xmlSkill.source || sourceBookEnum.Shadowrun5,
    page: xmlSkill.page || 0,
  };
};

const SkillXmlSchema = type({
  "+": "reject",
  id: "string",
  name: "string",
  // Related attribute
  attribute: type.valueOf(attributeXMLEnum),
  // Category of skill
  category: type.valueOf(skillCategoryEnum),
  // Able to use this skill without ranks
  default: type.or("'True'", "'False'"),
  // This skill is for one specific exotic thing e.g. exotic weapon
  "exotic?": "'True'",
  // Skillgroup this belongs to "" for none
  skillgroup: "string",
  // Skills with these are related to the movement type
  "requiresgroundmovement?": "'True'",
  "requiresswimmovement?": "'True'",
  "requiresflymovement?": "'True'",
  // List of default specialisations, however custom ones are normally possible
  specs: type.or(
    type({ "+": "reject", spec: StringArrayOrStringSchema }),
    "''"
  ),
  // TODO: add these to knowledge skills in xml
  "source?": "string",
  "page?": "number",
});
export const SkillListXmlSchema = type(SkillXmlSchema.array());
type SkillXmlType = typeof SkillXmlSchema.infer;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jObj: any = parser.parse(xml_string);
  // console.log(jObj.chummer.skills.skill[18]);
  const skillListParsed = SkillListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.skills.skill
  );

  // console.log(jObj.chummer.skills.skill[356]);
  if (skillListParsed instanceof type.errors) {
    console.log(skillListParsed.summary);
    assert(false);
  } else {
    console.log("skills.xml (skills) initial arktype parsed");
  }

  const knowledgeSkillListParsed = SkillListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.knowledgeskills.skill
  );

  // console.log(jObj.chummer.skills.skill[356]);
  if (knowledgeSkillListParsed instanceof type.errors) {
    console.log(knowledgeSkillListParsed.summary);
    assert(false);
  } else {
    console.log("skills.xml (knowledge skills) initial arktype parsed");
  }

  const skillList = skillListParsed;
  const partialSkillListConverted = skillList.map((skill: SkillXmlType) => {
    const convertedSkill = convertSkill(skill, false);
    const check = SkillSchema(convertedSkill);
    if (check instanceof type.errors) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.dir(convertedSkill, { depth: Infinity });
      throw new Error(check.summary);
    }
    return convertedSkill;
  });
  const knowledgeSkillList = knowledgeSkillListParsed;
  const skillListConverted = partialSkillListConverted.concat(
    knowledgeSkillList.map((skill: SkillXmlType) => {
      const convertedSkill = convertSkill(skill, true);
      const check = SkillSchema(convertedSkill);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedSkill);
        throw new Error(check.summary);
      }
      return convertedSkill;
    })
  );
  // console.log(skillListConverted);
  const check = SkillListSchema(skillListConverted);
  if (check instanceof type.errors) {
    throw new Error(check.summary);
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
