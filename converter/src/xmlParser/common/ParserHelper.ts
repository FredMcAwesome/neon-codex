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
} from "@neon-codex/common";
import {
  mathComparisonEnum,
  type GenericModListType,
} from "@neon-codex/common";
import assert from "assert";
import type {
  CategoryXmlListType,
  AugmentationXmlLimitType,
  xmlAllowGearType,
  XmlQualityListType,
  XmlQualityListSingularType,
  XmlDurationType,
  SpellPowerXmlRangeType,
  NaturalWeaponXmlType,
} from "./ParserCommonDefines.js";
import {
  attributeXMLEnum,
  augmentationXmlGradeEnum,
  limbSlotXmlEnum,
  gearXmlCategoryEnum,
} from "./ParserCommonDefines.js";
import type {
  IncludedGearXmlType,
  ModListXmlType,
  ModRecursiveXmlType,
  ModXmlType,
} from "./ParserCommonDefines.js";
import { sourceBookXmlEnum } from "./ParserCommonDefines.js";
import type { XmlMovementType } from "../character/MetatypeParserSchemas.js";
import type { BonusGenericListType } from "@neon-codex/common";
import type { CustomisedGearListType } from "@neon-codex/common";
import type { CustomisedVehicleModListType } from "@neon-codex/common";
import Weapons from "../../grammar/weapons.ohm-bundle.js";
import {
  accuracySemantics,
  armourPenetrationSemantics,
  damageSemantics,
} from "../combat/WeaponParserHelper.js";
import type {
  AccuracyType,
  ArmourPenetrationType,
  DamageType,
  NaturalWeaponType,
} from "@neon-codex/common";
import { type } from "arktype";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";
import { GearListXmlSchema } from "../other/GearParserSchemas.js";
import { MathComparisonXMLEnum } from "./RequiredParserSchemas.js";
const Accuracy = Weapons.Accuracy;
const Damage = Weapons.Damage;
const ArmourPenetration = Weapons.ArmourPenetration;

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
    case sourceBookXmlEnum.ShadowsInFocus_Casablanca_Rabat:
      return sourceBookEnum.ShadowsInFocus_Casablanca_Rabat;
    case sourceBookXmlEnum.ShadowsInFocus_Metropole:
      return sourceBookEnum.ShadowsInFocus_Metropole;
    case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
      return sourceBookEnum.ShadowsInFocus_SanFranciscoMetroplex;
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
    case sourceBookXmlEnum.Schattenhandbuch4:
      return sourceBookEnum.Schattenhandbuch4;
    case sourceBookXmlEnum.Schattenload2:
      return sourceBookEnum.Schattenload2;
    case sourceBookXmlEnum.Schattenload3:
      return sourceBookEnum.Schattenload3;
    case sourceBookXmlEnum.Schattenload7:
      return sourceBookEnum.Schattenload7;
    case sourceBookXmlEnum.Hamburg:
      return sourceBookEnum.Hamburg;
    case sourceBookXmlEnum.DatapulsOsterreich:
      return sourceBookEnum.DatapulsOsterreich;
    case sourceBookXmlEnum.DatapulsSOX2080:
      return sourceBookEnum.DatapulsSOX2080;
    case sourceBookXmlEnum.DatapulsSOTA2080:
      return sourceBookEnum.DatapulsSOTA2080;
    case sourceBookXmlEnum.DerAlmanach_Gratisrollenspieltag2019:
      return sourceBookEnum.DerAlmanach_Gratisrollenspieltag2019;
    case sourceBookXmlEnum.DatapulsVerschlusssache:
      return sourceBookEnum.DatapulsVerschlusssache;
    case sourceBookXmlEnum.Shadowrun2050:
      return sourceBookEnum.Shadowrun2050;
    case sourceBookXmlEnum.GrimmesErwachen:
      return sourceBookEnum.GrimmesErwachen;
    case sourceBookXmlEnum.Parabotany:
      return sourceBookEnum.Parabotany;
    case sourceBookXmlEnum.Parageology:
      return sourceBookEnum.Parageology;
    case sourceBookXmlEnum.Parazoology:
      return sourceBookEnum.Parazoology;
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      assert(false, `Missing Book: ${xmlSource}`);
  }
};

export const convertGearCategory = function (
  category: gearXmlCategoryEnum
): gearCategoryEnum {
  switch (category) {
    case gearXmlCategoryEnum.AlchemicalPreperations:
      return gearCategoryEnum.AlchemicalPreparations;
    case gearXmlCategoryEnum.AlchemicalTools:
      return gearCategoryEnum.AlchemicalTools;
    case gearXmlCategoryEnum.Ammunition:
      return gearCategoryEnum.Ammunition;
    case gearXmlCategoryEnum.Animals:
      return gearCategoryEnum.Animals;
    case gearXmlCategoryEnum.ArmorEnhancements:
      return gearCategoryEnum.ArmorEnhancements;
    case gearXmlCategoryEnum.AudioDevices:
      return gearCategoryEnum.AudioDevices;
    case gearXmlCategoryEnum.AudioEnhancements:
      return gearCategoryEnum.AudioEnhancements;
    case gearXmlCategoryEnum.Autosofts:
      return gearCategoryEnum.Autosofts;
    case gearXmlCategoryEnum.Biotech:
      return gearCategoryEnum.Biotech;
    case gearXmlCategoryEnum.BreakingAndEnteringGear:
      return gearCategoryEnum.BreakingAndEnteringGear;
    case gearXmlCategoryEnum.BTLs:
      return gearCategoryEnum.BTLs;
    case gearXmlCategoryEnum.Chemicals:
      return gearCategoryEnum.Chemicals;
    case gearXmlCategoryEnum.Commlinks:
      return gearCategoryEnum.Commlinks;
    case gearXmlCategoryEnum.Commlink_CyberdeckFormFactors:
      return gearCategoryEnum.Commlink_CyberdeckFormFactors;
    case gearXmlCategoryEnum.CommlinkAccessories:
      return gearCategoryEnum.CommlinkAccessories;
    case gearXmlCategoryEnum.CommlinkApps:
      return gearCategoryEnum.CommlinkApps;
    case gearXmlCategoryEnum.CommonPrograms:
      return gearCategoryEnum.CommonPrograms;
    case gearXmlCategoryEnum.CommunicationsAndCountermeasures:
      return gearCategoryEnum.CommunicationsAndCountermeasures;
    case gearXmlCategoryEnum.Contracts_Upkeep:
      return gearCategoryEnum.Contracts_Upkeep;
    case gearXmlCategoryEnum.CritterGear:
      return gearCategoryEnum.CritterGear;
    case gearXmlCategoryEnum.Currency:
      return gearCategoryEnum.Currency;
    case gearXmlCategoryEnum.Custom:
      return gearCategoryEnum.Custom;
    case gearXmlCategoryEnum.CustomCyberdeckAttributes:
      return gearCategoryEnum.CustomCyberdeckAttributes;
    case gearXmlCategoryEnum.CustomDrug:
      return gearCategoryEnum.CustomDrug;
    case gearXmlCategoryEnum.CyberdeckModules:
      return gearCategoryEnum.CyberdeckModules;
    case gearXmlCategoryEnum.Cyberdecks:
      return gearCategoryEnum.Cyberdecks;
    case gearXmlCategoryEnum.Cyberterminals:
      return gearCategoryEnum.Cyberterminals;
    case gearXmlCategoryEnum.Disguises:
      return gearCategoryEnum.Disguises;
    case gearXmlCategoryEnum.Drugs:
      return gearCategoryEnum.Drugs;
    case gearXmlCategoryEnum.ElectronicsAccessories:
      return gearCategoryEnum.ElectronicsAccessories;
    case gearXmlCategoryEnum.ElectronicModification:
      return gearCategoryEnum.ElectronicModification;
    case gearXmlCategoryEnum.ElectronicParts:
      return gearCategoryEnum.ElectronicParts;
    case gearXmlCategoryEnum.Entertainment:
      return gearCategoryEnum.Entertainment;
    case gearXmlCategoryEnum.Explosives:
      return gearCategoryEnum.Explosives;
    case gearXmlCategoryEnum.ExtractionDevices:
      return gearCategoryEnum.ExtractionDevices;
    case gearXmlCategoryEnum.Foci:
      return gearCategoryEnum.Foci;
    case gearXmlCategoryEnum.Food:
      return gearCategoryEnum.Food;
    case gearXmlCategoryEnum.Formulae:
      return gearCategoryEnum.Formulae;
    case gearXmlCategoryEnum.GrappleGun:
      return gearCategoryEnum.GrappleGun;
    case gearXmlCategoryEnum.HackingPrograms:
      return gearCategoryEnum.HackingPrograms;
    case gearXmlCategoryEnum.Housewares:
      return gearCategoryEnum.Housewares;
    case gearXmlCategoryEnum.ID_Credsticks:
      return gearCategoryEnum.ID_Credsticks;
    case gearXmlCategoryEnum.MagicalCompounds:
      return gearCategoryEnum.MagicalCompounds;
    case gearXmlCategoryEnum.MagicalPlants:
      return gearCategoryEnum.MagicalPlants;
    case gearXmlCategoryEnum.MagicalSupplies:
      return gearCategoryEnum.MagicalSupplies;
    case gearXmlCategoryEnum.Metatype_Specific:
      return gearCategoryEnum.MetatypeSpecific;
    case gearXmlCategoryEnum.Miscellany:
      return gearCategoryEnum.Miscellany;
    case gearXmlCategoryEnum.MusicalInstruments:
      return gearCategoryEnum.MusicalInstruments;
    case gearXmlCategoryEnum.Nanogear:
      return gearCategoryEnum.Nanogear;
    case gearXmlCategoryEnum.Paydata:
      return gearCategoryEnum.Paydata;
    case gearXmlCategoryEnum.PI_Tac:
      return gearCategoryEnum.PiTac;
    case gearXmlCategoryEnum.Printing:
      return gearCategoryEnum.Printing;
    case gearXmlCategoryEnum.ReporterGear:
      return gearCategoryEnum.ReporterGear;
    case gearXmlCategoryEnum.RFIDTags:
      return gearCategoryEnum.RFIDTags;
    case gearXmlCategoryEnum.RiggerCommandConsoles:
      return gearCategoryEnum.RiggerCommandConsoles;
    case gearXmlCategoryEnum.SecurityDevices:
      return gearCategoryEnum.SecurityDevices;
    case gearXmlCategoryEnum.Sensors:
      return gearCategoryEnum.Sensors;
    case gearXmlCategoryEnum.SensorFunctions:
      return gearCategoryEnum.SensorFunctions;
    case gearXmlCategoryEnum.SensorHousings:
      return gearCategoryEnum.SensorHousings;
    case gearXmlCategoryEnum.Services:
      return gearCategoryEnum.Services;
    case gearXmlCategoryEnum.Skillsofts:
      return gearCategoryEnum.Skillsofts;
    case gearXmlCategoryEnum.Software:
      return gearCategoryEnum.Software;
    case gearXmlCategoryEnum.SoftwareTweaks:
      return gearCategoryEnum.SoftwareTweaks;
    case gearXmlCategoryEnum.SurvivalGear:
      return gearCategoryEnum.SurvivalGear;
    case gearXmlCategoryEnum.TailoredPerfume_Cologne:
      return gearCategoryEnum.TailoredPerfume_Cologne;
    case gearXmlCategoryEnum.TirTairngireBeverages:
      return gearCategoryEnum.TirTairngireBeverages;
    case gearXmlCategoryEnum.Tools:
      return gearCategoryEnum.Tools;
    case gearXmlCategoryEnum.ToolsOfTheTrade:
      return gearCategoryEnum.ToolsOfTheTrade;
    case gearXmlCategoryEnum.Toxins:
      return gearCategoryEnum.Toxins;
    case gearXmlCategoryEnum.VisionDevices:
      return gearCategoryEnum.VisionDevices;
    case gearXmlCategoryEnum.VisionEnhancements:
      return gearCategoryEnum.VisionEnhancements;
    case gearXmlCategoryEnum.MatrixAccessories:
      return gearCategoryEnum.MatrixAccessories;
    case gearXmlCategoryEnum.BoosterChips:
      return gearCategoryEnum.BoosterChips;
    case gearXmlCategoryEnum.AppearanceModification:
      return gearCategoryEnum.AppearanceModification;
    case gearXmlCategoryEnum.DrugGrades:
      return gearCategoryEnum.DrugGrades;
    case gearXmlCategoryEnum.PI_TacPrograms:
      return gearCategoryEnum.PiTacPrograms;
    case gearXmlCategoryEnum.HardNanoware:
      return gearCategoryEnum.HardNanoware;
    default:
      // Arktype may fail to resolve/typecheck deeply nested things
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      assert(false, `Missing gear category: ${category}`);
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
    case "String_Force":
      return ratingMeaningEnum.ForcePerRating;
    case "String_Force_Potency":
      return ratingMeaningEnum.ForcePotencyPerRating;
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
export function convertIncludedXmlGears(
  gears: IncludedGearXmlType
): CustomisedGearListType {
  const xmlUseGear = Array.isArray(gears.usegear)
    ? gears.usegear
    : [gears.usegear];
  return xmlUseGear.map((useGear) => {
    if (typeof useGear === "string") {
      return {
        baseGear: useGear,
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
        baseGear: useGear.xmltext,
        ...(specificOption !== undefined && { specificOption: specificOption }),
        ...(rating !== undefined && { rating: rating }),
        ...(consumeCapacity !== undefined && {
          consumeCapacity: consumeCapacity,
        }),
        ...(quantity !== undefined && { currentQuantity: quantity }),
      };
    } else {
      let category;
      let name;
      if (useGear.category !== undefined) {
        category = convertGearCategory(useGear.category);
      }
      if ("name" in useGear) {
        if (typeof useGear.name !== "string") {
          name = useGear.name.xmltext;
        } else {
          name = useGear.name;
        }
      } else {
        const currentPath = import.meta.url;
        const xml_string = fs.readFileSync(
          fileURLToPath(
            path.dirname(currentPath) + "../../../../xmls/gear.xml"
          ),
          "utf8"
        );
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "_",
          textNodeName: "xmltext",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        const jObj: any = parser.parse(xml_string);
        // console.log(
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //   jObj.chummer.gears.gear[337].required
        // );

        const gearListParsed = GearListXmlSchema(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          jObj.chummer.gears.gear
        );

        if (gearListParsed instanceof type.errors) {
          console.log(gearListParsed.summary);
          assert(false);
        }

        // TODO: We can have multiple gear with the same name, lets store the category here as well
        const gearMatchedList = gearListParsed.filter((fullGear) => {
          return useGear.id === fullGear.id;
        });
        assert(
          gearMatchedList.length !== 0,
          `Gear ID: ${useGear.id} not found`
        );
        assert(
          gearMatchedList.length === 1,
          `Gear ID: ${useGear.id} has multiple matches`
        );
        assert(
          gearListParsed.filter((fullGear) => {
            return gearMatchedList[0].name === fullGear.name;
          }).length === 1,
          `Gear Name: ${gearMatchedList[0].name} has multiple matches`
        );
        name = gearMatchedList[0].name;
        if (category === undefined) {
          category = convertGearCategory(gearMatchedList[0].category);
        } else {
          assert(
            category === convertGearCategory(gearMatchedList[0].category),
            `Gear ID: ${useGear.id} category mismatch`
          );
        }
      }
      return {
        baseGear: name,
        ...(useGear.rating !== undefined && { rating: useGear.rating }),
        ...(category !== undefined && { category: category }),
      };
    }
  });
}

export function convertAttribute(
  attribute: attributeXMLEnum
): attributeTypeEnum {
  switch (attribute) {
    case attributeXMLEnum.BOD:
      return attributeTypeEnum.Body as const;
    case attributeXMLEnum.AGI:
      return attributeTypeEnum.Agility as const;
    case attributeXMLEnum.REA:
      return attributeTypeEnum.Reaction as const;
    case attributeXMLEnum.STR:
      return attributeTypeEnum.Strength as const;
    case attributeXMLEnum.WIL:
      return attributeTypeEnum.Willpower as const;
    case attributeXMLEnum.LOG:
      return attributeTypeEnum.Logic as const;
    case attributeXMLEnum.INT:
      return attributeTypeEnum.Intuition as const;
    case attributeXMLEnum.CHA:
      return attributeTypeEnum.Charisma as const;
    case attributeXMLEnum.MAG:
      return attributeTypeEnum.Magic as const;
    case attributeXMLEnum.RES:
      return attributeTypeEnum.Resonance as const;
    case attributeXMLEnum.EDG:
      return attributeTypeEnum.Edge as const;
    case attributeXMLEnum.INI:
      return attributeTypeEnum.Initiative as const;
    case attributeXMLEnum.DEP:
      return attributeTypeEnum.Depth as const;
    default:
      assert(false, attribute);
  }
}

export const convertXmlVehicleModList = function (
  modList: ModRecursiveXmlType
): CustomisedVehicleModListType | undefined {
  let mods: CustomisedVehicleModListType = [];
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
            subsystemList: [subsystem],
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
    return;
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
    return { baseMod: mod };
  }

  let rating;
  if (mod._rating !== undefined) {
    rating = Number(mod._rating);
    assert(!isNaN(rating));
  }

  return {
    baseMod: mod.xmltext,
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
  assert(
    categoryInformation !== undefined,
    `Category: ${category} is undefined`
  );
  return {
    blackMarketCategories: categoryInformation._blackmarket
      .split(",")
      .map((category) => category.trim()),
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
      break;
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

export const convertIncludedQualities = function (
  qualities: XmlQualityListType
) {
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
    `Quality list is empty, ${JSON.stringify(
      qualities.positive
    )}, ${JSON.stringify(qualities.negative)}`
  );
  return qualityList;
};

const convertIncludedQuality = function (
  qualitySingular: XmlQualityListSingularType
) {
  const qualityList = Array.isArray(qualitySingular.quality)
    ? qualitySingular.quality
    : [qualitySingular.quality];
  assert(
    qualityList.length > 0,
    `Quality list is empty, ${JSON.stringify(qualitySingular.quality)}`
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
    case "E":
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

export const convertNaturalWeapon = function (
  naturalWeapon: NaturalWeaponXmlType
): NaturalWeaponType {
  // console.dir(naturalWeapon, { depth: Infinity });
  let match = Accuracy.match(naturalWeapon.accuracy.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const accuracy: AccuracyType = accuracySemantics(match).eval();
  match = Damage.match(naturalWeapon.damage.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const damage: DamageType = damageSemantics(match).eval();
  match = ArmourPenetration.match(naturalWeapon.ap.toString());
  if (match.failed()) {
    assert(false, match.message);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const armourPenetration: ArmourPenetrationType =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    armourPenetrationSemantics(match).eval();

  return {
    name: naturalWeapon.name,
    accuracy: accuracy,
    damage: damage,
    armourPenetration: armourPenetration,
    reach: naturalWeapon.reach,
    relatedSkill: naturalWeapon.useskill,
    ...(naturalWeapon.useskillspec !== undefined && {
      relatedSkillSpecialisationList: [naturalWeapon.useskillspec],
    }),
    source: convertSource(naturalWeapon.source),
    page: naturalWeapon.page,
  };
};

export const convertMathComparison = function (
  comparison: MathComparisonXMLEnum
): mathComparisonEnum {
  switch (comparison) {
    case MathComparisonXMLEnum.LessThan:
      return mathComparisonEnum.LessThan;
    case MathComparisonXMLEnum.GreaterThan:
      return mathComparisonEnum.GreaterThan;
    case MathComparisonXMLEnum.GreaterThanOrEqual:
      return mathComparisonEnum.GreaterThanOrEqual;
    default:
      assert(false, `Missing comparison: ${comparison}`);
  }
};
