import assert from "assert";
import { EntityManager, ref } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { getSkills } from "../seeds/rpgSeeds/skillsSeed.js";
import { getWeapons } from "../seeds/rpgSeeds/weaponsSeed.js";
import { getWeaponAccessories } from "../seeds/rpgSeeds/weaponAccessoriesSeed.js";
import { getArmourModifications } from "../seeds/rpgSeeds/armourModificationsSeed.js";
import { getArmours } from "../seeds/rpgSeeds/armoursSeed.js";
import { getAugmentations } from "../seeds/rpgSeeds/augmentationsSeed.js";
import { getDrugs, getDrugComponents } from "../seeds/rpgSeeds/drugSeed.js";
import { getGears } from "../seeds/rpgSeeds/gearSeed.js";
import { getRanges } from "../seeds/rpgSeeds/rangesSeed.js";
import { getVehicleModifications } from "../seeds/rpgSeeds/vehicleModificationSeed.js";
import { getWeaponMountModifications } from "../seeds/rpgSeeds/weaponMountModSeed.js";
import {
  getVehicles,
  createVehicleWeaponMounts,
} from "../seeds/rpgSeeds/vehicleSeed.js";
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
  augmentationTypeEnum,
  heritageCategoryEnum,
  priorityLetterEnum,
  talentCategoryEnum,
  weaponTypeEnum,
} from "@neon-codex/common/build/enums.js";
import { Qualities } from "../models/rpg/traits/qualityModel.js";
import { getQualities } from "../seeds/rpgSeeds/qualitiesSeed.js";
import { getHeritages } from "../seeds/rpgSeeds/heritagesSeed.js";
import {
  Heritages,
  BaseHeritages,
  Metavariants,
} from "../models/rpg/traits/heritageModel.js";
import { getPriorities } from "../seeds/rpgSeeds/prioritySeed.js";
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
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import {
  CritterIncludedQualities,
  HeritageIncludedQualities,
} from "../models/rpg/activeTables/activeQualityModel.js";
import { Spells } from "../models/rpg/abilities/spellModel.js";
import { getSpells } from "../seeds/rpgSeeds/spellsSeed.js";
import { getAdeptPowers } from "../seeds/rpgSeeds/adeptPowerSeed.js";
import { AdeptPowers } from "../models/rpg/abilities/adeptPowerModel.js";
import {
  AllSpiritsTraditions,
  LinkedSpiritsTraditions,
  UnlinkedSpiritsTraditions,
} from "../models/rpg/traits/traditionModel.js";
import { getTraditions } from "../seeds/rpgSeeds/traditionSeed.js";
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
import { getMentors } from "../seeds/rpgSeeds/mentorSeed.js";
import {
  MentorSpirits,
  Paragons,
} from "../models/rpg/otherData/mentorModel.js";
import { QualityBonuses } from "../models/rpg/otherData/bonusModel.js";
import { getMartialArts } from "../seeds/rpgSeeds/martialArtSeed.js";
import { getMartialArtTechniques } from "../seeds/rpgSeeds/martialArtTechniqueSeed.js";
import { MartialArts } from "../models/rpg/abilities/martialArtModel.js";
import { MartialArtTechniques } from "../models/rpg/abilities/martialArtTechniqueModel.js";
import { getLifestyles } from "../seeds/rpgSeeds/lifestyleSeed.js";
import { getLifestyleQualities } from "../seeds/rpgSeeds/lifestyleQualitySeed.js";
import { Lifestyles } from "../models/rpg/otherData/lifestyleModel.js";
import { LifestyleQualities } from "../models/rpg/otherData/lifestyleQualityModel.js";
import { getEquipmentPacks } from "../seeds/rpgSeeds/equipmentPackSeed.js";
import { EquipmentPacks } from "../models/rpg/equipment/equipmentPackModel.js";
import { PackArmours } from "../models/rpg/activeTables/activeArmourModel.js";
import { PackVehicles } from "../models/rpg/activeTables/activeVehicleModel.js";
import {
  WeaponMountWeapons,
  PackWeapons,
} from "../models/rpg/activeTables/activeWeaponModel.js";
import { PackLifestyles } from "../models/rpg/activeTables/activeLIfestyleModel.js";
import { WeaponMountModifications } from "../models/rpg/equipment/rigger/weaponMountModModel.js";

export class SourcebookSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const { stagedSkills, stagedSkillGroups } = getSkills();
    const { unlinkedQualities, stagedQualities } = getQualities();
    const { unlinkedHeritages, stagedHeritages } = getHeritages();
    const { unlinkedPriorities, stagedPriorities } = getPriorities();
    const stagedWeaponRanges: Array<WeaponRanges> = getRanges();
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
    const stagedDrugs = getDrugs();
    const stagedDrugComponents = getDrugComponents();
    const { unlinkedVehicles, stagedVehicles } = getVehicles();
    const stagedVehicleWeaponMounts = createVehicleWeaponMounts();
    const stagedVehicleModifications = getVehicleModifications();
    const stagedVehicleWeaponMountModifications = getWeaponMountModifications();
    const { unlinkedGears, stagedGears } = getGears();
    const stagedSpells: Array<Spells> = getSpells();
    const stagedPrograms = getPrograms();
    const { unlinkedAdeptPowers, stagedAdeptPowers } = getAdeptPowers();
    const stagedComplexForms = getComplexForms();
    const { unlinkedCritters, stagedCritters } = getCritters();
    const stagedCritterPowers = getCritterPowers();
    const stagedTraditions = getTraditions(stagedCritters);
    const stagedMentors = getMentors();
    const { unlinkedMartialArts, stagedMartialArts } = getMartialArts();
    const stagedMartialArtTechniques = getMartialArtTechniques();
    const stagedLifestyles = getLifestyles();
    const { unlinkedLifestyleQualities, stagedLifestyleQualities } =
      getLifestyleQualities();
    const { unlinkedEquipmentPacks, stagedEquipmentPacks } =
      getEquipmentPacks();

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
        assert(false, `Unhandled weapon type: ${weapon.type}`);
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
        assert(false, `Unhandled augmentation type: ${augmentation.type}`);
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
        assert(false, `Unhandled vehicle type: ${vehicle.type}`);
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
          `Unhandled vehicle Modification type: ${vehicleMod.type}`
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

    await em.flush();

    // -----------------------------------------------------------------
    // Connect references that "may" need things in the database first
    // -----------------------------------------------------------------

    // Qualities that add weapons (e.g. Vampire Quality gives a bite attack)
    for (const quality of unlinkedQualities) {
      if (quality.addWeapons !== undefined) {
        assert(quality.addWeapons.length > 0, "Add weapon list is empty");
        const relatedQuality = await em.findOne(Qualities, {
          name: quality.name,
        });
        assert(
          relatedQuality !== null,
          `undefined Quality name: ${quality.name}`
        );
        for (const weapon of quality.addWeapons) {
          const linkedWeapon = await em.findOne(Weapons, {
            name: weapon,
          });
          assert(linkedWeapon !== null, `undefined Weapon name 1: ${weapon}`);
          const referencedWeapon = ref(linkedWeapon);
          relatedQuality.includedWeaponList.add(referencedWeapon);
        }
      }
    }
    // Qualities that share limits with other qualities
    for (const quality of unlinkedQualities) {
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
        for (const sharedLimitQuality of quality.sharedLimitQualityList) {
          const linkedQuality = await em.findOne(Qualities, {
            name: sharedLimitQuality,
          });
          assert(
            linkedQuality !== null,
            `undefined Shared Limit Quality: ${sharedLimitQuality}`
          );
          const referencedQuality = ref(linkedQuality);
          relatedQuality.sharedLimitQualityList.add(referencedQuality);
        }
      }
    }
    // Quality Bonuses
    for (const quality of unlinkedQualities) {
      if (quality.bonus !== undefined) {
        const relatedQuality = await em.findOne(Qualities, {
          name: quality.name,
        });
        assert(
          relatedQuality !== null,
          `undefined Quality name: ${quality.name}`
        );
        const stagedBonus = new QualityBonuses(
          ref(relatedQuality),
          quality.bonus
        );
        em.create(QualityBonuses, stagedBonus);
      }
    }
    console.log("Quality relationships linked");

    // Heritage metavariants
    for (const heritage of unlinkedHeritages) {
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
          !(relatedHeritage instanceof Metavariants),
          `relatedHeritage should not be a metavariant ${relatedHeritage.name}`
        );
        heritage.metavariantList.forEach((metavariant) => {
          const loadedMetavariant = unlinkedHeritages.find((heritageLocal) => {
            return (
              metavariant === heritageLocal.name &&
              heritageLocal.category === heritageCategoryEnum.Metavariant &&
              heritageLocal.baseHeritage === heritage.name
            );
          });
          assert(
            loadedMetavariant !== undefined,
            `undefined metavariant name 1: ${metavariant}`
          );
          assert(
            loadedMetavariant.category === heritageCategoryEnum.Metavariant,
            `undefined metavariant category is wrong 1: ${loadedMetavariant.category}`
          );
          const stagedMetavariant = new Metavariants({
            baseHeritage: ref(relatedHeritage as BaseHeritages),
            heritage: loadedMetavariant,
          });
          em.create(Metavariants, stagedMetavariant);
        });
      }
    }
    // Need to flush here to ensure all metavariants are handled by following loops
    await em.flush();
    // Heritages that have natural weapons
    for (const heritage of unlinkedHeritages) {
      if (heritage.addWeaponList !== undefined) {
        assert(heritage.addWeaponList.length > 0, "Add weapon list is empty");
        const relatedHeritage = await em.findOne(Heritages, {
          name: heritage.name,
        });
        assert(
          relatedHeritage !== null,
          `undefined Heritage name 2: ${heritage.name}`
        );
        for (const weapon of heritage.addWeaponList) {
          const linkedWeapon = await em.findOne(Weapons, {
            name: weapon,
          });
          assert(linkedWeapon !== null, `undefined Weapon name 2: ${weapon}`);
          const referencedWeapon = ref(linkedWeapon);
          relatedHeritage.includedWeaponList.add(referencedWeapon);
        }
      }
    }
    // Heritages that give qualities
    for (const heritage of unlinkedHeritages) {
      if (heritage.addQualityList !== undefined) {
        assert(heritage.addQualityList.length > 0, "Add quality list is empty");
        const relatedHeritage = await em.findOne(Heritages, {
          name: heritage.name,
        });
        assert(
          relatedHeritage !== null,
          `undefined Heritage name 3: ${heritage.name}`
        );
        for (const quality of heritage.addQualityList) {
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
        }
      }
    }
    // Heritages that forbid qualities
    for (const heritage of unlinkedHeritages) {
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
        for (const quality of heritage.forbiddenQualityList) {
          const linkedQuality = await em.findOne(Qualities, {
            name: quality,
          });
          assert(linkedQuality !== null, `undefined Quality (2): ${quality}`);
          const referencedQuality = ref(linkedQuality);
          relatedHeritage.forbiddenQualityList.add(referencedQuality);
        }
      }
    }
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
    for (const weaponAccessory of unlinkedWeaponAccessories) {
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
    }
    // Weapon Accessories that allow certain gear to be added
    for (const weaponAccessory of unlinkedWeaponAccessories) {
      if (weaponAccessory.allowedGearList !== undefined) {
        const relatedWeaponAccessory = await em.findOne(WeaponAccessories, {
          name: weaponAccessory.name,
        });
        assert(
          relatedWeaponAccessory !== null,
          `undefined Weapon Accessory name: ${weaponAccessory.name}`
        );

        for (const gear of weaponAccessory.allowedGearList) {
          const allowedGear = await em.findOne(Gears, {
            name: gear,
          });
          assert(allowedGear !== null, `undefined Allowed Gear (1): ${gear}`);
          const referencedGear = ref(allowedGear);
          relatedWeaponAccessory.allowedGearList.add(referencedGear);
        }
      }
    }
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
        weapon.type === weaponTypeEnum.Firearm &&
        weapon.firearmOptions.underbarrelWeapons !== undefined
      ) {
        const relatedWeapon = await em.findOne(FirearmWeapons, {
          name: weapon.name,
        });
        assert(
          relatedWeapon !== null,
          `undefined Weapon name 7: ${weapon.name}`
        );
        for (const underbarrelWeaponName of weapon.firearmOptions
          .underbarrelWeapons) {
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
    for (const armour of unlinkedArmours) {
      if (armour.isWeapon !== undefined) {
        const relatedArmour = await em.findOne(Armours, {
          name: armour.name,
        });
        assert(relatedArmour !== null, `undefined Armour name: ${armour.name}`);
        const linkedWeapon = await em.findOne(Weapons, {
          name: armour.name,
        });
        assert(
          linkedWeapon !== null,
          `undefined Linked Weapon: ${armour.name}`
        );
        relatedArmour.linkedWeapon = ref(linkedWeapon);
      }
    }
    // Armours that include certain gear
    for (const armour of unlinkedArmours) {
      if (armour.includedGearList !== undefined) {
        const relatedArmour = await em.findOne(Armours, {
          name: armour.name,
        });
        assert(relatedArmour !== null, `undefined Armour name: ${armour.name}`);
        const referencedArmour = ref(relatedArmour);
        for (const gear of armour.includedGearList) {
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
        }
      }
    }
    // Armours that include certain mods
    for (const armour of unlinkedArmours) {
      if (armour.includedModList !== undefined) {
        const relatedArmour = await em.findOne(Armours, {
          name: armour.name,
        });
        assert(relatedArmour !== null, `undefined Armour name: ${armour.name}`);
        const referencedArmour = ref(relatedArmour);
        for (const mod of armour.includedModList) {
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
        }
      }
    }
    console.log("Armour relationships associated");

    // Armour Modifications that include certain gear
    for (const armourMod of unlinkedArmourMods) {
      if (armourMod.includedGearList !== undefined) {
        const relatedArmourMod = await em.findOne(ArmourModifications, {
          name: armourMod.name,
        });
        assert(
          relatedArmourMod !== null,
          `undefined Armour Mod name: ${armourMod.name}`
        );
        const referencedArmourMod = ref(relatedArmourMod);
        for (const gear of armourMod.includedGearList) {
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
        }
      }
    }
    console.log("Armour Modification relationships associated");

    // Augmentations that add weapons
    for (const augmentation of unlinkedAugmentations) {
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
    }
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
    for (const augmentation of unlinkedAugmentations) {
      if (augmentation.allowedGearList !== undefined) {
        const relatedAugmentation = await em.findOne(Augmentations, {
          name: augmentation.name,
        });
        assert(
          relatedAugmentation !== null,
          `undefined Augmentation name: ${augmentation.name}`
        );

        for (const gear of augmentation.allowedGearList) {
          // TODO: add 2050 stuff
          if (gear.includes("2050")) {
            continue;
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
        }
      }
    }
    // Augmentations that include certain gear
    for (const augmentation of unlinkedAugmentations) {
      if (augmentation.includedGearList !== undefined) {
        const relatedAugmentation = await em.findOne(Augmentations, {
          name: augmentation.name,
        });
        assert(
          relatedAugmentation !== null,
          `undefined Augmentation name: ${augmentation.name}`
        );
        const referencedAugmentation = ref(relatedAugmentation);
        for (const gear of augmentation.includedGearList) {
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
        }
      }
    }
    // Augmentations that provide a wireless bonus when linked to another augmentation
    for (const augmentation of unlinkedAugmentations) {
      if (augmentation.type === augmentationTypeEnum.Cyberware) {
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
          relatedAugmentation.wirelessPairLinkedCyberware = linkedAugmentation;
        }
      }
    }
    // Augmentations that are a vehicle
    for (const augmentation of unlinkedAugmentations) {
      if (augmentation.type === augmentationTypeEnum.Cyberware) {
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
    }
    console.log("Augmentation relationships associated");

    // Vehicles that include certain gear
    for (const vehicle of unlinkedVehicles) {
      if (vehicle.includedGearList !== undefined) {
        const relatedVehicle = await em.findOne(Vehicles, {
          name: vehicle.name,
        });
        assert(
          relatedVehicle !== null,
          `undefined Vehicle name: ${vehicle.name}`
        );
        const referencedVehicle = ref(relatedVehicle);
        for (const gear of vehicle.includedGearList) {
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
        }
      }
    }
    // Vehicles that include certain mods
    for (const vehicle of unlinkedVehicles) {
      if (vehicle.includedModList !== undefined) {
        const relatedVehicle = await em.findOne(Vehicles, {
          name: vehicle.name,
        });
        assert(
          relatedVehicle !== null,
          `undefined Vehicle name: ${vehicle.name}`
        );
        const referencedVehicle = ref(relatedVehicle);
        for (const mod of vehicle.includedModList) {
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
          if (mod.subsystemList !== undefined && mod.subsystemList.length > 0) {
            for (const subsystem of mod.subsystemList) {
              const includedCyberware = await em.findOne(Cyberwares, {
                name: subsystem,
              });
              assert(
                includedCyberware !== null,
                `undefined Mod Subsystem: ${subsystem}`
              );
              stagedIncludedGear.actsAsCyberarm = true;
              stagedIncludedGear.associatedCyberwareList.add(includedCyberware);
            }
          }
          // this creates the link to armour
          em.create(IncludedVehicleModifications, stagedIncludedGear);
        }
      }
    }
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
            stagedMountedWeapon !== undefined,
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
    for (const critter of unlinkedCritters) {
      if (critter.includedPowerList !== undefined) {
        assert(
          critter.includedPowerList.length > 0,
          "Critter Power list is empty"
        );
        const relatedCritter = await em.findOne(Critters, {
          name: critter.name,
        });
        assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

        for (const critterPower of critter.includedPowerList) {
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
        }
      }
    }
    // Critters that have a list optional powers
    for (const critter of unlinkedCritters) {
      if (critter.optionalPowerList !== undefined) {
        assert(
          critter.optionalPowerList.length > 0,
          "Critter Optional Power list is empty"
        );
        const relatedCritter = await em.findOne(Critters, {
          name: critter.name,
        });
        assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

        for (const critterPower of critter.optionalPowerList) {
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
        }
      }
    }
    // Critters that have included qualities
    for (const critter of unlinkedCritters) {
      if (critter.addQualityList !== undefined) {
        assert(
          critter.addQualityList.length > 0,
          "Critter Quality list is empty"
        );
        const relatedCritter = await em.findOne(Critters, {
          name: critter.name,
        });
        assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

        for (const critterQuality of critter.addQualityList) {
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
        }
      }
    }
    // Critters that have included Bioware
    for (const critter of unlinkedCritters) {
      if (critter.addBiowareList !== undefined) {
        assert(
          critter.addBiowareList.length > 0,
          "Critter Bioware list is empty"
        );
        const relatedCritter = await em.findOne(Critters, {
          name: critter.name,
        });
        assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);

        for (const critterBioware of critter.addBiowareList) {
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
        }
      }
    }
    // Critters that have included complex forms
    for (const critter of unlinkedCritters) {
      if (critter.addComplexFormList !== undefined) {
        assert(
          critter.addComplexFormList.length > 0,
          "Critter Complex form list is empty"
        );
        const relatedCritter = await em.findOne(Critters, {
          name: critter.name,
        });
        assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);
        for (const critterComplexForm of critter.addComplexFormList) {
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
        }
      }
    }
    // Critters that have included Skills
    for (const critter of unlinkedCritters) {
      if (critter.skills.skillList !== undefined) {
        assert(
          critter.skills.skillList.length > 0,
          "Critter skill list is empty"
        );
        const relatedCritter = await em.findOne(Critters, {
          name: critter.name,
        });
        assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);
        for (const critterSkill of critter.skills.skillList) {
          const linkedSkill = await em.findOne(Skills, {
            name: critterSkill.name,
          });
          assert(linkedSkill !== null, `undefined Skill: ${critterSkill.name}`);
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
        }
      }
    }
    // Critters that have included Skill Groups
    for (const critter of unlinkedCritters) {
      if (critter.skills.skillGroupList !== undefined) {
        assert(
          critter.skills.skillGroupList.length > 0,
          "Critter skill group list is empty"
        );
        const relatedCritter = await em.findOne(Critters, {
          name: critter.name,
        });
        assert(relatedCritter !== null, `undefined Critter: ${critter.name}`);
        for (const critterSkillGroup of critter.skills.skillGroupList) {
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
        }
      }
    }
    // Critters that have included Knowledge Skills
    for (const critter of unlinkedCritters) {
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
        for (const critterKnowledgeSkill of critter.skills.knowledgeSkillList) {
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
      }
    }
    console.log("Critters relationships associated");

    // Martial Art linked techniques
    for (const martialArt of unlinkedMartialArts) {
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

        for (const technique of martialArt.techniqueList) {
          const relatedTechnique = await em.findOne(MartialArtTechniques, {
            name: technique,
          });
          assert(
            relatedTechnique !== null,
            `undefined Technique: ${technique}`
          );

          const referencedTechnique = ref(relatedTechnique);
          relatedMartialArt.techniqueList.add(referencedTechnique);
        }
      }
    }
    console.log("Martial Art relationships associated");

    // Lifestyle Qualities linked Lifestyle
    for (const lifestyleQuality of unlinkedLifestyleQualities) {
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

        for (const lifestyle of lifestyleQuality.requiredLifestyleList) {
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
        }
      }
    }
    console.log("Lifestyle Quality relationships associated");

    // Equipment Packs that have Armour
    for (const equipmentPack of unlinkedEquipmentPacks) {
      if (equipmentPack.armourList !== undefined) {
        const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
          name: equipmentPack.name,
        });
        assert(
          relatedEquipmentPack !== null,
          `undefined Equipment Pack: ${equipmentPack.name}`
        );

        for (const armour of equipmentPack.armourList) {
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
            for (const gear of armour.gearList) {
              const relatedGear = await em.findOne(Gears, {
                name: gear.baseGear,
              });
              assert(
                relatedGear !== null,
                `undefined armour gear: ${gear.baseGear} for Equipment Pack: ${equipmentPack.name}`
              );
              const referencedGear = ref(relatedGear);
              const activeArmourIncludedGear = new ActiveArmourIncludedGears(
                ref(activeArmour),
                referencedGear,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.currentQuantity
              );
              em.create(ActiveArmourIncludedGears, activeArmourIncludedGear);
            }
          }

          if (armour.modList !== undefined) {
            assert(
              armour.modList.length > 0,
              "Equipment Pack armour mod list is empty"
            );
            for (const mod of armour.modList) {
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
            }
          }
        }
      }
    }
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
          //   augmentation.type === augmentationTypeEnum.Bioware &&
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
    // Equipment Packs that have Weapons
    for (const equipmentPack of unlinkedEquipmentPacks) {
      if (equipmentPack.weaponList !== undefined) {
        const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
          name: equipmentPack.name,
        });
        assert(
          relatedEquipmentPack !== null,
          `undefined Equipment Pack: ${equipmentPack.name}`
        );

        for (const weapon of equipmentPack.weaponList) {
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
            for (const accessory of weapon.accessoryList) {
              const relatedAccessory = await em.findOne(WeaponAccessories, {
                name: accessory.baseAccessory,
              });
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
            }
          }
        }
      }
    }
    // Equipment Packs that have a Lifestyle
    for (const equipmentPack of unlinkedEquipmentPacks) {
      if (equipmentPack.lifestyleList !== undefined) {
        const relatedEquipmentPack = await em.findOne(EquipmentPacks, {
          name: equipmentPack.name,
        });
        assert(
          relatedEquipmentPack !== null,
          `undefined Equipment Pack: ${equipmentPack.name}`
        );
        for (const lifestyle of equipmentPack.lifestyleList) {
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
        }
      }
    }
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
            for (const skill of talent.includedSkills.skillList) {
              const linkedSkill = await em.findOne(Skills, {
                name: skill,
              });
              assert(linkedSkill !== null, `undefined Skill: ${skill}`);
              includedSkills.skillList.add(linkedSkill);
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
        const heritagePriority = new HeritagePriorityDetails({
          heritagePriority: referencedPriority,
          heritage: referencedHeritage,
          specialAttributePoints: heritage.specialAttributePoints,
          karmaCost: heritage.karmaCost,
        });
        em.create(HeritagePriorityDetails, heritagePriority);

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
            const referenceCorePriorityHeritage = ref(heritagePriority);
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
  }
}
