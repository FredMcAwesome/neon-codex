/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import {
  WeaponAccessoryXmlType,
  WeaponAccessoryListXmlSchema,
  WeaponAccessoryListXmlType,
} from "./WeaponAccessoryParserSchema.js";
import {
  AmmoCapacityCalculationType,
  WeaponAccessorySummaryListSchema,
  WeaponAccessorySummarySchema,
  WeaponAccessorySummaryType,
} from "@shadowrun/common/build/schemas/weaponAccessorySchema.js";
import * as fs from "fs";
import assert from "assert";
import { WeaponListXmlSchema } from "./WeaponParserSchema.js";
import { AvailabilityType, CostType, damageTypeEnum } from "@shadowrun/common";
import { convertAllowGear, convertXmlGears } from "./WeaponParserHelper.js";
import { standardCalculationEnum } from "@shadowrun/common/build/enums.js";
import {
  availabilitySemantics,
  getWeaponMounts,
  convertAmmoReplace,
  convertRequirements,
  costSemantics,
  modifyAmmoCapacitySemantics,
} from "./WeaponAccessoryParserHelper.js";
import { sourceBookXmlEnum } from "../ParserCommonDefines.js";
import { convertSource } from "../ParserHelper.js";
import WeaponAccessories from "../../grammar/weaponAccessories.ohm-bundle.js";
import { MatchResult } from "ohm-js";
const Availability = WeaponAccessories.Availability;
const Cost = WeaponAccessories.Cost;
const ModifyAmmoCapacity = WeaponAccessories.ModifyAmmoCapacity;

export function ParseWeaponAccessories() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/weapons.xml"),
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
  //   jObj.chummer.accessories.accessory.filter(
  //     (accessory: { name: string }) =>
  //       accessory.name == "Additional Clip/Magazine"
  //   )[0].forbidden.weapondetails.OR
  // );
  console.log(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    JSON.stringify(
      jObj.chummer.accessories.accessory[119].required.weapondetails
    )
  );

  const weaponListParsed = WeaponListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weapons.weapon
  );

  let weaponNames: Array<string> = [];
  if (weaponListParsed.success) {
    console.log("weapons all g");
    weaponNames = weaponListParsed.data.map((weapon) => weapon.name);
  } else {
    assert(false);
  }

  const weaponAccessoryListParsed = WeaponAccessoryListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.accessories.accessory
  );

  if (weaponAccessoryListParsed.success) console.log("accessories all g");
  else {
    console.log(weaponAccessoryListParsed.error.errors[0]);
  }

  // function convertWeaponAccessory(weapon: WeaponType): RequiredEntityData<MeleeWeapons> {
  const convertWeaponAccessory = function (
    weaponAccessory: WeaponAccessoryXmlType
  ): WeaponAccessorySummaryType {
    console.log(`\n${weaponAccessory.name}`);

    const mountLocations = getWeaponMounts(weaponAccessory.mount);
    const extraMountLocations = getWeaponMounts(weaponAccessory.extramount);
    const mountLocationsOnHostWeapon = mountLocations
      ? extraMountLocations
        ? [mountLocations, extraMountLocations]
        : [mountLocations]
      : extraMountLocations
      ? [extraMountLocations]
      : undefined;

    let ammoCapacityCalculation: AmmoCapacityCalculationType | undefined =
      undefined;
    let match: MatchResult;
    if (weaponAccessory.modifyammocapacity) {
      match = ModifyAmmoCapacity.match(
        weaponAccessory.modifyammocapacity.toString()
      );
      if (match.failed()) {
        throw match.message;
      }
      ammoCapacityCalculation = modifyAmmoCapacitySemantics(match).eval();
      console.log(`Ammo Capacity: ${ammoCapacityCalculation}`);
    }
    let newAmmoType = undefined;
    if (weaponAccessory.ammoreplace)
      newAmmoType = convertAmmoReplace(
        weaponAccessory.ammoreplace,
        weaponAccessory.name
      );
    const conceal = weaponAccessory.conceal
      ? weaponAccessory.conceal === "Rating"
        ? standardCalculationEnum.Rating
        : weaponAccessory.conceal
      : undefined;
    const required = convertRequirements(weaponAccessory.required);
    const forbidden = convertRequirements(weaponAccessory.forbidden);
    match = Availability.match(weaponAccessory.avail.toString());
    if (match.failed()) {
      throw match.message;
    }
    const availability: AvailabilityType = availabilitySemantics(match).eval();
    console.log(`Availability: ${availability}`);

    match = Cost.match(weaponAccessory.cost.toString());
    if (match.failed()) {
      throw match.message;
    }
    const cost: CostType = costSemantics(match).eval();
    console.log(`Cost: ${cost}`);

    return {
      // id: weapon.id,
      name: weaponAccessory.name,
      description: "",
      maxRating: weaponAccessory.rating,
      isWeapon: weaponNames.includes(weaponAccessory.name),
      accuracyIncrease: weaponAccessory.accuracy,
      damageIncrease: weaponAccessory.damage,
      newDamageType: weaponAccessory.damagetype
        ? weaponAccessory.damagetype === "P"
          ? damageTypeEnum.Physical
          : undefined
        : undefined,
      reachIncrease: weaponAccessory.reach,
      armourPiercingIncrease: weaponAccessory.ap,
      recoilCompensationIncrease: weaponAccessory.rc,
      recoilCompensationType: weaponAccessory.rcgroup,
      deploymentRequired: weaponAccessory.rcdeployable === "True",
      availability: availability,
      cost: cost,
      source: convertSource(weaponAccessory.source),
      page: weaponAccessory.page,
      accessoryCostMultiplier: weaponAccessory.accessorycostmultiplier,
      allowGear: convertAllowGear(
        weaponAccessory.allowgear,
        weaponAccessory.name
      ),
      preinstalledGear: weaponAccessory.gears
        ? convertXmlGears(weaponAccessory.gears, weaponAccessory.name)
        : undefined,
      specialModification: weaponAccessory.specialmodification === "True",
      extraAmmoSlots: weaponAccessory.ammoslots,
      ammoCapacityCalculation: ammoCapacityCalculation,
      newAmmoType: newAmmoType,
      hostWeaponMountsRequired: mountLocationsOnHostWeapon,
      hostWeaponRequirements: required,
      hostWeaponRestrictions: forbidden,
      rangePenaltyDecrease: weaponAccessory.rangemodifier,
      concealabilityModification: conceal,
    };
  };

  if (weaponAccessoryListParsed.success) {
    const weaponAccessoryList = weaponAccessoryListParsed.data;
    // .filter((weapon) => {
    //   return weapon.type === weaponTypeEnum.Melee;
    // })
    const englishWeaponAccessoryList: WeaponAccessoryListXmlType =
      weaponAccessoryList.filter((weaponAccessory) => {
        let found = false;
        switch (weaponAccessory.source) {
          case sourceBookXmlEnum.AssassinPrimer:
          case sourceBookXmlEnum.ChromeFlesh:
          case sourceBookXmlEnum.CuttingAces:
          case sourceBookXmlEnum.DataTrails:
          case sourceBookXmlEnum.GunHeaven3:
          case sourceBookXmlEnum.HardTargets:
          case sourceBookXmlEnum.KillCode:
          case sourceBookXmlEnum.KrimeKatalog:
          case sourceBookXmlEnum.Lockdown:
          case sourceBookXmlEnum.NoFuture:
          case sourceBookXmlEnum.Rigger5:
          case sourceBookXmlEnum.RunAndGun:
          case sourceBookXmlEnum.RunFaster:
          case sourceBookXmlEnum.SailAwaySweetSister:
          case sourceBookXmlEnum.Shadowrun5:
          case sourceBookXmlEnum.ShadowsInFocus_SanFranciscoMetroplex:
          case sourceBookXmlEnum.StolenSouls:
          case sourceBookXmlEnum.StreetGrimoire:
          case sourceBookXmlEnum.StreetLethal:
          case sourceBookXmlEnum.TheCompleteTrog:
          case sourceBookXmlEnum.TheSeattleGambit:
          case sourceBookXmlEnum.BetterThanBad:
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
          // Not containing Weapon Accessories
          case sourceBookXmlEnum.StreetGrimoireErrata:
          case sourceBookXmlEnum.BulletsAndBandages:
          case sourceBookXmlEnum.ShadowSpells:
          case sourceBookXmlEnum.NothingPersonal:
          case sourceBookXmlEnum.BloodyBusiness:
          case sourceBookXmlEnum.DataTrailsDissonantEchoes:
          case sourceBookXmlEnum.HowlingShadows:
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
            assert(false, `weaponAccessory.source = ${weaponAccessory.source}`);
            break;
        }
        return found;
      });

    // const weaponListConverted: Array<RequiredEntityData<MeleeWeapons>> =
    const weaponAccessoryListConverted = englishWeaponAccessoryList
      // .filter((weapon) => weapon.name === "Ares Thunderstruck Gauss Rifle")
      // .filter((weaponAccessory) => weaponAccessory.name === "Concealable Holster")
      .map((weaponAccessory: WeaponAccessoryXmlType) => {
        const convertedWeaponAccessory =
          convertWeaponAccessory(weaponAccessory);
        const check = WeaponAccessorySummarySchema.safeParse(
          convertedWeaponAccessory
        );
        if (!check.success) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log(convertedWeaponAccessory);
          throw new Error(check.error.message);
        }
        return convertedWeaponAccessory;
      });
    // console.log(weaponAccessoryListConverted);
    const check = WeaponAccessorySummaryListSchema.safeParse(
      weaponAccessoryListConverted
    );
    if (!check.success) {
      throw new Error(check.error.message);
    }
    const jsonFilePath = fileURLToPath(
      path.dirname(currentPath) + "../../../../jsonFiles/weaponAccessories.json"
    );
    fs.writeFile(
      jsonFilePath,
      JSON.stringify(weaponAccessoryListConverted, null, 2),
      (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`File written! Saved to: ${jsonFilePath}`);
        }
      }
    );
  }
}
