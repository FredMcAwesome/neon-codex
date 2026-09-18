import { linkBonusEntity } from "./bonusSeederHelper.js";
import { linkRequirementEntity } from "./requirementSeederHelper.js";
import type { RequirementsType } from "@neon-codex/common";
import {
  QualityBonuses,
  HeritagesBonuses,
  CrittersBonuses,
  AugmentationsBonuses,
  AugmentationsPairBonuses,
  AugmentationsWirelessBonuses,
  AugmentationsWirelessPairBonuses,
  DrugsBonuses,
  GearsBonuses,
  ArmoursBonuses,
  ArmoursWirelessBonuses,
  ArmourModificationsBonuses,
  ArmourModificationsWirelessBonuses,
  VehicleModificationsBonuses,
  SpellsBonuses,
  AdeptPowersBonuses,
  ComplexFormsBonuses,
  ProgramsBonuses,
  CritterPowersBonuses,
  TraditionsBonuses,
  MentorsBonuses,
  MartialArtsBonuses,
  MartialArtTechniquesBonuses,
  LifestylesBonuses,
  LifestyleQualitiesBonuses,
  MetamagicsBonuses,
  EchoesBonuses,
} from "../models/rpg/otherData/bonusModel.js";
import {
  TraditionRequirements,
  LifestyleRequirements,
  LifestyleForbidden,
  LifestyleQualityRequirements,
  LifestyleQualityForbidden,
  MetamagicRequirements,
  TalentPriorityDetailRequirements,
  TalentPriorityDetailForbidden,
  MentorRequired,
  QualityRequirements,
  QualityForbidden,
  QualityKarmaDiscountRequirements,
  AugmentationRequirements,
  AugmentationForbidden,
  VehicleModificationRequirements,
  VehicleModificationForbidden,
  WeaponMountModRequirements,
  MartialArtTechniqueRequirements,
  GearRequirements,
  GearForbidden,
  SpellRequirements,
  MartialArtRequirements,
  ProgramRequirements,
  ComplexFormRequirements,
  CritterPowerRequirements,
  CritterPowerForbidden,
  AdeptPowerAdeptWayRequirements,
  AdeptPowerRequirements,
  AdeptPowerForbidden,
  WeaponRequirements,
  WeaponAccessoryHostRequirements,
  WeaponAccessoryHostForbidden,
  ArmourModificationRequirements,
  ArmourModificationForbidden,
} from "../models/rpg/otherData/requirementsModel.js";
import assert from "assert";
import { EntityManager, ref } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { getSkills } from "../seeds/rpgSeeds/skillsSeed.js";
import { getWeapons } from "../seeds/rpgSeeds/weaponsSeed.js";

function hasRequirements(
  item: unknown
): item is { requirements?: RequirementsType } {
  return typeof item === "object" && item !== null && "requirements" in item;
}

function hasRequired(item: unknown): item is { required?: RequirementsType } {
  return typeof item === "object" && item !== null && "required" in item;
}

function hasAdeptWayRequirements(
  item: unknown
): item is { adeptWayRequirements?: RequirementsType } {
  return (
    typeof item === "object" && item !== null && "adeptWayRequirements" in item
  );
}
import { getWeaponAccessories } from "../seeds/rpgSeeds/weaponAccessoriesSeed.js";
import { getArmourModifications } from "../seeds/rpgSeeds/armourModificationsSeed.js";
import { getArmours } from "../seeds/rpgSeeds/armoursSeed.js";
import { getAugmentations } from "../seeds/rpgSeeds/augmentationsSeed.js";
import { getDrugs, getDrugComponents } from "../seeds/rpgSeeds/drugsSeed.js";
import { getGears } from "../seeds/rpgSeeds/gearsSeed.js";
import { getRanges } from "../seeds/rpgSeeds/rangesSeed.js";
import { getVehicleModifications } from "../seeds/rpgSeeds/vehicleModificationsSeed.js";
import { getWeaponMountModifications } from "../seeds/rpgSeeds/weaponMountModsSeed.js";
import {
  getVehicles,
  createVehicleWeaponMounts,
} from "../seeds/rpgSeeds/vehiclesSeed.js";
import { Skills } from "../models/rpg/abilities/skillModel.js";
import {
  IncludedArmourModifications,
  PackArmourModifications,
} from "../models/rpg/activeTables/activeArmourModificationModel.js";
import {
  WeaponAccessoryIncludedGears,
  ActiveWeaponAccessoryGears,
  ArmourIncludedGears,
  ArmourModificationIncludedGears,
  VehicleIncludedGears,
  GearIncludedGears,
  AugmentationIncludedGears,
  PackGears,
  ActiveArmourIncludedGears,
  ActiveAugmentationGears,
  ActiveVehicleGears,
  ChildGears,
} from "../models/rpg/activeTables/activeGearModel.js";
import { IncludedVehicleModifications } from "../models/rpg/activeTables/activeVehicleModificationModel.js";
import {
  CustomisedWeaponAccessories,
  IncludedWeaponAccessories,
} from "../models/rpg/activeTables/activeWeaponAccessoryModel.js";
import {
  IncludedWeaponMounts,
  PackVehicleWeaponMounts,
} from "../models/rpg/activeTables/activeWeaponMountModel.js";
import {
  Cyberwares,
  Biowares,
  Augmentations,
} from "../models/rpg/equipment/bodyModification/augmentationModel.js";
import { Armours } from "../models/rpg/equipment/combat/armourModel.js";
import { ArmourModifications } from "../models/rpg/equipment/combat/armourModificationModel.js";
import { WeaponRanges } from "../models/rpg/equipment/combat/helperTables/weaponRangeModel.js";
import { WeaponAccessories } from "../models/rpg/equipment/combat/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
  Weapons,
  RangedWeapons,
} from "../models/rpg/equipment/combat/weaponModel.js";
import { DrugComponents } from "../models/rpg/equipment/other/drugComponentModel.js";
import { Drugs } from "../models/rpg/equipment/other/drugModel.js";
import { Gears } from "../models/rpg/equipment/other/gearModel.js";
import {
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
  Vehicles,
} from "../models/rpg/equipment/rigger/vehicleModel.js";
import {
  VehicleChasisModifications,
  VehicleModifications,
} from "../models/rpg/equipment/rigger/vehicleModificationModel.js";
import { WeaponMounts } from "../models/rpg/equipment/rigger/weaponMountModel.js";
import {
  augmentationGradeEnum,
  augmentationCategoryEnum,
  heritageCategoryEnum,
  priorityLetterEnum,
  talentCategoryEnum,
  weaponCategoryEnum,
} from "@neon-codex/common";
import { Qualities } from "../models/rpg/traits/qualityModel.js";
import { getQualities } from "../seeds/rpgSeeds/qualitiesSeed.js";
import { getHeritages } from "../seeds/rpgSeeds/heritagesSeed.js";
import {
  Heritages,
  BaseHeritages,
  Metavariants,
} from "../models/rpg/traits/heritageModel.js";
import { getPriorities } from "../seeds/rpgSeeds/prioritiesSeed.js";
import { Priorities } from "../models/rpg/otherData/priorityModel.js";
import { HeritagePriorityDetails } from "../models/rpg/otherData/heritagePriorityDetailModel.js";
import {
  DepthTalentPriorityDetails,
  MagicTalentPriorityDetails,
  MundaneTalentPriorityDetails,
  ResonanceTalentPriorityDetails,
  TalentPriorityDetails,
} from "../models/rpg/otherData/talentPriorityDetailModel.js";
import {
  SkillGroupPriorityDetails,
  SkillPriorityDetails,
  SkillSourcePriorityDetails,
} from "../models/rpg/otherData/skillPriorityDetailModel.js";
import { SkillGroups } from "../models/rpg/abilities/skillGroupModel.js";
import type {
  HeritageOptionsPriorityType,
  TalentOptionsPriorityType,
  QualityListType,
  WeaponAccessoryListType,
  WeaponListType,
  ArmourModListType,
  AugmentationListType,
  VehicleModListType,
  WeaponMountModListType,
  GearListType,
  SpellListType,
  ProgramListType,
  AdeptPowerListType,
  ComplexFormListType,
  CritterPowerListType,
  TraditionListType,
  MentorListType,
  MartialArtListType,
  MartialArtTechniqueListType,
  LifestyleListType,
  LifestyleQualityListType,
  MetamagicListType,
} from "@neon-codex/common";
import {
  CritterIncludedQualities,
  HeritageIncludedQualities,
} from "../models/rpg/activeTables/activeQualityModel.js";
import { Spells } from "../models/rpg/abilities/spellModel.js";
import { getSpells } from "../seeds/rpgSeeds/spellsSeed.js";
import { getAdeptPowers } from "../seeds/rpgSeeds/adeptPowersSeed.js";
import { AdeptPowers } from "../models/rpg/abilities/adeptPowerModel.js";
import {
  Traditions,
  AllSpiritsTraditions,
  LinkedSpiritsTraditions,
  UnlinkedSpiritsTraditions,
} from "../models/rpg/traits/traditionModel.js";
import { getTraditions } from "../seeds/rpgSeeds/traditionsSeed.js";
import { getComplexForms } from "../seeds/rpgSeeds/complexFormsSeed.js";
import { ComplexForms } from "../models/rpg/abilities/complexFormModel.js";
import { getCritters } from "../seeds/rpgSeeds/crittersSeed.js";
import { getCritterPowers } from "../seeds/rpgSeeds/critterPowersSeed.js";
import { Critters } from "../models/rpg/creatures/critterModel.js";
import { CritterPowers } from "../models/rpg/abilities/critterPowerModel.js";
import {
  ChildAugmentations,
  CritterIncludedAugmentations,
  PackAugmentations,
} from "../models/rpg/activeTables/activeAugmentationModel.js";
import { IncludedCritterPowers } from "../models/rpg/activeTables/activeCritterPowerModel.js";
import { CritterIncludedComplexForms } from "../models/rpg/activeTables/activeComplexFormModel.js";
import { CritterIncludedSkills } from "../models/rpg/activeTables/activeSkillModel.js";
import { CritterIncludedSkillGroups } from "../models/rpg/activeTables/activeSkillGroupModel.js";
import { CritterIncludedKnowledgeSkills } from "../models/rpg/activeTables/activeKnowledgeSkillModel.js";
import { getPrograms } from "../seeds/rpgSeeds/programsSeed.js";
import { Programs } from "../models/rpg/abilities/programModel.js";
import { getMentors } from "../seeds/rpgSeeds/mentorsSeed.js";
import {
  MentorSpirits,
  Paragons,
} from "../models/rpg/otherData/mentorModel.js";
import { getMartialArts } from "../seeds/rpgSeeds/martialArtsSeed.js";
import { getMartialArtTechniques } from "../seeds/rpgSeeds/martialArtTechniquesSeed.js";
import { MartialArts } from "../models/rpg/abilities/martialArtModel.js";
import { MartialArtTechniques } from "../models/rpg/abilities/martialArtTechniqueModel.js";
import { getLifestyles } from "../seeds/rpgSeeds/lifestylesSeed.js";
import { getLifestyleQualities } from "../seeds/rpgSeeds/lifestyleQualitiesSeed.js";
import { Lifestyles } from "../models/rpg/otherData/lifestyleModel.js";
import { LifestyleQualities } from "../models/rpg/otherData/lifestyleQualityModel.js";
import { getEquipmentPacks } from "../seeds/rpgSeeds/equipmentPacksSeed.js";
import { EquipmentPacks } from "../models/rpg/equipment/equipmentPackModel.js";
import { PackArmours } from "../models/rpg/activeTables/activeArmourModel.js";
import { PackVehicles } from "../models/rpg/activeTables/activeVehicleModel.js";
import {
  WeaponMountWeapons,
  PackWeapons,
} from "../models/rpg/activeTables/activeWeaponModel.js";
import { PackLifestyles } from "../models/rpg/activeTables/activeLIfestyleModel.js";
import { WeaponMountModifications } from "../models/rpg/equipment/rigger/weaponMountModModel.js";
import { getEchoes } from "../seeds/rpgSeeds/echoesSeed.js";
import { getMetamagics } from "../seeds/rpgSeeds/metamagicsSeed.js";
import { Echoes } from "../models/rpg/otherData/echoModel.js";
import { Metamagics } from "../models/rpg/otherData/metamagicModel.js";

export class SourcebookSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const { stagedSkills, stagedSkillGroups } = getSkills();
    const { unlinkedQualities, stagedQualities } = getQualities();
    const { unlinkedHeritages, stagedHeritages } = getHeritages();
    const { unlinkedPriorities, stagedPriorities } = getPriorities();
    const { stagedRanges: stagedWeaponRanges } = getRanges();
    // Gear
    const { unlinkedWeaponAccessories, stagedWeaponAccessories } =
      getWeaponAccessories();
    const { unlinkedWeapons, stagedWeapons } = getWeapons(
      stagedSkills,
      stagedWeaponRanges
    );
    const { unlinkedArmours, stagedArmours } = getArmours();
    const { unlinkedArmourMods, stagedArmourModifications } =
      getArmourModifications();
    const { unlinkedAugmentations, stagedAugmentations } = getAugmentations();
    const { unlinkedDrugs, stagedDrugs } = getDrugs();
    const stagedDrugComponents = getDrugComponents();
    const { unlinkedVehicles, stagedVehicles } = getVehicles();
    const stagedVehicleWeaponMounts = createVehicleWeaponMounts();
    const {
      unlinkedVehicleMods: unlinkedVehicleModifications,
      stagedVehicleMods: stagedVehicleModifications,
    } = getVehicleModifications();
    const {
      unlinkedWeaponMountMods,
      stagedWeaponMountMods: stagedVehicleWeaponMountModifications,
    } = getWeaponMountModifications();
    const { unlinkedGears, stagedGears } = getGears();
    const { unlinkedSpells, stagedSpells } = getSpells();
    const { unlinkedPrograms, stagedPrograms } = getPrograms();
    const { unlinkedAdeptPowers, stagedAdeptPowers } = getAdeptPowers();
    const { unlinkedComplexForms, stagedComplexForms } = getComplexForms();
    const { unlinkedCritters, stagedCritters } = getCritters();
    const { unlinkedCritterPowers, stagedCritterPowers } = getCritterPowers();
    const { unlinkedTraditions, stagedTraditions } =
      getTraditions(stagedCritters);
    const { unlinkedMentorSpirits, unlinkedParagons, stagedMentors } =
      getMentors();
    const { unlinkedMartialArts, stagedMartialArts } = getMartialArts();
    const { unlinkedMartialArtTechniques, stagedMartialArtTechniques } =
      getMartialArtTechniques();
    const { unlinkedLifestyles, stagedLifestyles } = getLifestyles();
    const { unlinkedLifestyleQualities, stagedLifestyleQualities } =
      getLifestyleQualities();
    const { unlinkedEquipmentPacks, stagedEquipmentPacks } =
      getEquipmentPacks();
    const { unlinkedEchoes, stagedEchoes } = getEchoes();
    const { unlinkedMetamagics, stagedMetamagics } = getMetamagics();

    stagedSkills.forEach((skill) => {
      em.create(Skills, skill);
    });
    console.log("Skills created");

    stagedSkillGroups.forEach((skillGroup) => {
      em.create(SkillGroups, skillGroup);
    });
    console.log("Skill groups created");

    stagedQualities.forEach((quality) => {
      em.create(Qualities, quality);
    });
    console.log("Qualities created");

    stagedHeritages.forEach((heritage) => {
      em.create(Heritages, heritage);
    });
    console.log("Heritages created");

    for (const priority of stagedPriorities) {
      em.create(Priorities, priority);
    }
    console.log("Priorities created");

    stagedWeaponRanges.forEach((range) => {
      em.create(WeaponRanges, range);
    });
    console.log("Weapon Ranges created");

    stagedWeaponAccessories.forEach((weaponAccessory) => {
      em.create(WeaponAccessories, weaponAccessory);
    });
    console.log("Weapon Accessories created");

    // weapon related
    for (const weapon of stagedWeapons) {
      if (weapon instanceof MeleeWeapons) {
        em.create(MeleeWeapons, weapon);
      } else if (weapon instanceof ProjectileWeapons) {
        em.create(ProjectileWeapons, weapon);
      } else if (weapon instanceof FirearmWeapons) {
        em.create(FirearmWeapons, weapon);
      } else if (weapon instanceof Explosives) {
        em.create(Explosives, weapon);
      } else {
        assert(false, `Unhandled weapon category: ${weapon.category}`);
      }
    }
    console.log("Weapons created");

    stagedArmours.forEach((armour) => {
      em.create(Armours, armour);
    });
    console.log("Armours created");

    stagedArmourModifications.forEach((armourMod) => {
      em.create(ArmourModifications, armourMod);
    });
    console.log("Armour Modifications created");

    // augmentations
    for (const augmentation of stagedAugmentations) {
      if (augmentation instanceof Cyberwares) {
        em.create(Cyberwares, augmentation);
      } else if (augmentation instanceof Biowares) {
        em.create(Biowares, augmentation);
      } else {
        assert(
          false,
          `Unhandled augmentation category: ${augmentation.category}`
        );
      }
    }
    console.log("Augmentations created");

    stagedDrugs.forEach((drug) => {
      em.create(Drugs, drug);
    });
    console.log("Drugs created");

    stagedDrugComponents.forEach((drugComponent) => {
      em.create(DrugComponents, drugComponent);
    });
    console.log("Drug Components created");

    //vehicles
    for (const vehicle of stagedVehicles) {
      if (vehicle instanceof Groundcrafts) {
        em.create(Groundcrafts, vehicle);
      } else if (vehicle instanceof Watercrafts) {
        em.create(Watercrafts, vehicle);
      } else if (vehicle instanceof Aircrafts) {
        em.create(Aircrafts, vehicle);
      } else if (vehicle instanceof Drones) {
        em.create(Drones, vehicle);
      } else {
        assert(false, `Unhandled vehicle category: ${vehicle.category}`);
      }
    }
    console.log("Vehicles created");

    for (const weaponMount of stagedVehicleWeaponMounts) {
      em.create(WeaponMounts, weaponMount);
    }
    console.log("Vehicle Weapon Mounts created");

    for (const vehicleMod of stagedVehicleModifications) {
      if (vehicleMod instanceof VehicleChasisModifications) {
        em.create(VehicleChasisModifications, vehicleMod);
      } else {
        assert(
          false,
          `Unhandled vehicle Modification category: ${vehicleMod.category}`
        );
      }
    }
    console.log("Vehicle Modifications created");

    for (const weaponMountMod of stagedVehicleWeaponMountModifications) {
      em.create(WeaponMountModifications, weaponMountMod);
    }
    console.log("Weapon Mount Modifications created");

    for (const gear of stagedGears) {
      em.create(Gears, gear);
    }
    console.log("Gears created");

    stagedSpells.forEach((spell) => {
      em.create(Spells, spell);
    });
    console.log("Spells created");

    stagedPrograms.forEach((program) => {
      em.create(Programs, program);
    });

    stagedAdeptPowers.forEach((adeptPower) => {
      em.create(AdeptPowers, adeptPower);
    });
    console.log("Adept Powers created");

    for (const tradition of stagedTraditions) {
      if (tradition instanceof LinkedSpiritsTraditions) {
        em.create(LinkedSpiritsTraditions, tradition);
      } else if (tradition instanceof UnlinkedSpiritsTraditions) {
        em.create(UnlinkedSpiritsTraditions, tradition);
      } else if (tradition instanceof AllSpiritsTraditions) {
        em.create(AllSpiritsTraditions, tradition);
      } else {
        assert(false, `Unhandled tradition: ${tradition.name}`);
      }
    }
    console.log("Traditions created");

    stagedComplexForms.forEach((complexForm) => {
      em.create(ComplexForms, complexForm);
    });
    console.log("Complex Forms created");

    stagedMentors.forEach((mentor) => {
      if (mentor instanceof MentorSpirits) {
        em.create(MentorSpirits, mentor);
      } else if (mentor instanceof Paragons) {
        em.create(Paragons, mentor);
      } else {
        assert(false, `Unhandled mentor: ${mentor.name}`);
      }
    });
    console.log("Mentors created");

    stagedCritters.forEach((critter) => {
      em.create(Critters, critter);
    });
    console.log("Critters created");

    stagedCritterPowers.forEach((critterPower) => {
      em.create(CritterPowers, critterPower);
    });
    console.log("Critter Powers created");

    stagedMartialArts.forEach((martialArt) => {
      em.create(MartialArts, martialArt);
    });
    console.log("Martial Arts created");

    stagedMartialArtTechniques.forEach((martialArtTechnique) => {
      em.create(MartialArtTechniques, martialArtTechnique);
    });
    console.log("Martial Art Techniques created");

    stagedLifestyles.forEach((lifestyle) => {
      em.create(Lifestyles, lifestyle);
    });
    console.log("Lifestyles created");

    stagedLifestyleQualities.forEach((lifestyleQuality) => {
      em.create(LifestyleQualities, lifestyleQuality);
    });
    console.log("Lifestyle Qualities created");

    stagedEquipmentPacks.forEach((equipmentPack) => {
      em.create(EquipmentPacks, equipmentPack);
    });
    console.log("Equipment Packs created");

    stagedEchoes.forEach((echo) => {
      em.create(Echoes, echo);
    });
    console.log("Echoes Created");

    stagedMetamagics.forEach((metamagic) => {
      em.create(Metamagics, metamagic);
    });
    console.log("Metamagics Created");

    await em.flush();
    console.log("All base sourcebook data flushed to database");

    // -----------------------------------------------------------------
    // Connect references that "may" need things in the database first
    // -----------------------------------------------------------------

    // Qualities that add weapons (e.g. Vampire Quality gives a bite attack)
    await Promise.all(
      unlinkedQualities.map(async (quality) => {
        if (quality.addWeapons !== undefined) {
          assert(quality.addWeapons.length > 0, "Add weapon list is empty");
          const relatedQuality = await em.findOne(Qualities, {
            name: quality.name,
          });
          assert(
            relatedQuality !== null,
            `undefined Quality name: ${quality.name}`
          );
          await Promise.all(
            quality.addWeapons.map(async (weapon) => {
              const linkedWeapon = await em.findOne(Weapons, {
                name: weapon,
              });
              assert(
                linkedWeapon !== null,
                `undefined Weapon name 1: ${weapon}`
              );
              const referencedWeapon = ref(linkedWeapon);
              relatedQuality.includedWeaponList.add(referencedWeapon);
            })
          );
        }
      })
    );
    // Qualities that share limits with other qualities
    await Promise.all(
      unlinkedQualities.map(async (quality) => {
        if (quality.sharedLimitQualityList !== undefined) {
          assert(
            quality.sharedLimitQualityList.length > 0,
            "Shared Quality list is empty"
          );
          const relatedQuality = await em.findOne(Qualities, {
            name: quality.name,
          });
          assert(
            relatedQuality !== null,
            `undefined Quality name: ${quality.name}`
          );
          await Promise.all(
            quality.sharedLimitQualityList.map(async (sharedLimitQuality) => {
              const linkedQuality = await em.findOne(Qualities, {
                name: sharedLimitQuality,
              });
              assert(
                linkedQuality !== null,
                `undefined Shared Limit Quality: ${sharedLimitQuality}`
              );
              const referencedQuality = ref(linkedQuality);
              relatedQuality.sharedLimitQualityList.add(referencedQuality);
            })
          );
        }
      })
    );
    // Quality Bonuses are handled in the generalized bonus linkage loop below
    console.log("Quality relationships linked");

    // Heritage metavariants
    await Promise.all(
      unlinkedHeritages.map(async (heritage) => {
        if (
          heritage.category !== heritageCategoryEnum.Metavariant &&
          heritage.metavariantList !== undefined
        ) {
          const relatedHeritage = await em.findOne(Heritages, {
            name: heritage.name,
          });
          assert(
            relatedHeritage !== null,
            `undefined Heritage name 1: ${heritage.name}`
          );
          assert(
            relatedHeritage instanceof BaseHeritages,
            `relatedHeritage should be a BaseHeritages ${relatedHeritage.name}`
          );
          heritage.metavariantList.forEach((metavariant) => {
            const loadedMetavariant = unlinkedHeritages.find(
              (heritageLocal) => {
                return (
                  metavariant === heritageLocal.name &&
                  heritageLocal.category === heritageCategoryEnum.Metavariant &&
                  heritageLocal.baseHeritage === heritage.name
                );
              }
            );
            assert(
              loadedMetavariant !== undefined,
              `undefined metavariant name 1: ${metavariant}`
            );
            assert(
              loadedMetavariant.category === heritageCategoryEnum.Metavariant,
              `undefined metavariant category is wrong 1: ${loadedMetavariant.category}`
            );
            const stagedMetavariant = new Metavariants({
              baseHeritage: ref(relatedHeritage),
              heritage: loadedMetavariant,
            });
            em.create(Metavariants, stagedMetavariant);
          });
        }
      })
    );
    // Need to flush here to ensure all metavariants are handled by following loops
    await em.flush();
    // Heritages that have natural weapons
    await Promise.all(
      unlinkedHeritages.map(async (heritage) => {
        if (heritage.addWeaponList !== undefined) {
          assert(heritage.addWeaponList.length > 0, "Add weapon list is empty");
          const relatedHeritage = await em.findOne(Heritages, {
            name: heritage.name,
          });
          assert(
            relatedHeritage !== null,
            `undefined Heritage name 2: ${heritage.name}`
          );
          await Promise.all(
            heritage.addWeaponList.map(async (weapon) => {
              const linkedWeapon = await em.findOne(Weapons, {
                name: weapon,
              });
              assert(
                linkedWeapon !== null,
                `undefined Weapon name 2: ${weapon}`
              );
              const referencedWeapon = ref(linkedWeapon);
              relatedHeritage.includedWeaponList.add(referencedWeapon);
            })
          );
        }
      })
    );
    // Heritages that give qualities
    await Promise.all(
      unlinkedHeritages.map(async (heritage) => {
        if (heritage.addQualityList !== undefined) {
          assert(
            heritage.addQualityList.length > 0,
            "Add quality list is empty"
          );
          const relatedHeritage = await em.findOne(Heritages, {
            name: heritage.name,
          });
          assert(
            relatedHeritage !== null,
            `undefined Heritage name 3: ${heritage.name}`
          );
          await Promise.all(
            heritage.addQualityList.map(async (quality) => {
              const linkedQuality = await em.findOne(Qualities, {
                name: quality.name,
              });
              assert(
                linkedQuality !== null,
                `undefined Quality (1): ${quality.name}`
              );
              const referencedQuality = ref(linkedQuality);
              const customisedQuality = new HeritageIncludedQualities(
                ref(relatedHeritage),
                referencedQuality,
                quality.rating
              );
              em.create(HeritageIncludedQualities, customisedQuality);
            })
          );
        }
      })
    );
    // Heritages that forbid qualities
    await Promise.all(
      unlinkedHeritages.map(async (heritage) => {
        if (heritage.forbiddenQualityList !== undefined) {
          assert(
            heritage.forbiddenQualityList.length > 0,
            "Forbidden quality list is empty"
          );
          const relatedHeritage = await em.findOne(Heritages, {
            name: heritage.name,
          });
          assert(
            relatedHeritage !== null,
            `undefined Heritage name 4: ${heritage.name}`
          );
          await Promise.all(
            heritage.forbiddenQualityList.map(async (quality) => {
              const linkedQuality = await em.findOne(Qualities, {
                name: quality,
              });
              assert(
                linkedQuality !== null,
                `undefined Quality (2): ${quality}`
              );
              const referencedQuality = ref(linkedQuality);
              relatedHeritage.forbiddenQualityList.add(referencedQuality);
            })
          );
        }
      })
    );
    console.log("Heritage relationships linked");

    // Priority
    await addHeritageLinks(
      priorityLetterEnum.A,
      unlinkedPriorities.A.heritages
    );
    await addHeritageLinks(
      priorityLetterEnum.B,
      unlinkedPriorities.B.heritages
    );
    await addHeritageLinks(
      priorityLetterEnum.C,
      unlinkedPriorities.C.heritages
    );
    await addHeritageLinks(
      priorityLetterEnum.D,
      unlinkedPriorities.D.heritages
    );
    await addHeritageLinks(
      priorityLetterEnum.E,
      unlinkedPriorities.E.heritages
    );
    await addTalentLinks(priorityLetterEnum.A, unlinkedPriorities.A.talents);
    await addTalentLinks(priorityLetterEnum.B, unlinkedPriorities.B.talents);
    await addTalentLinks(priorityLetterEnum.C, unlinkedPriorities.C.talents);
    await addTalentLinks(priorityLetterEnum.D, unlinkedPriorities.D.talents);
    await addTalentLinks(priorityLetterEnum.E, unlinkedPriorities.E.talents);
    console.log("Priority relationships linked");

    // Weapon Accessories that are weapons
    await Promise.all(
      unlinkedWeaponAccessories.map(async (weaponAccessory) => {
        if (weaponAccessory.isWeapon) {
          const relatedWeaponAccessory = await em.findOne(WeaponAccessories, {
            name: weaponAccessory.name,
          });
          assert(
            relatedWeaponAccessory !== null,
            `undefined Weapon Accessory name: ${weaponAccessory.name}`
          );
          const linkedWeapon = await em.findOne(Weapons, {
            name: weaponAccessory.name,
          });
          assert(
            linkedWeapon !== null,
            `undefined Weapon: ${weaponAccessory.name}`
          );

          relatedWeaponAccessory.linkedWeapon = ref(linkedWeapon);
        }
      })
    );
    // Weapon Accessories that allow certain gear to be added
    await Promise.all(
      unlinkedWeaponAccessories.map(async (weaponAccessory) => {
        if (weaponAccessory.allowedGearList !== undefined) {
          const relatedWeaponAccessory = await em.findOne(WeaponAccessories, {
            name: weaponAccessory.name,
          });
          assert(
            relatedWeaponAccessory !== null,
            `undefined Weapon Accessory name: ${weaponAccessory.name}`
          );

          await Promise.all(
            weaponAccessory.allowedGearList.map(async (gear) => {
              const allowedGear = await em.findOne(Gears, {
                name: gear,
              });
              assert(
                allowedGear !== null,
                `undefined Allowed Gear (1): ${gear}`
              );
              const referencedGear = ref(allowedGear);
              relatedWeaponAccessory.allowedGearList.add(referencedGear);
            })
          );
        }
      })
    );
    // Weapon Accessories that include certain gear
    for (const weaponAccessory of unlinkedWeaponAccessories) {
      if (weaponAccessory.includedGearList !== undefined) {
        const relatedWeaponAccessory = await em.findOne(WeaponAccessories, {
          name: weaponAccessory.name,
        });
        assert(
          relatedWeaponAccessory !== null,
          `undefined Weapon Accessory name: ${weaponAccessory.name}`
        );
        const referencedWeaponAccessory = ref(relatedWeaponAccessory);
        for (const gear of weaponAccessory.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: gear.baseGear,
          });
          assert(
            includedGear !== null,
            `undefined Included Gear: ${gear.baseGear}`
          );
          const referencedGear = ref(includedGear);
          const stagedIncludedGear = new WeaponAccessoryIncludedGears(
            referencedWeaponAccessory,
            referencedGear,
            gear.specificOption,
            gear.rating,
            gear.consumeCapacity,
            gear.currentQuantity
          );
          // this creates the link to weapon accessory
          em.create(WeaponAccessoryIncludedGears, stagedIncludedGear);
        }
      }
    }
    console.log("Weapon Accessory relationships linked");

    // Weapons that allow certain gear to be added
    for (const weapon of unlinkedWeapons) {
      if (weapon.allowedGearList !== undefined) {
        const relatedWeapon = await em.findOne(Weapons, {
          name: weapon.name,
        });
        assert(
          relatedWeapon !== null,
          `undefined Weapon name 3: ${weapon.name}`
        );

        for (const gear of weapon.allowedGearList) {
          const allowedGear = await em.findOne(Gears, {
            name: gear,
          });
          assert(allowedGear !== null, `undefined Allowed Gear (2): ${gear}`);
          const referencedGear = ref(allowedGear);
          relatedWeapon.allowedGearList.add(referencedGear);
        }
      }
    }
    // Weapons that include certain Accessories
    for (const weapon of unlinkedWeapons) {
      if (weapon.includedAccessoryList !== undefined) {
        const relatedWeapon = await em.findOne(Weapons, {
          name: weapon.name,
        });
        assert(
          relatedWeapon !== null,
          `undefined Weapon name 4: ${weapon.name}`
        );
        const referencedWeapon = ref(relatedWeapon);
        for (const accessory of weapon.includedAccessoryList) {
          const includeWeaponAccessory = await em.findOne(WeaponAccessories, {
            name: accessory.baseAccessory,
          });
          assert(
            includeWeaponAccessory !== null,
            `undefined Weapon Accessory: ${accessory.baseAccessory}`
          );
          const referencedWeaponAccessory = ref(includeWeaponAccessory);
          const stagedIncludedWeaponAccessory = new IncludedWeaponAccessories(
            referencedWeapon,
            referencedWeaponAccessory,
            accessory.mountList,
            accessory.rating
          );
          // this creates the link to weapon accessory
          em.create(IncludedWeaponAccessories, stagedIncludedWeaponAccessory);
          const referencedIncludedWeaponAccessory = ref(
            stagedIncludedWeaponAccessory
          );
          if (accessory.gearList !== undefined) {
            for (const gear of accessory.gearList) {
              const includedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(includedGear !== null, `undefined Gear: ${gear.baseGear}`);
              const referencedGear = ref(includedGear);
              const stagedIncludedGear = new ActiveWeaponAccessoryGears(
                referencedIncludedWeaponAccessory,
                referencedGear,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.currentQuantity
              );
              em.create(ActiveWeaponAccessoryGears, stagedIncludedGear);
            }
          }
        }
      }
    }
    // Weapons referring to other weapons
    for (const weapon of unlinkedWeapons) {
      if (
        "alternativeWeaponForms" in weapon &&
        weapon.alternativeWeaponForms !== undefined &&
        weapon.alternativeWeaponForms.length > 0
      ) {
        const relatedWeapon = await em.findOne(Weapons, { name: weapon.name });
        assert(
          relatedWeapon !== null,
          `undefined Weapon name 5: ${weapon.name}`
        );
        for (const alternativeFormName of weapon.alternativeWeaponForms) {
          const alternativeWeaponForm = await em.findOne(Weapons, {
            name: alternativeFormName,
          });
          assert(
            alternativeWeaponForm !== null,
            `undefined form: ${alternativeFormName}`
          );
          // A weapon's alternative form shouldn't be itself
          assert(alternativeWeaponForm.name !== relatedWeapon.name);
          alternativeWeaponForm.baseWeaponForm = relatedWeapon;
        }
      }
    }
    // Weapons link to ranges
    for (const weapon of unlinkedWeapons) {
      if ("rangeList" in weapon) {
        const relatedWeapon = await em.findOne(Weapons, { name: weapon.name });
        assert(
          relatedWeapon !== null,
          `undefined Weapon name 6: ${weapon.name}`
        );
        const rangeList = weapon.rangeList;
        assert(rangeList.length > 0, "rangeList.length = 0");
        for (const currentRange of rangeList) {
          // console.log(`Range: ${currentRange}`);
          const foundRange = await em.findOne(WeaponRanges, {
            name: currentRange,
          });
          assert(foundRange !== null, `undefined Range: ${currentRange}`);
          assert(
            relatedWeapon instanceof RangedWeapons,
            `Assertion to type narrow`
          );
          relatedWeapon.ranges.add(foundRange);
        }
      }
    }
    // Firearms with underbarrel weapons
    for (const weapon of unlinkedWeapons) {
      if (
        weapon.category === weaponCategoryEnum.Firearm &&
        weapon.firearmOptions.underbarrelWeaponList !== undefined
      ) {
        const relatedWeapon = await em.findOne(FirearmWeapons, {
          name: weapon.name,
        });
        assert(
          relatedWeapon !== null,
          `undefined Weapon name 7: ${weapon.name}`
        );
        for (const underbarrelWeaponName of weapon.firearmOptions
          .underbarrelWeaponList) {
          const underbarrelWeapon = await em.findOne(Weapons, {
            name: underbarrelWeaponName,
          });
          assert(
            underbarrelWeapon !== null,
            `undefined weapon: ${underbarrelWeaponName}`
          );
          // A weapon's underbarrel weapon shouldn't be itself
          assert(underbarrelWeapon.name !== relatedWeapon.name);
          relatedWeapon.underbarrelWeapons.add(underbarrelWeapon);
        }
      }
    }
    console.log("Weapon relationships associated");

    // Armours that add weapons
    await Promise.all(
      unlinkedArmours.map(async (armour) => {
        if (armour.isWeapon !== undefined) {
          const relatedArmour = await em.findOne(Armours, {
            name: armour.name,
          });
          assert(
            relatedArmour !== null,
            `undefined Armour name: ${armour.name}`
          );
          const linkedWeapon = await em.findOne(Weapons, {
            name: armour.name,
          });
          assert(
            linkedWeapon !== null,
            `undefined Linked Weapon: ${armour.name}`
          );
          relatedArmour.linkedWeapon = ref(linkedWeapon);
        }
      })
    );
    // Armours that include certain gear
    await Promise.all(
      unlinkedArmours.map(async (armour) => {
        if (armour.includedGearList !== undefined) {
          const relatedArmour = await em.findOne(Armours, {
            name: armour.name,
          });
          assert(
            relatedArmour !== null,
            `undefined Armour name: ${armour.name}`
          );
          const referencedArmour = ref(relatedArmour);
          await Promise.all(
            armour.includedGearList.map(async (gear) => {
              const includedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(includedGear !== null, `undefined Gear: ${gear.baseGear}`);
              const referencedGear = ref(includedGear);
              const stagedIncludedGear = new ArmourIncludedGears(
                referencedArmour,
                referencedGear,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.currentQuantity
              );
              // this creates the link to weapon accessory
              em.create(ArmourIncludedGears, stagedIncludedGear);
            })
          );
        }
      })
    );
    // Armours that include certain mods
    await Promise.all(
      unlinkedArmours.map(async (armour) => {
        if (armour.includedModList !== undefined) {
          const relatedArmour = await em.findOne(Armours, {
            name: armour.name,
          });
          assert(
            relatedArmour !== null,
            `undefined Armour name: ${armour.name}`
          );
          const referencedArmour = ref(relatedArmour);
          await Promise.all(
            armour.includedModList.map(async (mod) => {
              const includedMod = await em.findOne(ArmourModifications, {
                name: mod.baseMod,
              });
              assert(includedMod !== null, `undefined Mod 1: ${mod.baseMod}`);
              const referencedMod = ref(includedMod);
              const stagedIncludedGear = new IncludedArmourModifications(
                referencedArmour,
                referencedMod,
                mod.rating
              );
              // this creates the link to armour
              em.create(IncludedArmourModifications, stagedIncludedGear);
            })
          );
        }
      })
    );
    console.log("Armour relationships associated");

    // Armour Modifications that include certain gear
    await Promise.all(
      unlinkedArmourMods.map(async (armourMod) => {
        if (armourMod.includedGearList !== undefined) {
          const relatedArmourMod = await em.findOne(ArmourModifications, {
            name: armourMod.name,
          });
          assert(
            relatedArmourMod !== null,
            `undefined Armour Mod name: ${armourMod.name}`
          );
          const referencedArmourMod = ref(relatedArmourMod);
          await Promise.all(
            armourMod.includedGearList.map(async (gear) => {
              const includedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(includedGear !== null, `undefined Gear: ${gear.baseGear}`);
              const referencedGear = ref(includedGear);
              const stagedIncludedGear = new ArmourModificationIncludedGears(
                referencedArmourMod,
                referencedGear,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.currentQuantity
              );
              // this creates the link to armour modification
              em.create(ArmourModificationIncludedGears, stagedIncludedGear);
            })
          );
        }
      })
    );
    console.log("Armour Modification relationships associated");

    // Augmentations that add weapons
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (augmentation.addWeapon !== undefined) {
          const relatedAugmentation = await em.findOne(Augmentations, {
            name: augmentation.name,
          });
          assert(
            relatedAugmentation !== null,
            `undefined Augmentation name: ${augmentation.name}`
          );
          const linkedWeapon = await em.findOne(Weapons, {
            name: augmentation.addWeapon,
          });
          assert(
            linkedWeapon !== null,
            `undefined Linked Weapon: ${augmentation.addWeapon}`
          );
          relatedAugmentation.addWeapon = ref(linkedWeapon);
        }
      })
    );
    // Augmentations that provide a bonus when linked to another augmentation
    for (const augmentation of unlinkedAugmentations) {
      if (augmentation.pairIncludeList !== undefined) {
        const relatedAugmentation = await em.findOne(Augmentations, {
          name: augmentation.name,
        });
        assert(
          relatedAugmentation !== null,
          `undefined Augmentation name: ${augmentation.name}`
        );
        for (const pairInclude of augmentation.pairIncludeList) {
          const linkedAugmentation = await em.findOne(Augmentations, {
            name: pairInclude,
          });
          assert(
            linkedAugmentation !== null,
            `undefined Linked Augmentation: ${pairInclude}`
          );
          relatedAugmentation.pairIncludeList.add(linkedAugmentation);
        }
      }
    }
    // Augmentations that allow certain gear to be added
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (augmentation.allowedGearList !== undefined) {
          const relatedAugmentation = await em.findOne(Augmentations, {
            name: augmentation.name,
          });
          assert(
            relatedAugmentation !== null,
            `undefined Augmentation name: ${augmentation.name}`
          );

          await Promise.all(
            augmentation.allowedGearList.map(async (gear) => {
              // TODO: add 2050 stuff
              if (gear.includes("2050")) {
                return;
              }
              const allowedGear = await em.findOne(Gears, {
                name: gear,
              });
              assert(
                allowedGear !== null,
                `undefined Allowed Gear (3): ${gear}, for Augmentations: ${augmentation.name}`
              );
              const referencedGear = ref(allowedGear);
              relatedAugmentation.allowedGearList.add(referencedGear);
            })
          );
        }
      })
    );
    // Augmentations that include certain gear
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (augmentation.includedGearList !== undefined) {
          const relatedAugmentation = await em.findOne(Augmentations, {
            name: augmentation.name,
          });
          assert(
            relatedAugmentation !== null,
            `undefined Augmentation name: ${augmentation.name}`
          );
          const referencedAugmentation = ref(relatedAugmentation);
          await Promise.all(
            augmentation.includedGearList.map(async (gear) => {
              const includedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(includedGear !== null, `undefined Gear: ${gear.baseGear}`);
              const referencedGear = ref(includedGear);
              const stagedIncludedGear = new AugmentationIncludedGears(
                referencedAugmentation,
                referencedGear,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.currentQuantity
              );
              // this creates the link to armour modification
              em.create(AugmentationIncludedGears, stagedIncludedGear);
            })
          );
        }
      })
    );
    // Augmentations that provide a wireless bonus when linked to another augmentation
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (augmentation.category === augmentationCategoryEnum.Cyberware) {
          if (augmentation.wirelessPairInclude !== undefined) {
            const relatedAugmentation = await em.findOne(Cyberwares, {
              name: augmentation.name,
            });
            assert(
              relatedAugmentation !== null,
              `undefined Augmentation name: ${augmentation.name}`
            );
            const linkedAugmentation = await em.findOne(Cyberwares, {
              name: augmentation.wirelessPairInclude,
            });
            assert(
              linkedAugmentation !== null,
              `undefined Linked Augmentation: ${augmentation.wirelessPairInclude}`
            );
            relatedAugmentation.wirelessPairLinkedCyberware =
              linkedAugmentation;
          }
        }
      })
    );
    // Augmentations that are a vehicle
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (augmentation.category === augmentationCategoryEnum.Cyberware) {
          if (augmentation.addVehicle !== undefined) {
            const relatedAugmentation = await em.findOne(Cyberwares, {
              name: augmentation.name,
            });
            assert(
              relatedAugmentation !== null,
              `undefined Augmentation name: ${augmentation.name}`
            );
            const linkedVehicle = await em.findOne(Vehicles, {
              name: augmentation.addVehicle,
            });
            assert(
              linkedVehicle !== null,
              `undefined Vehicle: ${augmentation.addVehicle}`
            );
            const referencedVehicle = ref(linkedVehicle);
            relatedAugmentation.linkedVehicle = referencedVehicle;
          }
        }
      })
    );
    console.log("Augmentation relationships associated");

    // Vehicles that include certain gear
    await Promise.all(
      unlinkedVehicles.map(async (vehicle) => {
        if (vehicle.includedGearList !== undefined) {
          const relatedVehicle = await em.findOne(Vehicles, {
            name: vehicle.name,
          });
          assert(
            relatedVehicle !== null,
            `undefined Vehicle name: ${vehicle.name}`
          );
          const referencedVehicle = ref(relatedVehicle);
          await Promise.all(
            vehicle.includedGearList.map(async (gear) => {
              const includedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(includedGear !== null, `undefined Gear: ${gear.baseGear}`);
              const referencedGear = ref(includedGear);
              const stagedIncludedGear = new VehicleIncludedGears(
                referencedVehicle,
                referencedGear,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.currentQuantity
              );
              // this creates the link to vehicle
              em.create(VehicleIncludedGears, stagedIncludedGear);
            })
          );
        }
      })
    );
    // Vehicles that include certain mods
    await Promise.all(
      unlinkedVehicles.map(async (vehicle) => {
        if (vehicle.includedModList !== undefined) {
          const relatedVehicle = await em.findOne(Vehicles, {
            name: vehicle.name,
          });
          assert(
            relatedVehicle !== null,
            `undefined Vehicle name: ${vehicle.name}`
          );
          const referencedVehicle = ref(relatedVehicle);
          await Promise.all(
            vehicle.includedModList.map(async (mod) => {
              const includedMod = await em.findOne(VehicleModifications, {
                name: mod.baseMod,
              });
              assert(includedMod !== null, `undefined Mod 2: ${mod.baseMod}`);
              const referencedMod = ref(includedMod);
              const stagedIncludedGear = new IncludedVehicleModifications(
                referencedVehicle,
                referencedMod,
                mod.specificOption,
                mod.rating
              );
              if (
                mod.subsystemList !== undefined &&
                mod.subsystemList.length > 0
              ) {
                await Promise.all(
                  mod.subsystemList.map(async (subsystem) => {
                    const includedCyberware = await em.findOne(Cyberwares, {
                      name: subsystem,
                    });
                    assert(
                      includedCyberware !== null,
                      `undefined Mod Subsystem: ${subsystem}`
                    );
                    stagedIncludedGear.actsAsCyberarm = true;
                    stagedIncludedGear.associatedCyberwareList.add(
                      includedCyberware
                    );
                  })
                );
              }
              // this creates the link to armour
              em.create(IncludedVehicleModifications, stagedIncludedGear);
            })
          );
        }
      })
    );
    // Vehicles including weapon mounts
    // Each mount may also include a weapon
    // Each mount may also include mods
    for (const vehicle of unlinkedVehicles) {
      if (
        vehicle.includedWeaponMountList !== undefined &&
        vehicle.includedWeaponMountList.length > 0
      ) {
        const relatedVehicle = await em.findOne(Vehicles, {
          name: vehicle.name,
        });
        assert(
          relatedVehicle !== null,
          `undefined Vehicle name: ${vehicle.name}`
        );
        for (const weaponMount of vehicle.includedWeaponMountList) {
          const relatedWeaponMount = await em.findOne(WeaponMounts, {
            control: weaponMount.control,
            flexibility: weaponMount.flexibility,
            size: weaponMount.size,
            visibility: weaponMount.visibility,
          });
          assert(
            relatedWeaponMount !== null,
            `undefined Weapon Mount: ${JSON.stringify(weaponMount)}`
          );

          let stagedMountedWeapon;
          if (weaponMount.weaponMounted !== undefined) {
            const relatedBaseWeapon = await em.findOne(Weapons, {
              name: weaponMount.weaponMounted.baseWeapon,
            });
            assert(
              relatedBaseWeapon !== null,
              `undefined Weapon name 8: ${weaponMount.weaponMounted.baseWeapon}`
            );
            const referencedBaseWeapon = ref(relatedBaseWeapon);
            stagedMountedWeapon = new WeaponMountWeapons(referencedBaseWeapon);
          }
          const referencedVehicle = ref(relatedVehicle);
          const referencedWeaponMount = ref(relatedWeaponMount);

          const stagedIncludedWeaponMount = new IncludedWeaponMounts(
            referencedVehicle,
            referencedWeaponMount,
            stagedMountedWeapon !== undefined ? (false as const) : undefined,
            undefined
          );
          if (weaponMount.weaponMountModList !== undefined) {
            const relatedVehicleMountMod = await em.findOne(
              WeaponMountModifications,
              {
                name: weaponMount.weaponMountModList,
              }
            );
            assert(
              relatedVehicleMountMod !== null,
              `undefined Weapon name 9: ${weaponMount.weaponMountModList}`
            );
            stagedIncludedWeaponMount.mountMods.add(relatedVehicleMountMod);
          }
          const createdWeaponMount = em.create(
            IncludedWeaponMounts,
            stagedIncludedWeaponMount
          );

          if (stagedMountedWeapon !== undefined) {
            stagedMountedWeapon.weaponMount = ref(createdWeaponMount);
            em.create(WeaponMountWeapons, stagedMountedWeapon);
          }
        }
      }
    }
    console.log("Vehicle relationships associated");

    // Gear that includes certain gear
    for (const gear of unlinkedGears) {
      if (gear.includedGearList !== undefined) {
        const relatedGear = await em.findOne(Gears, {
          name: gear.name,
        });
        assert(relatedGear !== null, `undefined Gear name: ${gear.name}`);
        const referencedParentGear = ref(relatedGear);
        for (const unlinkedIncludedGear of gear.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: unlinkedIncludedGear.baseGear,
          });
          assert(
            includedGear !== null,
            `undefined Included Gear: ${unlinkedIncludedGear.baseGear}`
          );
          const referencedIncludedGear = ref(includedGear);
          const stagedIncludedGear = new GearIncludedGears(
            referencedParentGear,
            referencedIncludedGear,
            unlinkedIncludedGear.specificOption,
            unlinkedIncludedGear.rating,
            unlinkedIncludedGear.consumeCapacity,
            unlinkedIncludedGear.currentQuantity
          );
          // this creates the link to weapon accessory
          em.create(GearIncludedGears, stagedIncludedGear);
        }
      }
    }
    // Gear that allow certain gear to be added
    for (const gear of unlinkedGears) {
      if (gear.allowedGearList !== undefined) {
        const relatedGear = await em.findOne(Gears, {
          name: gear.name,
        });
        assert(relatedGear !== null, `undefined Gear name: ${gear.name}`);

        for (const unlinkedAllowedGear of gear.allowedGearList) {
          const allowedGear = await em.findOne(Gears, {
            name: unlinkedAllowedGear,
          });
          assert(
            allowedGear !== null,
            `undefined Allowed Gear (4): ${unlinkedAllowedGear}`
          );
          const referencedGear = ref(allowedGear);
          relatedGear.allowedGearList.add(referencedGear);
        }
      }
    }
    console.log("Gear relationships associated");

    // Adept Powers that share limits with other adept powers
    for (const adeptPower of unlinkedAdeptPowers) {
      if (adeptPower.sharedLimitAdeptPowerList !== undefined) {
        assert(
          adeptPower.sharedLimitAdeptPowerList.length > 0,
          "Shared Adept Power list is empty"
        );
        const relatedAdeptPower = await em.findOne(AdeptPowers, {
          name: adeptPower.name,
        });
        assert(
          relatedAdeptPower !== null,
          `undefined Adept Power: ${adeptPower.name}`
        );

        for (const sharedLimitAdeptPower of adeptPower.sharedLimitAdeptPowerList) {
          const linkedAdeptPower = await em.findOne(AdeptPowers, {
            name: sharedLimitAdeptPower,
          });
          assert(
            linkedAdeptPower !== null,
            `undefined Shared Limit Adept Power (4): ${sharedLimitAdeptPower}`
          );
          const referencedAdeptPower = ref(linkedAdeptPower);
          relatedAdeptPower.sharedLimitAdeptPowerList.add(referencedAdeptPower);
        }
      }
    }
    console.log("Adept Power relationships associated");

    // Critters that have included powers
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.includedPowerList !== undefined) {
          assert(
            critter.includedPowerList.length > 0,
            "Critter Power list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

          await Promise.all(
            critter.includedPowerList.map(async (critterPower) => {
              const linkedCritterPower = await em.findOne(CritterPowers, {
                name: critterPower.name,
              });
              assert(
                linkedCritterPower !== null,
                `undefined Critter Power: ${critterPower.name}`
              );
              const referencedCritterPower = ref(linkedCritterPower);
              const referencedCritter = ref(relatedCritter);
              const customisedCritterPower = new IncludedCritterPowers(
                referencedCritter,
                referencedCritterPower,
                critterPower.selectText,
                critterPower.rating
              );
              em.create(IncludedCritterPowers, customisedCritterPower);
            })
          );
        }
      })
    );
    // Critters that have a list optional powers
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.optionalPowerList !== undefined) {
          assert(
            critter.optionalPowerList.length > 0,
            "Critter Optional Power list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

          await Promise.all(
            critter.optionalPowerList.map(async (critterPower) => {
              const linkedCritterPower = await em.findOne(CritterPowers, {
                name: critterPower.name,
              });
              assert(
                linkedCritterPower !== null,
                `undefined Critter Power: ${critterPower.name}`
              );
              const referencedCritterPower = ref(linkedCritterPower);
              const referencedCritter = ref(relatedCritter);
              const customisedCritterPower = new IncludedCritterPowers(
                referencedCritter,
                referencedCritterPower,
                critterPower.selectText,
                critterPower.rating
              );
              em.create(IncludedCritterPowers, customisedCritterPower);
            })
          );
        }
      })
    );
    // Critters that have included qualities
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.addQualityList !== undefined) {
          assert(
            critter.addQualityList.length > 0,
            "Critter Quality list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

          await Promise.all(
            critter.addQualityList.map(async (critterQuality) => {
              const linkedQuality = await em.findOne(Qualities, {
                name: critterQuality.name,
              });
              assert(
                linkedQuality !== null,
                `undefined Quality (3): ${critterQuality.name}`
              );
              const referencedQuality = ref(linkedQuality);
              const referencedCritter = ref(relatedCritter);
              const customisedQuality = new CritterIncludedQualities(
                referencedCritter,
                referencedQuality,
                critterQuality.rating
              );
              em.create(CritterIncludedQualities, customisedQuality);
            })
          );
        }
      })
    );
    // Critters that have included Bioware
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.addBiowareList !== undefined) {
          assert(
            critter.addBiowareList.length > 0,
            "Critter Bioware list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

          await Promise.all(
            critter.addBiowareList.map(async (critterBioware) => {
              const linkedAugmentation = await em.findOne(Augmentations, {
                name: critterBioware.name,
              });
              assert(
                linkedAugmentation !== null,
                `undefined Augmentation: ${critterBioware.name}`
              );
              const referencedAugmentation = ref(linkedAugmentation);
              const referencedCritter = ref(relatedCritter);
              const customisedAugmentation = new CritterIncludedAugmentations(
                referencedCritter,
                referencedAugmentation,
                // Grade is not listed in xml, assume standard grade
                augmentationGradeEnum.Standard,
                critterBioware.rating
              );
              em.create(CritterIncludedAugmentations, customisedAugmentation);
            })
          );
        }
      })
    );
    // Critters that have included complex forms
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.addComplexFormList !== undefined) {
          assert(
            critter.addComplexFormList.length > 0,
            "Critter Complex form list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);
          await Promise.all(
            critter.addComplexFormList.map(async (critterComplexForm) => {
              const linkedComplexForm = await em.findOne(ComplexForms, {
                name: critterComplexForm.name,
              });
              assert(
                linkedComplexForm !== null,
                `undefined Complex Form: ${critterComplexForm.name}`
              );
              const referencedComplexForm = ref(linkedComplexForm);
              const referencedCritter = ref(relatedCritter);
              const customisedComplexForm = new CritterIncludedComplexForms(
                referencedComplexForm,
                referencedCritter,
                critterComplexForm.select
              );
              em.create(CritterIncludedComplexForms, customisedComplexForm);
            })
          );
        }
      })
    );
    // Critters that have included Skills
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.skills.skillList !== undefined) {
          assert(
            critter.skills.skillList.length > 0,
            "Critter skill list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);
          await Promise.all(
            critter.skills.skillList.map(async (critterSkill) => {
              const linkedSkill = await em.findOne(Skills, {
                name: critterSkill.name,
              });
              assert(
                linkedSkill !== null,
                `undefined Skill: ${critterSkill.name}`
              );
              const referencedSkill = ref(linkedSkill);
              const referencedCritter = ref(relatedCritter);
              // TODO: include select here
              const critterIncludedSkill = new CritterIncludedSkills(
                referencedCritter,
                referencedSkill,
                critterSkill.rating,
                critterSkill.specialised
              );
              em.create(CritterIncludedSkills, critterIncludedSkill);
            })
          );
        }
      })
    );
    // Critters that have included Skill Groups
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.skills.skillGroupList !== undefined) {
          assert(
            critter.skills.skillGroupList.length > 0,
            "Critter skill group list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);
          await Promise.all(
            critter.skills.skillGroupList.map(async (critterSkillGroup) => {
              const linkedSkillGroup = await em.findOne(SkillGroups, {
                name: critterSkillGroup.name,
              });
              assert(
                linkedSkillGroup !== null,
                `undefined Skill Group: ${critterSkillGroup.name}`
              );
              const referencedSkillGroup = ref(linkedSkillGroup);
              const referencedCritter = ref(relatedCritter);
              const critterIncludedSkillGroup = new CritterIncludedSkillGroups(
                referencedCritter,
                referencedSkillGroup,
                critterSkillGroup.rating
              );
              em.create(CritterIncludedSkillGroups, critterIncludedSkillGroup);
            })
          );
        }
      })
    );
    // Critters that have included Knowledge Skills
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.skills.knowledgeSkillList !== undefined) {
          assert(
            critter.skills.knowledgeSkillList.length > 0,
            "Critter knowledge skill list is empty"
          );
          const relatedCritter = await em.findOne(Critters, {
            name: critter.name,
          });
          assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);
          const referencedCritter = ref(relatedCritter);
          await Promise.all(
            critter.skills.knowledgeSkillList.map(
              async (critterKnowledgeSkill) => {
                const critterIncludedKnowledgeSkill =
                  new CritterIncludedKnowledgeSkills(
                    referencedCritter,
                    critterKnowledgeSkill
                  );
                em.create(
                  CritterIncludedKnowledgeSkills,
                  critterIncludedKnowledgeSkill
                );
              }
            )
          );
        }
      })
    );
    console.log("Critters relationships associated");

    // Martial Art linked techniques
    await Promise.all(
      unlinkedMartialArts.map(async (martialArt) => {
        if (Array.isArray(martialArt.techniqueList)) {
          assert(
            martialArt.techniqueList.length > 0,
            "Martial Art Technique list is empty"
          );
          const relatedMartialArt = await em.findOne(MartialArts, {
            name: martialArt.name,
          });
          assert(
            relatedMartialArt !== null,
            `undefined Martial Art: ${martialArt.name}`
          );

          await Promise.all(
            martialArt.techniqueList.map(async (technique) => {
              const relatedTechnique = await em.findOne(MartialArtTechniques, {
                name: technique,
              });
              assert(
                relatedTechnique !== null,
                `undefined Technique: ${technique}`
              );

              const referencedTechnique = ref(relatedTechnique);
              relatedMartialArt.techniqueList.add(referencedTechnique);
            })
          );
        }
      })
    );
    console.log("Martial Art relationships associated");

    // Lifestyle Qualities linked Lifestyle
    await Promise.all(
      unlinkedLifestyleQualities.map(async (lifestyleQuality) => {
        if (lifestyleQuality.requiredLifestyleList !== undefined) {
          assert(
            lifestyleQuality.requiredLifestyleList.length > 0,
            "Lifestyle Quality required lifestyle list is empty"
          );
          const relatedLifestyleQuality = await em.findOne(LifestyleQualities, {
            name: lifestyleQuality.name,
          });
          assert(
            relatedLifestyleQuality !== null,
            `undefined Lifestyle Quality: ${lifestyleQuality.name}`
          );

          await Promise.all(
            lifestyleQuality.requiredLifestyleList.map(async (lifestyle) => {
              const relatedLifestyle = await em.findOne(Lifestyles, {
                name: lifestyle,
              });
              assert(
                relatedLifestyle !== null,
                `undefined Lifestyle: ${lifestyle} for Quality: ${lifestyleQuality.name}`
              );

              const referencedLifestyle = ref(relatedLifestyle);
              relatedLifestyleQuality.requiredLifestyleList.add(
                referencedLifestyle
              );
            })
          );
        }
      })
    );
    console.log("Lifestyle Quality relationships associated");

    // Equipment Packs that have Armour
    await Promise.all(
      unlinkedEquipmentPacks.map(async (equipmentPack) => {
        if (equipmentPack.armourList !== undefined) {
          const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
            name: equipmentPack.name,
          });
          assert(
            relatedEquipmentPack !== null,
            `undefined Equipment Pack: ${equipmentPack.name}`
          );

          await Promise.all(
            equipmentPack.armourList.map(async (armour) => {
              const relatedArmour = await em.findOne(Armours, {
                name: armour.baseArmour,
              });
              assert(
                relatedArmour !== null,
                `undefined Armour: ${armour.baseArmour} for Equipment Pack: ${equipmentPack.name}`
              );

              const referencedArmour = ref(relatedArmour);
              const activeArmour = new PackArmours(
                ref(relatedEquipmentPack),
                referencedArmour
              );
              em.create(PackArmours, activeArmour);

              if (armour.gearList !== undefined) {
                assert(
                  armour.gearList.length > 0,
                  "Equipment Pack armour gear list is empty"
                );
                await Promise.all(
                  armour.gearList.map(async (gear) => {
                    const relatedGear = await em.findOne(Gears, {
                      name: gear.baseGear,
                    });
                    assert(
                      relatedGear !== null,
                      `undefined armour gear: ${gear.baseGear} for Equipment Pack: ${equipmentPack.name}`
                    );
                    const referencedGear = ref(relatedGear);
                    const activeArmourIncludedGear =
                      new ActiveArmourIncludedGears(
                        ref(activeArmour),
                        referencedGear,
                        gear.specificOption,
                        gear.rating,
                        gear.consumeCapacity,
                        gear.currentQuantity
                      );
                    em.create(
                      ActiveArmourIncludedGears,
                      activeArmourIncludedGear
                    );
                  })
                );
              }

              if (armour.modList !== undefined) {
                assert(
                  armour.modList.length > 0,
                  "Equipment Pack armour mod list is empty"
                );
                await Promise.all(
                  armour.modList.map(async (mod) => {
                    const relatedMod = await em.findOne(ArmourModifications, {
                      name: mod.baseMod,
                    });
                    assert(
                      relatedMod !== null,
                      `undefined armour mod: ${mod.baseMod} for Equipment Pack: ${equipmentPack.name}`
                    );
                    const referencedMod = ref(relatedMod);
                    const PackArmourModification = new PackArmourModifications(
                      ref(activeArmour),
                      referencedMod,
                      mod.rating
                    );
                    em.create(PackArmourModifications, PackArmourModification);
                  })
                );
              }
            })
          );
        }
      })
    );
    console.log("Equipment Pack - Armour relationships associated");
    // Equipment Packs that have Augmentations
    for (const equipmentPack of unlinkedEquipmentPacks) {
      if (equipmentPack.augmentationList !== undefined) {
        const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
          name: equipmentPack.name,
        });
        assert(
          relatedEquipmentPack !== null,
          `undefined Equipment Pack: ${equipmentPack.name}`
        );

        for (const augmentation of equipmentPack.augmentationList) {
          const relatedAugmentation = await em.findOne(Augmentations, {
            name: augmentation.baseAugmentation,
          });
          assert(
            relatedAugmentation !== null,
            `undefined Augmentation: ${augmentation.baseAugmentation} for Equipment Pack: ${equipmentPack.name}`
          );

          const referencedAugmentation = ref(relatedAugmentation);
          const activeAugmentation = new PackAugmentations(
            ref(relatedEquipmentPack),
            referencedAugmentation,
            augmentation.grade,
            augmentation.rating
          );
          em.create(PackAugmentations, activeAugmentation);

          await em.flush();
          // if (
          //   augmentation.category === augmentationCategoryEnum.Bioware &&
          //   augmentation.subsystemList !== undefined
          // ) {
          //   if (augmentation.subsystemList.biowareList !== undefined) {
          //     assert(
          //       augmentation.subsystemList.biowareList.length > 0,
          //       "Equipment Pack augmentation subsystem bioware list is empty"
          //     );
          //     for (const subsystem of augmentation.subsystemList.biowareList) {
          //       const relatedBioware = await em.findOne(Biowares, {
          //         name: subsystem.name,
          //       });
          //       assert(
          //         relatedBioware !== null,
          //         `undefined augmentation subsystem bioware: ${subsystem.name} for Equipment Pack: ${equipmentPack.name}`
          //       );
          //       const referencedBioware = ref(relatedBioware);
          //       const packAugmentation = new PackAugmentations(
          //         referencedBioware,
          //         subsystem.rating
          //       );
          //       em.create(PackAugmentations, packAugmentation);
          //       activeAugmentation. .add(packAugmentation);
          //     }
          //   }
          // }

          if (augmentation.subsystemList !== undefined) {
            if (augmentation.subsystemList.cyberwareList !== undefined) {
              assert(
                augmentation.subsystemList.cyberwareList.length > 0,
                "Equipment Pack augmentation subsystem cyberware list is empty"
              );
              // TODO: This is technically recursive...
              for (const subsystem of augmentation.subsystemList
                .cyberwareList) {
                const relatedCyberware = await em.findOne(Cyberwares, {
                  name: subsystem.name,
                });
                assert(
                  relatedCyberware !== null,
                  `undefined augmentation subsystem cyberware: ${subsystem.name} for Equipment Pack: ${equipmentPack.name}`
                );
                const referencedCyberware = ref(relatedCyberware);
                const packAugmentation = new ChildAugmentations(
                  ref(activeAugmentation),
                  referencedCyberware,
                  subsystem.rating
                );
                em.create(ChildAugmentations, packAugmentation);
                if (subsystem.gearList !== undefined) {
                  assert(
                    subsystem.gearList.length > 0,
                    "Equipment Pack Augmentation subsystem gear list is empty"
                  );
                  for (const gear of subsystem.gearList) {
                    const relatedGear = await em.findOne(Gears, {
                      name: gear.baseGear,
                    });
                    assert(
                      relatedGear !== null,
                      `undefined augmentation subsystem gear: ${gear.baseGear} for Equipment Pack: ${equipmentPack.name}`
                    );
                    const referencedGear = ref(relatedGear);
                    const activeAugmentationIncludedGear =
                      new ActiveAugmentationGears(
                        ref(packAugmentation),
                        referencedGear,
                        gear.specificOption,
                        gear.rating,
                        gear.consumeCapacity,
                        gear.currentQuantity
                      );
                    em.create(
                      ActiveAugmentationGears,
                      activeAugmentationIncludedGear
                    );
                  }
                }
              }
            }
          }
          if (augmentation.gearList !== undefined) {
            assert(
              augmentation.gearList.length > 0,
              "Equipment Pack Augmentation gear list is empty"
            );
            for (const gear of augmentation.gearList) {
              const relatedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(
                relatedGear !== null,
                `undefined augmentation subsystem gear: ${gear.baseGear} for Equipment Pack: ${equipmentPack.name}`
              );
              const referencedGear = ref(relatedGear);
              const activeAugmentationIncludedGear =
                new ActiveAugmentationGears(
                  ref(activeAugmentation),
                  referencedGear,
                  gear.specificOption,
                  gear.rating,
                  gear.consumeCapacity,
                  gear.currentQuantity
                );
              em.create(
                ActiveAugmentationGears,
                activeAugmentationIncludedGear
              );
            }
          }
        }
      }
    }
    console.log("Equipment Pack - Augmentation relationships associated");
    // Equipment Packs that have Gear
    for (const equipmentPack of unlinkedEquipmentPacks) {
      if (equipmentPack.gearList !== undefined) {
        const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
          name: equipmentPack.name,
        });
        assert(
          relatedEquipmentPack !== null,
          `undefined Equipment Pack: ${equipmentPack.name}`
        );

        for (const gear of equipmentPack.gearList) {
          const relatedGear = await em.findOne(Gears, {
            name: gear.baseGear,
          });
          assert(
            relatedGear !== null,
            `undefined Gear: ${gear.baseGear} for Equipment Pack: ${equipmentPack.name}`
          );

          const referencedGear = ref(relatedGear);
          const activeGear = new PackGears(
            ref(relatedEquipmentPack),
            referencedGear
          );
          em.create(PackGears, activeGear);

          await em.flush();

          if (gear.innerGearList !== undefined) {
            assert(
              gear.innerGearList.length > 0,
              "Equipment Pack gear inner gear list is empty"
            );
            for (const innerGear of gear.innerGearList) {
              const relatedInnerGear = await em.findOne(Gears, {
                name: innerGear.baseGear,
              });
              assert(
                relatedInnerGear !== null,
                `undefined gear inner gear: ${innerGear.baseGear} for Equipment Pack: ${equipmentPack.name}`
              );
              const referencedInnerGear = ref(relatedInnerGear);
              console.log(activeGear.id);
              const activeGearIncludedGear = new ChildGears(
                ref(activeGear),
                referencedInnerGear,
                innerGear.specificOption,
                innerGear.rating,
                innerGear.consumeCapacity,
                innerGear.currentQuantity
              );
              em.create(ChildGears, activeGearIncludedGear);
            }
          }
        }
      }
    }
    console.log("Equipment Pack - Gear relationships associated");
    // Equipment Packs that have Vehicles
    for (const equipmentPack of unlinkedEquipmentPacks) {
      if (equipmentPack.vehicleList !== undefined) {
        const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
          name: equipmentPack.name,
        });
        assert(
          relatedEquipmentPack !== null,
          `undefined Equipment Pack: ${equipmentPack.name}`
        );

        for (const vehicle of equipmentPack.vehicleList) {
          const relatedVehicle = await em.findOne(Vehicles, {
            name: vehicle.baseVehicle,
          });
          assert(
            relatedVehicle !== null,
            `undefined Vehicle: ${vehicle.baseVehicle} for Equipment Pack: ${equipmentPack.name}`
          );

          const referencedVehicle = ref(relatedVehicle);
          const activeVehicle = new PackVehicles(
            ref(relatedEquipmentPack),
            referencedVehicle
          );
          em.create(PackVehicles, activeVehicle);

          if (vehicle.gearList !== undefined) {
            assert(
              vehicle.gearList.length > 0,
              "Equipment Pack vehicle gear list is empty"
            );
            for (const gear of vehicle.gearList) {
              const relatedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(
                relatedGear !== null,
                `undefined vehicle gear: ${gear.baseGear} for Equipment Pack: ${equipmentPack.name}`
              );
              const referencedGear = ref(relatedGear);
              const activeVehicleIncludedGear = new ActiveVehicleGears(
                ref(activeVehicle),
                referencedGear,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.currentQuantity
              );
              em.create(ActiveVehicleGears, activeVehicleIncludedGear);
            }
          }
          if (vehicle.weaponMountList !== undefined) {
            assert(
              vehicle.weaponMountList.length > 0,
              "Equipment Pack vehicle weapon mount list is empty"
            );
            for (const weaponMount of vehicle.weaponMountList) {
              const relatedWeaponMount = await em.findOne(WeaponMounts, {
                control: weaponMount.control,
                flexibility: weaponMount.flexibility,
                size: weaponMount.size,
                visibility: weaponMount.visibility,
              });
              assert(
                relatedWeaponMount !== null,
                `undefined vehicle weapon mount: ${weaponMount.control} ${weaponMount.flexibility} ${weaponMount.size} ${weaponMount.visibility} for Equipment Pack: ${equipmentPack.name}`
              );
              const referencedWeaponMount = ref(relatedWeaponMount);
              const activeVehicleIncludedWeaponMount =
                new PackVehicleWeaponMounts(
                  ref(activeVehicle),
                  referencedWeaponMount,
                  weaponMount.weaponExchangeable
                );
              em.create(
                PackVehicleWeaponMounts,
                activeVehicleIncludedWeaponMount
              );
              const referencedActiveVehicleIncludedWeaponMount = ref(
                activeVehicleIncludedWeaponMount
              );
              if (weaponMount.weaponMounted !== undefined) {
                const relatedWeapon = await em.findOne(Weapons, {
                  name: weaponMount.weaponMounted.baseWeapon,
                });
                assert(
                  relatedWeapon !== null,
                  `undefined vehicle weapon accessory: ${weaponMount.weaponMounted.baseWeapon} for Equipment Pack: ${equipmentPack.name}`
                );
                const referencedWeapon = ref(relatedWeapon);
                const activeWeaponMountWeapon = new WeaponMountWeapons(
                  referencedWeapon
                );
                activeWeaponMountWeapon.weaponMount =
                  referencedActiveVehicleIncludedWeaponMount;
                em.create(WeaponMountWeapons, activeWeaponMountWeapon);
                if (weaponMount.weaponMounted.accessoryList !== undefined) {
                  for (const accessory of weaponMount.weaponMounted
                    .accessoryList) {
                    const relatedAccessory = await em.findOne(
                      WeaponAccessories,
                      {
                        name: accessory.baseAccessory,
                      }
                    );
                    assert(
                      relatedAccessory !== null,
                      `undefined vehicle weapon accessory: ${accessory.baseAccessory} for Equipment Pack: ${equipmentPack.name}`
                    );
                    const referencedAccessory = ref(relatedAccessory);
                    const activeVehicleIncludedWeaponAccessory =
                      new CustomisedWeaponAccessories(
                        ref(activeWeaponMountWeapon),
                        referencedAccessory,
                        accessory.mountList,
                        accessory.rating
                      );
                    em.create(
                      CustomisedWeaponAccessories,
                      activeVehicleIncludedWeaponAccessory
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log("Equipment Pack - Vehicle relationships associated");
    // Equipment Packs that have Weapons
    await Promise.all(
      unlinkedEquipmentPacks.map(async (equipmentPack) => {
        if (equipmentPack.weaponList !== undefined) {
          const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
            name: equipmentPack.name,
          });
          assert(
            relatedEquipmentPack !== null,
            `undefined Equipment Pack: ${equipmentPack.name}`
          );

          await Promise.all(
            equipmentPack.weaponList.map(async (weapon) => {
              const relatedWeapon = await em.findOne(Weapons, {
                name: weapon.baseWeapon,
              });
              assert(
                relatedWeapon !== null,
                `undefined Weapon: ${weapon.baseWeapon} for Equipment Pack: ${equipmentPack.name}`
              );

              const referencedWeapon = ref(relatedWeapon);
              const activeWeapon = new PackWeapons(
                ref(relatedEquipmentPack),
                referencedWeapon
              );
              em.create(PackWeapons, activeWeapon);

              if (weapon.accessoryList !== undefined) {
                await Promise.all(
                  weapon.accessoryList.map(async (accessory) => {
                    const relatedAccessory = await em.findOne(
                      WeaponAccessories,
                      {
                        name: accessory.baseAccessory,
                      }
                    );
                    assert(
                      relatedAccessory !== null,
                      `undefined weapon accessory: ${accessory.baseAccessory} for Equipment Pack: ${equipmentPack.name}`
                    );
                    const referencedAccessory = ref(relatedAccessory);
                    const activeWeaponIncludedWeaponAccessory =
                      new CustomisedWeaponAccessories(
                        ref(activeWeapon),
                        referencedAccessory,
                        accessory.mountList,
                        accessory.rating
                      );
                    em.create(
                      CustomisedWeaponAccessories,
                      activeWeaponIncludedWeaponAccessory
                    );
                  })
                );
              }
            })
          );
        }
      })
    );
    console.log("Equipment Pack - Weapon relationships associated");
    // Equipment Packs that have a Lifestyle
    await Promise.all(
      unlinkedEquipmentPacks.map(async (equipmentPack) => {
        if (equipmentPack.lifestyleList !== undefined) {
          const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
            name: equipmentPack.name,
          });
          assert(
            relatedEquipmentPack !== null,
            `undefined Equipment Pack: ${equipmentPack.name}`
          );
          await Promise.all(
            equipmentPack.lifestyleList.map(async (lifestyle) => {
              const relatedLifestyle = await em.findOne(Lifestyles, {
                name: lifestyle.baseLifestyle,
              });
              assert(
                relatedLifestyle !== null,
                `undefined Lifestyle: ${lifestyle.baseLifestyle} for Equipment Pack: ${equipmentPack.name}`
              );
              const referencedLifestyle = ref(relatedLifestyle);
              const packLifestyle = new PackLifestyles(
                ref(relatedEquipmentPack),
                referencedLifestyle,
                lifestyle.purchasedDuration
              );
              em.create(PackLifestyles, packLifestyle);
            })
          );
        }
      })
    );
    console.log("Equipment Pack relationships associated");

    // -----------------------------------------------------------------
    // Internally used functions
    // -----------------------------------------------------------------
    async function addTalentLinks(
      rowLetter: priorityLetterEnum,
      talentPriority: TalentOptionsPriorityType
    ) {
      assert(talentPriority.talentList.length > 0, "Add talent list is empty");
      const relatedPriority = await em.findOne(Priorities, {
        rowLetter: rowLetter,
      });
      assert(relatedPriority !== null, `undefined Priority row: ${rowLetter}`);
      for (const talent of talentPriority.talentList) {
        let stagedTalent: TalentPriorityDetails;
        switch (talent.category) {
          case talentCategoryEnum.Magic:
            stagedTalent = new MagicTalentPriorityDetails(talent);
            break;
          case talentCategoryEnum.Resonance:
            stagedTalent = new ResonanceTalentPriorityDetails(talent);
            break;
          case talentCategoryEnum.Depth:
            stagedTalent = new DepthTalentPriorityDetails(talent);
            break;
          case talentCategoryEnum.Mundane:
            stagedTalent = new MundaneTalentPriorityDetails(talent);
            break;
        }

        if (talent.includedSkills !== undefined) {
          if ("source" in talent.includedSkills) {
            const includedSkills = new SkillSourcePriorityDetails(
              talent.includedSkills
            );
            includedSkills.talentPriorityDetails = ref(stagedTalent);
            em.create(SkillSourcePriorityDetails, includedSkills);
          } else {
            const includedSkills = new SkillPriorityDetails(
              talent.includedSkills
            );
            for (const skill of talent.includedSkills.skillOptionList) {
              const linkedSkill = await em.findOne(Skills, {
                name: skill,
              });
              assert(linkedSkill !== null, `undefined Skill: ${skill}`);
              includedSkills.skillOptionList.add(linkedSkill);
            }
            // TODO: check if this creation cascades properly
            includedSkills.talentPriorityDetails = ref(stagedTalent);
            em.create(SkillPriorityDetails, includedSkills);
          }
        }
        if (talent.includedSkillGroups !== undefined) {
          const includedSkillGroups = new SkillGroupPriorityDetails(
            talent.includedSkillGroups
          );
          for (const skillGroup of talent.includedSkillGroups.groupList) {
            const linkedSkillGroup = await em.findOne(SkillGroups, {
              name: skillGroup,
            });
            assert(
              linkedSkillGroup !== null,
              `undefined Skill Group: ${skillGroup}`
            );
            includedSkillGroups.skillGroupList.add(linkedSkillGroup);
          }
          // TODO: check if this creation cascades properly
          includedSkillGroups.talentPriorityDetails = ref(stagedTalent);
          em.create(SkillGroupPriorityDetails, includedSkillGroups);
        }
        if (talent.includedQuality !== undefined) {
          const linkedQuality = await em.findOne(Qualities, {
            name: talent.includedQuality,
          });
          assert(
            linkedQuality !== null,
            `undefined Quality (4): ${talent.includedQuality}`
          );
          stagedTalent.includedQuality = ref(linkedQuality);
        }

        if (stagedTalent instanceof MagicTalentPriorityDetails) {
          em.create(MagicTalentPriorityDetails, stagedTalent);
        } else if (stagedTalent instanceof ResonanceTalentPriorityDetails) {
          em.create(ResonanceTalentPriorityDetails, stagedTalent);
        } else if (stagedTalent instanceof DepthTalentPriorityDetails) {
          em.create(DepthTalentPriorityDetails, stagedTalent);
        } else if (stagedTalent instanceof MundaneTalentPriorityDetails) {
          em.create(MundaneTalentPriorityDetails, stagedTalent);
        } else {
          assert(false, `Unknown talentDetails instance`);
        }

        if (talent.required !== undefined) {
          const requirement = new TalentPriorityDetailRequirements();
          requirement.requirementTalentPriorityDetail = ref(stagedTalent);
          await linkRequirementEntity(em, talent.required, requirement);
          em.persist(requirement);
        }
        if (talent.forbidden !== undefined) {
          const requirement = new TalentPriorityDetailForbidden();
          requirement.forbiddenTalentPriorityDetail = ref(stagedTalent);
          await linkRequirementEntity(em, talent.forbidden, requirement);
          em.persist(requirement);
        }
        relatedPriority.talentList.add(stagedTalent);
      }
    }

    async function addHeritageLinks(
      rowLetter: priorityLetterEnum,
      heritagePriority: HeritageOptionsPriorityType
    ) {
      assert(
        heritagePriority.heritageList.length > 0,
        "Add heritage list is empty"
      );
      const relatedPriority = await em.findOne(Priorities, {
        rowLetter: rowLetter,
      });
      assert(
        relatedPriority !== null,
        `undefined Priority rowLetter: ${rowLetter}`
      );
      for (const heritage of heritagePriority.heritageList) {
        const linkedHeritage = await em.findOne(Heritages, {
          name: heritage.name,
        });
        assert(
          linkedHeritage !== null,
          `undefined Heritage name 5: ${heritage.name}`
        );
        const referencedHeritage = ref(linkedHeritage);
        const referencedPriority = ref(relatedPriority);
        const innerHeritagePriority = new HeritagePriorityDetails({
          heritagePriority: referencedPriority,
          heritage: referencedHeritage,
          specialAttributePoints: heritage.specialAttributePoints,
          karmaCost: heritage.karmaCost,
        });
        em.create(HeritagePriorityDetails, innerHeritagePriority);

        if (heritage.metavariantList !== undefined) {
          for (const metavariant of heritage.metavariantList) {
            const loadedMetavariant = await em.findOne(Metavariants, {
              name: metavariant.name,
              baseHeritage: referencedHeritage,
            });

            assert(
              loadedMetavariant !== null,
              `undefined metavariant name 2: ${metavariant.name}`
            );

            const referencedMetavariant = ref(loadedMetavariant);
            const referenceCorePriorityHeritage = ref(innerHeritagePriority);
            const metavariantPriorityDetails = new HeritagePriorityDetails({
              heritagePriority: referencedPriority,
              heritage: referencedMetavariant,
              corePriorityHeritage: referenceCorePriorityHeritage,
              specialAttributePoints: heritage.specialAttributePoints,
              karmaCost: heritage.karmaCost,
            });
            em.create(HeritagePriorityDetails, metavariantPriorityDetails);
          }
        }
      }
    }

    await em.flush();

    // === BONUS LINKAGES ===
    await Promise.all(
      unlinkedHeritages.map(async (heritage) => {
        if (heritage.bonus !== undefined) {
          const parent = await em.findOne(Heritages, { name: heritage.name });
          assert(parent !== null, `Parent not found: ${heritage.name}`);
          const bonus = new HeritagesBonuses(ref(parent), heritage.bonus);
          await linkBonusEntity(em, heritage.bonus, bonus, heritage.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Heritage bonuses associated");
    await Promise.all(
      unlinkedCritters.map(async (critter) => {
        if (critter.bonus !== undefined) {
          const parent = await em.findOne(Critters, { name: critter.name });
          assert(parent !== null, `Parent not found: ${critter.name}`);
          const bonus = new CrittersBonuses(ref(parent), critter.bonus);
          await linkBonusEntity(em, critter.bonus, bonus, critter.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Critter bonuses associated");
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (augmentation.bonus !== undefined) {
          const parent = await em.findOne(Augmentations, {
            name: augmentation.name,
          });
          assert(parent !== null, `Parent not found: ${augmentation.name}`);
          const bonus = new AugmentationsBonuses(
            ref(parent),
            augmentation.bonus
          );
          await linkBonusEntity(
            em,
            augmentation.bonus,
            bonus,
            augmentation.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Augmentation bonuses associated");
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (augmentation.pairBonus !== undefined) {
          const parent = await em.findOne(Augmentations, {
            name: augmentation.name,
          });
          assert(parent !== null, `Parent not found: ${augmentation.name}`);
          const bonus = new AugmentationsPairBonuses(
            ref(parent),
            augmentation.pairBonus
          );
          await linkBonusEntity(
            em,
            augmentation.pairBonus,
            bonus,
            augmentation.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Augmentation pair bonuses associated");
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (
          "wirelessBonus" in augmentation &&
          augmentation.wirelessBonus !== undefined
        ) {
          const parent = await em.findOne(Augmentations, {
            name: augmentation.name,
          });
          assert(parent !== null, `Parent not found: ${augmentation.name}`);
          const bonus = new AugmentationsWirelessBonuses(
            ref(parent),
            augmentation.wirelessBonus
          );
          await linkBonusEntity(
            em,
            augmentation.wirelessBonus,
            bonus,
            augmentation.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Augmentation wireless bonuses associated");
    await Promise.all(
      unlinkedAugmentations.map(async (augmentation) => {
        if (
          "wirelessPairBonus" in augmentation &&
          augmentation.wirelessPairBonus !== undefined
        ) {
          const parent = await em.findOne(Augmentations, {
            name: augmentation.name,
          });
          assert(parent !== null, `Parent not found: ${augmentation.name}`);
          const bonus = new AugmentationsWirelessPairBonuses(
            ref(parent),
            augmentation.wirelessPairBonus
          );
          await linkBonusEntity(
            em,
            augmentation.wirelessPairBonus,
            bonus,
            augmentation.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Augmentation wireless pair bonuses associated");
    await Promise.all(
      unlinkedDrugs.map(async (drug) => {
        if (drug.bonus !== undefined) {
          const parent = await em.findOne(Drugs, { name: drug.name });
          assert(parent !== null, `Parent not found: ${drug.name}`);
          const bonus = new DrugsBonuses(ref(parent), drug.bonus);
          await linkBonusEntity(em, drug.bonus, bonus, drug.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Drug bonuses associated");
    await Promise.all(
      unlinkedGears.map(async (gear) => {
        if (gear.bonus !== undefined) {
          const parent = await em.findOne(Gears, { name: gear.name });
          assert(parent !== null, `Parent not found: ${gear.name}`);
          const bonus = new GearsBonuses(ref(parent), gear.bonus);
          await linkBonusEntity(em, gear.bonus, bonus, gear.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Gear bonuses associated");
    await Promise.all(
      unlinkedArmours.map(async (armour) => {
        if (armour.bonus !== undefined) {
          const parent = await em.findOne(Armours, { name: armour.name });
          assert(parent !== null, `Parent not found: ${armour.name}`);
          const bonus = new ArmoursBonuses(ref(parent), armour.bonus);
          await linkBonusEntity(em, armour.bonus, bonus, armour.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Armour bonuses associated");
    await Promise.all(
      unlinkedArmours.map(async (armour) => {
        if (armour.wirelessBonus !== undefined) {
          const parent = await em.findOne(Armours, { name: armour.name });
          assert(parent !== null, `Parent not found: ${armour.name}`);
          const bonus = new ArmoursWirelessBonuses(
            ref(parent),
            armour.wirelessBonus
          );
          await linkBonusEntity(em, armour.wirelessBonus, bonus, armour.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Armour wireless bonuses associated");
    await Promise.all(
      unlinkedArmourMods.map(async (armourMod) => {
        if (armourMod.bonus !== undefined) {
          const parent = await em.findOne(ArmourModifications, {
            name: armourMod.name,
          });
          assert(parent !== null, `Parent not found: ${armourMod.name}`);
          const bonus = new ArmourModificationsBonuses(
            ref(parent),
            armourMod.bonus
          );
          await linkBonusEntity(em, armourMod.bonus, bonus, armourMod.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Armour modification bonuses associated");
    await Promise.all(
      unlinkedArmourMods.map(async (armourMod) => {
        if (armourMod.wirelessBonus !== undefined) {
          const parent = await em.findOne(ArmourModifications, {
            name: armourMod.name,
          });
          assert(parent !== null, `Parent not found: ${armourMod.name}`);
          const bonus = new ArmourModificationsWirelessBonuses(
            ref(parent),
            armourMod.wirelessBonus
          );
          await linkBonusEntity(
            em,
            armourMod.wirelessBonus,
            bonus,
            armourMod.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Armour modification wireless bonuses associated");
    await Promise.all(
      unlinkedVehicleModifications.map(async (vehicleMod) => {
        if (vehicleMod.bonus !== undefined) {
          const parent = await em.findOne(VehicleModifications, {
            name: vehicleMod.name,
          });
          assert(parent !== null, `Parent not found: ${vehicleMod.name}`);
          const bonus = new VehicleModificationsBonuses(
            ref(parent),
            vehicleMod.bonus
          );
          await linkBonusEntity(em, vehicleMod.bonus, bonus, vehicleMod.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Vehicle modification bonuses associated");
    await Promise.all(
      unlinkedSpells.map(async (spell) => {
        if (spell.bonus !== undefined) {
          const parent = await em.findOne(Spells, { name: spell.name });
          assert(parent !== null, `Parent not found: ${spell.name}`);
          const bonus = new SpellsBonuses(ref(parent), spell.bonus);
          await linkBonusEntity(em, spell.bonus, bonus, spell.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Spell bonuses associated");
    await Promise.all(
      unlinkedAdeptPowers.map(async (adeptPower) => {
        if (adeptPower.bonus !== undefined) {
          const parent = await em.findOne(AdeptPowers, {
            name: adeptPower.name,
          });
          assert(parent !== null, `Parent not found: ${adeptPower.name}`);
          const bonus = new AdeptPowersBonuses(ref(parent), adeptPower.bonus);
          await linkBonusEntity(em, adeptPower.bonus, bonus, adeptPower.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Adept power bonuses associated");
    await Promise.all(
      unlinkedComplexForms.map(async (complexForm) => {
        if (complexForm.bonus !== undefined) {
          const parent = await em.findOne(ComplexForms, {
            name: complexForm.name,
          });
          assert(parent !== null, `Parent not found: ${complexForm.name}`);
          const bonus = new ComplexFormsBonuses(ref(parent), complexForm.bonus);
          await linkBonusEntity(em, complexForm.bonus, bonus, complexForm.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Complex form bonuses associated");
    await Promise.all(
      unlinkedPrograms.map(async (program) => {
        if (program.bonus !== undefined) {
          const parent = await em.findOne(Programs, { name: program.name });
          assert(parent !== null, `Parent not found: ${program.name}`);
          const bonus = new ProgramsBonuses(ref(parent), program.bonus);
          await linkBonusEntity(em, program.bonus, bonus, program.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Program bonuses associated");
    await Promise.all(
      unlinkedCritterPowers.map(async (critterPower) => {
        if (critterPower.bonus !== undefined) {
          const parent = await em.findOne(CritterPowers, {
            name: critterPower.name,
          });
          assert(parent !== null, `Parent not found: ${critterPower.name}`);
          const bonus = new CritterPowersBonuses(
            ref(parent),
            critterPower.bonus
          );
          await linkBonusEntity(
            em,
            critterPower.bonus,
            bonus,
            critterPower.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Critter power bonuses associated");
    await Promise.all(
      unlinkedTraditions.map(async (tradition) => {
        if (tradition.bonus !== undefined) {
          const parent = await em.findOne(Traditions, { name: tradition.name });
          assert(parent !== null, `Parent not found: ${tradition.name}`);
          const bonus = new TraditionsBonuses(ref(parent), tradition.bonus);
          await linkBonusEntity(em, tradition.bonus, bonus, tradition.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Tradition bonuses associated");
    await Promise.all(
      unlinkedMentorSpirits.map(async (mentorSpirit) => {
        if (mentorSpirit.bonus !== undefined) {
          const parent = await em.findOne(MentorSpirits, {
            name: mentorSpirit.name,
          });
          assert(parent !== null, `Parent not found: ${mentorSpirit.name}`);
          const bonus = new MentorsBonuses(ref(parent), mentorSpirit.bonus);
          await linkBonusEntity(
            em,
            mentorSpirit.bonus,
            bonus,
            mentorSpirit.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Mentor spirit bonuses associated");
    await Promise.all(
      unlinkedParagons.map(async (paragon) => {
        if (paragon.bonus !== undefined) {
          const parent = await em.findOne(Paragons, { name: paragon.name });
          assert(parent !== null, `Parent not found: ${paragon.name}`);
          const bonus = new MentorsBonuses(ref(parent), paragon.bonus);
          await linkBonusEntity(em, paragon.bonus, bonus, paragon.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Paragon bonuses associated");
    await Promise.all(
      unlinkedMartialArts.map(async (martialArt) => {
        if (martialArt.bonus !== undefined) {
          const parent = await em.findOne(MartialArts, {
            name: martialArt.name,
          });
          assert(parent !== null, `Parent not found: ${martialArt.name}`);
          const bonus = new MartialArtsBonuses(ref(parent), martialArt.bonus);
          await linkBonusEntity(em, martialArt.bonus, bonus, martialArt.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Martial art bonuses associated");
    await Promise.all(
      unlinkedMartialArtTechniques.map(async (martialArtTechnique) => {
        if (martialArtTechnique.bonus !== undefined) {
          const parent = await em.findOne(MartialArtTechniques, {
            name: martialArtTechnique.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${martialArtTechnique.name}`
          );
          const bonus = new MartialArtTechniquesBonuses(
            ref(parent),
            martialArtTechnique.bonus
          );
          await linkBonusEntity(
            em,
            martialArtTechnique.bonus,
            bonus,
            martialArtTechnique.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Martial art technique bonuses associated");
    await Promise.all(
      unlinkedLifestyles.map(async (lifestyle) => {
        if (lifestyle.bonus !== undefined) {
          const parent = await em.findOne(Lifestyles, { name: lifestyle.name });
          assert(parent !== null, `Parent not found: ${lifestyle.name}`);
          const bonus = new LifestylesBonuses(ref(parent), lifestyle.bonus);
          await linkBonusEntity(em, lifestyle.bonus, bonus, lifestyle.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Lifestyle bonuses associated");
    await Promise.all(
      unlinkedLifestyleQualities.map(async (lifestyleQuality) => {
        if (lifestyleQuality.bonus !== undefined) {
          const parent = await em.findOne(LifestyleQualities, {
            name: lifestyleQuality.name,
          });
          assert(parent !== null, `Parent not found: ${lifestyleQuality.name}`);
          const bonus = new LifestyleQualitiesBonuses(
            ref(parent),
            lifestyleQuality.bonus
          );
          await linkBonusEntity(
            em,
            lifestyleQuality.bonus,
            bonus,
            lifestyleQuality.name
          );
          em.persist(bonus);
        }
      })
    );
    console.log("Lifestyle quality bonuses associated");
    await Promise.all(
      unlinkedMetamagics.map(async (metamagic) => {
        if (metamagic.bonus !== undefined) {
          const parent = await em.findOne(Metamagics, { name: metamagic.name });
          assert(parent !== null, `Parent not found: ${metamagic.name}`);
          const bonus = new MetamagicsBonuses(ref(parent), metamagic.bonus);
          await linkBonusEntity(em, metamagic.bonus, bonus, metamagic.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Metamagic bonuses associated");
    await Promise.all(
      unlinkedEchoes.map(async (echo) => {
        if (echo.bonus !== undefined) {
          const parent = await em.findOne(Echoes, { name: echo.name });
          assert(parent !== null, `Parent not found: ${echo.name}`);
          const bonus = new EchoesBonuses(ref(parent), echo.bonus);
          await linkBonusEntity(em, echo.bonus, bonus, echo.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Echo bonuses associated");
    await Promise.all(
      unlinkedQualities.map(async (quality) => {
        if (quality.bonus !== undefined) {
          const parent = await em.findOne(Qualities, { name: quality.name });
          assert(parent !== null, `Parent not found: ${quality.name}`);
          const bonus = new QualityBonuses(ref(parent), quality.bonus);
          await linkBonusEntity(em, quality.bonus, bonus, quality.name);
          em.persist(bonus);
        }
      })
    );
    console.log("Quality bonuses associated");
    await em.flush();
    console.log("All bonuses associated");

    await this.linkRequirements(em, {
      unlinkedQualities,
      unlinkedWeaponAccessories,
      unlinkedWeapons,
      unlinkedArmourMods,
      unlinkedAugmentations,
      unlinkedVehicleModifications,
      unlinkedWeaponMountMods,
      unlinkedGears,
      unlinkedSpells,
      unlinkedPrograms,
      unlinkedAdeptPowers,
      unlinkedComplexForms,
      unlinkedCritterPowers,
      unlinkedTraditions,
      unlinkedMentorSpirits,
      unlinkedMartialArts,
      unlinkedMartialArtTechniques,
      unlinkedLifestyles,
      unlinkedLifestyleQualities,
      unlinkedMetamagics,
    });
  }

  private async linkRequirements(
    em: EntityManager,
    {
      unlinkedQualities,
      unlinkedWeaponAccessories,
      unlinkedWeapons,
      unlinkedArmourMods,
      unlinkedAugmentations,
      unlinkedVehicleModifications,
      unlinkedWeaponMountMods,
      unlinkedGears,
      unlinkedSpells,
      unlinkedPrograms,
      unlinkedAdeptPowers,
      unlinkedComplexForms,
      unlinkedCritterPowers,
      unlinkedTraditions,
      unlinkedMentorSpirits,
      unlinkedMartialArts,
      unlinkedMartialArtTechniques,
      unlinkedLifestyles,
      unlinkedLifestyleQualities,
      unlinkedMetamagics,
    }: {
      unlinkedQualities: QualityListType;
      unlinkedWeaponAccessories: WeaponAccessoryListType;
      unlinkedWeapons: WeaponListType;
      unlinkedArmourMods: ArmourModListType;
      unlinkedAugmentations: AugmentationListType;
      unlinkedVehicleModifications: VehicleModListType;
      unlinkedWeaponMountMods: WeaponMountModListType;
      unlinkedGears: GearListType;
      unlinkedSpells: SpellListType;
      unlinkedPrograms: ProgramListType;
      unlinkedAdeptPowers: AdeptPowerListType;
      unlinkedComplexForms: ComplexFormListType;
      unlinkedCritterPowers: CritterPowerListType;
      unlinkedTraditions: TraditionListType;
      unlinkedMentorSpirits: MentorListType;
      unlinkedMartialArts: MartialArtListType;
      unlinkedMartialArtTechniques: MartialArtTechniqueListType;
      unlinkedLifestyles: LifestyleListType;
      unlinkedLifestyleQualities: LifestyleQualityListType;
      unlinkedMetamagics: MetamagicListType;
    }
  ): Promise<void> {
    for (const unlinkedQuality of unlinkedQualities) {
      if (unlinkedQuality.requirements !== undefined) {
        const parent = await em.findOne(Qualities, {
          name: unlinkedQuality.name,
        });
        assert(parent !== null, `Parent not found: ${unlinkedQuality.name}`);
        const requirement = new QualityRequirements();
        requirement.requirementQuality = ref(parent);
        await linkRequirementEntity(
          em,
          unlinkedQuality.requirements,
          requirement
        );
        em.persist(requirement);
      }
    }
    console.log("Quality requirements linked");

    for (const unlinkedQuality of unlinkedQualities) {
      if (unlinkedQuality.forbidden !== undefined) {
        const parent = await em.findOne(Qualities, {
          name: unlinkedQuality.name,
        });
        assert(parent !== null, `Parent not found: ${unlinkedQuality.name}`);
        const requirement = new QualityForbidden();
        requirement.forbiddenQuality = ref(parent);
        await linkRequirementEntity(em, unlinkedQuality.forbidden, requirement);
        em.persist(requirement);
      }
    }
    console.log("Quality forbidden linked");

    for (const unlinkedQuality of unlinkedQualities) {
      if (unlinkedQuality.karmaDiscount !== undefined) {
        const parent = await em.findOne(Qualities, {
          name: unlinkedQuality.name,
        });
        assert(parent !== null, `Parent not found: ${unlinkedQuality.name}`);
        const requirement = new QualityKarmaDiscountRequirements();
        requirement.requirementQualityKarmaDiscount = ref(parent);
        parent.karmaDiscountRequirements = ref(requirement);
        await linkRequirementEntity(
          em,
          unlinkedQuality.karmaDiscount.requirements,
          requirement
        );
        em.persist(requirement);
      }
    }
    console.log("Quality karma discount requirements linked");

    await Promise.all(
      unlinkedWeaponAccessories.map(async (unlinkedWeaponAccessory) => {
        if (unlinkedWeaponAccessory.requirements !== undefined) {
          const parent = await em.findOne(WeaponAccessories, {
            name: unlinkedWeaponAccessory.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedWeaponAccessory.name}`
          );
          const requirement = new WeaponAccessoryHostRequirements();
          requirement.requirementWeaponAccessory = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedWeaponAccessory.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Weapon accessory requirements linked");

    await Promise.all(
      unlinkedWeaponAccessories.map(async (unlinkedWeaponAccessory) => {
        if (unlinkedWeaponAccessory.forbidden !== undefined) {
          const parent = await em.findOne(WeaponAccessories, {
            name: unlinkedWeaponAccessory.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedWeaponAccessory.name}`
          );
          const requirement = new WeaponAccessoryHostForbidden();
          requirement.forbiddenWeaponAccessory = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedWeaponAccessory.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Weapon accessory forbidden linked");

    await Promise.all(
      unlinkedWeapons.map(async (unlinkedWeapon) => {
        if (
          hasRequirements(unlinkedWeapon) &&
          unlinkedWeapon.requirements !== undefined
        ) {
          const parent = await em.findOne(Weapons, {
            name: unlinkedWeapon.name,
          });
          assert(parent !== null, `Parent not found: ${unlinkedWeapon.name}`);
          const requirement = new WeaponRequirements();
          requirement.requirementWeapon = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedWeapon.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Weapon requirements linked");

    await Promise.all(
      unlinkedArmourMods.map(async (unlinkedArmourMod) => {
        if (unlinkedArmourMod.requirements !== undefined) {
          const parent = await em.findOne(ArmourModifications, {
            name: unlinkedArmourMod.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedArmourMod.name}`
          );
          const requirement = new ArmourModificationRequirements();
          requirement.requirementArmourModification = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedArmourMod.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Armour modification requirements linked");

    await Promise.all(
      unlinkedArmourMods.map(async (unlinkedArmourMod) => {
        if (unlinkedArmourMod.forbidden !== undefined) {
          const parent = await em.findOne(ArmourModifications, {
            name: unlinkedArmourMod.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedArmourMod.name}`
          );
          const requirement = new ArmourModificationForbidden();
          requirement.forbiddenArmourModification = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedArmourMod.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Armour modification forbidden linked");

    await Promise.all(
      unlinkedAugmentations.map(async (unlinkedAugmentation) => {
        if (unlinkedAugmentation.requirements !== undefined) {
          const parent = await em.findOne(Augmentations, {
            name: unlinkedAugmentation.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedAugmentation.name}`
          );
          const requirement = new AugmentationRequirements();
          requirement.requirementAugmentation = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedAugmentation.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Augmentation requirements linked");

    await Promise.all(
      unlinkedAugmentations.map(async (unlinkedAugmentation) => {
        if (unlinkedAugmentation.forbidden !== undefined) {
          const parent = await em.findOne(Augmentations, {
            name: unlinkedAugmentation.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedAugmentation.name}`
          );
          const requirement = new AugmentationForbidden();
          requirement.forbiddenAugmentation = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedAugmentation.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Augmentation forbidden linked");

    await Promise.all(
      unlinkedVehicleModifications.map(async (unlinkedVehicleModification) => {
        if (unlinkedVehicleModification.requirements !== undefined) {
          const parent = await em.findOne(VehicleModifications, {
            name: unlinkedVehicleModification.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedVehicleModification.name}`
          );
          const requirement = new VehicleModificationRequirements();
          requirement.requirementVehicleModification = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedVehicleModification.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Vehicle modification requirements linked");

    await Promise.all(
      unlinkedVehicleModifications.map(async (unlinkedVehicleModification) => {
        if (unlinkedVehicleModification.forbidden !== undefined) {
          const parent = await em.findOne(VehicleModifications, {
            name: unlinkedVehicleModification.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedVehicleModification.name}`
          );
          const requirement = new VehicleModificationForbidden();
          requirement.forbiddenVehicleModification = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedVehicleModification.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Vehicle modification forbidden linked");

    await Promise.all(
      unlinkedWeaponMountMods.map(async (unlinkedWeaponMountMod) => {
        if (unlinkedWeaponMountMod.requirements !== undefined) {
          const parent = await em.findOne(WeaponMountModifications, {
            name: unlinkedWeaponMountMod.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedWeaponMountMod.name}`
          );
          const requirement = new WeaponMountModRequirements();
          requirement.requirementWeaponMountMod = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedWeaponMountMod.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Weapon mount modification requirements linked");

    for (const unlinkedGear of unlinkedGears) {
      if (unlinkedGear.requirements !== undefined) {
        const candidates = await em.find(Gears, { name: unlinkedGear.name });
        assert(candidates.length > 0, `Parent not found: ${unlinkedGear.name}`);
        const parent = candidates.find((c) => c.requirements == null);
        assert(
          parent !== undefined,
          `No unlinked parent found for ${unlinkedGear.name}`
        );
        const requirement = new GearRequirements();
        requirement.requirementGear = ref(parent);
        await linkRequirementEntity(em, unlinkedGear.requirements, requirement);
        em.persist(requirement);
      }
    }
    console.log("Gear requirements linked");

    for (const unlinkedGear of unlinkedGears) {
      if (unlinkedGear.forbidden !== undefined) {
        const candidates = await em.find(Gears, { name: unlinkedGear.name });
        assert(candidates.length > 0, `Parent not found: ${unlinkedGear.name}`);
        const parent = candidates.find((c) => c.forbidden == null);
        assert(
          parent !== undefined,
          `No unlinked parent found for ${unlinkedGear.name}`
        );
        const requirement = new GearForbidden();
        requirement.forbiddenGear = ref(parent);
        await linkRequirementEntity(em, unlinkedGear.forbidden, requirement);
        em.persist(requirement);
      }
    }
    console.log("Gear forbidden linked");

    await Promise.all(
      unlinkedSpells.map(async (unlinkedSpell) => {
        if (unlinkedSpell.requirements !== undefined) {
          const parent = await em.findOne(Spells, { name: unlinkedSpell.name });
          assert(parent !== null, `Parent not found: ${unlinkedSpell.name}`);
          const requirement = new SpellRequirements();
          requirement.requirementSpell = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedSpell.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Spell requirements linked");

    await Promise.all(
      unlinkedPrograms.map(async (unlinkedProgram) => {
        if (unlinkedProgram.requirements !== undefined) {
          const parent = await em.findOne(Programs, {
            name: unlinkedProgram.name,
          });
          assert(parent !== null, `Parent not found: ${unlinkedProgram.name}`);
          const requirement = new ProgramRequirements();
          requirement.requirementProgram = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedProgram.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Program requirements linked");

    await Promise.all(
      unlinkedAdeptPowers.map(async (unlinkedAdeptPower) => {
        if (
          hasAdeptWayRequirements(unlinkedAdeptPower) &&
          unlinkedAdeptPower.adeptWayRequirements !== undefined
        ) {
          const parent = await em.findOne(AdeptPowers, {
            name: unlinkedAdeptPower.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedAdeptPower.name}`
          );
          const requirement = new AdeptPowerAdeptWayRequirements();
          requirement.requirementAdeptPower = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedAdeptPower.adeptWayRequirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Adept power requirements linked");

    await Promise.all(
      unlinkedAdeptPowers.map(async (unlinkedAdeptPower) => {
        if (unlinkedAdeptPower.requirements !== undefined) {
          const parent = await em.findOne(AdeptPowers, {
            name: unlinkedAdeptPower.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedAdeptPower.name}`
          );
          const requirement = new AdeptPowerRequirements();
          requirement.forbiddenAdeptPower = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedAdeptPower.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Adept power requirements linked");

    await Promise.all(
      unlinkedAdeptPowers.map(async (unlinkedAdeptPower) => {
        if (unlinkedAdeptPower.forbidden !== undefined) {
          const parent = await em.findOne(AdeptPowers, {
            name: unlinkedAdeptPower.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedAdeptPower.name}`
          );
          const requirement = new AdeptPowerForbidden();
          requirement.forbiddenAdeptPower = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedAdeptPower.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Adept power forbidden linked");

    await Promise.all(
      unlinkedComplexForms.map(async (unlinkedComplexForm) => {
        if (unlinkedComplexForm.requirements !== undefined) {
          const parent = await em.findOne(ComplexForms, {
            name: unlinkedComplexForm.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedComplexForm.name}`
          );
          const requirement = new ComplexFormRequirements();
          requirement.requirementComplexForm = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedComplexForm.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Complex form requirements linked");

    await Promise.all(
      unlinkedCritterPowers.map(async (unlinkedCritterPower) => {
        if (unlinkedCritterPower.requirements !== undefined) {
          const parent = await em.findOne(CritterPowers, {
            name: unlinkedCritterPower.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedCritterPower.name}`
          );
          const requirement = new CritterPowerRequirements();
          requirement.requirementCritterPower = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedCritterPower.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Critter power requirements linked");

    await Promise.all(
      unlinkedCritterPowers.map(async (unlinkedCritterPower) => {
        if (unlinkedCritterPower.forbidden !== undefined) {
          const parent = await em.findOne(CritterPowers, {
            name: unlinkedCritterPower.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedCritterPower.name}`
          );
          const requirement = new CritterPowerForbidden();
          requirement.forbiddenCritterPower = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedCritterPower.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Critter power forbidden linked");

    await Promise.all(
      unlinkedTraditions.map(async (unlinkedTradition) => {
        if (unlinkedTradition.requirements !== undefined) {
          const parent = await em.findOne(Traditions, {
            name: unlinkedTradition.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedTradition.name}`
          );
          const requirement = new TraditionRequirements();
          requirement.requirementTradition = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedTradition.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Tradition requirements linked");

    await Promise.all(
      unlinkedMentorSpirits.map(async (unlinkedMentorSpirit) => {
        if (
          hasRequired(unlinkedMentorSpirit) &&
          unlinkedMentorSpirit.required !== undefined
        ) {
          const parent = await em.findOne(MentorSpirits, {
            name: unlinkedMentorSpirit.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedMentorSpirit.name}`
          );
          const requirement = new MentorRequired();
          requirement.requirementMentor = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedMentorSpirit.required,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Mentor spirit requirements linked");

    await Promise.all(
      unlinkedMartialArts.map(async (unlinkedMartialArt) => {
        if (unlinkedMartialArt.requirements !== undefined) {
          const parent = await em.findOne(MartialArts, {
            name: unlinkedMartialArt.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedMartialArt.name}`
          );
          const requirement = new MartialArtRequirements();
          requirement.requirementMartialArt = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedMartialArt.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Martial art requirements linked");

    await Promise.all(
      unlinkedMartialArtTechniques.map(async (unlinkedMartialArtTechnique) => {
        if (unlinkedMartialArtTechnique.requirements !== undefined) {
          const parent = await em.findOne(MartialArtTechniques, {
            name: unlinkedMartialArtTechnique.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedMartialArtTechnique.name}`
          );
          const requirement = new MartialArtTechniqueRequirements();
          requirement.requirementMartialArtTechnique = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedMartialArtTechnique.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Martial art technique requirements linked");

    await Promise.all(
      unlinkedLifestyles.map(async (unlinkedLifestyle) => {
        if (unlinkedLifestyle.requirements !== undefined) {
          const parent = await em.findOne(Lifestyles, {
            name: unlinkedLifestyle.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedLifestyle.name}`
          );
          const requirement = new LifestyleRequirements();
          requirement.requirementLifestyle = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedLifestyle.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Lifestyle requirements linked");

    await Promise.all(
      unlinkedLifestyles.map(async (unlinkedLifestyle) => {
        if (unlinkedLifestyle.forbidden !== undefined) {
          const parent = await em.findOne(Lifestyles, {
            name: unlinkedLifestyle.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedLifestyle.name}`
          );
          const requirement = new LifestyleForbidden();
          requirement.forbiddenLifestyle = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedLifestyle.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Lifestyle forbidden linked");

    await Promise.all(
      unlinkedLifestyleQualities.map(async (unlinkedLifestyleQuality) => {
        if (unlinkedLifestyleQuality.requirements !== undefined) {
          const parent = await em.findOne(LifestyleQualities, {
            name: unlinkedLifestyleQuality.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedLifestyleQuality.name}`
          );
          const requirement = new LifestyleQualityRequirements();
          requirement.requirementLifestyleQuality = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedLifestyleQuality.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Lifestyle quality requirements linked");

    await Promise.all(
      unlinkedLifestyleQualities.map(async (unlinkedLifestyleQuality) => {
        if (unlinkedLifestyleQuality.forbidden !== undefined) {
          const parent = await em.findOne(LifestyleQualities, {
            name: unlinkedLifestyleQuality.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedLifestyleQuality.name}`
          );
          const requirement = new LifestyleQualityForbidden();
          requirement.forbiddenLifestyleQuality = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedLifestyleQuality.forbidden,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Lifestyle quality forbidden linked");

    await Promise.all(
      unlinkedMetamagics.map(async (unlinkedMetamagic) => {
        if (unlinkedMetamagic.requirements !== undefined) {
          const parent = await em.findOne(Metamagics, {
            name: unlinkedMetamagic.name,
          });
          assert(
            parent !== null,
            `Parent not found: ${unlinkedMetamagic.name}`
          );
          const requirement = new MetamagicRequirements();
          requirement.requirementMetamagic = ref(parent);
          await linkRequirementEntity(
            em,
            unlinkedMetamagic.requirements,
            requirement
          );
          em.persist(requirement);
        }
      })
    );
    console.log("Metamagic requirements linked");

    await em.flush();
    console.log("Requirement linkages associated");
  }
}
