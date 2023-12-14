import {
  attributeTypeEnum,
  augmentationGradeEnum,
  augmentationLimitEnum,
  gearCategoryEnum,
  limbSlotEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import { ModListType } from "@shadowrun/common/build/schemas/shared/modSchemas.js";
import assert from "assert";
import {
  attributeXMLEnum,
  CategoryXmlListType,
  augmentationXmlGradeEnum,
  AugmentationXmlLimitType,
  xmlAllowGearType,
  limbSlotXmlEnum,
  GearXmlCategoryEnum,
} from "./ParserCommonDefines.js";
import type {
  GearXmlType,
  ModListXmlType,
  ModRecursiveXmlType,
  ModXmlType,
} from "./ParserCommonDefines.js";
import { sourceBookXmlEnum } from "./ParserCommonDefines.js";
import {
  AllowedGearType,
  UseGearListType,
} from "@shadowrun/common/build/schemas/commonSchemas.js";

export const convertSource = function (source: sourceBookXmlEnum | 2050) {
  const xmlSource = source === 2050 ? sourceBookXmlEnum.Shadowrun2050 : source;
  switch (xmlSource) {
    case sourceBookXmlEnum.AssassinPrimer:
      return sourceBookEnum.AssassinPrimer;
    case sourceBookXmlEnum.ChromeFlesh:
      return sourceBookEnum.ChromeFlesh;
    case sourceBookXmlEnum.CuttingAces:
      return sourceBookEnum.CuttingAces;
    case sourceBookXmlEnum.DataTrails:
      return sourceBookEnum.DataTrails;
    case sourceBookXmlEnum.GunHeaven3:
      return sourceBookEnum.GunHeaven3;
    case sourceBookXmlEnum.HardTargets:
      return sourceBookEnum.HardTargets;
    case sourceBookXmlEnum.KillCode:
      return sourceBookEnum.KillCode;
    case sourceBookXmlEnum.KrimeKatalog:
      return sourceBookEnum.KrimeKatalog;
    case sourceBookXmlEnum.Lockdown:
      return sourceBookEnum.Lockdown;
    case sourceBookXmlEnum.NoFuture:
      return sourceBookEnum.NoFuture;
    case sourceBookXmlEnum.Rigger5:
      return sourceBookEnum.Rigger5;
    case sourceBookXmlEnum.RunAndGun:
      return sourceBookEnum.RunAndGun;
    case sourceBookXmlEnum.RunFaster:
      return sourceBookEnum.RunFaster;
    case sourceBookXmlEnum.SailAwaySweetSister:
      return sourceBookEnum.SailAwaySweetSister;
    case sourceBookXmlEnum.Shadowrun5:
      return sourceBookEnum.Shadowrun5;
    case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
      return sourceBookEnum.ShadowsInFocus_SanFranciscoMetroplex;
    case sourceBookXmlEnum.StolenSouls:
      return sourceBookEnum.StolenSouls;
    case sourceBookXmlEnum.StreetGrimoire:
      return sourceBookEnum.StreetGrimoire;
    case sourceBookXmlEnum.StreetLethal:
      return sourceBookEnum.StreetLethal;
    case sourceBookXmlEnum.TheCompleteTrog:
      return sourceBookEnum.TheCompleteTrog;
    case sourceBookXmlEnum.TheSeattleGambit:
      return sourceBookEnum.TheSeattleGambit;
    case sourceBookXmlEnum.Aetherology:
      return sourceBookEnum.Aetherology;
    case sourceBookXmlEnum.BetterThanBad:
      return sourceBookEnum.BetterThanBad;
    case sourceBookXmlEnum.BloodyBusiness:
      return sourceBookEnum.BloodyBusiness;
    case sourceBookXmlEnum.BookOfTheLost:
      return sourceBookEnum.BookOfTheLost;
    case sourceBookXmlEnum.BulletsAndBandages:
      return sourceBookEnum.BulletsAndBandages;
    case sourceBookXmlEnum.DarkTerrors:
      return sourceBookEnum.DarkTerrors;
    case sourceBookXmlEnum.DataTrailsDissonantEchoes:
      return sourceBookEnum.DataTrailsDissonantEchoes;
    case sourceBookXmlEnum.ForbiddenArcana:
      return sourceBookEnum.ForbiddenArcana;
    case sourceBookXmlEnum.HongKongSourcebook:
      return sourceBookEnum.HongKongSourcebook;
    case sourceBookXmlEnum.HowlingShadows:
      return sourceBookEnum.HowlingShadows;
    case sourceBookXmlEnum.NothingPersonal:
      return sourceBookEnum.NothingPersonal;
    case sourceBookXmlEnum.ShadowrunMissions0803_10BlockTango:
      return sourceBookEnum.ShadowrunMissions0803_10BlockTango;
    case sourceBookXmlEnum.ShadowrunMissions0804_DirtyLaundry:
      return sourceBookEnum.ShadowrunMissions0804_DirtyLaundry;
    case sourceBookXmlEnum.ShadowrunQuickStartRules:
      return sourceBookEnum.ShadowrunQuickStartRules;
    case sourceBookXmlEnum.ShadowSpells:
      return sourceBookEnum.ShadowSpells;
    case sourceBookXmlEnum.ShadowsInFocus_Butte:
      return sourceBookEnum.ShadowsInFocus_Butte;
    case sourceBookXmlEnum.ShadowsInFocus_Metropole:
      return sourceBookEnum.ShadowsInFocus_Metropole;
    case sourceBookXmlEnum.ShadowsInFocus_SiouxNation_CountingCoup:
      return sourceBookEnum.ShadowsInFocus_SiouxNation_CountingCoup;
    case sourceBookXmlEnum.SprawlWilds:
      return sourceBookEnum.SprawlWilds;
    case sourceBookXmlEnum.SplinteredState:
      return sourceBookEnum.SplinteredState;
    case sourceBookXmlEnum.StreetGrimoireErrata:
      return sourceBookEnum.StreetGrimoireErrata;
    case sourceBookXmlEnum.TheVladivostokGauntlet:
      return sourceBookEnum.TheVladivostokGauntlet;
    // Not in english
    case sourceBookXmlEnum.StateOfTheArtADL:
    case sourceBookXmlEnum.Schattenhandbuch:
    case sourceBookXmlEnum.Schattenhandbuch2:
    case sourceBookXmlEnum.Schattenhandbuch3:
    case sourceBookXmlEnum.Hamburg:
    case sourceBookXmlEnum.DatapulsSOTA2080:
    case sourceBookXmlEnum.DatapulsVerschlusssache:
    case sourceBookXmlEnum.Shadowrun2050:
    case sourceBookXmlEnum.GrimmesErwachen:
      assert(false, "Only english books should get here.");
      break;
  }
};

export const convertGearCategory = function (category: GearXmlCategoryEnum) {
  switch (category) {
    case GearXmlCategoryEnum.AlchemicalTools:
      return gearCategoryEnum.AlchemicalTools;
    case GearXmlCategoryEnum.Ammunition:
      return gearCategoryEnum.Ammunition;
    case GearXmlCategoryEnum.ArmorEnhancements:
      return gearCategoryEnum.ArmorEnhancements;
    case GearXmlCategoryEnum.AudioDevices:
      return gearCategoryEnum.AudioDevices;
    case GearXmlCategoryEnum.AudioEnhancements:
      return gearCategoryEnum.AudioEnhancements;
    case GearXmlCategoryEnum.Autosofts:
      return gearCategoryEnum.Autosofts;
    case GearXmlCategoryEnum.Biotech:
      return gearCategoryEnum.Biotech;
    case GearXmlCategoryEnum.BreakingAndEnteringGear:
      return gearCategoryEnum.BreakingAndEnteringGear;
    case GearXmlCategoryEnum.BTLs:
      return gearCategoryEnum.BTLs;
    case GearXmlCategoryEnum.Chemicals:
      return gearCategoryEnum.Chemicals;
    case GearXmlCategoryEnum.Commlinks:
      return gearCategoryEnum.Commlinks;
    case GearXmlCategoryEnum.Commlink_CyberdeckFormFactors:
      return gearCategoryEnum.Commlink_CyberdeckFormFactors;
    case GearXmlCategoryEnum.CommlinkAccessories:
      return gearCategoryEnum.CommlinkAccessories;
    case GearXmlCategoryEnum.CommlinkApps:
      return gearCategoryEnum.CommlinkApps;
    case GearXmlCategoryEnum.CommonPrograms:
      return gearCategoryEnum.CommonPrograms;
    case GearXmlCategoryEnum.CommunicationsAndCountermeasures:
      return gearCategoryEnum.CommunicationsAndCountermeasures;
    case GearXmlCategoryEnum.Contracts_Upkeep:
      return gearCategoryEnum.Contracts_Upkeep;
    case GearXmlCategoryEnum.CritterGear:
      return gearCategoryEnum.CritterGear;
    case GearXmlCategoryEnum.Currency:
      return gearCategoryEnum.Currency;
    case GearXmlCategoryEnum.Custom:
      return gearCategoryEnum.Custom;
    case GearXmlCategoryEnum.CustomCyberdeckAttributes:
      return gearCategoryEnum.CustomCyberdeckAttributes;
    case GearXmlCategoryEnum.CustomDrug:
      return gearCategoryEnum.CustomDrug;
    case GearXmlCategoryEnum.CyberdeckModules:
      return gearCategoryEnum.CyberdeckModules;
    case GearXmlCategoryEnum.Cyberdecks:
      return gearCategoryEnum.Cyberdecks;
    case GearXmlCategoryEnum.Cyberterminals:
      return gearCategoryEnum.Cyberterminals;
    case GearXmlCategoryEnum.Disguises:
      return gearCategoryEnum.Disguises;
    case GearXmlCategoryEnum.Drugs:
      return gearCategoryEnum.Drugs;
    case GearXmlCategoryEnum.ElectronicsAccessories:
      return gearCategoryEnum.ElectronicsAccessories;
    case GearXmlCategoryEnum.ElectronicModification:
      return gearCategoryEnum.ElectronicModification;
    case GearXmlCategoryEnum.ElectronicParts:
      return gearCategoryEnum.ElectronicParts;
    case GearXmlCategoryEnum.Entertainment:
      return gearCategoryEnum.Entertainment;
    case GearXmlCategoryEnum.Explosives:
      return gearCategoryEnum.Explosives;
    case GearXmlCategoryEnum.ExtractionDevices:
      return gearCategoryEnum.ExtractionDevices;
    case GearXmlCategoryEnum.Foci:
      return gearCategoryEnum.Foci;
    case GearXmlCategoryEnum.Food:
      return gearCategoryEnum.Food;
    case GearXmlCategoryEnum.Formulae:
      return gearCategoryEnum.Formulae;
    case GearXmlCategoryEnum.GrappleGun:
      return gearCategoryEnum.GrappleGun;
    case GearXmlCategoryEnum.HackingPrograms:
      return gearCategoryEnum.HackingPrograms;
    case GearXmlCategoryEnum.Housewares:
      return gearCategoryEnum.Housewares;
    case GearXmlCategoryEnum.ID_Credsticks:
      return gearCategoryEnum.ID_Credsticks;
    case GearXmlCategoryEnum.MagicalCompounds:
      return gearCategoryEnum.MagicalCompounds;
    case GearXmlCategoryEnum.MagicalSupplies:
      return gearCategoryEnum.MagicalSupplies;
    case GearXmlCategoryEnum.Metatype_Specific:
      return gearCategoryEnum.MetatypeSpecific;
    case GearXmlCategoryEnum.Miscellany:
      return gearCategoryEnum.Miscellany;
    case GearXmlCategoryEnum.MusicalInstruments:
      return gearCategoryEnum.MusicalInstruments;
    case GearXmlCategoryEnum.Nanogear:
      return gearCategoryEnum.Nanogear;
    case GearXmlCategoryEnum.Paydata:
      return gearCategoryEnum.Paydata;
    case GearXmlCategoryEnum.PI_Tac:
      return gearCategoryEnum.PiTac;
    case GearXmlCategoryEnum.Printing:
      return gearCategoryEnum.Printing;
    case GearXmlCategoryEnum.ReporterGear:
      return gearCategoryEnum.ReporterGear;
    case GearXmlCategoryEnum.RFIDTags:
      return gearCategoryEnum.RFIDTags;
    case GearXmlCategoryEnum.RiggerCommandConsoles:
      return gearCategoryEnum.RiggerCommandConsoles;
    case GearXmlCategoryEnum.SecurityDevices:
      return gearCategoryEnum.SecurityDevices;
    case GearXmlCategoryEnum.Sensors:
      return gearCategoryEnum.Sensors;
    case GearXmlCategoryEnum.SensorFunctions:
      return gearCategoryEnum.SensorFunctions;
    case GearXmlCategoryEnum.SensorHousings:
      return gearCategoryEnum.SensorHousings;
    case GearXmlCategoryEnum.Services:
      return gearCategoryEnum.Services;
    case GearXmlCategoryEnum.Skillsofts:
      return gearCategoryEnum.Skillsofts;
    case GearXmlCategoryEnum.Software:
      return gearCategoryEnum.Software;
    case GearXmlCategoryEnum.SoftwareTweaks:
      return gearCategoryEnum.SoftwareTweaks;
    case GearXmlCategoryEnum.SurvivalGear:
      return gearCategoryEnum.SurvivalGear;
    case GearXmlCategoryEnum.TailoredPerfume_Cologne:
      return gearCategoryEnum.TailoredPerfume_Cologne;
    case GearXmlCategoryEnum.Tools:
      return gearCategoryEnum.Tools;
    case GearXmlCategoryEnum.ToolsOfTheTrade:
      return gearCategoryEnum.ToolsOfTheTrade;
    case GearXmlCategoryEnum.Toxins:
      return gearCategoryEnum.Toxins;
    case GearXmlCategoryEnum.VisionDevices:
      return gearCategoryEnum.VisionDevices;
    case GearXmlCategoryEnum.VisionEnhancements:
      return gearCategoryEnum.VisionEnhancements;
    case GearXmlCategoryEnum.MatrixAccessories:
      return gearCategoryEnum.MatrixAccessories;
    case GearXmlCategoryEnum.BoosterChips:
      return gearCategoryEnum.BoosterChips;
    case GearXmlCategoryEnum.AppearanceModification:
      return gearCategoryEnum.AppearanceModification;
    case GearXmlCategoryEnum.DrugGrades:
      return gearCategoryEnum.DrugGrades;
    case GearXmlCategoryEnum.Pi_TacPrograms:
      return gearCategoryEnum.PiTacPrograms;
    case GearXmlCategoryEnum.HardNanoware:
      return gearCategoryEnum.HardNanoware;
  }
};

export const convertAllowGear = function (
  xmlAllowGear: xmlAllowGearType | undefined
): AllowedGearType | undefined {
  if (!xmlAllowGear) {
    return undefined;
  }
  if (typeof xmlAllowGear === "string") {
    return { gearNameList: [xmlAllowGear] };
  }
  // console.log("Allow Gear: " + xmlAllowGear.toString());
  const gearXmlCategories =
    xmlAllowGear.gearcategory === undefined
      ? undefined
      : Array.isArray(xmlAllowGear.gearcategory)
      ? xmlAllowGear.gearcategory
      : [xmlAllowGear.gearcategory];
  let gearCategories;
  if (gearXmlCategories !== undefined) {
    gearCategories = gearXmlCategories.map((gearCategory) =>
      convertGearCategory(gearCategory)
    );
  }

  const gearNames =
    xmlAllowGear.gearname === undefined
      ? undefined
      : Array.isArray(xmlAllowGear.gearname)
      ? xmlAllowGear.gearname
      : [xmlAllowGear.gearname];
  assert(!(gearNames === undefined && gearCategories === undefined));
  return { gearNameList: gearNames, gearCategoryList: gearCategories };
};

// TODO: handle gear correctly
export function convertXmlGears(gears: GearXmlType): UseGearListType {
  const xmlUseGear = Array.isArray(gears.usegear)
    ? gears.usegear
    : [gears.usegear];
  return xmlUseGear.map((useGear) => {
    if (typeof useGear === "string") {
      return {
        name: useGear,
      };
    } else if ("xmltext" in useGear) {
      const enterName =
        useGear._select !== undefined
          ? useGear._select === ""
            ? (true as const)
            : useGear._select
          : undefined;
      const rating =
        useGear._rating !== undefined ? parseInt(useGear._rating) : undefined;
      const consumeCapacity =
        useGear._consumecapacity !== undefined ? (true as const) : undefined;
      const quantity =
        useGear._costfor !== undefined ? parseInt(useGear._costfor) : undefined;

      return {
        name: useGear.xmltext,
        enterName: enterName,
        rating: rating,
        consumeCapacity: consumeCapacity,
        quantity: quantity,
      };
    }
    let category;
    if (useGear.category) {
      category = convertGearCategory(useGear.category);
    }
    if (typeof useGear.name !== "string") {
      useGear.name = useGear.name.xmltext;
    }
    return {
      name: useGear.name,
      ...(useGear.rating !== undefined && { rating: useGear.rating }),
      ...(category !== undefined && { category: category }),
    };
  });
}

export function convertAttribute(attribute: attributeXMLEnum) {
  switch (attribute) {
    case attributeXMLEnum.BOD:
      return attributeTypeEnum.Body;
      break;
    case attributeXMLEnum.AGI:
      return attributeTypeEnum.Agility;
      break;
    case attributeXMLEnum.REA:
      return attributeTypeEnum.Reaction;
      break;
    case attributeXMLEnum.STR:
      return attributeTypeEnum.Strength;
      break;
    case attributeXMLEnum.WIL:
      return attributeTypeEnum.Willpower;
      break;
    case attributeXMLEnum.LOG:
      return attributeTypeEnum.Logic;
      break;
    case attributeXMLEnum.INT:
      return attributeTypeEnum.Intuition;
      break;
    case attributeXMLEnum.CHA:
      return attributeTypeEnum.Charisma;
      break;
    case attributeXMLEnum.MAG:
      return attributeTypeEnum.Magic;
      break;
    case attributeXMLEnum.RES:
      return attributeTypeEnum.Resonance;
      break;
    case attributeXMLEnum.EDG:
      return attributeTypeEnum.Edge;
      break;
    default:
      assert(false, attribute);
  }
}

export const convertXmlModList = function (
  modList: ModRecursiveXmlType
): ModListType | undefined {
  const mods: ModListType = [];
  if ("mod" in modList && modList.mod !== undefined) {
    const nameList = Array.isArray(modList.mod) ? modList.mod : [modList.mod];
    nameList.forEach((name) => {
      mods.concat(convertXmlModObject(name));
    });
  }
  mods.concat(convertXmlModObject(modList));
  if (mods.length === 0) {
    return undefined;
  }
  return mods;
};

const convertXmlModObject = function (modList: ModListXmlType): ModListType {
  const mods: ModListType = [];
  if (Array.isArray(modList.name)) {
    // related to a specific mod, doesn't make sense for array
    assert(modList.subsystems === undefined);
    modList.name.forEach((name) => {
      const mod = convertXmlModInner(name, undefined);
      mods.concat(mod);
    });
  } else {
    let subsystem;
    if (modList.subsystems !== undefined) {
      // technically this could also be bioware but no examples yet
      assert("cyberware" in modList.subsystems);
      subsystem = modList.subsystems.cyberware.name;
    }
    const mod = convertXmlModInner(modList.name, subsystem);
    mods.concat(mod);
  }

  if (modList.addslots !== undefined) {
    mods.concat({ additionalSlots: modList.addslots });
  }
  return mods;
};

const convertXmlModInner = function (
  mod: ModXmlType,
  subsystem: string | undefined
) {
  if (typeof mod === "string") {
    return { name: mod };
  }

  let rating, cost;
  if (mod._rating !== undefined) {
    rating = Number(mod._rating);
    assert(!isNaN(rating));
  }
  if (mod._cost !== undefined) {
    cost = Number(mod._cost);
    assert(!isNaN(cost));
  }

  return {
    name: mod.xmltext,
    ...(mod._select !== undefined && { specificOption: mod._select }),
    ...(rating !== undefined && { rating: rating }),
    ...(cost !== undefined && { cost: cost }),
    ...(subsystem !== undefined && { addCyberware: subsystem }),
  };
};

export const convertXmlCategory = function (
  category: string,
  categoryList: CategoryXmlListType
) {
  const categoryInformation = categoryList.find((categoryObject) => {
    return categoryObject.xmltext === category;
  });
  console.log(categoryList);
  assert(
    categoryInformation !== undefined,
    `Category: ${category} is undefined`
  );
  return {
    blackMarketCategories: categoryInformation._blackmarket.split(","),
    category: categoryInformation.xmltext,
  };
};

export const convertAugmentationGradeList = function (
  gradeList: Array<augmentationXmlGradeEnum>
) {
  if (gradeList.includes(augmentationXmlGradeEnum.UsedAdapsin)) {
    assert(gradeList.includes(augmentationXmlGradeEnum.Used));
    // remove Adapsin
    gradeList.splice(
      gradeList.indexOf(augmentationXmlGradeEnum.UsedAdapsin),
      1
    );
  }
  if (gradeList.includes(augmentationXmlGradeEnum.StandardBurnout)) {
    assert(gradeList.includes(augmentationXmlGradeEnum.Standard));
    // remove Burnout
    gradeList.splice(
      gradeList.indexOf(augmentationXmlGradeEnum.StandardBurnout),
      1
    );
  }

  return gradeList
    .filter((grade) => {
      return !(
        grade.includes(augmentationXmlGradeEnum.UsedAdapsin) ||
        grade.includes(augmentationXmlGradeEnum.StandardBurnout) ||
        grade.includes(augmentationXmlGradeEnum.AlphawareAdapsin) ||
        grade.includes(augmentationXmlGradeEnum.BetawareAdapsin) ||
        grade.includes(augmentationXmlGradeEnum.DeltawareAdapsin) ||
        grade.includes(augmentationXmlGradeEnum.GammawareAdapsin) ||
        grade.includes(augmentationXmlGradeEnum.OmegawareAdapsin) ||
        grade.includes(augmentationXmlGradeEnum.GreywareAdapsin)
      );
    })
    .map((grade) => {
      return convertAugmentationGrade(grade);
    });
};
export const convertAugmentationGrade = function (
  grade: augmentationXmlGradeEnum
) {
  switch (grade) {
    case augmentationXmlGradeEnum.UsedAdapsin:
    case augmentationXmlGradeEnum.StandardBurnout:
    case augmentationXmlGradeEnum.AlphawareAdapsin:
    case augmentationXmlGradeEnum.BetawareAdapsin:
    case augmentationXmlGradeEnum.DeltawareAdapsin:
    case augmentationXmlGradeEnum.GammawareAdapsin:
    case augmentationXmlGradeEnum.OmegawareAdapsin:
    case augmentationXmlGradeEnum.GreywareAdapsin:
      assert(false, `Grade: ${grade} exists`);
    case augmentationXmlGradeEnum.None:
      return augmentationGradeEnum.None;
    case augmentationXmlGradeEnum.Used:
      return augmentationGradeEnum.Used;
    case augmentationXmlGradeEnum.Standard:
      return augmentationGradeEnum.Standard;
    case augmentationXmlGradeEnum.Alphaware:
      return augmentationGradeEnum.Alphaware;
    case augmentationXmlGradeEnum.Betaware:
      return augmentationGradeEnum.Betaware;
    case augmentationXmlGradeEnum.Deltaware:
      return augmentationGradeEnum.Deltaware;
    case augmentationXmlGradeEnum.Gammaware:
      return augmentationGradeEnum.Gammaware;
    case augmentationXmlGradeEnum.Omegaware:
      return augmentationGradeEnum.Omegaware;
    case augmentationXmlGradeEnum.Greyware:
      return augmentationGradeEnum.Greyware;
  }
};

export const convertAugmentationLimit = function (
  limit: AugmentationXmlLimitType | undefined
) {
  if (typeof limit === "number") {
    return limit;
  }
  switch (limit) {
    case "False":
      return { option: augmentationLimitEnum.None };
    case "{arm}":
      return { option: augmentationLimitEnum.Arm };
    case "{leg}":
      return { option: augmentationLimitEnum.Leg };
    case "{torso}":
      return { option: augmentationLimitEnum.Leg };
    case "{skull}":
      return { option: augmentationLimitEnum.Skull };
    case "{arm} * 5":
      return { option: augmentationLimitEnum.Finger };
    case "{BODUnaug}":
      return { option: augmentationLimitEnum.UnaugmentedBody };
    case undefined:
      return undefined;
  }
};

export const convertLimbSlot = function (slot: limbSlotXmlEnum) {
  switch (slot) {
    case limbSlotXmlEnum.ARM:
      return limbSlotEnum.Arm;
    case limbSlotXmlEnum.LEG:
      return limbSlotEnum.Leg;
    case limbSlotXmlEnum.SKULL:
      return limbSlotEnum.Skull;
    case limbSlotXmlEnum.TORSO:
      return limbSlotEnum.Torso;
    default:
      assert(false);
  }
};
