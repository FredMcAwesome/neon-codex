/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import {
  convertAttribute,
  convertIncludedQualities,
  convertMovement,
  convertSource,
} from "../common/ParserHelper.js";
import {
  CritterSchema,
  type CritterSkillListType,
  type CritterType,
} from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";
import {
  CritterListXmlSchema,
  type CritterXmlType,
} from "./CritterParserSchemas.js";
import type { MovementStrideType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import {
  convertCritterRating,
  convertIncludedBiowareList,
  convertIncludedComplexForms,
  convertIncludedCritterPowers,
} from "./CritterParserHelper.js";

export function ParseCritters() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/critters.xml"),
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
  //   jObj.chummer.metatypes.metatype[155]
  // );

  const critterListParsed = CritterListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.metatypes.metatype
  );

  if (critterListParsed.success) console.log("critters.xml initial zod parsed");
  else {
    console.log(critterListParsed.error.errors[0]);
    assert(false);
  }

  const critterList = critterListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const critterListConverted = critterList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((critter) => {
      const convertedCritter = convertCritter(critter);
      const check = CritterSchema.safeParse(convertedCritter);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedCritter, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(spellListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/critters.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(critterListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertCritter(critter: CritterXmlType): CritterType {
  // console.log(`\n${critter.name}`);

  assert(
    ("walk" in critter && "run" in critter && "sprint" in critter) ||
      "movement" in critter
  );

  const bodyAttributeRange = {
    min: convertCritterRating(critter.bodmin, critter.category),
    max: convertCritterRating(critter.bodmax, critter.category),
    augmentedMax: convertCritterRating(critter.bodaug, critter.category),
  };
  const agilityAttributeRange = {
    min: convertCritterRating(critter.agimin, critter.category),
    max: convertCritterRating(critter.agimax, critter.category),
    augmentedMax: convertCritterRating(critter.agiaug, critter.category),
  };
  const reactionAttributeRange = {
    min: convertCritterRating(critter.reamin, critter.category),
    max: convertCritterRating(critter.reamax, critter.category),
    augmentedMax: convertCritterRating(critter.reaaug, critter.category),
  };
  const strengthAttributeRange = {
    min: convertCritterRating(critter.strmin, critter.category),
    max: convertCritterRating(critter.strmax, critter.category),
    augmentedMax: convertCritterRating(critter.straug, critter.category),
  };
  const charismaAttributeRange = {
    min: convertCritterRating(critter.chamin, critter.category),
    max: convertCritterRating(critter.chamax, critter.category),
    augmentedMax: convertCritterRating(critter.chaaug, critter.category),
  };
  const intuitionAttributeRange = {
    min: convertCritterRating(critter.intmin, critter.category),
    max: convertCritterRating(critter.intmax, critter.category),
    augmentedMax: convertCritterRating(critter.intaug, critter.category),
  };
  const logicAttributeRange = {
    min: convertCritterRating(critter.logmin, critter.category),
    max: convertCritterRating(critter.logmax, critter.category),
    augmentedMax: convertCritterRating(critter.logaug, critter.category),
  };
  const willpowerAttributeRange = {
    min: convertCritterRating(critter.wilmin, critter.category),
    max: convertCritterRating(critter.wilmax, critter.category),
    augmentedMax: convertCritterRating(critter.wilaug, critter.category),
  };
  const initiativeAttributeRange = {
    min:
      critter.inimin !== undefined
        ? convertCritterRating(critter.inimin, critter.category)
        : [0],
    max:
      critter.inimax !== undefined
        ? convertCritterRating(critter.inimax, critter.category)
        : [0],
    augmentedMax:
      critter.iniaug !== undefined
        ? convertCritterRating(critter.iniaug, critter.category)
        : [0],
  };
  const edgeAttributeRange = {
    min: convertCritterRating(critter.edgmin, critter.category),
    max: convertCritterRating(critter.edgmax, critter.category),
    augmentedMax: convertCritterRating(critter.edgaug, critter.category),
  };
  const magicAttributeRange = {
    min:
      critter.magmin !== undefined
        ? convertCritterRating(critter.magmin, critter.category)
        : [0],
    max:
      critter.magmax !== undefined
        ? convertCritterRating(critter.magmax, critter.category)
        : [0],
    augmentedMax:
      critter.magaug !== undefined
        ? convertCritterRating(critter.magaug, critter.category)
        : [0],
  };
  const resonanceAttributeRange = {
    min:
      critter.resmin !== undefined
        ? convertCritterRating(critter.resmin, critter.category)
        : [0],
    max:
      critter.resmax !== undefined
        ? convertCritterRating(critter.resmax, critter.category)
        : [0],
    augmentedMax:
      critter.resaug !== undefined
        ? convertCritterRating(critter.resaug, critter.category)
        : [0],
  };
  const essenceAttributeRange = {
    min: convertCritterRating(critter.essmin, critter.category),
    max: convertCritterRating(critter.essmax, critter.category),
    augmentedMax: convertCritterRating(critter.essaug, critter.category),
  };
  const depthAttributeRange = {
    min:
      critter.depmin !== undefined
        ? convertCritterRating(critter.depmin, critter.category)
        : [0],
    max:
      critter.depmax !== undefined
        ? convertCritterRating(critter.depmax, critter.category)
        : [0],
    augmentedMax:
      critter.depaug !== undefined
        ? convertCritterRating(critter.depaug, critter.category)
        : [0],
  };

  const bonus =
    critter.bonus !== undefined ? convertXmlBonus(critter.bonus) : undefined;
  const source = convertSource(critter.source);
  let movement: MovementStrideType | undefined = undefined;
  if (
    critter.walk !== undefined ||
    critter.run !== undefined ||
    critter.sprint !== undefined
  ) {
    assert(
      critter.walk !== undefined &&
        critter.run !== undefined &&
        critter.sprint !== undefined
    );
    movement = {
      walk: convertMovement(critter.walk),
      run: convertMovement(critter.run),
      sprint: convertMovement(critter.sprint),
    };
  }

  let addPowerList;
  if (critter.powers !== undefined) {
    const powers = Array.isArray(critter.powers.power)
      ? critter.powers.power
      : [critter.powers.power];
    assert(powers[0] !== undefined, `Empty powers for ${critter.name}`);
    addPowerList = convertIncludedCritterPowers(powers);
  }
  let optionalPowerList;
  if (critter.optionalpowers !== undefined) {
    const powers = Array.isArray(critter.optionalpowers.optionalpower)
      ? critter.optionalpowers.optionalpower
      : [critter.optionalpowers.optionalpower];
    assert(
      powers[0] !== undefined,
      `Empty optional powers for ${critter.name}`
    );
    optionalPowerList = convertIncludedCritterPowers(powers);
  }
  let addQualityList;
  if (critter.qualities !== undefined) {
    addQualityList = convertIncludedQualities(critter.qualities);
  }
  let addBiowareList;
  if (critter.biowares !== undefined) {
    const biowares = Array.isArray(critter.biowares.bioware)
      ? critter.biowares.bioware
      : [critter.biowares.bioware];
    addBiowareList = convertIncludedBiowareList(biowares);
  }
  let addComplexFormList;
  if (critter.complexforms !== undefined) {
    const complexFormList = Array.isArray(critter.complexforms.complexform)
      ? critter.complexforms.complexform
      : [critter.complexforms.complexform];
    addComplexFormList = convertIncludedComplexForms(complexFormList);
  }

  const skillGroupList =
    critter.skills.group !== undefined
      ? Array.isArray(critter.skills.group)
        ? critter.skills.group
        : [critter.skills.group]
      : undefined;

  const knowledgeSkillList =
    critter.skills.knowledge !== undefined
      ? [critter.skills.knowledge]
      : undefined;

  // All critter should have some skills
  assert(critter.skills.skill.length > 0);
  const skills: CritterSkillListType = {
    skillList: critter.skills.skill.map((skill) => {
      assert(skill._rating !== undefined);
      const rating = convertCritterRating(skill._rating, critter.category);

      return {
        name: skill.xmltext,
        rating: rating,
        ...(skill._spec !== undefined && { specialised: [skill._spec] }),
        ...(skill._select !== undefined && { select: skill._select }),
      };
    }),
    ...(skillGroupList !== undefined && {
      skillGroupList: skillGroupList.map((group) => {
        const rating = convertCritterRating(group._rating, critter.category);

        return {
          name: group.xmltext,
          rating: rating,
        };
      }),
    }),
    ...(knowledgeSkillList !== undefined && {
      knowledgeSkillList: knowledgeSkillList.map((skill) => {
        const skillPoints = parseInt(skill._rating);
        assert(!isNaN(skillPoints));

        return {
          name: skill.xmltext,
          description: "",
          category: skill._category,
          attribute: convertAttribute(skill._attribute),
          skillPoints: skillPoints,
        };
      }),
    }),
  };

  return {
    name: critter.name,
    description: "",
    category: critter.category,
    bodyAttributeRange: bodyAttributeRange,
    agilityAttributeRange: agilityAttributeRange,
    reactionAttributeRange: reactionAttributeRange,
    strengthAttributeRange: strengthAttributeRange,
    charismaAttributeRange: charismaAttributeRange,
    intuitionAttributeRange: intuitionAttributeRange,
    logicAttributeRange: logicAttributeRange,
    willpowerAttributeRange: willpowerAttributeRange,
    initiativeAttributeRange: initiativeAttributeRange,
    edgeAttributeRange: edgeAttributeRange,
    magicAttributeRange: magicAttributeRange,
    resonanceAttributeRange: resonanceAttributeRange,
    essenceAttributeRange: essenceAttributeRange,
    depthAttributeRange: depthAttributeRange,
    ...(critter.movement === "Special" && { nonStandardMovement: true }),
    ...(movement !== undefined && { movement: movement }),
    includedPowerList: addPowerList,
    optionalPowerList: optionalPowerList,
    addQualityList: addQualityList,
    addBiowareList: addBiowareList,
    addComplexFormList: addComplexFormList,
    skills: skills,
    ...(bonus !== undefined && { bonus: bonus }),
    source: source,
    page: critter.page,
  };
}
