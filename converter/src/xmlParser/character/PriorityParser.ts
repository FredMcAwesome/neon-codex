import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  PriorityListXmlSchema,
  type HeritageXmlType,
  type PriorityXmlType,
  type AttributeXmlType,
  type ResourceXmlType,
  type SkillXmlType,
  type TalentXmlType,
  type PriorityUnionListType,
  type PriorityUnionType,
} from "./PriorityParserSchemas.js";
import {
  PriorityTableSchema,
  type PriorityType,
  type ResourcePriorityType,
  type PriorityTableType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import {
  priorityCategoryEnum,
  priorityLetterEnum,
  priorityTableRunnerLevelEnum,
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
  const priorityCellListConverted = priorityList.map(
    (priority: PriorityXmlType) => {
      return convertPriorityCell(priority);
    }
  );
  const priorityTable = convertPriorityTable(priorityCellListConverted);
  // console.log(priorityListConverted);
  const check = PriorityTableSchema.safeParse(priorityTable);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/priorities.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(priorityTable, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertPriorityTable = function (
  priorityCellList: PriorityUnionListType
): PriorityTableType {
  const rowA = priorityCellList.filter(
    (cell) => cell.rowLetter === priorityLetterEnum.A
  );
  const rowB = priorityCellList.filter(
    (cell) => cell.rowLetter === priorityLetterEnum.B
  );
  const rowC = priorityCellList.filter(
    (cell) => cell.rowLetter === priorityLetterEnum.C
  );
  const rowD = priorityCellList.filter(
    (cell) => cell.rowLetter === priorityLetterEnum.D
  );
  const rowE = priorityCellList.filter(
    (cell) => cell.rowLetter === priorityLetterEnum.E
  );
  return {
    A: convertPriorityRow(rowA),
    B: convertPriorityRow(rowB),
    C: convertPriorityRow(rowC),
    D: convertPriorityRow(rowD),
    E: convertPriorityRow(rowE),
  };
};

const convertPriorityRow = function (
  priorityRow: PriorityUnionListType
): PriorityType {
  const priorityRowNoLetter = priorityRow.map((row) => {
    const { rowLetter: _a, ...rest } = row;
    return rest;
  });
  const heritageCategory = priorityRowNoLetter.find((row) => {
    return row.category === priorityCategoryEnum.Heritage;
  });
  assert(heritageCategory !== undefined);
  const { category: _, ...heritage } = heritageCategory;

  const talentCategory = priorityRowNoLetter.find((row) => {
    return row.category === priorityCategoryEnum.Talent;
  });
  assert(talentCategory !== undefined);
  const { category: _b, ...talent } = talentCategory;

  const attributeCategory = priorityRowNoLetter.find((row) => {
    return row.category === priorityCategoryEnum.Attributes;
  });
  assert(attributeCategory !== undefined);
  const { category: _c, ...attributes } = attributeCategory;

  const skillCategory = priorityRowNoLetter.find((row) => {
    return row.category === priorityCategoryEnum.Skills;
  });
  assert(skillCategory !== undefined);
  const { category: _d, ...skills } = skillCategory;

  const resourceCategories = priorityRowNoLetter.filter((row) => {
    return row.category === priorityCategoryEnum.Resources;
  });
  assert(resourceCategories !== undefined);
  const resourceList = resourceCategories.map((resourceCategory) => {
    const { category: _, ...resource } = resourceCategory;
    return resource;
  });
  const resourceStreetLevel = convertResourceRunnerPriority(
    resourceList,
    priorityTableRunnerLevelEnum.StreetLevel
  );
  const resourceStandard = convertResourceRunnerPriority(
    resourceList,
    priorityTableRunnerLevelEnum.Standard
  );
  const resourcePrimeRunner = convertResourceRunnerPriority(
    resourceList,
    priorityTableRunnerLevelEnum.PrimeRunner
  );
  return {
    heritages: heritage,
    talents: talent,
    attributes: attributes,
    skills: skills,
    resources: {
      streetLevel: resourceStreetLevel,
      standard: resourceStandard,
      primeRunner: resourcePrimeRunner,
    },
  };
};

const convertPriorityCell = function (
  xmlPriority: PriorityXmlType
): PriorityUnionType {
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

const convertHeritage = function (xmlHeritage: HeritageXmlType) {
  const metatypeXmlList = Array.isArray(xmlHeritage.metatypes.metatype)
    ? xmlHeritage.metatypes.metatype
    : [xmlHeritage.metatypes.metatype];
  const heritageList = metatypeXmlList.map((metatype) => {
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
  assert(
    xmlHeritage.name.startsWith("A - ") ||
      xmlHeritage.name.startsWith("B - ") ||
      xmlHeritage.name.startsWith("C - ") ||
      xmlHeritage.name.startsWith("D - ") ||
      xmlHeritage.name.startsWith("E - ")
  );
  return {
    name: xmlHeritage.name.substring(4),
    category: xmlHeritage.category,
    rowLetter: xmlHeritage.value,
    heritageList: heritageList,
  };
};

const convertTalent = function (xmlTalent: TalentXmlType) {
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
  assert(
    xmlTalent.name.startsWith("A - ") ||
      xmlTalent.name.startsWith("B - ") ||
      xmlTalent.name.startsWith("C - ") ||
      xmlTalent.name.startsWith("D - ") ||
      xmlTalent.name.startsWith("E - ")
  );
  return {
    name: xmlTalent.name.substring(4),
    category: xmlTalent.category,
    rowLetter: xmlTalent.value,
    talentList: talentList,
  };
};

const convertAttribute = function (xmlAttribute: AttributeXmlType) {
  assert(
    xmlAttribute.name.startsWith("A - ") ||
      xmlAttribute.name.startsWith("B - ") ||
      xmlAttribute.name.startsWith("C - ") ||
      xmlAttribute.name.startsWith("D - ") ||
      xmlAttribute.name.startsWith("E - ")
  );
  return {
    name: xmlAttribute.name.substring(4),
    category: xmlAttribute.category,
    rowLetter: xmlAttribute.value,
    attributes: xmlAttribute.attributes,
  };
};

const convertSkill = function (xmlSkill: SkillXmlType) {
  assert(
    xmlSkill.name.startsWith("A - ") ||
      xmlSkill.name.startsWith("B - ") ||
      xmlSkill.name.startsWith("C - ") ||
      xmlSkill.name.startsWith("D - ") ||
      xmlSkill.name.startsWith("E - ")
  );
  return {
    name: xmlSkill.name.substring(4),
    category: xmlSkill.category,
    rowLetter: xmlSkill.value,
    skillPoints: xmlSkill.skills,
    skillGroupPoints: xmlSkill.skillgroups,
  };
};

const convertResource = function (xmlResource: ResourceXmlType) {
  assert(
    xmlResource.name.startsWith("A - ") ||
      xmlResource.name.startsWith("B - ") ||
      xmlResource.name.startsWith("C - ") ||
      xmlResource.name.startsWith("D - ") ||
      xmlResource.name.startsWith("E - ")
  );
  return {
    name: xmlResource.name.substring(4),
    category: xmlResource.category,
    rowLetter: xmlResource.value,
    priorityTable: xmlResource.prioritytable,
    resources: xmlResource.resources,
  };
};

function convertResourceRunnerPriority(
  resourceList: Array<
    {
      priorityTable: priorityTableRunnerLevelEnum;
    } & ResourcePriorityType
  >,
  runnerLevel: priorityTableRunnerLevelEnum
): ResourcePriorityType {
  const resourcePriorityTable = resourceList.find((resource) => {
    return resource.priorityTable === runnerLevel;
  });
  assert(resourcePriorityTable !== undefined);
  const { priorityTable: _, ...resource } = resourcePriorityTable;
  return resource;
}
