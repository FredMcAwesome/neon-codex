import {
  MetatypeListSchema,
  MetatypeSchema,
  type BaseMetatypeType,
  type MetatypeType,
  type MovementStrideType,
} from "@neon-codex/common/build/schemas/abilities/metatypeSchemas.js";
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MetatypeListXmlSchema,
  type BaseMetatypeXmlType,
  type MetatypeXmlType,
} from "./MetatypeParserSchemas.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import {
  convertMetatypeCategory,
  convertMetatypeQualities,
  convertMovement,
} from "./MetatypeParserHelper.js";

export function ParseMetatypes() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/metatypes.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  const jObj: any = parser.parse(xml_string);
  // console.log(jObj.chummer.metatypes.metatype[301]);
  const metatypeListParsed = MetatypeListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.metatypes.metatype
  );

  // console.log(jObj.chummer.metatypes.metatype[356]);
  if (metatypeListParsed.success)
    console.log("metatypes.xml initial zod parsed");
  else {
    console.log(metatypeListParsed.error.errors[0]);
    assert(false);
  }

  const metatypeList = metatypeListParsed.data;
  const metatypeListConverted = metatypeList.map(
    (metatype: MetatypeXmlType) => {
      const convertedMetatype = convertMetatype(metatype);
      const check = MetatypeSchema.safeParse(convertedMetatype);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedMetatype);
        throw new Error(check.error.message);
      }
      return convertedMetatype;
    }
  );
  // console.log(metatypeListConverted);
  const check = MetatypeListSchema.safeParse(metatypeListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/metatypes.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(metatypeListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

const convertMetatype = function (xmlMetatype: MetatypeXmlType): MetatypeType {
  const metatype: MetatypeType = convertBaseMetatype(xmlMetatype);
  if (xmlMetatype.metavariants !== undefined) {
    const metavariantXmlList = Array.isArray(
      xmlMetatype.metavariants.metavariant
    )
      ? xmlMetatype.metavariants.metavariant
      : [xmlMetatype.metavariants.metavariant];
    metatype.metavariantList = metavariantXmlList.map((metavariant) => {
      return convertBaseMetatype(metavariant);
    });
  }
  return metatype;
};

const convertBaseMetatype = function (
  xmlMetatype: BaseMetatypeXmlType
): BaseMetatypeType {
  const category = convertMetatypeCategory(xmlMetatype.category);

  const bodyAttributeRange = {
    min: xmlMetatype.bodmin,
    max: xmlMetatype.bodmax,
    augmentedMax: xmlMetatype.bodaug,
  };
  const agilityAttributeRange = {
    min: xmlMetatype.agimin,
    max: xmlMetatype.agimax,
    augmentedMax: xmlMetatype.agiaug,
  };
  const reactionAttributeRange = {
    min: xmlMetatype.reamin,
    max: xmlMetatype.reamax,
    augmentedMax: xmlMetatype.reaaug,
  };
  const strengthAttributeRange = {
    min: xmlMetatype.strmin,
    max: xmlMetatype.strmax,
    augmentedMax: xmlMetatype.straug,
  };
  const charismaAttributeRange = {
    min: xmlMetatype.chamin,
    max: xmlMetatype.chamax,
    augmentedMax: xmlMetatype.chaaug,
  };
  const intuitionAttributeRange = {
    min: xmlMetatype.intmin,
    max: xmlMetatype.intmax,
    augmentedMax: xmlMetatype.intaug,
  };
  const logicAttributeRange = {
    min: xmlMetatype.logmin,
    max: xmlMetatype.logmax,
    augmentedMax: xmlMetatype.logaug,
  };
  const willpowerAttributeRange = {
    min: xmlMetatype.wilmin,
    max: xmlMetatype.wilmax,
    augmentedMax: xmlMetatype.wilaug,
  };
  const initiativeAttributeRange = {
    min: xmlMetatype.inimin,
    max: xmlMetatype.inimax,
    augmentedMax: xmlMetatype.iniaug,
  };
  const edgeAttributeRange = {
    min: xmlMetatype.edgmin,
    max: xmlMetatype.edgmax,
    augmentedMax: xmlMetatype.edgaug,
  };
  const magicAttributeRange = {
    min: xmlMetatype.magmin,
    max: xmlMetatype.magmax,
    augmentedMax: xmlMetatype.magaug,
  };
  const resonanceAttributeRange = {
    min: xmlMetatype.resmin,
    max: xmlMetatype.resmax,
    augmentedMax: xmlMetatype.resaug,
  };
  const essenceAttributeRange = {
    min: xmlMetatype.essmin,
    max: xmlMetatype.essmax,
    augmentedMax: xmlMetatype.essaug,
  };
  const depthAttributeRange = {
    min: xmlMetatype.depmin,
    max: xmlMetatype.depmax,
    augmentedMax: xmlMetatype.depaug,
  };
  let bonus;
  if (xmlMetatype.bonus !== undefined) {
    bonus = convertXmlBonus(xmlMetatype.bonus);
  }
  let bonusInitiativeDice;
  if (xmlMetatype.initiativedice !== undefined) {
    bonusInitiativeDice = { bonusDice: xmlMetatype.initiativedice };
  }
  let movement: MovementStrideType | undefined = undefined;
  if (
    xmlMetatype.walk !== undefined ||
    xmlMetatype.run !== undefined ||
    xmlMetatype.sprint !== undefined
  ) {
    assert(
      xmlMetatype.walk !== undefined &&
        xmlMetatype.run !== undefined &&
        xmlMetatype.sprint !== undefined
    );
    movement = {
      walk: convertMovement(xmlMetatype.walk),
      run: convertMovement(xmlMetatype.run),
      sprint: convertMovement(xmlMetatype.sprint),
    };
  }
  const addWeaponList =
    xmlMetatype.addweapon !== undefined
      ? Array.isArray(xmlMetatype.addweapon)
        ? xmlMetatype.addweapon
        : [xmlMetatype.addweapon]
      : undefined;
  let addPowerList;
  if (xmlMetatype.powers !== undefined) {
    const powers = Array.isArray(xmlMetatype.powers.power)
      ? xmlMetatype.powers.power
      : [xmlMetatype.powers.power];
    addPowerList = powers.map((power) => {
      if (typeof power === "object") {
        return power.xmltext;
      }
      return power;
    });
  }
  let addQualityList;
  if (xmlMetatype.qualities !== undefined) {
    addQualityList = convertMetatypeQualities(xmlMetatype.qualities);
  }
  let forbiddenQualityList;
  if (xmlMetatype.qualityrestriction !== undefined) {
    forbiddenQualityList = convertMetatypeQualities(
      xmlMetatype.qualityrestriction
    );
  }
  return {
    // id: xmlMetatype.id,
    name: xmlMetatype.name,
    description: "",
    category: category,
    pointBuyKarmaCost: xmlMetatype.karma,
    // priorityKarmaCost: priorityKarmaCost,
    ...(xmlMetatype.halveattributepoints !== undefined && {
      halveAttributePoints: true,
    }),
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
    initiative: bonusInitiativeDice,
    ...(xmlMetatype.movement === "Special" && { nonStandardMovement: true }),
    ...(movement !== undefined && { movement: movement }),
    addWeaponList: addWeaponList,
    addPowerList: addPowerList,
    addQualityList: addQualityList,
    forbiddenQualityList: forbiddenQualityList,
    bonus: bonus,
    source: xmlMetatype.source,
    page: xmlMetatype.page,
  };
};
