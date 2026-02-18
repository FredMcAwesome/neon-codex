/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { SpellListXmlSchema } from "./SpellParserSchemas.js";
import type { SpellXmlType } from "./SpellParserSchemas.js";
import {
  convertSpellDamageType,
  convertSpellType,
} from "./SpellParserHelper.js";
import {
  convertSpellCategory,
  convertSpellDescriptors,
  damageSpellSemantics,
} from "./SpellParserHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import {
  convertDuration,
  convertSource,
  convertSpellPowerRange,
} from "../common/ParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { SpellSchema } from "@neon-codex/common";
import Spells from "../../grammar/spells.ohm-bundle.js";
import { type } from "arktype";
const Damage = Spells.Damage;

export function ParseSpells() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/spells.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jObj: any = parser.parse(xml_string);
  // console.dir(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.spells.spell[111],
  //   { depth: Infinity }
  // );

  const spellListParsed = SpellListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.spells.spell
  );

  if (spellListParsed instanceof type.errors) {
    console.log(spellListParsed.summary);
    assert(false);
  } else {
    console.log("spells.xml initial arktype parsed");
  }

  const spellList = spellListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const spellListConverted = spellList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((spell) => {
      const convertedSpell = convertSpell(spell);
      const check = SpellSchema(convertedSpell);
      if (check instanceof type.errors) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedSpell, { depth: Infinity });
        throw new Error(check.summary);
      }
      return check;
    });
  // console.log(spellListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/spells.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(spellListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertSpell(spell: SpellXmlType) {
  // console.log(`\n${spell.name}`);

  const category = convertSpellCategory(spell.category);
  const damageType = convertSpellDamageType(spell.damage);
  const descriptorList = convertSpellDescriptors(spell.descriptor);
  const duration = convertDuration(spell.duration);
  let damage;
  if (typeof spell.dv === "string") {
    const match = Damage.match(spell.dv);
    if (match.failed()) {
      assert(false, match.message);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    damage = damageSpellSemantics(match).eval();
  } else {
    damage = spell.dv;
  }
  const range = convertSpellPowerRange(spell.range);
  const type = convertSpellType(spell.type);

  const bonus =
    spell.bonus !== undefined ? convertXmlBonus(spell.bonus) : undefined;
  const requirements =
    spell.required !== undefined
      ? convertRequirements(spell.required)
      : undefined;
  const source = convertSource(spell.source);

  return {
    name: spell.name,
    description: "",
    category: category,
    damageType: damageType,
    descriptorList: descriptorList,
    duration: duration,
    damage: damage,
    range: range,
    type: type,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(spell.useskill !== undefined && { useSkill: spell.useskill }),
    source: source,
    page: spell.page,
  };
}
