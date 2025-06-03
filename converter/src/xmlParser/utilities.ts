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
import { SpellListXmlSchema } from "./talent/SpellParserSchemas.js";
import { DrugComponentListXmlSchema } from "./other/DrugComponentParserSchemas.js";
import { DrugListXmlSchema } from "./other/DrugParserSchemas.js";
import { GearListXmlSchema } from "./other/GearParserSchemas.js";
import { VehicleModListXmlSchema } from "./riggerGear/VehicleModParserSchemas.js";
import { VehicleListXmlSchema } from "./riggerGear/VehicleParserSchemas.js";
import { MetatypeListXmlSchema } from "./character/MetatypeParserSchemas.js";
import { AdeptPowerListXmlSchema } from "./talent/AdeptPowerParserSchemas.js";
import { TraditionListXmlSchema } from "./talent/TraditionParserSchemas.js";
import { CritterListXmlSchema } from "./creatures/CritterParserSchemas.js";
import { ProgramListXmlSchema } from "./talent/ProgramParser.js";
import { CritterPowerListXmlSchema } from "./creatures/CritterPowerParserSchemas.js";
import { ComplexFormListXmlSchema } from "./talent/ComplexFormParserSchemas.js";
import { ParagonListXmlSchema } from "./talent/ParagonParser.js";
import { MentorSpiritListXmlSchema } from "./talent/MentorSpiritParser.js";
import { MartialArtListXmlSchema } from "./character/MartialArtParser.js";
import { MartialArtTechniqueListXmlSchema } from "./character/MartialArtTechniqueParser.js";
import { type } from "arktype";

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

  const biowareListParsed = BiowareListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.biowares.bioware
  );

  if (biowareListParsed instanceof type.errors) {
    console.log(biowareListParsed.summary);
    assert(false);
  }

  // --- Cyberware --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/cyberware.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const cyberwareListParsed = CyberwareListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.cyberwares.cyberware
  );

  if (cyberwareListParsed instanceof type.errors) {
    console.log(cyberwareListParsed.summary);
    assert(false);
  }

  // --- Quality --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/qualities.xml"),
    "utf8"
  );
  jObj = parser.parse(xml_string);
  const qualityListParsed = QualityListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.qualities.quality
  );

  if (qualityListParsed instanceof type.errors) {
    console.log(qualityListParsed.summary);
    assert(false);
  }

  // --- Metatype --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/metatypes.xml"),
    "utf8"
  );
  jObj = parser.parse(xml_string);
  const metatypeListParsed = MetatypeListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.metatypes.metatype
  );

  if (metatypeListParsed instanceof type.errors) {
    console.log(metatypeListParsed.summary);
    assert(false);
  }

  // --- Skill --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/skills.xml"),
    "utf8"
  );
  jObj = parser.parse(xml_string);
  const skillListParsed = SkillListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.skills.skill
  );

  if (skillListParsed instanceof type.errors) {
    console.log(skillListParsed.summary);
    assert(false);
  }

  // --- Armour Mod --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/armor.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const armourModListParsed = ArmourModListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mods.mod
  );

  if (armourModListParsed instanceof type.errors) {
    console.log(armourModListParsed.summary);
    assert(false);
  }

  // --- Armour --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/armor.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const armourListParsed = ArmourListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.armors.armor
  );

  if (armourListParsed instanceof type.errors) {
    console.log(armourListParsed.summary);
    assert(false);
  }

  // --- Weapon Accessory --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/weapons.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const weaponAccessoryListParsed = WeaponAccessoryListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.accessories.accessory
  );

  if (weaponAccessoryListParsed instanceof type.errors) {
    console.log(weaponAccessoryListParsed.summary);
    assert(false);
  }

  // --- Weapon --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/weapons.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const weaponListParsed = WeaponListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weapons.weapon
  );

  if (weaponListParsed instanceof type.errors) {
    console.log(weaponListParsed.summary);
    assert(false);
  }

  // --- Spell --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/spells.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const spellListParsed = SpellListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.spells.spell
  );

  if (spellListParsed instanceof type.errors) {
    console.log(spellListParsed.summary);
    assert(false);
  }

  // --- Programs --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/programs.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const programListParsed = ProgramListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.programs.program
  );

  if (programListParsed instanceof type.errors) {
    console.log(programListParsed.summary);
    assert(false);
  }

  // --- Adept Powers --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/powers.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const adeptPowerListParsed = AdeptPowerListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.powers.power
  );

  if (adeptPowerListParsed instanceof type.errors) {
    console.log(adeptPowerListParsed.summary);
    assert(false);
  }
  // --- Traditions --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/traditions.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const traditionListParsed = TraditionListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.traditions.tradition
  );

  if (traditionListParsed instanceof type.errors) {
    console.log(traditionListParsed.summary);
    assert(false);
  }

  // --- Critters --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/critters.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const critterListParsed = CritterListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.metatypes.metatype
  );

  if (critterListParsed instanceof type.errors) {
    console.log(critterListParsed.summary);
    assert(false);
  }

  // --- Critter Powers --- //
  xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../xmls/critterpowers.xml"
    ),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const critterPowerListParsed = CritterPowerListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.powers.power
  );

  if (critterPowerListParsed instanceof type.errors) {
    console.log(critterPowerListParsed.summary);
    assert(false);
  }

  // --- Complex Form --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/complexforms.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const complexFormListParsed = ComplexFormListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.complexforms.complexform
  );

  if (complexFormListParsed instanceof type.errors) {
    console.log(complexFormListParsed.summary);
    assert(false);
  }

  // --- Paragons --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/paragons.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const paragonListParsed = ParagonListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mentors.mentor
  );

  if (paragonListParsed instanceof type.errors) {
    console.log(paragonListParsed.summary);
    assert(false);
  }

  // --- Mentor Spirit --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/mentors.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const mentorSpiritListParsed = MentorSpiritListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mentors.mentor
  );

  if (mentorSpiritListParsed instanceof type.errors) {
    console.log(mentorSpiritListParsed.summary);
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

  const drugComponentListParsed = DrugComponentListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.drugcomponents.drugcomponent
  );

  if (drugComponentListParsed instanceof type.errors) {
    console.log(drugComponentListParsed.summary);
    assert(false);
  }

  // --- Drugs --- //
  xml_string = fs.readFileSync(
    fileURLToPath(
      path.dirname(currentPath) + "../../../xmls/drugcomponents.xml"
    ),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const drugListParsed = DrugListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.drugs.drug
  );

  if (drugListParsed instanceof type.errors) {
    console.log(drugListParsed.summary);
    assert(false);
  }

  // --- Gear --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/gear.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const gearListParsed = GearListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.gears.gear
  );

  if (gearListParsed instanceof type.errors) {
    console.log(gearListParsed.summary);
    assert(false);
  }

  // --- Vehicle Mod --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/vehicles.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const vehicleModListParsed = VehicleModListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.mods.mod
  );
  const vehicleWeaponMountModListParsed = VehicleModListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.weaponmountmods.mod
  );

  if (vehicleModListParsed instanceof type.errors) {
    console.log(vehicleModListParsed.summary);
    assert(false);
  } else if (vehicleWeaponMountModListParsed instanceof type.errors) {
    console.log(vehicleWeaponMountModListParsed.summary);
    assert(false);
  }

  // --- Vehicle --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/vehicles.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const vehicleListParsed = VehicleListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.vehicles.vehicle
  );

  if (vehicleListParsed instanceof type.errors) {
    console.log(vehicleListParsed.summary);
    assert(false);
  }

  // --- Martial Art --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/martialarts.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const martialArtListParsed = MartialArtListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.martialarts.martialart
  );

  if (martialArtListParsed instanceof type.errors) {
    console.log(martialArtListParsed.summary);
    assert(false);
  }

  // --- Martial Art Technique --- //
  xml_string = fs.readFileSync(
    fileURLToPath(path.dirname(currentPath) + "../../../xmls/martialarts.xml"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jObj = parser.parse(xml_string);

  const martialArtTechniqueListParsed = MartialArtTechniqueListXmlSchema(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jObj.chummer.techniques.technique
  );

  if (martialArtTechniqueListParsed instanceof type.errors) {
    console.log(martialArtTechniqueListParsed.summary);
    assert(false);
  }

  // ------ GUID List -------
  let idList = biowareListParsed.map((bioware) => {
    return bioware.id;
  });
  idList = idList.concat(
    cyberwareListParsed.map((cyberware) => {
      return cyberware.id;
    })
  );
  idList = idList.concat(
    qualityListParsed.map((quality) => {
      return quality.id;
    })
  );
  idList = idList.concat(
    metatypeListParsed.map((metatype) => {
      return metatype.id;
    })
  );
  idList = idList.concat(
    critterListParsed.map((critter) => {
      return critter.id;
    })
  );
  idList = idList.concat(
    critterPowerListParsed.map((critterPower) => {
      return critterPower.id;
    })
  );
  idList = idList.concat(
    complexFormListParsed.map((complexForm) => {
      return complexForm.id;
    })
  );
  idList = idList.concat(
    paragonListParsed.map((paragon) => {
      return paragon.id;
    })
  );
  idList = idList.concat(
    mentorSpiritListParsed.map((mentorSpirit) => {
      return mentorSpirit.id;
    })
  );
  idList = idList.concat(
    skillListParsed.map((skill) => {
      return skill.id;
    })
  );
  idList = idList.concat(
    armourModListParsed.map((armourMod) => {
      return armourMod.id;
    })
  );
  idList = idList.concat(
    armourListParsed.map((armour) => {
      return armour.id;
    })
  );
  idList = idList.concat(
    weaponAccessoryListParsed.map((weaponAccessory) => {
      return weaponAccessory.id;
    })
  );
  idList = idList.concat(
    weaponListParsed.map((weapon) => {
      return weapon.id;
    })
  );
  idList = idList.concat(
    spellListParsed.map((spell) => {
      return spell.id;
    })
  );
  idList = idList.concat(
    programListParsed.map((program) => {
      return program.id;
    })
  );
  idList = idList.concat(
    adeptPowerListParsed.map((power) => {
      return power.id;
    })
  );
  idList = idList.concat(
    traditionListParsed.map((tradition) => {
      return tradition.id;
    })
  );
  idList = idList.concat(
    drugComponentListParsed.map((drugComponent) => {
      return drugComponent.id;
    })
  );
  idList = idList.concat(
    drugListParsed.map((drug) => {
      return drug.id;
    })
  );
  idList = idList.concat(
    gearListParsed.map((gear) => {
      return gear.id;
    })
  );
  idList = idList.concat(
    vehicleModListParsed.map((vehicleMod) => {
      return vehicleMod.id;
    })
  );
  idList = idList.concat(
    vehicleWeaponMountModListParsed.map((weaponMount) => {
      return weaponMount.id;
    })
  );
  idList = idList.concat(
    vehicleListParsed.map((vehicle) => {
      return vehicle.id;
    })
  );
  idList = idList.concat(
    martialArtListParsed.map((martialArt) => {
      return martialArt.id;
    })
  );
  idList = idList.concat(
    martialArtTechniqueListParsed.map((martialArtTechnique) => {
      return martialArtTechnique.id;
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
