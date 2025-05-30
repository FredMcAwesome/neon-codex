/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import type { WeaponAccessoryXmlType } from "./WeaponAccessoryParserSchemas.js";
import { WeaponAccessoryListXmlSchema } from "./WeaponAccessoryParserSchemas.js";
import type {
  AmmoCapacityCalculationType,
  WeaponAccessoryType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import {
  WeaponAccessoryListSchema,
  WeaponAccessorySchema,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import * as fs from "fs";
import assert from "assert";
import { WeaponListXmlSchema } from "./WeaponParserSchemas.js";
import {
  convertAllowGear,
  convertIncludedXmlGears,
} from "../common/ParserHelper.js";
import {
  damageTypeEnum,
  standardCalculationEnum,
} from "@neon-codex/common/build/enums.js";
import {
  getWeaponMounts,
  availabilityWeaponAccessorySemantics,
  costWeaponAccessorySemantics,
  modifyAmmoCapacitySemantics,
  ammoWeaponAccessorySemantics,
} from "./WeaponAccessoryParserHelper.js";
import { convertSource } from "../common/ParserHelper.js";
import WeaponAccessories from "../../grammar/weaponAccessories.ohm-bundle.js";
import type { MatchResult } from "ohm-js";
import type {
  AvailabilityWeaponAccessoryType,
  CostWeaponAccessoryType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import { convertRequirements } from "../common/RequiredParserHelper.js";
const Availability = WeaponAccessories.Availability;
const Cost = WeaponAccessories.Cost;
const ModifyAmmoCapacity = WeaponAccessories.ModifyAmmoCapacity;
const Ammo = WeaponAccessories.Ammo;

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
  // console.log(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   JSON.stringify(jObj.chummer.accessories.accessory[86])
  // );

  const weaponListParsed = WeaponListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weapons.weapon
  );

  let weaponNames: Array<string> = [];
  if (weaponListParsed.success) {
    weaponNames = weaponListParsed.data.map((weapon) => weapon.name);
  } else {
    assert(false);
  }

  const weaponAccessoryListParsed = WeaponAccessoryListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.accessories.accessory
  );

  if (weaponAccessoryListParsed.success) {
    console.log("weapons.xml (accessories) initial zod parsed");
  } else {
    console.log(weaponAccessoryListParsed.error.errors[0]);
    assert(false);
  }

  const convertWeaponAccessory = function (
    weaponAccessory: WeaponAccessoryXmlType
  ): WeaponAccessoryType {
    // console.log(`\n${weaponAccessory.name}`);

    const mountLocations = getWeaponMounts(weaponAccessory.mount);
    const extraMountLocations = getWeaponMounts(weaponAccessory.extramount);
    const mountLocationsOnHostWeapon = mountLocations
      ? extraMountLocations
        ? mountLocations.concat(extraMountLocations)
        : mountLocations
      : extraMountLocations
      ? extraMountLocations
      : undefined;

    let ammoCapacityCalculation: AmmoCapacityCalculationType | undefined =
      undefined;
    let match: MatchResult;
    if (weaponAccessory.modifyammocapacity) {
      match = ModifyAmmoCapacity.match(
        weaponAccessory.modifyammocapacity.toString()
      );
      if (match.failed()) {
        assert(false, match.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      ammoCapacityCalculation = modifyAmmoCapacitySemantics(match).eval();
      // console.log(`Ammo Capacity: ${ammoCapacityCalculation}`);
    }
    let newAmmoType = undefined;
    if (weaponAccessory.ammoreplace) {
      match = Ammo.match(weaponAccessory.ammoreplace.toString());
      if (match.failed()) {
        assert(false, match.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      newAmmoType = ammoWeaponAccessorySemantics(match).eval();
      // console.log(`New Ammo type: ${newAmmoType}`);
    }
    const conceal = weaponAccessory.conceal
      ? weaponAccessory.conceal === "Rating"
        ? standardCalculationEnum.Rating
        : weaponAccessory.conceal
      : undefined;
    let requirements;
    if (weaponAccessory.required) {
      requirements = convertRequirements(weaponAccessory.required);
    }
    let forbidden;
    if (weaponAccessory.forbidden) {
      forbidden = convertRequirements(weaponAccessory.forbidden);
    }
    match = Availability.match(weaponAccessory.avail.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    const availability: AvailabilityWeaponAccessoryType =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      availabilityWeaponAccessorySemantics(match).eval();
    // console.log(`Availability: ${availability}`);

    match = Cost.match(weaponAccessory.cost.toString());
    if (match.failed()) {
      assert(false, match.message);
    }
    const cost: CostWeaponAccessoryType =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      costWeaponAccessorySemantics(match).eval();
    // console.log(`Cost: ${cost}`);

    const { allowedGearList, allowedGearCategories } = convertAllowGear(
      weaponAccessory.allowgear
    );

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
      allowedGearList: allowedGearList,
      allowedGearCategories: allowedGearCategories,
      includedGearList: weaponAccessory.gears
        ? convertIncludedXmlGears(weaponAccessory.gears)
        : undefined,
      specialModification: weaponAccessory.specialmodification === "True",
      extraAmmoSlots: weaponAccessory.ammoslots,
      ammoCapacityCalculation: ammoCapacityCalculation,
      newAmmoType: newAmmoType,
      hostWeaponMountsRequired: mountLocationsOnHostWeapon,
      hostWeaponRequirements: requirements,
      hostWeaponRestrictions: forbidden,
      ...(weaponAccessory.hide !== undefined && {
        userSelectable: false as const,
      }),
      rangePenaltyDecrease: weaponAccessory.rangemodifier,
      concealabilityModification: conceal,
    };
  };

  const weaponAccessoryList = weaponAccessoryListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  // const weaponListConverted: Array<RequiredEntityData<MeleeWeapons>> =
  const weaponAccessoryListConverted = weaponAccessoryList
    // .filter((weapon) => weapon.name === "Ares Thunderstruck Gauss Rifle")
    // .filter((weaponAccessory) => weaponAccessory.name === "Concealable Holster")
    .map((weaponAccessory: WeaponAccessoryXmlType) => {
      const convertedWeaponAccessory = convertWeaponAccessory(weaponAccessory);
      const check = WeaponAccessorySchema.safeParse(convertedWeaponAccessory);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedWeaponAccessory, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(weaponAccessoryListConverted);
  const check = WeaponAccessoryListSchema.safeParse(
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
