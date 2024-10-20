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

import { ParseSpells } from "./xmlParser/talent/SpellParser.js";
ParseSpells();

import { ParsePrograms } from "./xmlParser/talent/ProgramParser.js";
ParsePrograms();

import { ParseAdeptPowers } from "./xmlParser/talent/AdeptPowerParser.js";
ParseAdeptPowers();

import { ParseTraditions } from "./xmlParser/talent/TraditionParser.js";
ParseTraditions();

import { ParseBiowares } from "./xmlParser/bodyModification/BiowareParser.js";
ParseBiowares();
import { ParseCyberwares } from "./xmlParser/bodyModification/CyberwareParser.js";
ParseCyberwares();

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

import { ParseQualities } from "./xmlParser/character/QualityParser.js";
ParseQualities();

import { ParseMetatypes } from "./xmlParser/character/MetatypeParser.js";
ParseMetatypes();

import { ParsePriorites } from "./xmlParser/character/PriorityParser.js";
ParsePriorites();

import { ParseCritters } from "./xmlParser/creatures/CritterParser.js";
ParseCritters();
import { ParseCritterPowers } from "./xmlParser/creatures/CritterPowerParser.js";
ParseCritterPowers();

import { ParseComplexForms } from "./xmlParser/talent/ComplexFormParser.js";
ParseComplexForms();

import { ParseParagons } from "./xmlParser/talent/ParagonParser.js";
ParseParagons();

import { ParseMentorSpirits } from "./xmlParser/talent/MentorSpiritParser.js";
ParseMentorSpirits();

import { ParseMartialArts } from "./xmlParser/character/MartialArtParser.js";
ParseMartialArts();

import { ParseMartialArtTechniques } from "./xmlParser/character/MartialArtTechniqueParser.js";
ParseMartialArtTechniques();

import { CheckGUIDs } from "./xmlParser/utilities.js";
CheckGUIDs();
