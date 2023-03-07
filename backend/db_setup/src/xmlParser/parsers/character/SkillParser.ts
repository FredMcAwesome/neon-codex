/* eslint-disable @typescript-eslint/no-unused-vars */
import { mathOperatorEnum } from "@shadowrun/common";
import {
  attributeTypeEnum,
  skillCategoryEnum,
  skillGroupEnum,
  standardCalculationEnum,
} from "@shadowrun/common/src/enums.js";
import type { SkillType } from "@shadowrun/common/src/schemas/skillSchema.js";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z as zod } from "zod";

export type GenericXmlParsingType =
  | { option: standardCalculationEnum }
  | { operator: mathOperatorEnum }
  | string
  | number;

export type GenericArrayXmlParsingType = Array<GenericXmlParsingType>;

const convertSkill = function (xmlSkill: SkillXmlType): SkillType {
  let attribute: attributeTypeEnum;
  switch (xmlSkill.attribute) {
    case "BOD":
      attribute = attributeTypeEnum.Body;
      break;
    case "AGI":
      attribute = attributeTypeEnum.Agility;
      break;
    case "REA":
      attribute = attributeTypeEnum.Reaction;
      break;
    case "STR":
      attribute = attributeTypeEnum.Strength;
      break;
    case "WIL":
      attribute = attributeTypeEnum.Willpower;
      break;
    case "LOG":
      attribute = attributeTypeEnum.Logic;
      break;
    case "INT":
      attribute = attributeTypeEnum.Intuition;
      break;
    case "CHA":
      attribute = attributeTypeEnum.Charisma;
      break;
    case "MAG":
      attribute = attributeTypeEnum.Magic;
      break;
    case "RES":
      attribute = attributeTypeEnum.Resonance;
      break;
  }

  return {
    id: xmlSkill.id,
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
    source: xmlSkill.source,
    page: xmlSkill.page,
    description: "",
  };
};

const SkillXmlSchema = zod
  .object({
    id: zod.string(),
    name: zod.string(),
    attribute: zod.union([
      zod.literal("BOD"),
      zod.literal("AGI"),
      zod.literal("REA"),
      zod.literal("STR"),
      zod.literal("WIL"),
      zod.literal("LOG"),
      zod.literal("INT"),
      zod.literal("CHA"),
      zod.literal("MAG"),
      zod.literal("RES"),
    ]),
    category: zod.nativeEnum(skillCategoryEnum),
    default: zod.union([zod.literal("True"), zod.literal("False")]),
    exotic: zod.optional(zod.literal("True")),
    skillgroup: zod.union([zod.nativeEnum(skillGroupEnum), zod.literal("")]),
    requiresgroundmovement: zod.optional(zod.literal("True")),
    requiresswimmovement: zod.optional(zod.literal("True")),
    requiresflymovement: zod.optional(zod.literal("True")),
    specs: zod.union([
      zod.object({
        spec: zod.union([zod.array(zod.string()), zod.string()]),
      }),
      zod.literal(""),
    ]),
    source: zod.string(),
    page: zod.number(),
  })
  .strict();
const SkillListXmlSchema = zod.array(SkillXmlSchema);
type SkillXmlType = zod.infer<typeof SkillXmlSchema>;

const currentPath = import.meta.url;
const xml_string = fs.readFileSync(
  fileURLToPath(path.dirname(currentPath) + "../../../xmls/skills.xml"),
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

// console.log(jObj.chummer.weapons.weapon[356]);
if (skillListParsed.success) console.log("all g");
else {
  console.log(skillListParsed.error.errors[0]);
}

if (skillListParsed.success) {
  const skillList = skillListParsed.data;
  const skillListConverted = skillList.map((skill: SkillXmlType) => {
    return convertSkill(skill);
  });
  console.log(skillListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../seeds/character/skills.json"
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
