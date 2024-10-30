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
  CritterPowerSchema,
  type CritterPowerType,
} from "@neon-codex/common/build/schemas/abilities/talent/critterPowerSchemas.js";
import { convertSpellType } from "../talent/SpellParserHelper.js";
import {
  SpellPowerXmlRangeSchema,
  XmlDurationSchema,
} from "../common/ParserCommonDefines.js";
import { actionEnum } from "@neon-codex/common/build/enums.js";

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

  const critterPowerListParsed = CritterPowerListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.powers.power
  );

  if (critterPowerListParsed.success)
    console.log("critterpowers.xml initial zod parsed");
  else {
    console.log(critterPowerListParsed.error.errors[0]);
    assert(false);
  }

  const critterPowerList = critterPowerListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const critterPowerListConverted = critterPowerList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((critterPower) => {
      const convertedCritter = convertCritterPower(critterPower);
      const check = CritterPowerSchema.safeParse(convertedCritter);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedCritter, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
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
  let type;
  if (critterPower.type !== "") {
    if (critterPower.type === "As Spell") {
      type = { spellType: true as const };
    } else if (critterPower.type === "As ritual") {
      type = { ritualType: true as const };
    } else if (critterPower.type === "Device") {
      type = { device: true as const };
    } else if (critterPower.type === "Host") {
      type = { host: true as const };
    } else if (critterPower.type === "File") {
      type = { file: true as const };
    } else if (critterPower.type === "Icon") {
      type = { icon: true as const };
    } else if (critterPower.type === "Persona") {
      type = { persona: true as const };
    } else if (critterPower.type === "Persona or Device") {
      type = { personaOrDevice: true as const };
    } else {
      type = convertSpellType(critterPower.type);
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
    const check = SpellPowerXmlRangeSchema.safeParse(critterPower.range);
    if (check.success) {
      range = { rangeCalc: convertSpellPowerRange(check.data) };
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
    const check = XmlDurationSchema.safeParse(critterPower.duration);
    if (check.success) {
      duration = convertDuration(check.data);
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
    karma: karma,
    rating: rating,
    type: type,
    action: action,
    range: range,
    duration: duration,
    category: critterPower.category,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(critterPower.hide !== undefined && { userSelectable: false as const }),
    requirements: requirements,
    forbidden: forbidden,
    source: source,
    page: critterPower.page,
  };
}
