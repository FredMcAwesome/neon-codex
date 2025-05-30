import type { Options } from "@mikro-orm/postgresql";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import Users from "./models/accounts/userModel.js";
import Comments from "./models/forum/commentModel.js";
import Threads from "./models/forum/threadModel.js";
import { Skills } from "./models/rpg/abilities/skillModel.js";
import { Spells } from "./models/rpg/abilities/spellModel.js";
import {
  ActiveArmourModifications,
  IncludedArmourModifications,
  CustomisedArmourModifications,
  PackArmourModifications,
} from "./models/rpg/activeTables/activeArmourModificationModel.js";
import {
  ActiveGears,
  WeaponAccessoryIncludedGears,
  ActiveWeaponAccessoryGears,
  ArmourIncludedGears,
  ArmourModificationIncludedGears,
  AugmentationIncludedGears,
  VehicleIncludedGears,
  GearIncludedGears,
  ActiveArmourIncludedGears,
  PackGears,
} from "./models/rpg/activeTables/activeGearModel.js";
import {
  ActiveVehicleModifications,
  IncludedVehicleModifications,
  CustomisedVehicleModifications,
  PackVehicleModifications,
} from "./models/rpg/activeTables/activeVehicleModificationModel.js";
import {
  ActiveWeaponAccessories,
  IncludedWeaponAccessories,
  CustomisedWeaponAccessories,
} from "./models/rpg/activeTables/activeWeaponAccessoryModel.js";
import {
  ActiveWeaponMounts,
  IncludedWeaponMounts,
  CustomisedWeaponMounts,
  PackVehicleWeaponMounts,
} from "./models/rpg/activeTables/activeWeaponMountModel.js";
import {
  ActiveSkills,
  CustomisedSkills,
  CritterIncludedSkills,
} from "./models/rpg/activeTables/activeSkillModel.js";
import {
  ActiveArmours,
  CustomisedArmours,
  PackArmours,
} from "./models/rpg/activeTables/activeArmourModel.js";
import {
  ActiveVehicles,
  CustomisedVehicles,
  PackVehicles,
} from "./models/rpg/activeTables/activeVehicleModel.js";
import {
  ActiveWeapons,
  CustomisedWeapons,
  WeaponMountWeapons,
  PackWeapons,
} from "./models/rpg/activeTables/activeWeaponModel.js";
import {
  Augmentations,
  Biowares,
  Cyberwares,
} from "./models/rpg/equipment/bodyModification/augmentationModel.js";
import { Armours } from "./models/rpg/equipment/combat/armourModel.js";
import { ArmourModifications } from "./models/rpg/equipment/combat/armourModificationModel.js";
import { WeaponRanges } from "./models/rpg/equipment/combat/helperTables/weaponRangeModel.js";
import { WeaponAccessories } from "./models/rpg/equipment/combat/weaponAccessoryModel.js";
import {
  Weapons,
  MeleeWeapons,
  RangedWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "./models/rpg/equipment/combat/weaponModel.js";
import { DrugComponents } from "./models/rpg/equipment/other/drugComponentModel.js";
import { Drugs } from "./models/rpg/equipment/other/drugModel.js";
import { Gears } from "./models/rpg/equipment/other/gearModel.js";
import {
  Vehicles,
  MannedVehicles,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
} from "./models/rpg/equipment/rigger/vehicleModel.js";
import {
  VehicleModifications,
  VehicleChasisModifications,
} from "./models/rpg/equipment/rigger/vehicleModificationModel.js";
import { WeaponMounts } from "./models/rpg/equipment/rigger/weaponMountModel.js";
import {
  HOST,
  DATABASE_PORT,
  DB_NAME,
  PASSWORD,
} from "./utils/databaseConfig.js";
import { Characters } from "./models/rpg/characters/characterModel.js";
import { Qualities } from "./models/rpg/traits/qualityModel.js";
import {
  Metahumans,
  Metasapients,
  Heritages,
  Metavariants,
  Shapeshifters,
  BaseHeritages,
} from "./models/rpg/traits/heritageModel.js";
import { HeritagePriorityDetails } from "./models/rpg/otherData/heritagePriorityDetailModel.js";
import { Priorities } from "./models/rpg/otherData/priorityModel.js";
import {
  SkillBasePriorityDetails,
  SkillPriorityDetails,
  SkillSourcePriorityDetails,
  SkillGroupPriorityDetails,
} from "./models/rpg/otherData/skillPriorityDetailModel.js";
import {
  TalentPriorityDetails,
  MagicTalentPriorityDetails,
  ResonanceTalentPriorityDetails,
  DepthTalentPriorityDetails,
  MundaneTalentPriorityDetails,
} from "./models/rpg/otherData/talentPriorityDetailModel.js";
import { SkillGroups } from "./models/rpg/abilities/skillGroupModel.js";
import {
  ActiveQualities,
  CustomisedQualities,
  HeritageIncludedQualities,
  CritterIncludedQualities,
} from "./models/rpg/activeTables/activeQualityModel.js";
import { AdeptPowers } from "./models/rpg/abilities/adeptPowerModel.js";
import {
  AllSpiritsTraditions,
  LinkedSpiritsTraditions,
  Traditions,
  UnlinkedSpiritsTraditions,
} from "./models/rpg/traits/traditionModel.js";
import { ComplexForms } from "./models/rpg/abilities/complexFormModel.js";
import { CritterPowers } from "./models/rpg/abilities/critterPowerModel.js";
import { Critters } from "./models/rpg/creatures/critterModel.js";
import {
  CustomisedAugmentations,
  ActiveAugmentations,
  CritterIncludedAugmentations,
  PackAugmentations,
  ChildAugmentations,
  BaseActiveAugmentations,
} from "./models/rpg/activeTables/activeAugmentationModel.js";
import {
  ActiveComplexForms,
  CustomisedComplexForms,
  IncludedComplexForms,
  CritterIncludedComplexForms,
} from "./models/rpg/activeTables/activeComplexFormModel.js";
import {
  ActiveCritterPowers,
  IncludedCritterPowers,
  CustomisedCritterPowers,
} from "./models/rpg/activeTables/activeCritterPowerModel.js";
import { CustomisedCritters } from "./models/rpg/activeTables/customisedCritterModel.js";
import {
  ActiveSkillGroups,
  CritterIncludedSkillGroups,
  CustomisedSkillGroups,
} from "./models/rpg/activeTables/activeSkillGroupModel.js";
import {
  ActiveKnowledgeSkills,
  CustomisedKnowledgeSkills,
  CritterIncludedKnowledgeSkills,
} from "./models/rpg/activeTables/activeKnowledgeSkillModel.js";
import { Programs } from "./models/rpg/abilities/programModel.js";
import { ActivePrograms } from "./models/rpg/activeTables/activeProgramModel.js";
import {
  ActiveDepthTalents,
  ActiveMagicTalents,
  ActiveMundaneTalents,
  ActiveResonanceTalents,
  ActiveTalents,
} from "./models/rpg/activeTables/activeTalentModel.js";
import {
  Mentors,
  MentorSpirits,
  Paragons,
} from "./models/rpg/otherData/mentorModel.js";
import { Bonuses, QualityBonuses } from "./models/rpg/otherData/bonusModel.js";
import { ActiveMentorSpirits } from "./models/rpg/activeTables/activeMentorModel.js";
import { ActiveParagons } from "./models/rpg/activeTables/activeParagonModel.js";
import { MartialArtTechniques } from "./models/rpg/abilities/martialArtTechniqueModel.js";
import { MartialArts } from "./models/rpg/abilities/martialArtModel.js";
import { ActiveMartialArts } from "./models/rpg/activeTables/activeMartialArtModel.js";
import { Lifestyles } from "./models/rpg/otherData/lifestyleModel.js";
import { LifestyleQualities } from "./models/rpg/otherData/lifestyleQualityModel.js";
import {
  ActiveLifestyles,
  PackLifestyles,
} from "./models/rpg/activeTables/activeLIfestyleModel.js";
import { EquipmentPacks } from "./models/rpg/equipment/equipmentPackModel.js";
import { WeaponMountModifications } from "./models/rpg/equipment/rigger/weaponMountModModel.js";

const dbOptions: Options = {
  entities: [
    Users,
    Threads,
    Comments,

    Skills,
    ActiveSkills,
    CritterIncludedSkills,
    CustomisedSkills,
    SkillGroups,
    ActiveSkillGroups,
    CritterIncludedSkillGroups,
    CustomisedSkillGroups,
    ActiveKnowledgeSkills,
    CritterIncludedKnowledgeSkills,
    CustomisedKnowledgeSkills,

    Qualities,
    ActiveQualities,
    HeritageIncludedQualities,
    CritterIncludedQualities,
    CustomisedQualities,

    Heritages,
    BaseHeritages,
    Metahumans,
    Metavariants,
    Metasapients,
    Shapeshifters,

    Priorities,

    HeritagePriorityDetails,
    TalentPriorityDetails,
    SkillBasePriorityDetails,
    SkillPriorityDetails,
    SkillSourcePriorityDetails,
    SkillGroupPriorityDetails,
    MagicTalentPriorityDetails,
    ResonanceTalentPriorityDetails,
    DepthTalentPriorityDetails,
    MundaneTalentPriorityDetails,

    WeaponRanges,

    Weapons,
    MeleeWeapons,
    RangedWeapons,
    ProjectileWeapons,
    FirearmWeapons,
    Explosives,
    WeaponAccessories,

    ActiveWeapons,
    PackWeapons,
    WeaponMountWeapons,
    CustomisedWeapons,
    ActiveWeaponAccessories,
    IncludedWeaponAccessories,
    CustomisedWeaponAccessories,

    Armours,
    ArmourModifications,

    ActiveArmours,
    PackArmours,
    CustomisedArmours,
    ActiveArmourModifications,
    PackArmourModifications,
    IncludedArmourModifications,
    CustomisedArmourModifications,

    Drugs,
    DrugComponents,

    Augmentations,
    Biowares,
    Cyberwares,
    ActiveAugmentations,
    BaseActiveAugmentations,
    ChildAugmentations,
    PackAugmentations,
    CritterIncludedAugmentations,
    CustomisedAugmentations,

    Vehicles,
    MannedVehicles,
    Groundcrafts,
    Watercrafts,
    Aircrafts,
    Drones,

    WeaponMounts,
    WeaponMountModifications,

    ActiveWeaponMounts,
    IncludedWeaponMounts,
    CustomisedWeaponMounts,
    PackVehicleWeaponMounts,

    VehicleModifications,
    VehicleChasisModifications,

    ActiveVehicles,
    PackVehicles,
    CustomisedVehicles,
    ActiveVehicleModifications,
    IncludedVehicleModifications,
    PackVehicleModifications,
    CustomisedVehicleModifications,

    Gears,

    ActiveGears,
    WeaponAccessoryIncludedGears,
    ActiveWeaponAccessoryGears,
    ArmourIncludedGears,
    ArmourModificationIncludedGears,
    AugmentationIncludedGears,
    VehicleIncludedGears,
    GearIncludedGears,
    ActiveArmourIncludedGears,
    PackGears,

    Spells,
    AdeptPowers,
    Traditions,
    LinkedSpiritsTraditions,
    UnlinkedSpiritsTraditions,
    AllSpiritsTraditions,
    ComplexForms,
    ActiveComplexForms,
    IncludedComplexForms,
    CritterIncludedComplexForms,
    CustomisedComplexForms,

    ActiveTalents,
    ActiveMagicTalents,
    ActiveResonanceTalents,
    ActiveDepthTalents,
    ActiveMundaneTalents,

    Programs,
    ActivePrograms,

    Mentors,
    MentorSpirits,
    Paragons,
    ActiveMentorSpirits,
    ActiveParagons,

    Critters,
    CustomisedCritters,
    CritterPowers,
    ActiveCritterPowers,
    IncludedCritterPowers,
    CustomisedCritterPowers,

    Bonuses,
    QualityBonuses,

    MartialArts,
    MartialArtTechniques,
    ActiveMartialArts,

    Lifestyles,
    LifestyleQualities,
    ActiveLifestyles,
    PackLifestyles,

    EquipmentPacks,

    Characters,
  ],
  host: HOST,
  port: DATABASE_PORT,
  dbName: DB_NAME,
  password: PASSWORD,
  forceUndefined: true,
  driver: PostgreSqlDriver,
};

export default dbOptions;
