import { ParseRanges } from "./xmlParser/combat/RangeParser.js";
ParseRanges();

import { ParseWeapons } from "./xmlParser/combat/WeaponParser.js";
ParseWeapons();
import { ParseWeaponAccessories } from "./xmlParser/combat/WeaponAccessoryParser.js";
ParseWeaponAccessories();

import { ParseSkills } from "./xmlParser/character/SkillParser.js";
ParseSkills();

import { ParseArmour } from "./xmlParser/combat/ArmourParser.js";
ParseArmour();
import { ParseArmourMods } from "./xmlParser/combat/ArmourModParser.js";
ParseArmourMods();

import { ParseSpells } from "./xmlParser/magic/SpellParser.js";
ParseSpells();

import { ParseBioware } from "./xmlParser/bodyModification/BiowareParser.js";
ParseBioware();
import { ParseCyberware } from "./xmlParser/bodyModification/CyberwareParser.js";
ParseCyberware();

import { ParseDrugs } from "./xmlParser/other/DrugParser.js";
ParseDrugs();
import { ParseDrugComponents } from "./xmlParser/other/DrugComponentParser.js";
ParseDrugComponents();

import { ParseVehicles } from "./xmlParser/riggerGear/VehicleParser.js";
ParseVehicles();
import { ParseVehicleMods } from "./xmlParser/riggerGear/VehicleModParser.js";
ParseVehicleMods();

import { ParseGear } from "./xmlParser/other/GearParser.js";
ParseGear();
