/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import {
  convertDuration,
  convertSource,
  convertSpellPowerRange,
} from "../common/ParserHelper.js";
import {
  CritterPowerListXmlSchema,
  type CritterPowerXmlType,
} from "./CritterPowerParserSchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import {
  critterPowerCategoryEnum,
  CritterPowerSchema,
  NonTopRequirementsArraySchema,
  NonTopRequirementsSchema,
  RequirementsSchema,
} from "@neon-codex/common";
import type {
  CritterPowerType,
  RequirementsType,
  NonTopRequirementsType,
} from "@neon-codex/common";
import { convertSpellType } from "../talent/SpellParserHelper.js";
import {
  SpellPowerXmlRangeSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { actionEnum } from "@neon-codex/common";
import { type } from "arktype";
import { resolveDuplicateNames } from "../utilities.js";

export function ParseCritterPowers() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../../xmls/critterpowers.xml"
    ),
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
  //   jObj.chummer.powers.power[271]
  // );

  const critterPowerListParsed = CritterPowerListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.powers.power
  );

  if (critterPowerListParsed instanceof type.errors) {
    console.log(critterPowerListParsed.summary);
    assert(false);
  } else {
    console.log("critterpowers.xml initial arktype parsed");
  }

  const critterPowerListConverted = critterPowerListParsed.map(
    (critterPower) => {
      const convertedCritter = convertCritterPower(critterPower);
      const check = CritterPowerSchema(convertedCritter);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedCritter, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    }
  );
  // const non_paranormal = critterPowerListConverted.filter(
  //   (critterPower) =>
  //     critterPower.category !== critterPowerCategoryEnum.Paranormal
  // );
  // const paranormal = critterPowerListConverted.filter(
  //   (critterPower) =>
  //     critterPower.category === critterPowerCategoryEnum.Paranormal
  // );
  // resolveDuplicateNames(non_paranormal, "critterpowers.xml");
  // console.log(spellListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/critterPowers.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(critterPowerListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function isInsectQualityString(q: unknown): boolean {
  return (
    typeof q === "string" && q.toLowerCase().includes("free insect spirit")
  );
}

function analyzeAndFilterRequirementNode(
  node: RequirementsType | NonTopRequirementsType | undefined
): { node?: RequirementsType | NonTopRequirementsType; foundInsect: boolean } {
  if (node === undefined) return { foundInsect: false };

  const n = node;

  // If this node directly contains otherDetails (a leaf)
  if ("otherDetails" in n && n.otherDetails !== undefined) {
    const det = n.otherDetails;
    if (det !== undefined && "value" in det && det.value !== undefined) {
      const val = det.value;
      if (
        typeof val === "object" &&
        val !== null &&
        "quality" in val &&
        typeof val.quality === "string" &&
        isInsectQualityString(val.quality)
      ) {
        return { foundInsect: true };
      }
    }
    return { node, foundInsect: false };
  }

  // If this node wraps a oneOf
  if ("oneOf" in n && Array.isArray(n.oneOf)) {
    let foundInsectAny = false;
    const newChildren: Array<RequirementsType | NonTopRequirementsType> = [];
    for (const child of n.oneOf) {
      const res = analyzeAndFilterRequirementNode(child);
      if (res.foundInsect) foundInsectAny = true;
      if (res.node !== undefined) newChildren.push(res.node);
    }
    if (newChildren.length === 0) return { foundInsect: foundInsectAny };
    return {
      node: { oneOf: newChildren },
      foundInsect: foundInsectAny,
    };
  }

  // If this node wraps an allOf
  if ("allOf" in n && Array.isArray(n.allOf)) {
    let foundInsectAny = false;
    const newChildren: Array<RequirementsType | NonTopRequirementsType> = [];
    for (const child of n.allOf) {
      const res = analyzeAndFilterRequirementNode(child);
      if (res.foundInsect) foundInsectAny = true;
      if (res.node !== undefined) newChildren.push(res.node);
    }
    if (newChildren.length === 0) return { foundInsect: foundInsectAny };
    return {
      node: { allOf: newChildren },
      foundInsect: foundInsectAny,
    };
  }

  // ParentDetails or uncommon nodes - keep as-is
  return { node, foundInsect: false };
}

function convertCritterPower(
  critterPower: CritterPowerXmlType
): CritterPowerType {
  // console.log(`\n${critterPower.name}`);

  const karma = critterPower.karma !== "" ? critterPower.karma : undefined;
  let powerType;
  if (critterPower.type !== "") {
    if (critterPower.type === "As Spell") {
      powerType = { spellType: true as const };
    } else if (critterPower.type === "As ritual") {
      powerType = { ritualType: true as const };
    } else if (critterPower.type === "Device") {
      powerType = { device: true as const };
    } else if (critterPower.type === "Host") {
      powerType = { host: true as const };
    } else if (critterPower.type === "File") {
      powerType = { file: true as const };
    } else if (critterPower.type === "Icon") {
      powerType = { icon: true as const };
    } else if (critterPower.type === "Persona") {
      powerType = { persona: true as const };
    } else if (critterPower.type === "Persona or Device") {
      powerType = { personaOrDevice: true as const };
    } else {
      powerType = convertSpellType(critterPower.type);
    }
  }
  const action =
    critterPower.action !== ""
      ? critterPower.action === "None"
        ? actionEnum.Auto
        : critterPower.action === "As ritual"
        ? { ritualType: true as const }
        : critterPower.action
      : undefined;
  let range;
  if (critterPower.range !== "") {
    const check = SpellPowerXmlRangeSchema(critterPower.range);
    if (!(check instanceof type.errors)) {
      range = { rangeCalc: convertSpellPowerRange(check) };
    } else {
      switch (critterPower.range) {
        case "Per Spell":
          range = { spellRange: true as const };
          break;
        case "As ritual":
          range = { ritualRange: true as const };
          break;
        case "MAG":
          range = { magicMutliplied: 1 };
          break;
        case "MAG x 50":
          range = { magicMutliplied: 50 };
          break;
        case "MAG x 25 m":
          range = { magicMutliplied: 25 };
          break;
        default:
          assert(false, critterPower.range);
      }
    }
  }
  let duration;
  if (critterPower.duration !== "") {
    const check = XmlDurationSchema(critterPower.duration);
    if (!(check instanceof type.errors)) {
      duration = convertDuration(check);
    } else {
      switch (critterPower.duration) {
        case "Per Spell":
          duration = { spellDuration: true as const };
          break;
        case "As ritual":
          duration = { ritualDuration: true as const };
          break;
        case "Predetermined by Sprite":
          duration = { spriteDuration: true as const };
          break;
        case "F x 10 Combat Turns":
          duration = { forceMultipliedTenCombatTurns: true as const };
          break;
        default:
          assert(false, critterPower.range);
      }
    }
  }

  const bonus =
    critterPower.bonus !== undefined
      ? convertXmlBonus(critterPower.bonus)
      : undefined;
  let requirements: RequirementsType | undefined;
  if (critterPower.required) {
    requirements = convertRequirements(critterPower.required);
  }
  let forbidden;
  if (critterPower.forbidden) {
    forbidden = convertRequirements(critterPower.forbidden);
  }
  const source = convertSource(critterPower.source);

  let rating;
  if (critterPower.rating !== undefined) {
    rating =
      critterPower.rating === "True"
        ? { critterRating: true as const }
        : { maxRating: critterPower.rating };
  }

  // Detect and strip Free Insect Spirit requirements. If found, promote category to Insect.
  let finalCategory = critterPower.category;
  if (requirements !== undefined) {
    const filtered = analyzeAndFilterRequirementNode(requirements);
    if (filtered.foundInsect) {
      finalCategory = critterPowerCategoryEnum.Insect;
      if (filtered.node === undefined) {
        requirements = undefined;
      } else {
        const maybe = filtered.node;
        if ("oneOf" in maybe || "allOf" in maybe) {
          const check = RequirementsSchema(maybe);
          if (check instanceof type.errors) {
            assert(
              false,
              "Unexpectedly lost all requirements when filtering insect requirement from critter power. This should never happen, as the root node should always be preserved even if all children are filtered out."
            );
          }
          requirements = check;
        } else {
          const check = NonTopRequirementsArraySchema(maybe);
          if (check instanceof type.errors) {
            assert(
              false,
              "Unexpectedly lost all requirements when filtering insect requirement from critter power. This should never happen, as the root node should always be preserved even if all children are filtered out."
            );
          }
          requirements = {
            allOf: check,
          };
        }
      }
    }
  }

  let name;
  let select;
  if (typeof critterPower.name === "string") {
    name = critterPower.name;
  } else {
    name = critterPower.name.xmltext;
    select = critterPower.name._select;
  }

  return {
    name: name,
    ...(select !== undefined && { selectText: select }),
    description: "",
    ...(karma !== undefined && { karmaCost: karma }),
    ...(rating !== undefined && { rating: rating }),
    ...(powerType !== undefined && { type: powerType }),
    ...(action !== undefined && { action: action }),
    ...(range !== undefined && { range: range }),
    ...(duration !== undefined && { duration: duration }),
    category: finalCategory,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(critterPower.hide !== undefined && { userSelectable: false as const }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(forbidden !== undefined && { forbidden: forbidden }),
    source: source,
    page: critterPower.page,
  };
}
