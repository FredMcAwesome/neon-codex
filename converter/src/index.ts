import { ParseRanges } from "./xmlParser/combatGear/RangeParser.js";
ParseRanges();

import { ParseWeapons } from "./xmlParser/combatGear/WeaponParser.js";

ParseWeapons();

import { ParseWeaponAccessories } from "./xmlParser/combatGear/WeaponAccessoryParser.js";

ParseWeaponAccessories();

import { ParseSkills } from "./xmlParser/character/SkillParser.js";

ParseSkills();

import { ParseArmour } from "./xmlParser/combatGear/ArmourParser.js";
ParseArmour();

import { ParseArmourMods } from "./xmlParser/combatGear/ArmourModParser.js";
ParseArmourMods();

import { ParseSpells } from "./xmlParser/magic/SpellParser.js";
ParseSpells();

import { ParseBioware } from "./xmlParser/bodyModification/BiowareParser.js";
ParseBioware();

import { ParseCyberware } from "./xmlParser/bodyModification/CyberwareParser.js";
ParseCyberware();

import { ParseGear } from "./xmlParser/otherGear/GenericGearParser.js";
import { ParseDrugs } from "./xmlParser/otherGear/DrugParser.js";
import { ParseVehicles } from "./xmlParser/riggerGear/VehicleParser.js";
ParseGear();
ParseDrugs();
ParseVehicles();
