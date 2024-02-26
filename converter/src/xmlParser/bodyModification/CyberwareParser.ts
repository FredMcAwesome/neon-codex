/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import {
  augmentationXmlGradeEnum,
  sourceBookXmlEnum,
} from "../common/ParserCommonDefines.js";
import type {
  CyberwareListXmlType,
  CyberwareXmlType,
} from "./CyberwareParserSchemas.js";
import { CyberwareListXmlSchema } from "./CyberwareParserSchemas.js";
import {
  convertAllowGear,
  convertAugmentationGrade,
  convertAugmentationGradeList,
  convertLimbSlot,
  convertAugmentationLimit,
  convertSource,
  convertXmlGears,
  convertRatingMeaning,
} from "../common/ParserHelper.js";
import {
  convertCyberwareCategory,
  convertSubsystem,
  convertMountLocation,
  convertSubsystemCategory,
  convertCyberwareRating,
} from "./CyberwareParserHelper.js";
import { convertXmlBonus } from "../common/BonusParserHelper.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
import {
  augmentationTypeEnum,
  availabilityEnum,
} from "@neon-codex/common/build/enums.js";
import { AugmentationSchema } from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import Augmentation from "../../grammar/augmentation.ohm-bundle.js";
import {
  availabilityAugmentationSemantics,
  capacityCyberwareSemantics,
  costAugmentationSemantics,
  essenceCostSemantics,
  mountsAugmentationSemantics,
} from "./augmentationParserHelper.js";
const EssenceCost = Augmentation.EssenceCost;
const Availability = Augmentation.Availability;
const Cost = Augmentation.Cost;
const MountList = Augmentation.MountList;
const Capacity = Augmentation.Capacity;

export function ParseCyberware() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/cyberware.xml"),
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
  //   jObj.chummer.cyberwares.cyberware[47].capacity
  // );

  const cyberwareListParsed = CyberwareListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.cyberwares.cyberware
  );

  if (cyberwareListParsed.success)
    console.log("cyberware.xml initial zod parsed");
  else {
    console.log(cyberwareListParsed.error.errors[0]);
    assert(false);
  }

  const cyberwareList = cyberwareListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })
  const englishCyberwareList: CyberwareListXmlType = cyberwareList.filter(
    (cyberware) => {
      let found = false;
      switch (cyberware.source) {
        case sourceBookXmlEnum.Shadowrun5:
        case sourceBookXmlEnum.Rigger5:
        case sourceBookXmlEnum.KillCode:
        case sourceBookXmlEnum.TheSeattleGambit:
        case sourceBookXmlEnum.ChromeFlesh:
        case sourceBookXmlEnum.BulletsAndBandages:
        case sourceBookXmlEnum.HardTargets:
        case sourceBookXmlEnum.Lockdown:
        case sourceBookXmlEnum.HowlingShadows:
        case sourceBookXmlEnum.TheCompleteTrog:
        case sourceBookXmlEnum.NoFuture:
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
        // Not containing Cyberware
        case sourceBookXmlEnum.DarkTerrors:
        case sourceBookXmlEnum.TheVladivostokGauntlet:
        case sourceBookXmlEnum.StolenSouls:
        case sourceBookXmlEnum.RunAndGun:
        case sourceBookXmlEnum.RunFaster:
        case sourceBookXmlEnum.CuttingAces:
        case sourceBookXmlEnum.StreetLethal:
        case sourceBookXmlEnum.AssassinPrimer:
        case sourceBookXmlEnum.DataTrails:
        case sourceBookXmlEnum.GunHeaven3:
        case sourceBookXmlEnum.KrimeKatalog:
        case sourceBookXmlEnum.SailAwaySweetSister:
        case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
        case sourceBookXmlEnum.StreetGrimoire:
        case sourceBookXmlEnum.StreetGrimoireErrata:
        case sourceBookXmlEnum.ShadowSpells:
        case sourceBookXmlEnum.NothingPersonal:
        case sourceBookXmlEnum.BloodyBusiness:
        case sourceBookXmlEnum.DataTrailsDissonantEchoes:
        case sourceBookXmlEnum.SplinteredState:
        case sourceBookXmlEnum.ShadowsInFocus_Butte:
        case sourceBookXmlEnum.HongKongSourcebook:
        case sourceBookXmlEnum.ShadowsInFocus_Metropole:
        case sourceBookXmlEnum.BookOfTheLost:
        case sourceBookXmlEnum.ForbiddenArcana:
        case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
        case sourceBookXmlEnum.BetterThanBad:
        case sourceBookXmlEnum.Aetherology:
        case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
        case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
        case sourceBookXmlEnum.ShadowrunQuickStartRules:
        case sourceBookXmlEnum.SprawlWilds:
          assert(false, cyberware.source);
          break;
      }
      return found;
    }
  );

  const cyberwareListConverted = englishCyberwareList.map((cyberware) => {
    const convertedCyberware = convertCyberware(cyberware);
    const check = AugmentationSchema.safeParse(convertedCyberware);
    if (!check.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(convertedCyberware);
      throw new Error(check.error.message);
    }
    return check.data;
  });
  // console.log(cyberwareListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/cyberwares.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(cyberwareListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertCyberware(cyberware: CyberwareXmlType) {
  const augmentationLimit = convertAugmentationLimit(cyberware.limit);
  const subtype = convertCyberwareCategory(cyberware.category);
  const unavailableGrades =
    cyberware.bannedgrades !== undefined
      ? convertAugmentationGradeList(cyberware.bannedgrades.grade)
      : undefined;
  let match = EssenceCost.match(cyberware.ess.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const essenceCost = essenceCostSemantics(match).eval();
  let cyberwareModification;
  if (cyberware.addtoparentess !== undefined) {
    //TODO use requireparent somehow...
    // assert(
    //   cyberware.requireparent !== undefined,
    //   `Missing requireparent for ${cyberware.name}`
    // );
    cyberwareModification = true as const;
  }
  const maxRating =
    cyberware.rating !== undefined
      ? convertCyberwareRating(cyberware.rating)
      : [1];
  const minRating =
    cyberware.minrating !== undefined
      ? convertCyberwareRating(cyberware.minrating)
      : [1];
  const ratingMeaning = convertRatingMeaning(cyberware.ratinglabel);

  const addWeapon =
    cyberware.addweapon === undefined
      ? undefined
      : cyberware.addweapon === ""
      ? undefined
      : cyberware.addweapon;

  const programs = cyberware.programs;

  let capacity;
  let capacityCost;
  if (cyberware.capacity !== undefined) {
    match = Capacity.match(cyberware.capacity.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    capacity = capacityCyberwareSemantics(match).eval();
    if ("ratingLinked" in capacity && capacity.ratingLinked !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      capacityCost = {
        ratingLinked: capacity.ratingLinked.map(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          (capacity: { cost: any }) => {
            return capacity.cost;
          }
        ),
      };
      capacity = undefined;
    } else if ("cost" in capacity && capacity.cost !== undefined) {
      capacityCost = capacity.cost;
      capacity = undefined;
    }
  } else {
    capacity = [0];
  }

  let addToParentCapacity;
  if (cyberware.addtoparentcapacity !== undefined) {
    addToParentCapacity = true as const;
  }
  let addParentWeaponCapacity;
  if (cyberware.addparentweaponaccessory !== undefined) {
    addParentWeaponCapacity = true as const;
  }

  match = Availability.match(cyberware.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const availability = availabilityAugmentationSemantics(match).eval();
  if (cyberware.cost === undefined) {
    cyberware.cost = 0;
  }
  match = Cost.match(cyberware.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  const cost = costAugmentationSemantics(match).eval();

  const inheritAttributes =
    cyberware.inheritattributes === undefined ? undefined : true;

  const limbSlot =
    cyberware.limbslot === undefined
      ? undefined
      : convertLimbSlot(cyberware.limbslot);
  const useBothLimbSlots =
    cyberware.limbslotcount === undefined ? undefined : true;

  let mountLocation =
    cyberware.mountsto === undefined
      ? undefined
      : convertMountLocation(cyberware.mountsto);
  if (cyberware.modularmount !== undefined) {
    if (cyberware.mountsto !== undefined) {
      assert(cyberware.modularmount === cyberware.mountsto, cyberware.name);
    }
    mountLocation = convertMountLocation(cyberware.modularmount);
  }
  const modularMount = cyberware.modularmount === undefined ? undefined : true;

  let blockedMountList: Array<string> = [];
  if (cyberware.blocksmounts !== undefined) {
    match = MountList.match(cyberware.blocksmounts.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    blockedMountList = mountsAugmentationSemantics(match).eval();
  }

  const selectSide = cyberware.selectside === undefined ? undefined : true;

  const bonus =
    cyberware.bonus !== undefined
      ? convertXmlBonus(cyberware.bonus)
      : undefined;
  const pairBonus =
    cyberware.pairbonus !== undefined
      ? convertXmlBonus(cyberware.pairbonus)
      : undefined;
  const pairIncludeList =
    cyberware.pairinclude !== undefined
      ? Array.isArray(cyberware.pairinclude.name)
        ? cyberware.pairinclude.name
        : [cyberware.pairinclude.name]
      : undefined;

  const wirelessBonus =
    cyberware.wirelessbonus !== undefined
      ? convertXmlBonus(cyberware.wirelessbonus)
      : undefined;
  const wirelessPairBonus =
    cyberware.wirelesspairbonus !== undefined
      ? convertXmlBonus(cyberware.wirelesspairbonus)
      : undefined;
  const wirelessPairInclude =
    cyberware.wirelesspairinclude !== undefined
      ? cyberware.wirelesspairinclude.name
      : undefined;

  let requirements;
  if (cyberware.required) {
    requirements = convertRequirements(cyberware.required);
  }
  let forbidden;
  if (cyberware.forbidden) {
    forbidden = convertRequirements(cyberware.forbidden);
  }

  const gears =
    cyberware.gears !== undefined
      ? convertXmlGears(cyberware.gears)
      : undefined;
  const { allowedGearList, allowedGearCategories } = convertAllowGear(
    cyberware.allowgear
  );
  const subsystemList = convertSubsystem(cyberware.subsystems);
  const allowCategoryList = convertSubsystemCategory(cyberware.allowsubsystems);
  const forceGrade =
    cyberware.forcegrade === undefined
      ? undefined
      : convertAugmentationGrade(
          cyberware.forcegrade as augmentationXmlGradeEnum
        );
  const deviceRating =
    cyberware.devicerating === undefined
      ? undefined
      : { option: availabilityEnum.Rating as const };
  const source = convertSource(cyberware.source);

  const typeInformation = {
    type: augmentationTypeEnum.Cyberware,
    subtype: subtype,
    programs: programs,
    capacity: capacity,
    capacityCost: capacityCost,
    addToParentCapacity: addToParentCapacity,
    addParentWeaponAccessory: addParentWeaponCapacity,
    removalCost: cyberware.removalcost,
    inheritAttributes: inheritAttributes,
    limbSlot: limbSlot,
    useBothLimbSlots: useBothLimbSlots,
    mountsLocation: mountLocation,
    modularMount: modularMount,
    wirelessBonus: wirelessBonus,
    wirelessPairBonus: wirelessPairBonus,
    wirelessPairInclude: wirelessPairInclude,
    includedGearList: gears,
    subsystemList: subsystemList,
    forceGrade: forceGrade,
    deviceRating: deviceRating,
    addVehicle: cyberware.addvehicle,
  };

  return {
    name: cyberware.name,
    description: "",
    augmentationLimit: augmentationLimit,
    ...typeInformation,
    unavailableGrades: unavailableGrades,
    essenceCost: essenceCost,
    modification: cyberwareModification,
    rating: { minimum: minRating, maximum: maxRating },
    ratingMeaning: ratingMeaning,
    addWeapon: addWeapon,
    ...(blockedMountList.length > 0 && { blockedMountList: blockedMountList }),
    selectSide: selectSide,
    bonus: bonus,
    pairBonus: pairBonus,
    pairIncludeList: pairIncludeList,
    requirements: requirements,
    forbidden: forbidden,
    allowedGearList: allowedGearList,
    allowedGearCategories: allowedGearCategories,
    allowCategoryList: allowCategoryList,
    ...(cyberware.hide !== undefined && { userSelectable: false as const }),
    availability: availability,
    cost: cost,
    source: source,
    page: cyberware.page,
  };
}
