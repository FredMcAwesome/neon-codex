/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { ArmourListXmlSchema } from "./ArmourParserSchemas.js";
import type { ArmourXmlType } from "./ArmourParserSchemas.js";
import {
  availabilityArmourSemantics,
  convertArmourCategory,
  costArmourSemantics,
} from "./ArmourParserHelper.js";
import {
  ArmourListSchema,
  ArmourSchema,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import type {
  AvailabilityArmourType,
  CostArmourType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import Armours from "../../grammar/armours.ohm-bundle.js";
import {
  convertSource,
  convertXmlGears,
  convertXmlModObject,
} from "../common/ParserHelper.js";
import { convertArmourModCategory } from "./ArmourModParserHelper.js";
const Availability = Armours.Availability;
const Cost = Armours.Cost;

export function ParseArmour() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/armor.xml"),
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
  //   jObj.chummer.armors.armor[193].gears.usegear
  // );

  const armourListParsed = ArmourListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.armors.armor
  );

  if (armourListParsed.success) console.log("armor.xml initial zod parsed");
  else {
    console.log(armourListParsed.error.errors[0]);
    assert(false);
  }

  const armourList = armourListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const armourListConverted = armourList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((armour) => {
      const convertedArmour = convertArmour(armour);
      const check = ArmourSchema.safeParse(convertedArmour);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedArmour, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(armourListConverted);
  const check = ArmourListSchema.safeParse(armourListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/armours.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(armourListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertArmour(armour: ArmourXmlType) {
  // console.log(`\n${armour.name}`);

  const category = convertArmourCategory(armour.category);
  const damageReduction =
    typeof armour.armor === "number" ? armour.armor : { option: armour.armor };
  const capacity =
    typeof armour.armorcapacity === "number"
      ? armour.armorcapacity
      : { option: armour.armorcapacity };

  // check that the name always refers to the same name as this item
  if (armour.addweapon !== undefined) assert(armour.addweapon === armour.name);

  const gears =
    armour.gears !== undefined ? convertXmlGears(armour.gears) : undefined;

  let match = Availability.match(armour.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability: AvailabilityArmourType =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    availabilityArmourSemantics(match).eval();
  match = Cost.match(armour.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const cost: CostArmourType = costArmourSemantics(match).eval();

  const bonus =
    armour.bonus !== undefined ? convertXmlBonus(armour.bonus) : undefined;
  const wirelessBonus =
    armour.wirelessbonus !== undefined
      ? convertXmlBonus(armour.wirelessbonus)
      : undefined;

  const includedMods =
    armour.mods !== undefined ? convertXmlModObject(armour.mods) : undefined;
  const allowModCategory =
    armour.addmodcategory !== undefined
      ? convertArmourModCategory(armour.addmodcategory)
      : undefined;
  const addModFromXmlCategory =
    armour.selectmodsfromcategory !== undefined
      ? armour.selectmodsfromcategory.category
      : undefined;
  const source = convertSource(armour.source);

  return {
    name: armour.name,
    description: "",
    category: category,
    ...(armour.rating !== undefined && { maxRating: armour.rating }),
    damageReduction: damageReduction,
    ...(armour.armoroverride !== undefined && {
      customFitStackDamageReduction: armour.armoroverride,
    }),
    capacity: capacity,
    ...(armour.addweapon !== undefined && {
      isWeapon: true,
    }),
    availability: availability,
    cost: cost,
    ...(gears !== undefined && {
      includedGearList: gears,
    }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(wirelessBonus !== undefined && { wirelessBonus: wirelessBonus }),
    ...(includedMods !== undefined && { includedMods: includedMods }),
    allowModsFromCategory: allowModCategory,
    addModFromCategory: addModFromXmlCategory,
    source: source,
    page: armour.page,
  };
}
