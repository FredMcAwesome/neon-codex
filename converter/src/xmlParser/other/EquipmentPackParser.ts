/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import {
  EquipmentPackSchema,
  type AugmentationEquipmentPackListType,
} from "@neon-codex/common/build/schemas/equipment/equipmentPackSchemas.js";
import {
  EquipmentListXmlSchema,
  type EquipmentPackXmlType,
} from "./EquipmentPackParserSchemas.js";
import {
  convertArmorEquipmentPack,
  convertAugmentationEquipmentPack,
  convertVehicleEquipmentPack,
  convertWeaponEquipmentPack,
} from "./EquipmentPackParserHelper.js";
import { augmentationTypeEnum } from "@neon-codex/common/build/enums.js";
import { convertIncludedXmlGears } from "../common/ParserHelper.js";

export function ParseEquipmentPacks() {
  const currentPath = import.meta.url;
  const xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../../xmls/packs.xml"),
    "utf8"
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jObj: any = parser.parse(xml_string);
  // console.dir(
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   jObj.chummer.packs.pack[193],
  //   { depth: Infinity }
  // );

  const packListParsed = EquipmentListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.packs.pack
  );

  if (packListParsed.success) console.log("packs.xml initial zod parsed");
  else {
    console.log(packListParsed.error.errors[0]);
    assert(false);
  }

  const packList = packListParsed.data;
  // .filter((weapon) => {
  //   return weapon.type === weaponTypeEnum.Melee;
  // })

  const packListConverted = packList
    // .filter((weapon) => weapon.name === "Osmium Mace")
    .map((pack) => {
      const convertedPack = convertPack(pack);
      const check = EquipmentPackSchema.safeParse(convertedPack);
      if (!check.success) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.dir(convertedPack, { depth: Infinity });
        throw new Error(check.error.message);
      }
      return check.data;
    });
  // console.log(armourListConverted);
  const jsonFilePath = fileURLToPath(
    path.dirname(currentPath) + "../../../../jsonFiles/equipmentPacks.json"
  );
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(packListConverted, null, 2),
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`File written! Saved to: ${jsonFilePath}`);
      }
    }
  );
}

function convertPack(pack: EquipmentPackXmlType) {
  // console.log(pack.name);
  let armourList;
  if (pack.armors !== undefined) {
    const xmlArmourList = Array.isArray(pack.armors.armor)
      ? pack.armors.armor
      : [pack.armors.armor];
    armourList = xmlArmourList.map((xmlArmour) => {
      return convertArmorEquipmentPack(xmlArmour);
    });
  }
  let augmentationList: AugmentationEquipmentPackListType | undefined;
  if (pack.biowares !== undefined) {
    const xmlBiowareList = Array.isArray(pack.biowares.bioware)
      ? pack.biowares.bioware
      : [pack.biowares.bioware];
    augmentationList = xmlBiowareList.map((bioware) => {
      return convertAugmentationEquipmentPack(
        bioware,
        augmentationTypeEnum.Bioware
      );
    });
  }
  if (pack.cyberwares !== undefined) {
    const xmlCyberwareList = Array.isArray(pack.cyberwares.cyberware)
      ? pack.cyberwares.cyberware
      : [pack.cyberwares.cyberware];
    if (augmentationList !== undefined) {
      augmentationList = augmentationList.concat(
        xmlCyberwareList.map((cyberware) => {
          return convertAugmentationEquipmentPack(
            cyberware,
            augmentationTypeEnum.Cyberware
          );
        })
      );
    } else {
      augmentationList = xmlCyberwareList.map((cyberware) => {
        return convertAugmentationEquipmentPack(
          cyberware,
          augmentationTypeEnum.Cyberware
        );
      });
    }
  }
  let gearList;
  if (pack.gears !== undefined) {
    const xmlGearList = Array.isArray(pack.gears.gear)
      ? pack.gears.gear
      : [pack.gears.gear];
    gearList = convertIncludedXmlGears({ usegear: xmlGearList });
  }
  let vehicleList;
  if (pack.vehicles !== undefined) {
    const xmlVehicleList = Array.isArray(pack.vehicles.vehicle)
      ? pack.vehicles.vehicle
      : [pack.vehicles.vehicle];
    vehicleList = xmlVehicleList.map((vehicle) => {
      return convertVehicleEquipmentPack(vehicle);
    });
  }
  let weaponList;
  if (pack.weapons !== undefined) {
    const xmlWeaponList = Array.isArray(pack.weapons.weapon)
      ? pack.weapons.weapon
      : [pack.weapons.weapon];
    weaponList = xmlWeaponList.map((weapon) => {
      return convertWeaponEquipmentPack(weapon);
    });
  }

  return {
    name: pack.name,
    description: "",
    category: pack.category,
    nuyen: pack.nuyenbp * 1000,
    armourList: armourList,
    augmentationList: augmentationList,
    gearList: gearList,
    vehicleList: vehicleList,
    weaponList: weaponList,
    ...(pack.lifestyles !== undefined && {
      lifestyle: {
        baseLifestyle: pack.lifestyles.lifestyle.baselifestyle,
        prepurchasedDuration: pack.lifestyles.lifestyle.months,
      },
    }),
  };
}
