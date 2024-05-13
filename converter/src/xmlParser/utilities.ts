import assert from "assert";
import { XMLParser } from "fast-xml-parser";
import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { BiowareListXmlSchema } from "./bodyModification/BiowareParserSchemas.js";
import { CyberwareListXmlSchema } from "./bodyModification/CyberwareParserSchemas.js";
import { QualityListXmlSchema } from "./character/QualityParserSchemas.js";
import { ArmourModListXmlSchema } from "./combat/ArmourModParserSchemas.js";
import { SkillListXmlSchema } from "./character/SkillParser.js";
import { ArmourListXmlSchema } from "./combat/ArmourParserSchemas.js";
import { WeaponAccessoryListXmlSchema } from "./combat/WeaponAccessoryParserSchemas.js";
import { WeaponListXmlSchema } from "./combat/WeaponParserSchemas.js";
import { SpellListXmlSchema } from "./magic/SpellParserSchemas.js";
import { DrugComponentListXmlSchema } from "./other/DrugComponentParserSchemas.js";
import { DrugListXmlSchema } from "./other/DrugParserSchemas.js";
import { GearListXmlSchema } from "./other/GearParserSchemas.js";
import { VehicleModListXmlSchema } from "./riggerGear/VehicleModParserSchemas.js";
import { VehicleListXmlSchema } from "./riggerGear/VehicleParserSchemas.js";
import { MetatypeListXmlSchema } from "./character/MetatypeParserSchemas.js";
import { AdeptPowerListXmlSchema } from "./magic/AdeptPowerParserSchemas.js";

export const CheckGUIDs = function () {
  const currentPath = import.meta.url;

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "_",
    textNodeName: "xmltext",
  });
  // --- Bioware --- //
  let xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/bioware.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jObj: any = parser.parse(xml_string);

  const biowareListParsed = BiowareListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.biowares.bioware
  );

  if (!biowareListParsed.success) {
    console.log(biowareListParsed.error.errors[0]);
    assert(false);
  }

  // --- Cyberware --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/cyberware.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const cyberwareListParsed = CyberwareListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.cyberwares.cyberware
  );

  if (!cyberwareListParsed.success) {
    console.log(cyberwareListParsed.error.errors[0]);
    assert(false);
  }

  // --- Quality --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/qualities.xml"),
    "utf8"
  );
  jObj = parser.parse(xml_string);
  const qualityListParsed = QualityListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.qualities.quality
  );

  if (!qualityListParsed.success) {
    console.log(qualityListParsed.error.errors[0]);
    assert(false);
  }

  // --- Metatype --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/metatypes.xml"),
    "utf8"
  );
  jObj = parser.parse(xml_string);
  const metatypeListParsed = MetatypeListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.metatypes.metatype
  );

  if (!metatypeListParsed.success) {
    console.log(metatypeListParsed.error.errors[0]);
    assert(false);
  }

  // --- Skill --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/skills.xml"),
    "utf8"
  );
  jObj = parser.parse(xml_string);
  const skillListParsed = SkillListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.skills.skill
  );

  if (!skillListParsed.success) {
    console.log(skillListParsed.error.errors[0]);
    assert(false);
  }

  // --- Armour Mod --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/armor.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const armourModListParsed = ArmourModListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mods.mod
  );

  if (!armourModListParsed.success) {
    console.log(armourModListParsed.error.errors[0]);
    assert(false);
  }

  // --- Armour --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/armor.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const armourListParsed = ArmourListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.armors.armor
  );

  if (!armourListParsed.success) {
    console.log(armourListParsed.error.errors[0]);
    assert(false);
  }

  // --- Weapon Accessory --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/weapons.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const weaponAccessoryListParsed = WeaponAccessoryListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.accessories.accessory
  );

  if (!weaponAccessoryListParsed.success) {
    console.log(weaponAccessoryListParsed.error.errors[0]);
    assert(false);
  }

  // --- Weapon --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/weapons.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const weaponListParsed = WeaponListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weapons.weapon
  );

  if (!weaponListParsed.success) {
    console.log(weaponListParsed.error.errors[0]);
    assert(false);
  }

  // --- Spell --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/spells.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const spellListParsed = SpellListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.spells.spell
  );

  if (!spellListParsed.success) {
    console.log(spellListParsed.error.errors[0]);
    assert(false);
  }

  // --- Adept Powers --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/powers.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const adeptPowerListParsed = AdeptPowerListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.powers.power
  );

  if (!adeptPowerListParsed.success) {
    console.log(adeptPowerListParsed.error.errors[0]);
    assert(false);
  }

  // --- Drug Component --- //
  xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../xmls/drugcomponents.xml"
    ),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const drugComponentListParsed = DrugComponentListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.drugcomponents.drugcomponent
  );

  if (!drugComponentListParsed.success) {
    console.log(drugComponentListParsed.error.errors[0]);
    assert(false);
  }

  // --- Drug --- //
  xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../xmls/drugcomponents.xml"
    ),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const drugListParsed = DrugListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.drugs.drug
  );

  if (!drugListParsed.success) {
    console.log(drugListParsed.error.errors[0]);
    assert(false);
  }

  // --- Gear --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/gear.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const gearListParsed = GearListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.gears.gear
  );

  if (!gearListParsed.success) {
    console.log(gearListParsed.error.errors[0]);
    assert(false);
  }

  // --- Vehicle Mod --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/vehicles.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const vehicleModListParsed = VehicleModListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mods.mod
  );
  const vehicleWeaponMountModListParsed = VehicleModListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weaponmountmods.mod
  );

  if (!vehicleModListParsed.success) {
    console.log(vehicleModListParsed.error.errors[0]);
    assert(false);
  } else if (!vehicleWeaponMountModListParsed.success) {
    console.log(vehicleWeaponMountModListParsed.error.errors[0]);
    assert(false);
  }

  // --- Vehicle --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/vehicles.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const vehicleListParsed = VehicleListXmlSchema.safeParse(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.vehicles.vehicle
  );

  if (!vehicleListParsed.success) {
    console.log(vehicleListParsed.error.errors[0]);
    assert(false);
  }

  let idList = biowareListParsed.data.map((bioware) => {
    return bioware.id;
  });
  idList = idList.concat(
    cyberwareListParsed.data.map((cyberware) => {
      return cyberware.id;
    })
  );
  idList = idList.concat(
    qualityListParsed.data.map((quality) => {
      return quality.id;
    })
  );
  idList = idList.concat(
    skillListParsed.data.map((skill) => {
      return skill.id;
    })
  );
  idList = idList.concat(
    armourModListParsed.data.map((armourMod) => {
      return armourMod.id;
    })
  );
  idList = idList.concat(
    armourListParsed.data.map((armour) => {
      return armour.id;
    })
  );
  idList = idList.concat(
    weaponAccessoryListParsed.data.map((weaponAccessory) => {
      return weaponAccessory.id;
    })
  );
  idList = idList.concat(
    weaponListParsed.data.map((weapon) => {
      return weapon.id;
    })
  );
  idList = idList.concat(
    spellListParsed.data.map((spell) => {
      return spell.id;
    })
  );
  idList = idList.concat(
    adeptPowerListParsed.data.map((spell) => {
      return spell.id;
    })
  );
  idList = idList.concat(
    drugComponentListParsed.data.map((drugComponent) => {
      return drugComponent.id;
    })
  );
  idList = idList.concat(
    drugListParsed.data.map((drug) => {
      return drug.id;
    })
  );
  idList = idList.concat(
    gearListParsed.data.map((gear) => {
      return gear.id;
    })
  );
  idList = idList.concat(
    vehicleModListParsed.data.map((vehicleMod) => {
      return vehicleMod.id;
    })
  );
  idList = idList.concat(
    vehicleWeaponMountModListParsed.data.map((weaponMount) => {
      return weaponMount.id;
    })
  );
  idList = idList.concat(
    vehicleListParsed.data.map((vehicle) => {
      return vehicle.id;
    })
  );
  for (let i = 0; i < idList.length; i++) {
    for (let j = i + 1; j < idList.length; j++) {
      assert(idList[i] !== idList[j], `GUID "${idList[i]}" is duplicated`);
    }
  }
  console.log("All GUIDs are unique!");
};

export const removeAttrFromObject = <O extends object, A extends keyof O>(
  object: O,
  attr: A
): Omit<O, A> => {
  const newObject = { ...object };

  if (attr in newObject) {
    delete newObject[attr];
  }

  return newObject;
};
