/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { ArmourModListXmlSchema } from "./ArmourModParserSchemas.js";
import type { ArmourModXmlType } from "./ArmourModParserSchemas.js";
import {
  availabilityArmourModificationSemantics,
  capacityArmourModificationSemantics,
  costArmourModificationSemantics,
} from "./ArmourModParserHelper.js";
import { convertArmourModCategory } from "./ArmourModParserHelper.js";
import { ArmourModListSchema } from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas.js";
import type {
  AvailabilityArmourModType,
  CostArmourModType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas.js";
import { ArmourModSchema } from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas.js";
import ArmourModifications from "../../grammar/armourModifications.ohm-bundle.js";
import { convertSource } from "../common/ParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";

const Availability = ArmourModifications.Availability;
const Cost = ArmourModifications.Cost;
const Capacity = ArmourModifications.Capacity;

export function ParseArmourMods() {
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
  //   jObj.chummer.mods.mod[58]
  // );

  const armourModListParsed = ArmourModListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mods.mod
  );

  if (armourModListParsed.success)
    console.log("armor.xml (Mods) initial zod parsed");
  else {
    console.log(armourModListParsed.error.errors[0]);
    assert(false);
  }

  const armourModList = armourModListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const armourModListConverted = armourModList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((armourMod) => {
      const convertedArmourMod = convertArmourMod(armourMod);
      const check = ArmourModSchema.safeParse(convertedArmourMod);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedArmourMod, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(armourModListConverted);
  const check = ArmourModListSchema.safeParse(armourModListConverted);
  if (!check.success) {
    throw new Error(check.error.message);
  }
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/armourMods.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(armourModListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertArmourMod(armourMod: ArmourModXmlType) {
  // console.log(`\n${armourMod.name}`);

  const category = convertArmourModCategory(armourMod.category);
  const damageReduction =
    typeof armourMod.armor === "number"
      ? armourMod.armor
      : { option: armourMod.armor };

  let match = Capacity.match(armourMod.armorcapacity);
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const capacityCost = capacityArmourModificationSemantics(match).eval();
  // console.log(`Capacity: ${capacity}`);

  let requirements;
  if (armourMod.required) {
    requirements = convertRequirements(armourMod.required);
  }

  match = Availability.match(armourMod.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability: AvailabilityArmourModType =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    availabilityArmourModificationSemantics(match).eval();
  // console.log(`Availability: ${availability}`);

  match = Cost.match(armourMod.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const cost: CostArmourModType = costArmourModificationSemantics(match).eval();
  // console.log(`Cost: ${cost}`);

  const bonus =
    armourMod.bonus !== undefined
      ? convertXmlBonus(armourMod.bonus)
      : undefined;
  const wirelessBonus =
    armourMod.wirelessbonus !== undefined
      ? convertXmlBonus(armourMod.wirelessbonus)
      : undefined;
  const source = convertSource(armourMod.source);

  return {
    name: armourMod.name,
    description: "",
    category: category,
    maxRating: armourMod.maxrating,
    damageReduction: damageReduction,
    capacityCost: capacityCost,
    ...(requirements !== undefined && { hostArmourRequirements: requirements }),
    availability: availability,
    cost: cost,
    ...(bonus !== undefined && { bonus: bonus }),
    ...(wirelessBonus !== undefined && { wirelessBonus: wirelessBonus }),
    ...(armourMod.hide !== undefined && { userSelectable: false as const }),
    source: source,
    page: armourMod.page,
  };
}
