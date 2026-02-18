/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { augmentationXmlGradeEnum } from "../common/ParserCommonDefines.js";
import type { CyberwareXmlType } from "./CyberwareParserSchemas.js";
import { CyberwareListXmlSchema } from "./CyberwareParserSchemas.js";
import {
  convertAllowGear,
  convertAugmentationGrade,
  convertAugmentationGradeList,
  convertLimbSlot,
  convertAugmentationLimit,
  convertSource,
  convertIncludedXmlGears,
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
import { augmentationCategoryEnum, availabilityEnum } from "@neon-codex/common";
import { AugmentationSchema } from "@neon-codex/common";
import Augmentation from "../../grammar/augmentation.ohm-bundle.js";
import {
  availabilityAugmentationSemantics,
  capacityCyberwareSemantics,
  costAugmentationSemantics,
  essenceCostSemantics,
  mountsAugmentationSemantics,
} from "./augmentationParserHelper.js";
import { type } from "arktype";
const EssenceCost = Augmentation.EssenceCost;
const Availability = Augmentation.Availability;
const Cost = Augmentation.Cost;
const MountList = Augmentation.MountList;
const Capacity = Augmentation.Capacity;

export function ParseCyberwares() {
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

  const cyberwareListParsed = CyberwareListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.cyberwares.cyberware
  );

  if (cyberwareListParsed instanceof type.errors) {
    console.log(cyberwareListParsed.summary);
    assert(false);
  } else {
    console.log("cyberware.xml initial arktype parsed");
  }

  const cyberwareList = cyberwareListParsed;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const cyberwareListConverted = cyberwareList.map((cyberware) => {
    const convertedCyberware = convertCyberware(cyberware);
    const augmentation = AugmentationSchema(convertedCyberware);
    if (augmentation instanceof type.errors) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.dir(convertedCyberware, { depth: Infinity });
      throw new Error(augmentation.summary);
    }
    return augmentation;
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  let addParentWeaponAccessory;
  if (cyberware.addparentweaponaccessory !== undefined) {
    addParentWeaponAccessory = true as const;
  }

  match = Availability.match(cyberware.avail.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const availability = availabilityAugmentationSemantics(match).eval();
  if (cyberware.cost === undefined) {
    cyberware.cost = 0;
  }
  match = Cost.match(cyberware.cost.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
      ? convertIncludedXmlGears(cyberware.gears)
      : undefined;
  const { allowedGearList, allowedGearCategories } = convertAllowGear(
    cyberware.allowgear
  );
  const includedSubsystemList = convertSubsystem(cyberware.subsystems);
  const allowSubsystemCategoryList = convertSubsystemCategory(
    cyberware.allowsubsystems
  );
  const forceGrade =
    cyberware.forcegrade === undefined
      ? undefined
      : convertAugmentationGrade(cyberware.forcegrade);
  const deviceRating =
    cyberware.devicerating === undefined
      ? undefined
      : { option: availabilityEnum.Rating as const };
  const source = convertSource(cyberware.source);

  const typeInformation = {
    category: augmentationCategoryEnum.Cyberware,
    subtype: subtype,
    ...(programs !== undefined && { programs: programs }),
    ...(capacity !== undefined && { capacity: capacity }),
    ...(capacityCost !== undefined && { capacityCost: capacityCost }),
    ...(addToParentCapacity !== undefined && {
      addToParentCapacity: addToParentCapacity,
    }),
    ...(addParentWeaponAccessory !== undefined && {
      addParentWeaponAccessory: addParentWeaponAccessory,
    }),
    ...(cyberware.removalcost !== undefined && {
      removalCost: cyberware.removalcost,
    }),
    ...(inheritAttributes !== undefined && {
      inheritAttributes: inheritAttributes,
    }),
    ...(limbSlot !== undefined && { limbSlot: limbSlot }),
    ...(useBothLimbSlots !== undefined && {
      useBothLimbSlots: useBothLimbSlots,
    }),
    ...(mountLocation !== undefined && { mountsLocation: mountLocation }),
    ...(modularMount !== undefined && { modularMount: modularMount }),
    ...(wirelessBonus !== undefined && { wirelessBonus: wirelessBonus }),
    ...(wirelessPairBonus !== undefined && {
      wirelessPairBonus: wirelessPairBonus,
    }),
    ...(wirelessPairInclude !== undefined && {
      wirelessPairInclude: wirelessPairInclude,
    }),
    ...(gears !== undefined && { includedGearList: gears }),
    ...(includedSubsystemList !== undefined && {
      includedSubsystemList: includedSubsystemList,
    }),
    ...(forceGrade !== undefined && { forceGrade: forceGrade }),
    ...(deviceRating !== undefined && { deviceRating: deviceRating }),
    ...(cyberware.addvehicle !== undefined && {
      addVehicle: cyberware.addvehicle,
    }),
  };

  return {
    name: cyberware.name,
    description: "",
    ...(augmentationLimit !== undefined && {
      augmentationLimit: augmentationLimit,
    }),
    ...typeInformation,
    ...(unavailableGrades !== undefined && {
      unavailableGrades: unavailableGrades,
    }),
    essenceCost: essenceCost,
    ...(cyberwareModification !== undefined && {
      modification: cyberwareModification,
    }),
    rating: { minimum: minRating, maximum: maxRating },
    ...(ratingMeaning !== undefined && { ratingMeaning: ratingMeaning }),
    ...(addWeapon !== undefined && { addWeapon: addWeapon }),
    ...(blockedMountList.length > 0 && { blockedMountList: blockedMountList }),
    ...(selectSide !== undefined && { selectSide: selectSide }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(pairBonus !== undefined && { pairBonus: pairBonus }),
    ...(pairIncludeList !== undefined && { pairIncludeList: pairIncludeList }),
    ...(requirements !== undefined && { requirements: requirements }),
    ...(forbidden !== undefined && { forbidden: forbidden }),
    ...(allowedGearList !== undefined && { allowedGearList: allowedGearList }),
    ...(allowedGearCategories !== undefined && {
      allowedGearCategories: allowedGearCategories,
    }),
    ...(allowSubsystemCategoryList !== undefined && {
      allowSubsystemCategoryList: allowSubsystemCategoryList,
    }),
    ...(cyberware.hide !== undefined && { userSelectable: false as const }),
    availability: availability,
    cost: cost,
    source: source,
    page: cyberware.page,
  };
}
