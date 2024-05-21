import {
  attributeTypeEnum,
  augmentationGradeEnum,
  augmentationLimitEnum,
  durationEnum,
  gearCategoryEnum,
  limbSlotEnum,
  ratingMeaningEnum,
  sourceBookEnum,
  spellPowerRangeEnum,
  spellPowerTargetEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  GenericModListType,
  GenericVehicleModListType,
} from "@neon-codex/common/build/schemas/shared/modSchemas.js";
import assert from "assert";
import type {
  CategoryXmlListType,
  AugmentationXmlLimitType,
  xmlAllowGearType,
  XmlQualitiesType,
  XmlQualitiesSingularType,
  XmlDurationType,
  SpellPowerXmlRangeType,
} from "./ParserCommonDefines.js";
import {
  attributeXMLEnum,
  augmentationXmlGradeEnum,
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
import type { UseGearListType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import type { XmlMovementType } from "../character/MetatypeParserSchemas.js";
import type { BonusGenericListType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";

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
      return sourceBookEnum.StateOfTheArtADL;
    case sourceBookXmlEnum.Schattenhandbuch:
      return sourceBookEnum.Schattenhandbuch;
    case sourceBookXmlEnum.Schattenhandbuch2:
      return sourceBookEnum.Schattenhandbuch2;
    case sourceBookXmlEnum.Schattenhandbuch3:
      return sourceBookEnum.Schattenhandbuch3;
    case sourceBookXmlEnum.Hamburg:
      return sourceBookEnum.Hamburg;
    case sourceBookXmlEnum.DatapulsSOTA2080:
      return sourceBookEnum.DatapulsSOTA2080;
    case sourceBookXmlEnum.DatapulsVerschlusssache:
      return sourceBookEnum.DatapulsVerschlusssache;
    case sourceBookXmlEnum.Shadowrun2050:
      return sourceBookEnum.Shadowrun2050;
    case sourceBookXmlEnum.GrimmesErwachen:
      return sourceBookEnum.GrimmesErwachen;
      break;
    default:
      assert(false, `Missing Book: ${xmlSource}`);
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

export const convertRatingMeaning = function (meaning: string | undefined) {
  if (meaning === undefined) {
    return undefined;
  }
  switch (meaning) {
    case "String_Hours":
      return ratingMeaningEnum.HourPerRating;
    case "String_UpgradedRating":
      return ratingMeaningEnum.UpgradedRating;
    case "Rating_LengthInCmBy10":
      return ratingMeaningEnum.TenCmPerRating;
    case "Rating_Meters":
      return ratingMeaningEnum.MeterPerRating;
    case "Rating_SqMeters":
      return ratingMeaningEnum.SquareMeterPerRating;
    default:
      assert(false);
  }
};

export const convertAllowGear = function (
  xmlAllowGear: xmlAllowGearType | undefined
): {
  allowedGearList?: Array<string> | undefined;
  allowedGearCategories?: Array<gearCategoryEnum> | undefined;
} {
  if (xmlAllowGear === undefined) {
    return { allowedGearList: undefined };
  }
  if (typeof xmlAllowGear === "string") {
    if (xmlAllowGear === "") {
      return { allowedGearList: undefined };
    }
    return { allowedGearList: [xmlAllowGear] };
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
  return { allowedGearList: gearNames, allowedGearCategories: gearCategories };
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
      if (useGear._select !== undefined) {
        assert(useGear._select !== "");
      }
      const specificOption = useGear._select;
      const rating =
        useGear._rating !== undefined ? parseInt(useGear._rating) : undefined;
      const consumeCapacity =
        useGear._consumecapacity !== undefined ? (true as const) : undefined;
      const quantity =
        useGear._costfor !== undefined ? parseInt(useGear._costfor) : undefined;

      return {
        name: useGear.xmltext,
        specificOption: specificOption,
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
    case attributeXMLEnum.AGI:
      return attributeTypeEnum.Agility;
    case attributeXMLEnum.REA:
      return attributeTypeEnum.Reaction;
    case attributeXMLEnum.STR:
      return attributeTypeEnum.Strength;
    case attributeXMLEnum.WIL:
      return attributeTypeEnum.Willpower;
    case attributeXMLEnum.LOG:
      return attributeTypeEnum.Logic;
    case attributeXMLEnum.INT:
      return attributeTypeEnum.Intuition;
    case attributeXMLEnum.CHA:
      return attributeTypeEnum.Charisma;
    case attributeXMLEnum.MAG:
      return attributeTypeEnum.Magic;
    case attributeXMLEnum.RES:
      return attributeTypeEnum.Resonance;
    case attributeXMLEnum.EDG:
      return attributeTypeEnum.Edge;
    default:
      assert(false, attribute);
  }
}

export const convertXmlVehicleModList = function (
  modList: ModRecursiveXmlType
): GenericVehicleModListType | undefined {
  let mods: GenericVehicleModListType = [];
  // TODO: handle all possiblities here properly
  if ("mod" in modList && modList.mod !== undefined) {
    const nameList = Array.isArray(modList.mod) ? modList.mod : [modList.mod];
    nameList.forEach((name) => {
      const initialModObject = convertXmlModObject(name);
      let modObject;
      if (name.subsystems !== undefined) {
        // technically this could also be bioware but no examples yet
        assert("cyberware" in name.subsystems);
        const subsystem = name.subsystems.cyberware.name;
        assert(initialModObject.length === 1);
        modObject = [
          {
            addCyberware: subsystem,
            ...initialModObject[0],
          },
        ];
      } else {
        modObject = initialModObject;
      }
      mods = mods.concat(modObject);
    });
  }
  mods = mods.concat(convertXmlModObject(modList));
  if (mods.length === 0) {
    return undefined;
  }
  return mods;
};

export const convertXmlModObject = function (
  modList: ModListXmlType
): GenericModListType {
  const mods: GenericModListType = [];
  if (Array.isArray(modList.name)) {
    modList.name.forEach((name) => {
      const mod = convertXmlModInner(name);
      mods.push(mod);
    });
  } else {
    const mod = convertXmlModInner(modList.name);
    mods.push(mod);
  }

  return mods;
};

const convertXmlModInner = function (mod: ModXmlType) {
  if (typeof mod === "string") {
    return { name: mod };
  }

  let rating;
  if (mod._rating !== undefined) {
    rating = Number(mod._rating);
    assert(!isNaN(rating));
  }

  return {
    name: mod.xmltext,
    ...(mod._select !== undefined && { specificOption: mod._select }),
    ...(rating !== undefined && { rating: rating }),
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
    case limbSlotXmlEnum.ALL:
      return limbSlotEnum.All;
    default:
      assert(false);
  }
};

export const convertMovement = function (movement: XmlMovementType) {
  let movementString;
  if (typeof movement === "object") {
    movementString = movement.xmltext;
  } else {
    movementString = movement;
  }
  const movementArray = movementString.split("/").map((movement) => {
    const movementNumber = parseInt(movement);
    assert(!isNaN(movementNumber));
    return movementNumber;
  });
  assert(movementArray.length === 3);
  return {
    ground: movementArray[2],
    water: movementArray[1],
    air: movementArray[0],
  };
};

export const convertIncludedQualities = function (qualities: XmlQualitiesType) {
  assert(
    !(qualities.positive === undefined && qualities.negative === undefined)
  );
  let qualityList: BonusGenericListType = [];
  if (qualities.positive !== undefined) {
    qualityList = qualityList.concat(
      convertIncludedQuality(qualities.positive)
    );
  }
  if (qualities.negative !== undefined) {
    qualityList = qualityList.concat(
      convertIncludedQuality(qualities.negative)
    );
  }
  assert(
    qualityList.length > 0,
    `Quality list is empty, ${qualities.positive}, ${qualities.negative}`
  );
  return qualityList;
};

const convertIncludedQuality = function (
  qualitySingular: XmlQualitiesSingularType
) {
  const qualityList = Array.isArray(qualitySingular.quality)
    ? qualitySingular.quality
    : [qualitySingular.quality];
  assert(
    qualityList.length > 0,
    `Quality list is empty, ${qualitySingular.quality}`
  );
  return qualityList.map((quality) => {
    if (typeof quality === "object") {
      return { name: quality.xmltext };
    }
    return { name: quality };
  });
};

export const convertDuration = function (duration: XmlDurationType) {
  switch (duration) {
    case "I":
    case "Instant":
      return durationEnum.Instantaneous;
    case "S":
    case "Sustained":
      return durationEnum.Sustained;
    case "P":
    case "Permanent":
      return durationEnum.Permanent;
    case "Always":
      return durationEnum.Always;
    case "Special":
      return durationEnum.Special;
  }
};

export const convertSpellPowerRange = function (range: SpellPowerXmlRangeType) {
  switch (range) {
    case "S":
    case "Self":
      return {
        value: spellPowerRangeEnum.Self,
        target: spellPowerTargetEnum.Target,
      };
    case "S (A)":
      return {
        value: spellPowerRangeEnum.Self,
        target: spellPowerTargetEnum.Area,
      };
    case "T":
    case "Touch":
      return {
        value: spellPowerRangeEnum.Touch,
        target: spellPowerTargetEnum.Target,
      };
    case "T (A)":
      return {
        value: spellPowerRangeEnum.Touch,
        target: spellPowerTargetEnum.Area,
      };
    case "LOS":
      return {
        value: spellPowerRangeEnum.LineOfSight,
        target: spellPowerTargetEnum.Target,
      };
    case "LOS (A)":
      return {
        value: spellPowerRangeEnum.LineOfSight,
        target: spellPowerTargetEnum.Area,
      };
    case "Special":
      return {
        value: spellPowerRangeEnum.Special,
        target: spellPowerTargetEnum.Target,
      };
    case "Touch or LOS":
      return {
        value: spellPowerRangeEnum.Special,
        target: spellPowerTargetEnum.Target,
      };
  }
};
