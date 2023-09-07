import {
  gearCategoryEnum,
  sourceBookEnum,
} from "@shadowrun/common/build/enums.js";
import { useGearType } from "@shadowrun/common/src/schemas/weaponSchemas.js";
import assert from "assert";
import { GearXmlType, sourceBookXmlEnum } from "./ParserCommonDefines.js";

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

// TODO: handle gear correctly
export function convertXmlGears(
  gears: GearXmlType,
  name: string
): Array<useGearType> {
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
