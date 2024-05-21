/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import {
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
import { convertCritterRating } from "./CritterParserHelper.js";

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
        console.log(convertedCritter);
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

  let addQualityList;
  if (critter.qualities !== undefined) {
    addQualityList = convertIncludedQualities(critter.qualities);
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

  const skills: CritterSkillListType = {
    skillList: critter.skills.skill.map((skill) => {
      if (typeof skill === "object") {
        let rating;
        if (skill._rating !== undefined) {
          rating = convertCritterRating(skill._rating, critter.category);
        }
        return {
          name: skill.xmltext,
          ...(skill._spec !== undefined && { specialised: [skill._spec] }),
          ...(rating !== undefined && { rating: rating }),
          ...(skill._select !== undefined && { select: skill._select }),
        };
      } else {
        return { name: skill };
      }
    }),
    ...(skillGroupList !== undefined && {
      skillGroupList: skillGroupList.map((group) => {
        if (typeof group === "object") {
          const rating = parseInt(group._rating);
          assert(!isNaN(rating));

          return {
            name: group.xmltext,
            rating: rating,
          };
        } else {
          return { name: group };
        }
      }),
    }),
    ...(knowledgeSkillList !== undefined && {
      knowledgeSkillList: knowledgeSkillList.map((skill) => {
        const rating = parseInt(skill._rating);
        assert(!isNaN(rating));

        return {
          name: skill.xmltext,
          rating: rating,
          category: skill._category,
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
    addQualityList: addQualityList,
    skills: skills,

    ...(bonus !== undefined && { bonus: bonus }),
    source: source,
    page: critter.page,
  };
}
