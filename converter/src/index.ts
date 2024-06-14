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

import { ParseAdeptPowers } from "./xmlParser/magic/AdeptPowerParser.js";
ParseAdeptPowers();

import { ParseTraditions } from "./xmlParser/magic/TraditionParser.js";
ParseTraditions();

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

import { ParseQuality } from "./xmlParser/character/QualityParser.js";
ParseQuality();

import { ParseMetatypes } from "./xmlParser/character/MetatypeParser.js";
ParseMetatypes();

import { ParsePriorites } from "./xmlParser/character/PriorityParser.js";
ParsePriorites();

import { ParseCritters } from "./xmlParser/creatures/CritterParser.js";
ParseCritters();
import { ParseCritterPowers } from "./xmlParser/creatures/CritterPowerParser.js";
ParseCritterPowers();

import { ParseComplexForms } from "./xmlParser/magic/ComplexFormParser.js";
ParseComplexForms();

import { CheckGUIDs } from "./xmlParser/utilities.js";
CheckGUIDs();
