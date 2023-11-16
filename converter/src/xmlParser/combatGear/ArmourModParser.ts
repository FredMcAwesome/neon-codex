import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sourceBookXmlEnum } from "../common/ParserCommonDefines.js";
import { convertXmlBonus } from "../common/BonusHelper.js";
import {
  ArmourModListXmlSchema,
  ArmourModListXmlType,
  ArmourModXmlType,
} from "./ArmourModParserSchemas.js";
import {
  availabilityArmourModificationSemantics,
  capacityArmourModificationSemantics,
  costArmourModificationSemantics,
} from "./ArmourModParserHelper.js";
import { convertArmourModCategory } from "./ArmourModParserHelper.js";
import {
  ArmourModListSchema,
  AvailabilityArmourModType,
  CostArmourModType,
} from "@shadowrun/common/build/schemas/armourModSchemas.js";
import { ArmourModSchema } from "@shadowrun/common/build/schemas/armourModSchemas.js";
import ArmourModifications from "../../grammar/armourModifications.ohm-bundle.js";
import { convertSource } from "../common/ParserHelper.js";
import { convertRequirements } from "../common/RequiredHelper.js";

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
  const englishArmourModList: ArmourModListXmlType = armourModList.filter(
    (armourMod) => {
      let found = false;
      switch (armourMod.source) {
        case sourceBookXmlEnum.Shadowrun5:
        case sourceBookXmlEnum.BetterThanBad:
        case sourceBookXmlEnum.BulletsAndBandages:
        case sourceBookXmlEnum.RunAndGun:
        case sourceBookXmlEnum.HardTargets:
        case sourceBookXmlEnum.CuttingAces:
        case sourceBookXmlEnum.StreetLethal:
        case sourceBookXmlEnum.KillCode:
          found = true;
          break;
        // Not in english
        case sourceBookXmlEnum.StateOfTheArtADL:
        case sourceBookXmlEnum.Schattenhandbuch:
        case sourceBookXmlEnum.Schattenhandbuch2:
        case sourceBookXmlEnum.Schattenhandbuch3:
        case sourceBookXmlEnum.Hamburg:
        case sourceBookXmlEnum.DatapulsSOTA2080:
        case sourceBookXmlEnum.DatapulsVerschlusssache:
        case sourceBookXmlEnum.Shadowrun2050:
        case 2050:
        case sourceBookXmlEnum.GrimmesErwachen:
          break;
        // Not containing Armour Mods
        case sourceBookXmlEnum.AssassinPrimer:
        case sourceBookXmlEnum.ChromeFlesh:
        case sourceBookXmlEnum.DataTrails:
        case sourceBookXmlEnum.GunHeaven3:
        case sourceBookXmlEnum.KrimeKatalog:
        case sourceBookXmlEnum.Lockdown:
        case sourceBookXmlEnum.Rigger5:
        case sourceBookXmlEnum.SailAwaySweetSister:
        case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
        case sourceBookXmlEnum.StolenSouls:
        case sourceBookXmlEnum.StreetGrimoire:
        case sourceBookXmlEnum.TheSeattleGambit:
        case sourceBookXmlEnum.StreetGrimoireErrata:
        case sourceBookXmlEnum.ShadowSpells:
        case sourceBookXmlEnum.NothingPersonal:
        case sourceBookXmlEnum.BloodyBusiness:
        case sourceBookXmlEnum.DataTrailsDissonantEchoes:
        case sourceBookXmlEnum.TheVladivostokGauntlet:
        case sourceBookXmlEnum.SplinteredState:
        case sourceBookXmlEnum.ShadowsInFocus_Butte:
        case sourceBookXmlEnum.HongKongSourcebook:
        case sourceBookXmlEnum.ShadowsInFocus_Metropole:
        case sourceBookXmlEnum.BookOfTheLost:
        case sourceBookXmlEnum.ForbiddenArcana:
        case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
        case sourceBookXmlEnum.DarkTerrors:
        case sourceBookXmlEnum.Aetherology:
        case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
        case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
        case sourceBookXmlEnum.ShadowrunQuickStartRules:
        case sourceBookXmlEnum.SprawlWilds:
        case sourceBookXmlEnum.NoFuture:
        case sourceBookXmlEnum.TheCompleteTrog:
        case sourceBookXmlEnum.HowlingShadows:
        case sourceBookXmlEnum.RunFaster:
          assert(false, armourMod.source);
          break;
      }
      return found;
    }
  );

  // console.log(englishArmourList);

  const armourModListConverted = englishArmourModList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((armourMod) => {
      const convertedArmourMod = convertArmourMod(armourMod);
      const check = ArmourModSchema.safeParse(convertedArmourMod);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        // console.log(convertedArmourMod.capacity);
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
  const capacity = capacityArmourModificationSemantics(match).eval();
  // console.log(`Capacity: ${capacity}`);

  const requirements = convertRequirements(armourMod.required);

  match = Availability.match(armourMod.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability: AvailabilityArmourModType =
    availabilityArmourModificationSemantics(match).eval();
  // console.log(`Availability: ${availability}`);

  match = Cost.match(armourMod.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
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
    capacity: capacity,
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
