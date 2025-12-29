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
import { CritterPowerSchema, type CritterPowerType } from "@neon-codex/common";
import { convertSpellType } from "../talent/SpellParserHelper.js";
import {
  SpellPowerXmlRangeSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { actionEnum } from "@neon-codex/common";
import { type } from "arktype";

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

  const critterPowerList = critterPowerListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const critterPowerListConverted = critterPowerList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((critterPower) => {
      const convertedCritter = convertCritterPower(critterPower);
      const check = CritterPowerSchema(convertedCritter);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedCritter, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
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
  let requirements;
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

  return {
    name: critterPower.name,
    description: "",
    ...(karma !== undefined && { karma: karma }),
    ...(rating !== undefined && { rating: rating }),
    ...(powerType !== undefined && { type: powerType }),
    ...(action !== undefined && { action: action }),
    ...(range !== undefined && { range: range }),
    ...(duration !== undefined && { duration: duration }),
    category: critterPower.category,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(critterPower.hide !== undefined && { userSelectable: false as const }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(forbidden !== undefined && { forbidden: forbidden }),
    source: source,
    page: critterPower.page,
  };
}
