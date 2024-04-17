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
  convertSpellDuration,
  convertSpellRange,
  damageSpellSemantics,
} from "./SpellParserHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import { SpellSchema } from "@neon-codex/common/build/schemas/abilities/spellSchemas.js";
import Spells from "../../grammar/spells.ohm-bundle.js";
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
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.spells.spell[337].required
  // );

  const spellListParsed = SpellListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.spells.spell
  );

  if (spellListParsed.success) console.log("spells.xml initial zod parsed");
  else {
    console.log(spellListParsed.error.errors[0]);
    assert(false);
  }

  const spellList = spellListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const spellListConverted = spellList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((spell) => {
      const convertedSpell = convertSpell(spell);
      const check = SpellSchema.safeParse(convertedSpell);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(convertedSpell);
        throw new Error(check.error.message);
      }
      return check.data;
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
  // console.log(`\n${armour.name}`);

  const category = convertSpellCategory(spell.category);
  const damageType = convertSpellDamageType(spell.damage);
  const descriptorList = convertSpellDescriptors(spell.descriptor);
  const duration = convertSpellDuration(spell.duration);
  let match = Damage.match(spell.dv);
  if (match.failed()) {
    assert(false, match.message);
  }
  const damage = damageSpellSemantics(match).eval();
  const range = convertSpellRange(spell.range);
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
    source: source,
    page: spell.page,
  };
}
