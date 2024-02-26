import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  PriorityListXmlSchema,
  type HeritageType,
  type PriorityXmlType,
  type AttributeType,
  type ResourceXmlType,
  type SkillXmlType,
  type TalentType,
} from "./PriorityParserSchemas.js";
import {
  PriorityListSchema,
  PrioritySchema,
  type PriorityType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import {
  priorityCategoryEnum,
  skillTalentSourceEnum,
  talentCategoryEnum,
} from "@neon-codex/common/build/enums.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";

export function ParsePriorites() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/priorities.xml"
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
  //   jObj.chummer.priorities.priority[0].metatypes.metatype[9].metavariants
  // );
  const priorityListParsed = PriorityListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.priorities.priority
  );

  // console.log(jObj.chummer.priorities.priority[356]);
  if (priorityListParsed.success) {
    console.log("priorities.xml initial zod parsed");
  } else {
    console.log(priorityListParsed.error.errors[0]);
    assert(false);
  }

  const priorityList = priorityListParsed.data;
  const priorityListConverted = priorityList.map(
    (priority: PriorityXmlType) => {
      const convertedPriority = convertPriority(priority);
      const check = PrioritySchema.safeParse(convertedPriority);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedPriority);
        throw new Error(check.error.message);
      }
      return convertedPriority;
    }
  );
  // console.log(priorityListConverted);
  const check = PriorityListSchema.safeParse(priorityListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/priorities.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(priorityListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertPriority = function (xmlPriority: PriorityXmlType): PriorityType {
  switch (xmlPriority.category) {
    case priorityCategoryEnum.Heritage:
      return convertHeritage(xmlPriority);
    case priorityCategoryEnum.Talent:
      return convertTalent(xmlPriority);
    case priorityCategoryEnum.Attributes:
      return convertAttribute(xmlPriority);
    case priorityCategoryEnum.Skills:
      return convertSkill(xmlPriority);
    case priorityCategoryEnum.Resources:
      return convertResource(xmlPriority);
  }
};

const convertHeritage = function (xmlHeritage: HeritageType): PriorityType {
  const metatypeXmlList = Array.isArray(xmlHeritage.metatypes.metatype)
    ? xmlHeritage.metatypes.metatype
    : [xmlHeritage.metatypes.metatype];
  const metatypeList = metatypeXmlList.map((metatype) => {
    const metavariantXmlList =
      metatype.metavariants === undefined
        ? undefined
        : typeof metatype.metavariants === "string"
        ? undefined
        : Array.isArray(metatype.metavariants.metavariant)
        ? metatype.metavariants.metavariant
        : [metatype.metavariants.metavariant];
    const metavariantList =
      metavariantXmlList === undefined
        ? undefined
        : metavariantXmlList.map((metavariant) => {
            return {
              name: metavariant.name,
              specialAttributePoints: metavariant.value,
              karmaCost: metavariant.karma,
            };
          });
    return {
      name: metatype.name,
      specialAttributePoints: metatype.value,
      karmaCost: metatype.karma,
      metavariantList: metavariantList,
    };
  });
  return {
    name: xmlHeritage.name,
    category: xmlHeritage.category,
    rowLetter: xmlHeritage.value,
    metatypeList: metatypeList,
  };
};

const convertTalent = function (xmlTalent: TalentType): PriorityType {
  const talentList = xmlTalent.talents.talent.map((talent) => {
    const quality =
      talent.qualities === undefined ? undefined : talent.qualities.quality;
    let includedSkills;
    if (talent.skillqty !== undefined) {
      assert(talent.skillqty !== 0, "talent.skillqty = 0");
      assert(talent.skillval !== undefined, "talent.skillval is undefined");
      assert(talent.skilltype !== undefined, "talent.skilltype is undefined");
      let skillType;
      switch (talent.skilltype) {
        case "specific":
          assert(
            talent.skillchoices !== undefined,
            "talent.skillchoices is undefined"
          );
          skillType = { skillList: talent.skillchoices.skill };
          break;
        case "magic":
          skillType = { source: skillTalentSourceEnum.Magic };
          break;
        case "matrix":
          skillType = { source: skillTalentSourceEnum.Matrix };
          break;
        case "resonance":
          skillType = { source: skillTalentSourceEnum.Resonance };
          break;
        default:
          assert(typeof talent.skilltype === "object");
          assert(talent.skilltype.xmltext === "xpath");
          skillType = { source: skillTalentSourceEnum.Adept };
      }
      includedSkills = {
        points: talent.skillqty,
        rating: talent.skillval,
        ...skillType,
      };
    }

    let includedSkillGroups;
    if (talent.skillgroupqty !== undefined) {
      assert(talent.skillgroupqty !== 0, "talent.skillgroupqty = 0");
      assert(
        talent.skillgroupval !== undefined,
        "talent.skillgroupval is undefined"
      );
      assert(
        talent.skillgrouptype !== undefined,
        "talent.skillgrouptype is undefined"
      );
      assert(
        talent.skillgrouptype === "grouped",
        "skillgrouptype has an unexpected value"
      );
      assert(
        talent.skillgroupchoices !== undefined,
        "skillgroupchoices is undefined"
      );
      const skillGroupList = Array.isArray(talent.skillgroupchoices.skillgroup)
        ? talent.skillgroupchoices.skillgroup
        : [talent.skillgroupchoices.skillgroup];
      includedSkillGroups = {
        points: talent.skillgroupqty,
        rating: talent.skillgroupval,
        groupList: skillGroupList,
      };
    }

    let talentType;
    if (talent.magic !== undefined) {
      assert(talent.resonance === undefined, "magic illegal");
      assert(talent.cfp === undefined, "magic illegal");
      assert(talent.depth === undefined, "magic illegal");
      talentType = {
        magic: talent.magic,
        ...(talent.spells !== undefined && { spells: talent.spells }),
        category: talentCategoryEnum.Magic as const,
      };
    }
    if (talent.resonance !== undefined) {
      assert(talent.magic === undefined, "resonance illegal");
      assert(talent.spells === undefined, "resonance illegal");
      assert(talent.depth === undefined, "resonance illegal");
      assert(talent.cfp !== undefined, "complex forms is undefined");
      talentType = {
        resonance: talent.resonance,
        complexForms: talent.cfp,
        category: talentCategoryEnum.Resonance as const,
      };
    }
    if (talent.depth !== undefined) {
      assert(talent.magic === undefined, "depth illegal");
      assert(talent.spells === undefined, "depth illegal");
      assert(talent.cfp === undefined, "depth illegal");
      assert(talent.resonance === undefined, "depth illegal");
      talentType = {
        depth: talent.depth,
        category: talentCategoryEnum.Depth as const,
      };
    }
    if (talentType === undefined) {
      talentType = {
        category: talentCategoryEnum.Mundane as const,
      };
    }

    return {
      name: talent.value,
      label: talent.name,
      ...talentType,
      includedQuality: quality,
      includedSkills: includedSkills,
      includedSkillGroups: includedSkillGroups,
      ...(talent.required !== undefined && {
        required: convertRequirements(talent.required),
      }),
      ...(talent.forbidden !== undefined && {
        forbidden: convertRequirements(talent.forbidden),
      }),
    };
  });
  return {
    name: xmlTalent.name,
    category: xmlTalent.category,
    rowLetter: xmlTalent.value,
    talentList: talentList,
  };
};

const convertAttribute = function (xmlAttribute: AttributeType) {
  return {
    name: xmlAttribute.name,
    category: xmlAttribute.category,
    rowLetter: xmlAttribute.value,
    attributes: xmlAttribute.attributes,
  };
};

const convertSkill = function (xmlSkill: SkillXmlType) {
  return {
    name: xmlSkill.name,
    category: xmlSkill.category,
    rowLetter: xmlSkill.value,
    skillPoints: xmlSkill.skills,
    skillGroupPoints: xmlSkill.skillgroups,
  };
};

const convertResource = function (xmlResource: ResourceXmlType) {
  return {
    name: xmlResource.name,
    category: xmlResource.category,
    rowLetter: xmlResource.value,
    priorityTable: xmlResource.prioritytable,
    resources: xmlResource.resources,
  };
};
