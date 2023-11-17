import {
  attributeTypeEnum,
  augmentationGradeEnum,
  augmentationLimitEnum,
  gearCategoryEnum,
  limbSlotEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import type { UseGearListType } from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { ModListType } from "@shadowrun/common/build/schemas/shared/modSchemas.js";
import assert from "assert";
import {
  attributeXMLEnum,
  CategoryXmlListType,
  augmentationXmlGradeEnum,
  AugmentationXmlLimitType,
  xmlAllowGearType,
  limbSlotXmlEnum,
} from "./ParserCommonDefines.js";
import type {
  GearXmlType,
  ModListXmlType,
  ModRecursiveXmlType,
  ModXmlType,
} from "./ParserCommonDefines.js";
import { sourceBookXmlEnum } from "./ParserCommonDefines.js";
import { AllowedGearType } from "@shadowrun/common/build/schemas/commonSchemas.js";

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

export const convertGearCategory = function (
  category: string,
  otherMessage: string
) {
  switch (category) {
    case "Alchemical Tools":
      return gearCategoryEnum.AlchemicalTools;
    case "Ammunition":
      return gearCategoryEnum.Ammunition;
    case "Armor Enhancements":
      return gearCategoryEnum.ArmorEnhancements;
    case "Audio Devices":
      return gearCategoryEnum.AudioDevices;
    case "Audio Enhancements":
      return gearCategoryEnum.AudioEnhancements;
    case "Autosofts":
      return gearCategoryEnum.Autosofts;
    case "Biotech":
      return gearCategoryEnum.Biotech;
    case "Breaking and Entering Gear":
      return gearCategoryEnum.BreakingAndEnteringGear;
    case "BTLs":
      return gearCategoryEnum.BTLs;
    case "Chemicals":
      return gearCategoryEnum.Chemicals;
    case "Commlinks":
      return gearCategoryEnum.Commlinks;
    case "Commlink/Cyberdeck Form Factors":
      return gearCategoryEnum.Commlink_CyberdeckFormFactors;
    case "Commlink Accessories":
      return gearCategoryEnum.CommlinkAccessories;
    case "Commlink Apps":
      return gearCategoryEnum.CommlinkApps;
    case "Common Programs":
      return gearCategoryEnum.CommonPrograms;
    case "Communications and Countermeasures":
      return gearCategoryEnum.CommunicationsAndCountermeasures;
    case "Contracts/Upkeep":
      return gearCategoryEnum.Contracts_Upkeep;
    case "Critter Gear":
      return gearCategoryEnum.CritterGear;
    case "Currency":
      return gearCategoryEnum.Currency;
    case "Custom":
      return gearCategoryEnum.Custom;
    case "Custom Cyberdeck Attributes":
      return gearCategoryEnum.CustomCyberdeckAttributes;
    case "Custom Drug":
      return gearCategoryEnum.CustomDrug;
    case "Cyberdeck Modules":
      return gearCategoryEnum.CyberdeckModules;
    case "Cyberdecks":
      return gearCategoryEnum.Cyberdecks;
    case "Cyberterminals":
      return gearCategoryEnum.Cyberterminals;
    case "Disguises":
      return gearCategoryEnum.Disguises;
    case "Drugs":
      return gearCategoryEnum.Drugs;
    case "Electronics Accessories":
      return gearCategoryEnum.ElectronicsAccessories;
    case "Electronic Modification":
      return gearCategoryEnum.ElectronicModification;
    case "Electronic Parts":
      return gearCategoryEnum.ElectronicParts;
    case "Entertainment":
      return gearCategoryEnum.Entertainment;
    case "Explosives":
      return gearCategoryEnum.Explosives;
    case "Extraction Devices":
      return gearCategoryEnum.ExtractionDevices;
    case "Foci":
      return gearCategoryEnum.Foci;
    case "Food":
      return gearCategoryEnum.Food;
    case "Formulae":
      return gearCategoryEnum.Formulae;
    case "Grapple Gun":
      return gearCategoryEnum.GrappleGun;
    case "Hacking Programs":
      return gearCategoryEnum.HackingPrograms;
    case "Hard Nanoware":
      return gearCategoryEnum.HardNanoware;
    case "Housewares":
      return gearCategoryEnum.Housewares;
    case "ID/Credsticks":
      return gearCategoryEnum.ID_Credsticks;
    case "Magical Compounds":
      return gearCategoryEnum.MagicalCompounds;
    case "Magical Supplies":
      return gearCategoryEnum.MagicalSupplies;
    case "Metatype-Specific":
      return gearCategoryEnum.MetatypeSpecific;
    case "Miscellany":
      return gearCategoryEnum.Miscellany;
    case "Musical Instruments":
      return gearCategoryEnum.MusicalInstruments;
    case "Nanogear":
      return gearCategoryEnum.Nanogear;
    case "Paydata":
      return gearCategoryEnum.Paydata;
    case "PI-Tac":
      return gearCategoryEnum.PiTac;
    case "Printing":
      return gearCategoryEnum.Printing;
    case "Reporter Gear":
      return gearCategoryEnum.ReporterGear;
    case "RFID Tags":
      return gearCategoryEnum.RFIDTags;
    case "Rigger Command Consoles":
      return gearCategoryEnum.RiggerCommandConsoles;
    case "Security Devices":
      return gearCategoryEnum.SecurityDevices;
    case "Sensors":
      return gearCategoryEnum.Sensors;
    case "Sensor Functions":
      return gearCategoryEnum.SensorFunctions;
    case "Sensor Housings":
      return gearCategoryEnum.SensorHousings;
    case "Services":
      return gearCategoryEnum.Services;
    case "Skillsofts":
      return gearCategoryEnum.Skillsofts;
    case "Software":
      return gearCategoryEnum.Software;
    case "Software Tweaks":
      return gearCategoryEnum.SoftwareTweaks;
    case "Survival Gear":
      return gearCategoryEnum.SurvivalGear;
    case "Tailored Perfume/Cologne":
      return gearCategoryEnum.TailoredPerfume_Cologne;
    case "Tools":
      return gearCategoryEnum.Tools;
    case "Tools of the Trade":
      return gearCategoryEnum.ToolsOfTheTrade;
    case "Toxins":
      return gearCategoryEnum.Toxins;
    case "Vision Devices":
      return gearCategoryEnum.VisionDevices;
    case "Vision Enhancements":
      return gearCategoryEnum.VisionEnhancements;
    case "Matrix Accessories":
      return gearCategoryEnum.MatrixAccessories;
    case "Booster Chips":
      return gearCategoryEnum.BoosterChips;
    case "Appearance Modification":
      return gearCategoryEnum.AppearanceModification;
    case "Drug Grades":
      return gearCategoryEnum.DrugGrades;
  }
  assert(false, `Category not found ${category}, ${otherMessage}`);
};

export const convertAllowGear = function (
  xmlAllowGear: xmlAllowGearType | undefined,
  name: string
): AllowedGearType | undefined {
  if (!xmlAllowGear) {
    return undefined;
  }
  if (typeof xmlAllowGear === "string") {
    return { gearNameList: [xmlAllowGear] };
  }
  // console.log("Allow Gear: " + xmlAllowGear.toString());
  let gearCategories =
    xmlAllowGear.gearcategory === undefined
      ? undefined
      : Array.isArray(xmlAllowGear.gearcategory)
      ? xmlAllowGear.gearcategory
      : [xmlAllowGear.gearcategory];
  if (gearCategories !== undefined) {
    gearCategories = gearCategories.map((gearCategory) =>
      convertGearCategory(gearCategory, `name: ${name}`)
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
export function convertXmlGears(
  gears: GearXmlType,
  name: string
): UseGearListType {
  const xmlUseGear = Array.isArray(gears.usegear)
    ? gears.usegear
    : [gears.usegear];
  return xmlUseGear.map((useGear) => {
    if (typeof useGear === "string") {
      return {
        name: useGear,
      };
    } else if ("xmltext" in useGear) {
      return {
        name: useGear.xmltext,
        rating: parseInt(useGear._rating),
      };
    }
    let category;
    if (useGear.category) {
      category = convertGearCategory(useGear.category, `item.name = ${name}`);
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
