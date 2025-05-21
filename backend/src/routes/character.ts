import { z as zod } from "zod";
import * as logger from "../utils/logger.js";
import { router, privateProcedure } from "../trpc.js";
import { Skills } from "@neon-codex/database/build/models/rpg/abilities/skillModel.js";
import { SkillGroups } from "@neon-codex/database/build/models/rpg/abilities/skillGroupModel.js";
import { init } from "../utils/db.js";
import { ref } from "@mikro-orm/postgresql";
import {
  CustomSkillListSchema,
  type CustomSkillType,
  type SkillListType,
  CustomSkillGroupListSchema,
} from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type {
  CustomisedVehicleListType,
  VehicleListType,
  VehicleType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";
import {
  weaponTypeEnum,
  augmentationTypeEnum,
  vehicleTypeEnum,
  priorityLetterEnum,
  talentCategoryEnum,
  heritageCategoryEnum,
  mentorCategoryEnum,
  augmentationGradeEnum,
} from "@neon-codex/common/build/enums.js";
import type {
  AugmentationListType,
  AugmentationType,
  CustomisedAugmentationListType,
  CustomisedAugmentationType,
} from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type {
  CustomisedGearType,
  GearListType,
  GearType,
} from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type {
  CustomisedWeaponType,
  WeaponListType,
  WeaponType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import {
  SelectedEquipmentListSchema,
  type EquipmentListType,
} from "@neon-codex/common/build/schemas/equipment/other/equipmentSchemas.js";
import {
  Augmentations,
  Cyberwares,
  Biowares,
} from "@neon-codex/database/build/models/rpg/equipment/bodyModification/augmentationModel.js";
import {
  Weapons,
  MeleeWeapons,
  RangedWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "@neon-codex/database/build/models/rpg/equipment/combat/weaponModel.js";
import {
  Vehicles,
  MannedVehicles,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
} from "@neon-codex/database/build/models/rpg/equipment/rigger/vehicleModel.js";
import { Gears } from "@neon-codex/database/build/models/rpg/equipment/other/gearModel.js";
import type {
  ArmourListType,
  ArmourType,
  CustomisedArmourListType,
  CustomisedArmourType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import type { CustomisedVehicleType } from "@neon-codex/common/build/schemas/equipment/rigger/vehicleSchemas.js";
import {
  AttributesSchema,
  SpecialAttributesSchema,
  HeritagePrioritySelectedSchema,
  PriorityLevelsSchema,
  QualitySelectedListSchema,
  type CharacterType,
  type CharacterSummaryListType,
  type CharacterSummaryType,
  TalentInfoSchema,
  type CustomSpiritsType,
  type FormulaListSelectedType,
  type AdeptPowerListSelectedType,
  type ProgramSelectedListType,
  MartialArtSelectedSchema,
  type MartialArtSelectedType,
  type LifestyleSelectedType,
  LifestyleSelectedListSchema,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { Armours } from "@neon-codex/database/build/models/rpg/equipment/combat/armourModel.js";
import { Characters } from "@neon-codex/database/build/models/rpg/characters/characterModel.js";
import {
  type CustomQualityType,
  type QualityListType,
  type QualityType,
} from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";
import { Qualities } from "@neon-codex/database/build/models/rpg/traits/qualityModel.js";
import {
  BaseHeritages,
  Heritages,
  Metahumans,
  Metasapients,
  Metavariants,
  Shapeshifters,
} from "@neon-codex/database/build/models/rpg/traits/heritageModel.js";
import { Priorities } from "@neon-codex/database/build/models/rpg/otherData/priorityModel.js";
import type {
  PriorityRowType,
  PriorityTableType,
} from "@neon-codex/common/build/schemas/otherData/prioritySchemas.js";
import type { Loaded } from "@mikro-orm/postgresql";
import {
  MagicTalentPriorityDetails,
  ResonanceTalentPriorityDetails,
  DepthTalentPriorityDetails,
  MundaneTalentPriorityDetails,
} from "@neon-codex/database/build/models/rpg/otherData/talentPriorityDetailModel.js";
import type {
  HeritageListType,
  HeritageType,
} from "@neon-codex/common/build/schemas/abilities/heritageSchemas.js";
import {
  ActiveQualities,
  CustomisedQualities,
} from "@neon-codex/database/build/models/rpg/activeTables/activeQualityModel.js";
import { CustomisedSkills } from "@neon-codex/database/build/models/rpg/activeTables/activeSkillModel.js";
import {
  ActiveWeapons,
  CustomisedWeapons,
  WeaponMountWeapons,
} from "@neon-codex/database/build/models/rpg/activeTables/activeWeaponModel.js";
import {
  ActiveArmours,
  CustomisedArmours,
} from "@neon-codex/database/build/models/rpg/activeTables/activeArmourModel.js";
import { WeaponAccessories } from "@neon-codex/database/build/models/rpg/equipment/combat/weaponAccessoryModel.js";
import {
  ActiveAugmentationGears,
  ActiveGears,
  ChildGears,
  CustomisedGears,
} from "@neon-codex/database/build/models/rpg/activeTables/activeGearModel.js";
import {
  CustomisedWeaponAccessories,
  type ActiveWeaponAccessories,
} from "@neon-codex/database/build/models/rpg/activeTables/activeWeaponAccessoryModel.js";
import {
  ActiveArmourModifications,
  CustomisedArmourModifications,
} from "@neon-codex/database/build/models/rpg/activeTables/activeArmourModificationModel.js";
import { ArmourModifications } from "@neon-codex/database/build/models/rpg/equipment/combat/armourModificationModel.js";
import { CustomisedAugmentations } from "@neon-codex/database/build/models/rpg/activeTables/activeAugmentationModel.js";
import { VehicleModifications } from "@neon-codex/database/build/models/rpg/equipment/rigger/vehicleModificationModel.js";
import {
  ActiveVehicleModifications,
  CustomisedVehicleModifications,
} from "@neon-codex/database/build/models/rpg/activeTables/activeVehicleModificationModel.js";
import {
  ActiveVehicles,
  CustomisedVehicles,
} from "@neon-codex/database/build/models/rpg/activeTables/activeVehicleModel.js";
import { CustomisedSkillGroups } from "@neon-codex/database/build/models/rpg/activeTables/activeSkillGroupModel.js";
import Users from "@neon-codex/database/build/models/accounts/userModel.js";
import type { SpellListType } from "@neon-codex/common/build/schemas/abilities/talent/spellSchemas.js";
import { Spells } from "@neon-codex/database/build/models/rpg/abilities/spellModel.js";
import type { ComplexFormListType } from "@neon-codex/common/build/schemas/abilities/talent/complexFormSchemas.js";
import { ComplexForms } from "@neon-codex/database/build/models/rpg/abilities/complexFormModel.js";
import type { AdeptPowerListType } from "@neon-codex/common/build/schemas/abilities/talent/adeptPowerSchemas.js";
import { AdeptPowers } from "@neon-codex/database/build/models/rpg/abilities/adeptPowerModel.js";
import type { ProgramListType } from "@neon-codex/common/build/schemas/abilities/talent/programSchemas.js";
import { Programs } from "@neon-codex/database/build/models/rpg/abilities/programModel.js";
import type { TraditionListType } from "@neon-codex/common/build/schemas/abilities/talent/traditionSchemas.js";
import {
  AllSpiritsTraditions,
  LinkedSpiritsTraditions,
  Traditions,
  UnlinkedSpiritsTraditions,
} from "@neon-codex/database/build/models/rpg/traits/traditionModel.js";
import type { CritterListType } from "@neon-codex/common/build/schemas/creatures/critterSchemas.js";
import { Critters } from "@neon-codex/database/build/models/rpg/creatures/critterModel.js";
import { ActivePrograms } from "@neon-codex/database/build/models/rpg/activeTables/activeProgramModel.js";
import {
  ActiveDepthTalents,
  ActiveMagicTalents,
  ActiveResonanceTalents,
  ActiveTalents,
} from "@neon-codex/database/build/models/rpg/activeTables/activeTalentModel.js";
import assert from "assert";
import type { Bonuses } from "@neon-codex/database/build/models/rpg/otherData/bonusModel.js";
import type { BonusType } from "@neon-codex/common/build/schemas/shared/bonusSchemas.js";
import type {
  MentorBaseType,
  MentorListType,
} from "@neon-codex/common/build/schemas/abilities/talent/mentorSchemas.js";
import { CharacterCreatorBonusListSchema } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import {
  Mentors,
  MentorSpirits,
  Paragons,
} from "@neon-codex/database/build/models/rpg/otherData/mentorModel.js";
import { ActiveMentorSpirits } from "@neon-codex/database/build/models/rpg/activeTables/activeMentorModel.js";
import { ActiveParagons } from "@neon-codex/database/build/models/rpg/activeTables/activeParagonModel.js";
import type {
  MartialArtListType,
  MartialArtTechniqueListType,
} from "@neon-codex/common/build/schemas/abilities/martialArtSchemas.js";
import { MartialArts } from "@neon-codex/database/build/models/rpg/abilities/martialArtModel.js";
import { MartialArtTechniques } from "@neon-codex/database/build/models/rpg/abilities/martialArtTechniqueModel.js";
import { ActiveMartialArts } from "@neon-codex/database/build/models/rpg/activeTables/activeMartialArtModel.js";
import type {
  LifestyleListType,
  LifestyleQualityListType,
} from "@neon-codex/common/build/schemas/otherData/lifestyleSchemas.js";
import { Lifestyles } from "@neon-codex/database/build/models/rpg/otherData/lifestyleModel.js";
import { LifestyleQualities } from "@neon-codex/database/build/models/rpg/otherData/lifestyleQualityModel.js";
import {
  ActiveLifestyles,
  CustomisedLifestyles,
} from "@neon-codex/database/build/models/rpg/activeTables/activeLIfestyleModel.js";
import type { EquipmentPackListType } from "@neon-codex/common/build/schemas/equipment/equipmentPackSchemas.js";
import { EquipmentPacks } from "@neon-codex/database/build/models/rpg/equipment/equipmentPackModel.js";
import type {
  CustomisedWeaponAccessoryType,
  WeaponAccessoryListType,
  WeaponAccessoryType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponAccessorySchemas.js";
import type {
  ArmourModListType,
  ArmourModType,
  CustomisedArmourModType,
} from "@neon-codex/common/build/schemas/equipment/combat/armourModSchemas.js";
import type {
  CustomisedVehicleModType,
  VehicleModListType,
  VehicleModType,
} from "@neon-codex/common/build/schemas/equipment/rigger/vehicleModSchemas.js";
import {
  CustomisedWeaponMounts,
  IncludedWeaponMounts,
  PackVehicleWeaponMounts,
  type ActiveWeaponMounts,
} from "@neon-codex/database/build/models/rpg/activeTables/activeWeaponMountModel.js";
import type { CustomisedWeaponMountType } from "@neon-codex/common/build/schemas/equipment/rigger/weaponMountSchemas.js";
import { WeaponMounts } from "@neon-codex/database/build/models/rpg/equipment/rigger/weaponMountModel.js";
import { createGunzip } from "zlib";
import { access } from "fs";

export function convertDBBonus(DBbonus: Bonuses) {
  const bonus: BonusType = {};
  if (DBbonus.linkMentorSpirit !== undefined) {
    bonus.linkMentorSpirit = true;
  }
  if (DBbonus.linkParagon !== undefined) {
    bonus.linkParagon = true;
  }
  return bonus;
}

export async function getSkills() {
  const db = await init();
  const skills = await db.em.findAll(Skills, {
    populate: ["*"],
  });
  const skillsResponse: SkillListType = skills.map((skill) => {
    const skillGroup =
      skill.skillGroup === undefined ? undefined : skill.skillGroup.$.name;
    return {
      name: skill.name,
      isKnowledgeSkill: skill.isKnowledgeSkill,
      description: skill.description,
      category: skill.category,
      attribute: skill.attribute,
      default: skill.default,
      exotic: skill.exotic,
      skillGroup: skillGroup,
      specialisations: skill.defaultSpecialisations,
      source: skill.source,
      page: skill.page,
    };
  });
  return skillsResponse;
}

export async function getTraditions() {
  const db = await init();
  const traditions = await db.em.findAll(Traditions, {
    populate: ["*"],
  });
  const traditionsResponse: TraditionListType = await Promise.all(
    traditions.map(async (tradition) => {
      let spiritTypes;
      if (tradition instanceof UnlinkedSpiritsTraditions) {
        spiritTypes = "Select Spirits" as const;
      } else if (tradition instanceof AllSpiritsTraditions) {
        spiritTypes = "All" as const;
      } else if (tradition instanceof LinkedSpiritsTraditions) {
        const combat = await tradition.combat.load();
        if (combat === null) {
          throw new Error("Combat spirit does not exist");
        }
        const detection = await tradition.detection.load();
        if (detection === null) {
          throw new Error("Detection spirit does not exist");
        }
        const health = await tradition.health.load();
        if (health === null) {
          throw new Error("Health spirit does not exist");
        }
        const illusion = await tradition.illusion.load();
        if (illusion === null) {
          throw new Error("Illusion spirit does not exist");
        }
        const manipulation = await tradition.manipulation.load();
        if (manipulation === null) {
          throw new Error("Manipulation spirit does not exist");
        }
        spiritTypes = {
          spiritCombat: combat.name,
          spiritDetection: detection.name,
          spiritHealth: health.name,
          spiritIllusion: illusion.name,
          spiritManipulation: manipulation.name,
        };
      } else {
        throw new Error(
          `Unknown Tradition type: ${tradition.name}, class ${tradition.constructor.name}`
        );
      }
      return {
        name: tradition.name,
        drain: tradition.drain,
        spiritForm: tradition.spiritForm,
        spiritTypes: spiritTypes,
        bonus: tradition.bonus,
        requirements: tradition.requirements,
        source: tradition.source,
        page: tradition.page,
        description: tradition.description,
      };
    })
  );
  return traditionsResponse;
}

export async function getMentors() {
  const db = await init();
  const mentors = await db.em.findAll(Mentors, {
    populate: ["*"],
  });
  const mentorsResponse: MentorListType = mentors.map((mentor) => {
    const baseMentor: MentorBaseType = {
      name: mentor.name,
      description: mentor.description,
      advantage: mentor.advantage,
      disadvantage: mentor.disadvantage,
      bonus: mentor.bonus,
      source: mentor.source,
      page: mentor.page,
    };
    if (mentor instanceof MentorSpirits) {
      return {
        ...baseMentor,
        category: mentorCategoryEnum.MentorSpirit,
        choices: mentor.choices,
        choiceCount: mentor.choiceCount,
        required: mentor.required,
      };
    } else if (mentor instanceof Paragons) {
      return {
        ...baseMentor,
        category: mentorCategoryEnum.Paragon,
      };
    } else {
      throw new Error(`Mentor: ${mentor.name} has unknown class`);
    }
  });
  return mentorsResponse;
}

export async function getCritters() {
  const db = await init();
  const critters = await db.em.findAll(Critters, {
    populate: ["*"],
  });
  const crittersResponse: CritterListType = await Promise.all(
    critters.map(async (critter) => {
      return {
        name: critter.name,
        category: critter.type,
        bodyAttributeRange: critter.bodyAttributeRange,
        agilityAttributeRange: critter.agilityAttributeRange,
        reactionAttributeRange: critter.reactionAttributeRange,
        strengthAttributeRange: critter.strengthAttributeRange,
        charismaAttributeRange: critter.charismaAttributeRange,
        intuitionAttributeRange: critter.intuitionAttributeRange,
        logicAttributeRange: critter.logicAttributeRange,
        willpowerAttributeRange: critter.willpowerAttributeRange,
        initiativeAttributeRange: critter.initiativeAttributeRange,
        edgeAttributeRange: critter.edgeAttributeRange,
        magicAttributeRange: critter.magicAttributeRange,
        resonanceAttributeRange: critter.resonanceAttributeRange,
        essenceAttributeRange: critter.essenceAttributeRange,
        depthAttributeRange: critter.depthAttributeRange,
        nonStandardMovement: critter.nonStandardMovement,
        movement: critter.movement,
        includedPowerList: await Promise.all(
          critter.includedPowerList.map(async (power) => {
            const powerLoaded = await power.critterPower.load();
            if (powerLoaded === null) {
              throw new Error("Power does not exist");
            }

            return {
              name: powerLoaded.name,
              rating: power.rating,
            };
          })
        ),
        optionalPowerList: await Promise.all(
          critter.optionalPowerList.map(async (power) => {
            const powerLoaded = await power.critterPower.load();
            if (powerLoaded === null) {
              throw new Error("Power does not exist");
            }

            return {
              name: powerLoaded.name,
              rating: power.rating,
            };
          })
        ),
        addQualityList: await Promise.all(
          critter.includedQualityList.map(async (quality) => {
            const qualityLoaded = await quality.quality.load();
            if (qualityLoaded === null) {
              throw new Error("Included Quality does not exist");
            }

            return {
              name: qualityLoaded.name,
              rating: quality.rating,
            };
          })
        ),
        addBiowareList: await Promise.all(
          critter.includedBiowareList.map(async (bioware) => {
            const biowareLoaded = await bioware.augmentation.load();
            if (biowareLoaded === null) {
              throw new Error("Included Augmentation does not exist");
            }

            return {
              name: biowareLoaded.name,
              rating: bioware.rating,
            };
          })
        ),
        addComplexFormList: await Promise.all(
          critter.includedComplexFormList.map(async (complexForm) => {
            const complexFormLoaded = await complexForm.complexForm.load();
            if (complexFormLoaded === null) {
              throw new Error("Complex Form does not exist");
            }

            return {
              name: complexFormLoaded.name,
              select: complexForm.matrixAttribute,
            };
          })
        ),
        skills: {
          skillList: await Promise.all(
            critter.includedSkillList.map(async (skill) => {
              const skillLoaded = await skill.skill.load();
              if (skillLoaded === null) {
                throw new Error("Skill does not exist");
              }
              return {
                name: skillLoaded.name,
                specialised: skill.specialisationsSelected,
                rating: skill.critterSkillRating,
                // TODO: do something for select
                // select: skill.
              };
            })
          ),
          skillGroupList: await Promise.all(
            critter.includedSkillGroupList.map(async (skillGroup) => {
              const skillGroupLoaded = await skillGroup.skillGroup.load();
              if (skillGroupLoaded === null) {
                throw new Error("Skill Group does not exist");
              }
              return {
                name: skillGroupLoaded.name,
                rating: skillGroup.critterSkillGroupRating,
              };
            })
          ),
        },
        bonus: critter.bonus,
        source: critter.source,
        page: critter.page,
        description: critter.description,
      };
    })
  );
  return crittersResponse;
}

export async function getSpells() {
  const db = await init();
  const spells = await db.em.findAll(Spells, {
    populate: ["*"],
  });
  const spellsResponse: SpellListType = spells.map((spell) => {
    return {
      name: spell.name,
      category: spell.category,
      type: spell.type,
      damage: spell.damage,
      damageType: spell.damageType,
      descriptorList: spell.descriptorList,
      duration: spell.duration,
      range: spell.range,
      bonus: spell.bonus,
      requirements: spell.requirements,
      source: spell.source,
      page: spell.page,
      description: spell.description,
    };
  });
  return spellsResponse;
}

export async function getComplexForms() {
  const db = await init();
  const complexForms = await db.em.findAll(ComplexForms, {
    populate: ["*"],
  });
  const complexFormsResponse: ComplexFormListType = complexForms.map(
    (complexForm) => {
      return {
        name: complexForm.name,
        target: complexForm.target,
        duration: complexForm.duration,
        fadingValue: complexForm.fadingValue,
        bonus: complexForm.bonus,
        requirements: complexForm.requirements,
        source: complexForm.source,
        page: complexForm.page,
        description: complexForm.description,
      };
    }
  );
  return complexFormsResponse;
}

export async function getAdeptPowers() {
  const db = await init();
  const adeptPowers = await db.em.findAll(AdeptPowers, {
    populate: ["*"],
  });
  const adeptPowersResponse: AdeptPowerListType = adeptPowers.map(
    (adeptPower) => {
      return {
        name: adeptPower.name,
        description: adeptPower.description,
        pointCost: adeptPower.pointCost,
        extraFirstLevelPointCost: adeptPower.extraFirstLevelPointCost,
        levels: adeptPower.levels,
        limit: adeptPower.limit,
        sharedLimitAdeptPowerList: adeptPower.sharedLimitAdeptPowerList.map(
          (power) => {
            return power.name;
          }
        ),
        action: adeptPower.action,
        adeptWay:
          adeptPower.adeptWayPointCost !== undefined
            ? {
                pointCost: adeptPower.adeptWayPointCost,
                requirements: adeptPower.adeptWayRequirements,
              }
            : undefined,
        doubleCost: adeptPower.doubleCost,
        maxLevels: adeptPower.maxLevels,
        userSelectable: adeptPower.userSelectable,
        bonus: adeptPower.bonus,
        requirements: adeptPower.requirements,
        forbidden: adeptPower.forbidden,
        source: adeptPower.source,
        page: adeptPower.page,
      };
    }
  );
  return adeptPowersResponse;
}

export async function getPrograms() {
  const db = await init();
  const programs = await db.em.findAll(Programs, {
    populate: ["*"],
  });
  const programsResponse: ProgramListType = programs.map((program) => {
    return {
      name: program.name,
      description: program.description,
      category: program.category,
      rating: program.rating,
      availability: program.availability,
      cost: program.cost,
      bonus: program.bonus,
      requirements: program.requirements,
      source: program.source,
      page: program.page,
    };
  });
  return programsResponse;
}

async function getWeapons(): Promise<WeaponListType> {
  const db = await init();
  const weapons = await db.em.findAll(Weapons, {
    populate: ["*", "includedAccessoryList.weaponAccessory"],
  });
  const weaponsResponse = Promise.all(
    weapons.map(async (weapon) => {
      const skill = weapon.relatedSkill.$.name;
      const dbAccessories = weapon.includedAccessoryList;
      const includedAccessoryList = await Promise.all(
        dbAccessories.$.map(async (accessory) => {
          const originalAccessory = accessory.weaponAccessory.$.name;
          return {
            baseAccessory: originalAccessory,
            gearList: await Promise.all(
              accessory.includedGearList.$.map(async (gear) => {
                return await convertActiveGearDBToDTO(gear);
              })
            ),
            mountList: accessory.weaponMountsUsed,
            rating: accessory.rating,
          };
        })
      );
      const gearList = weapon.allowedGearList.$;
      const gearNameList = gearList.map((gear) => gear.name);
      const alternativeWeaponNameForms = weapon.alternativeWeaponForms.$.map(
        (weapon) => weapon.name
      );

      const weaponTypeInformation = await getWeaponTypeInformation(weapon);
      const weaponFormatted: WeaponType = {
        // id: weapon.id,
        name: weapon.name,
        description: weapon.description,
        ...weaponTypeInformation,
        concealability: weapon.concealability,
        accuracy: weapon.accuracy,
        damage: weapon.damage,
        armourPenetration: weapon.armourPenetration,
        ...(weapon.ammunition !== undefined &&
          weapon.ammunition.length > 0 && { ammunition: weapon.ammunition }),
        availability: weapon.availability,
        cost: weapon.cost,
        ...(gearList !== undefined &&
          gearList.length > 0 && {
            allowedGearList: gearNameList,
          }),
        ...(weapon.allowedGearCategories !== undefined && {
          allowedGearCategories: weapon.allowedGearCategories,
        }),
        ...(includedAccessoryList.length > 0 && {
          includedAccessoryList: includedAccessoryList,
        }),
        allowAccessories: weapon.allowAccessories,
        userSelectable: weapon.userSelectable,
        augmentationType: weapon.augmentationType,
        ...(weapon.hostWeaponMountsRequired && {
          hostWeaponRequirements: {
            weaponRequirements: weapon.requirements,
            hostWeaponMountsRequired: weapon.hostWeaponMountsRequired,
          },
        }),
        ...(alternativeWeaponNameForms.length > 0 && {
          alternativeWeaponForms: alternativeWeaponNameForms,
        }),
        relatedSkill: skill,
        ...(weapon.relatedSkillSpecialisations !== undefined &&
          weapon.relatedSkillSpecialisations.length > 0 && {
            relatedSkillSpecialisations: weapon.relatedSkillSpecialisations,
          }),
        ...(weapon.wireless !== undefined && { wireless: weapon.wireless }),
        source: weapon.source,
        page: weapon.page,
      };
      return weaponFormatted;
    })
  );
  return weaponsResponse;
}

async function getWeaponAccessories(): Promise<WeaponAccessoryListType> {
  const db = await init();
  const weaponAccessories = await db.em.findAll(WeaponAccessories, {
    populate: ["*"],
  });
  const weaponAccessoriesResponse = Promise.all(
    weaponAccessories.map(async (weaponAccessory) => {
      const gearList = await Promise.all(
        weaponAccessory.includedGearList.$.map(async (gear) => {
          return await convertActiveGearDBToDTO(gear);
        })
      );

      const weaponAccessoryFormatted: WeaponAccessoryType = {
        // id: weapon.id,
        name: weaponAccessory.name,
        description: weaponAccessory.description,
        wireless: weaponAccessory.wireless,
        maxRating: weaponAccessory.maxRating,
        isWeapon: weaponAccessory.linkedWeapon !== undefined,
        accuracyIncrease: weaponAccessory.accuracyIncrease,
        damageIncrease: weaponAccessory.damageIncrease,
        newDamageType: weaponAccessory.newDamageType,
        reachIncrease: weaponAccessory.reachIncrease,
        armourPiercingIncrease: weaponAccessory.armourPiercingIncrease,
        recoilCompensationIncrease: weaponAccessory.recoilCompensationIncrease,
        recoilCompensationType: weaponAccessory.recoilCompensationType,
        deploymentRequired: weaponAccessory.deploymentRequired,
        accessoryCostMultiplier: weaponAccessory.accessoryCostMultiplier,
        allowedGearList: weaponAccessory.allowedGearList.$.map((gear) => {
          return gear.name;
        }),
        allowedGearCategories: weaponAccessory.allowedGearCategories,
        includedGearList: gearList,
        specialModification: weaponAccessory.specialModification,
        extraAmmoSlots: weaponAccessory.extraAmmoSlots,
        ammoCapacityCalculation: weaponAccessory.ammoCapacityCalculation,
        newAmmoType: weaponAccessory.newAmmoType,
        hostWeaponMountsRequired: weaponAccessory.hostWeaponMountsRequired,
        hostWeaponRequirements: weaponAccessory.hostWeaponRequirements,
        hostWeaponRestrictions: weaponAccessory.hostWeaponRestrictions,
        rangePenaltyDecrease: weaponAccessory.rangePenaltyDecrease,
        concealabilityModification: weaponAccessory.concealabilityModification,
        userSelectable: weaponAccessory.userSelectable,
        availability: weaponAccessory.availability,
        cost: weaponAccessory.cost,
        source: weaponAccessory.source,
        page: weaponAccessory.page,
      };
      return weaponAccessoryFormatted;
    })
  );
  return weaponAccessoriesResponse;
}

async function getWeaponTypeInformation(weapon: Weapons) {
  if (weapon instanceof MeleeWeapons) {
    const meleeWeapon = weapon;
    const typeInformation = {
      type: weaponTypeEnum.Melee as const,
      subtype: meleeWeapon.subtype,
      meleeOptions: {
        reach: meleeWeapon.reach,
      },
    };
    return typeInformation;
  }
  if (weapon instanceof RangedWeapons) {
    const rangedWeapon = weapon;
    const rangeLinkList = await rangedWeapon.ranges.loadItems();
    const rangeList = rangeLinkList.map((rangeLink) => rangeLink.name);

    if (weapon instanceof ProjectileWeapons) {
      const projectileWeapon = weapon;
      const typeInformation = {
        type: weaponTypeEnum.Projectile as const,
        subtype: projectileWeapon.subtype,
        extraClassification: weapon.extraClassification,
        rangeList: rangeList,
      };
      return typeInformation;
    } else if (weapon instanceof FirearmWeapons) {
      const firearmWeapon = weapon;
      const underbarrelWeapons =
        await firearmWeapon.underbarrelWeapons.loadItems();
      const underbarrelWeaponNames = underbarrelWeapons.map((weapon) => {
        return weapon.name;
      });
      const typeInformation = {
        type: weaponTypeEnum.Firearm as const,
        subtype: firearmWeapon.subtype,
        extraClassification: weapon.extraClassification,
        firearmOptions: {
          mode: firearmWeapon.mode,
          recoilCompensation: firearmWeapon.recoilCompensation,
          ...(firearmWeapon.ammoCategory !== undefined && {
            ammoCategory: firearmWeapon.ammoCategory,
          }),
          ammoSlots: firearmWeapon.ammoSlots,
          ...(firearmWeapon.underbarrelWeapons !== undefined &&
            firearmWeapon.underbarrelWeapons.length > 0 && {
              underbarrelWeapons: underbarrelWeaponNames,
            }),
          ...(firearmWeapon.accessoryMounts !== undefined &&
            firearmWeapon.accessoryMounts.length > 0 && {
              accessoryMounts: firearmWeapon.accessoryMounts,
            }),
          ...(firearmWeapon.doubleCostAccessoryMounts !== undefined &&
            firearmWeapon.doubleCostAccessoryMounts.length > 0 && {
              doubleCostAccessoryMounts:
                firearmWeapon.doubleCostAccessoryMounts,
            }),
        },
        rangeList: rangeList,
      };
      return typeInformation;
    } else if (weapon instanceof Explosives) {
      const explosiveWeapon = weapon;
      const typeInformation = {
        type: weaponTypeEnum.Explosive as const,
        subtype: explosiveWeapon.subtype,
        rangeList: rangeList,
      };
      return typeInformation;
    } else {
      throw new Error(
        `Weapon type unexpected: ${weapon.type}, class ${weapon.constructor.name}`
      );
    }
  }
  throw new Error(`Weapon type unexpected: ${weapon.type}`);
}

async function getArmours(): Promise<ArmourListType> {
  const db = await init();
  const armours = await db.em.findAll(Armours, {
    populate: ["*"],
  });
  const armoursResponse: ArmourListType = await Promise.all(
    armours.map(async (armour) => {
      const isWeapon = armour.linkedWeapon !== undefined ? true : undefined;
      const includedGearNameList = await Promise.all(
        armour.includedGearList.$.map(async (activeGear) => {
          return await convertActiveGearDBToDTO(activeGear);
        })
      );
      const includedMods = await Promise.all(
        armour.includedModList.$.map(async (activeMod) => {
          return await convertActiveArmourModDBToDTO(activeMod);
        })
      );

      const armourFormatted: ArmourType = {
        name: armour.name,
        description: armour.description,
        category: armour.category,
        maxRating: armour.maxRating,
        damageReduction: armour.damageReduction,
        customFitStackDamageReduction: armour.customFitStackDamageReduction,
        capacity: armour.capacity,
        isWeapon: isWeapon,
        includedGearList: includedGearNameList,
        bonus: armour.bonus,
        wirelessBonus: armour.wirelessBonus,
        includedModList: includedMods,
        allowModsFromCategory: armour.allowModsFromCategory,
        addModFromCategory: armour.addModFromCategory,
        availability: armour.availability,
        cost: armour.cost,
        source: armour.source,
        page: armour.page,
      };
      return armourFormatted;
    })
  );

  return armoursResponse;
}

async function getArmourModifications(): Promise<ArmourModListType> {
  const db = await init();
  const armourMods = await db.em.findAll(ArmourModifications, {
    populate: ["*"],
  });
  const armourModsResponse: ArmourModListType = await Promise.all(
    armourMods.map(async (armourMod) => {
      const includedGearList = await Promise.all(
        armourMod.includedGearList.$.map(async (activeGear) => {
          return await convertActiveGearDBToDTO(activeGear);
        })
      );

      const armourModFormatted: ArmourModType = {
        name: armourMod.name,
        description: armourMod.description,
        category: armourMod.category,
        maxRating: armourMod.maxRating,
        damageReduction: armourMod.damageReduction,
        capacityCost: armourMod.capacityCost,
        hostArmourRequirements: armourMod.hostArmourRequirements,
        includedGearList: includedGearList,
        bonus: armourMod.bonus,
        wirelessBonus: armourMod.wirelessBonus,
        userSelectable: armourMod.userSelectable,
        availability: armourMod.availability,
        cost: armourMod.cost,
        source: armourMod.source,
        page: armourMod.page,
      };
      return armourModFormatted;
    })
  );

  return armourModsResponse;
}

async function getAugmentations() {
  const db = await init();
  const augmentations = await db.em.findAll(Augmentations, {
    populate: ["*", "includedGearList.gear"],
  });
  const augmentationsResponse: AugmentationListType = await Promise.all(
    augmentations.map(async (augmentation) => {
      let weaponName;
      if (augmentation.addWeapon !== undefined) {
        const addWeapon = augmentation.addWeapon.$;
        weaponName = addWeapon.name;
      }
      const pairIncludeList = await augmentation.pairIncludeList.loadItems();
      const pairIncludeNameList = pairIncludeList.map(
        (pairInclude) => pairInclude.name
      );
      const allowedGearList = await augmentation.allowedGearList.loadItems();
      const allowedGearNameList = allowedGearList.map((gear) => gear.name);
      const includedGearList = await Promise.all(
        augmentation.includedGearList.$.map(async (activeGear) => {
          return await convertActiveGearDBToDTO(activeGear);
        })
      );

      const typeInformation = getAugmentationTypeInformation(augmentation);
      const augmentationFormatted: AugmentationType = {
        name: augmentation.name,
        description: augmentation.description,
        wireless: augmentation.wireless,
        ...typeInformation,
        augmentationLimit: augmentation.augmentationLimit,
        unavailableGrades: augmentation.unavailableGrades,
        essenceCost: augmentation.essenceCost,
        modification: augmentation.modification,
        rating: augmentation.rating,
        ratingMeaning: augmentation.ratingMeaning,
        addWeapon: weaponName,
        blockedMountList: augmentation.blockedMountList,
        selectSide: augmentation.selectSide,
        bonus: augmentation.bonus,
        pairBonus: augmentation.pairBonus,
        pairIncludeList: pairIncludeNameList,
        requirements: augmentation.requirements,
        forbidden: augmentation.forbidden,
        allowedGearList: allowedGearNameList,
        includedGearList: includedGearList,
        allowedGearCategories: augmentation.allowedGearCategories,
        userSelectable: augmentation.userSelectable,
        allowSubsystemCategoryList: augmentation.allowSubsystemCategoryList,
        availability: augmentation.availability,
        cost: augmentation.cost,
        source: augmentation.source,
        page: augmentation.page,
      };
      return augmentationFormatted;
    })
  );
  return augmentationsResponse;
}

function getAugmentationTypeInformation(augmentation: Augmentations) {
  if (augmentation instanceof Cyberwares) {
    return {
      type: augmentationTypeEnum.Cyberware as const,
      subtype: augmentation.subtype,
      programs: augmentation.programs,
      capacity: augmentation.capacity,
      capacityCost: augmentation.capacityCost,
      addToParentCapacity: augmentation.addToParentCapacity,
      addParentWeaponAccessory: augmentation.addParentWeaponAccessory,
      removalCost: augmentation.removalCost,
      inheritAttributes: augmentation.inheritAttributes,
      limbSlot: augmentation.limbSlot,
      useBothLimbSlots: augmentation.useBothLimbSlots,
      mountsLocation: augmentation.mountsLocation,
      modularMount: augmentation.modularMount,
      wirelessBonus: augmentation.wirelessBonus,
      wirelessPairBonus: augmentation.wirelessPairBonus,
      subsystemList: augmentation.subsystemList,
      forceGrade: augmentation.forceGrade,
      deviceRating: augmentation.deviceRating,
    };
  } else if (augmentation instanceof Biowares) {
    return {
      type: augmentationTypeEnum.Bioware as const,
      subtype: augmentation.subtype,
      isGeneware: augmentation.isGeneware,
    };
  }
  throw new Error(
    `Augmentation type unexpected: ${augmentation.type}, class ${augmentation.constructor.name}`
  );
}

async function getVehicles() {
  const db = await init();
  const vehicles = await db.em.findAll(Vehicles, { populate: ["*"] });
  const vehiclesResponse: VehicleListType = await Promise.all(
    vehicles.map(async (vehicle) => {
      const includedGearList = await Promise.all(
        vehicle.includedGearList.$.map(async (activeGear) => {
          return await convertActiveGearDBToDTO(activeGear);
        })
      );
      const includedModList = await Promise.all(
        vehicle.includedModList.$.map(async (mod) => {
          return await convertActiveVehicleModDBToDTO(mod);
        })
      );
      const includedWeaponMountNameList = await Promise.all(
        vehicle.includedWeaponMountList.$.map(async (includedMount) => {
          const loadedMount = includedMount.weaponMount.$;
          let weapon;
          if (includedMount.mountedWeapon !== undefined) {
            const activeWeapon = includedMount.mountedWeapon.$;

            weapon = {
              baseWeapon: activeWeapon.weapon.$.name,
              accessoryList: await Promise.all(
                activeWeapon.accessoryList.$.map(async (accessory) => {
                  return await convertActiveWeaponAccessoryDBToDTO(accessory);
                })
              ),
              rating: activeWeapon.rating,
            };
          }
          return {
            control: loadedMount.control,
            flexibility: loadedMount.flexibility,
            size: loadedMount.size,
            visibility: loadedMount.visibility,
            modList: includedMount.mountMods.$.map((mod) => {
              return mod.name;
            }),
            weaponMounted: weapon,
            weaponExchangeable: includedMount.weaponExchangeable,
          };
        })
      );
      const vehicleTypeInformation = getVehicleTypeInformation(vehicle);
      const vehicleFormatted: VehicleType = {
        name: vehicle.name,
        description: vehicle.description,
        ...vehicleTypeInformation,
        handling: vehicle.handling,
        speed: vehicle.speed,
        acceleration: vehicle.acceleration,
        body: vehicle.body,
        armour: vehicle.armour,
        pilot: vehicle.pilot,
        sensor: vehicle.sensor,
        includedGearList: includedGearList,
        includedModList: includedModList,
        modSlots: vehicle.modSlots,
        powerTrainModSlots: vehicle.powerTrainModSlots,
        protectionModSlots: vehicle.protectionModSlots,
        weaponModSlots: vehicle.weaponModSlots,
        bodyModSlots: vehicle.bodyModSlots,
        electromagneticModSlots: vehicle.electromagneticModSlots,
        cosmeticModSlots: vehicle.cosmeticModSlots,
        includedWeaponMountList: includedWeaponMountNameList,
        userSelectable: vehicle.userSelectable,
        availability: vehicle.availability,
        cost: vehicle.cost,
        source: vehicle.source,
        page: vehicle.page,
      };
      return vehicleFormatted;
    })
  );
  return vehiclesResponse;
}

function getVehicleTypeInformation(vehicle: Vehicles) {
  if (vehicle instanceof MannedVehicles) {
    if (vehicle instanceof Groundcrafts) {
      return {
        type: vehicleTypeEnum.Groundcraft as const,
        subtype: vehicle.subtype,
        seats: vehicle.seats,
      };
    } else if (vehicle instanceof Watercrafts) {
      return {
        type: vehicleTypeEnum.Watercraft as const,
        subtype: vehicle.subtype,
        seats: vehicle.seats,
      };
    } else if (vehicle instanceof Aircrafts) {
      return {
        type: vehicleTypeEnum.Aircraft as const,
        subtype: vehicle.subtype,
        seats: vehicle.seats,
      };
    }
  } else if (vehicle instanceof Drones) {
    return {
      type: vehicleTypeEnum.Drone as const,
      subtype: vehicle.subtype,
    };
  }

  throw new Error(
    `Vehicle type unexpected: ${vehicle.type}, class ${vehicle.constructor.name}`
  );
}

async function getVehicleModifications(): Promise<VehicleModListType> {
  const db = await init();
  const vehicleModifications = await db.em.findAll(VehicleModifications, {
    populate: ["*"],
  });
  const vehicleModificationsResponse: VehicleModListType =
    vehicleModifications.map((vehicleModification) => {
      const vehicleModificationFormatted: VehicleModType = {
        name: vehicleModification.name,
        description: vehicleModification.description,
        type: vehicleModification.type,
        maxRating: vehicleModification.maxRating,
        minRating: vehicleModification.minRating,
        ratingMeaning: vehicleModification.ratingMeaning,
        capacity: vehicleModification.capacity,
        addPhysicalBoxes: vehicleModification.addPhysicalBoxes,
        isDowngrade: vehicleModification.isDowngrade,
        requiresDroneParent: vehicleModification.requiresDroneParent,
        slotCost: vehicleModification.slotCost,
        allowedSubsystemList: vehicleModification.allowedSubsystemList,
        bonus: vehicleModification.bonus,
        requirements: vehicleModification.requirements,
        userSelectable: vehicleModification.userSelectable,
        availability: vehicleModification.availability,
        cost: vehicleModification.cost,
        source: vehicleModification.source,
        page: vehicleModification.page,
      };
      return vehicleModificationFormatted;
    });
  return vehicleModificationsResponse;
}

async function getMartialArts() {
  const db = await init();
  const martialArts = await db.em.findAll(MartialArts, { populate: ["*"] });
  const martialArtsResponse: MartialArtListType = martialArts.map(
    (martialArt) => {
      let techniqueList;
      if (martialArt.allTechniques !== undefined) {
        techniqueList = {
          allTechniques: true as const,
        };
      } else {
        techniqueList = martialArt.techniqueList.$.map((technique) => {
          return technique.name;
        });
      }
      return {
        name: martialArt.name,
        bonus: martialArt.bonus,
        techniqueList: techniqueList,
        karmaCost: martialArt.karmaCost,
        requirements: martialArt.requirements,
        description: martialArt.description,
        source: martialArt.source,
        page: martialArt.page,
      };
    }
  );
  return martialArtsResponse;
}

async function getMartialArtTechniques() {
  const db = await init();
  const techniques = await db.em.findAll(MartialArtTechniques, {
    populate: ["*"],
  });
  const techniquesResponse: MartialArtTechniqueListType = techniques.map(
    (technique) => {
      return {
        name: technique.name,
        bonus: technique.bonus,
        requirements: technique.requirements,
        description: technique.description,
        source: technique.source,
        page: technique.page,
      };
    }
  );
  return techniquesResponse;
}

async function getLifestyles() {
  const db = await init();
  const lifestyles = await db.em.findAll(Lifestyles, {
    populate: ["*"],
  });
  const lifestylesResponse: LifestyleListType = lifestyles.map((lifestyle) => {
    return {
      name: lifestyle.name,
      cost: lifestyle.cost,
      lifestylePoints: lifestyle.lifestylePoints,
      allowBonusLifestylePoints: lifestyle.allowBonusLifestylePoints,
      freegridList: lifestyle.freegridList,
      dice: lifestyle.dice,
      startingNuyenMultiplier: lifestyle.startingNuyenMultiplier,
      costIncreasePerCategoryLevelIncrease:
        lifestyle.costIncreasePerCategoryLevelIncrease,
      lifestyleCategoryDefaults: lifestyle.lifestyleCategoryDefaults,
      requirements: lifestyle.requirements,
      bonus: lifestyle.bonus,
      forbidden: lifestyle.forbidden,
      description: lifestyle.description,
      source: lifestyle.source,
      page: lifestyle.page,
    };
  });
  return lifestylesResponse;
}

async function getLifestyleQualities() {
  const db = await init();
  const lifestyleQualities = await db.em.findAll(LifestyleQualities, {
    populate: ["*"],
  });
  const lifestyleQualitiesResponse: LifestyleQualityListType =
    lifestyleQualities.map((lifestyleQuality) => {
      return {
        name: lifestyleQuality.name,
        category: lifestyleQuality.category,
        monthlyCost: lifestyleQuality.monthlyCost,
        lifestylePointCost: lifestyleQuality.lifestylePointCost,
        lifestyleCostMultiplier: lifestyleQuality.lifestyleCostMultiplier,
        requiredLifestyleList: lifestyleQuality.requiredLifestyleList.$.map(
          (lifestyle) => {
            return lifestyle.name;
          }
        ),
        multipleAllowed: lifestyleQuality.multipleAllowed,
        bonus: lifestyleQuality.bonus,
        requirements: lifestyleQuality.requirements,
        forbidden: lifestyleQuality.forbidden,
        description: lifestyleQuality.description,
        source: lifestyleQuality.source,
        page: lifestyleQuality.page,
      };
    });
  return lifestyleQualitiesResponse;
}

async function getEquipmentPacks() {
  const db = await init();
  const equipmentPacks = await db.em.findAll(EquipmentPacks, {
    populate: ["*"],
  });
  const equipmentPacksResponse: EquipmentPackListType = [];
  for (const equipmentPack of equipmentPacks) {
    const armourList: CustomisedArmourListType = await Promise.all(
      equipmentPack.armourList.$.map(async (armour) => {
        return {
          baseArmour: armour.armour.$.name,
          modList: await Promise.all(
            armour.modList.$.map(async (mod) => {
              return await convertActiveArmourModDBToDTO(mod);
            })
          ),
          gearList: await Promise.all(
            armour.gearList.$.map(async (gear) => {
              return await convertActiveGearDBToDTO(gear);
            })
          ),
        };
      })
    );

    const augmentationList: CustomisedAugmentationListType = await Promise.all(
      equipmentPack.augmentationList.$.map(async (augmentation) => {
        const augmentationGearList = await Promise.all(
          augmentation.gearList.$.map(async (gear) => {
            return await convertActiveGearDBToDTO(gear);
          })
        );
        // TODO: include all cyberware specific values
        return {
          baseAugmentation: augmentation.augmentation.$.name,
          gearList: augmentationGearList,
          grade: augmentation.grade,
          rating: augmentation.rating,
        };
      })
    );

    const gearList = await Promise.all(
      equipmentPack.gearList.$.map(async (gear) => {
        return await convertActiveGearDBToDTO(gear);
      })
    );
    const vehicleList: CustomisedVehicleListType = await Promise.all(
      equipmentPack.vehicleList.$.map((vehicle) => {
        return convertActiveVehicleDBToDTO(vehicle);
      })
    );
    const weaponList = await Promise.all(
      equipmentPack.weaponList.$.map((weapon) => {
        return convertActiveWeaponDBToDTO(weapon);
      })
    );
    const lifestyleList = equipmentPack.lifestyleList.$.map((lifestyle) => {
      return {
        baseLifestyle: lifestyle.lifestyle.$.name,
        purchasedDuration: lifestyle.purchasedDuration,
      };
    });
    equipmentPacksResponse.push({
      name: equipmentPack.name,
      category: equipmentPack.type,
      nuyen: equipmentPack.nuyen,
      armourList: armourList,
      augmentationList: augmentationList,
      gearList: gearList,
      vehicleList: vehicleList,
      weaponList: weaponList,
      lifestyleList: lifestyleList,
      description: equipmentPack.description,
    });
  }
  return equipmentPacksResponse;
}

export async function getGears(): Promise<GearListType> {
  const db = await init();
  const gears = await db.em.findAll(Gears, {
    populate: ["*", "includedWeapon.weapon"],
  });
  const gearsResponse: GearListType = await Promise.all(
    gears.map(async (gear) => {
      const gearList = gear.allowedGearList.$;
      const gearNameList = gearList.map((linkedGear) => linkedGear.name);
      const includedGearList = await Promise.all(
        gear.includedGearList.$.map(async (activeGear) => {
          return await convertActiveGearDBToDTO(activeGear);
        })
      );
      let includedWeapon;
      if (gear.includedWeapon !== undefined) {
        const weaponLink = gear.includedWeapon.$.weapon.$.name;
        includedWeapon = { name: weaponLink };
      }

      const gearFormatted: GearType = {
        name: gear.name,
        description: gear.description,
        category: gear.category,
        minRating: gear.minRating,
        maxRating: gear.maxRating,
        ratingMeaning: gear.ratingMeaning,
        includedWeapon: includedWeapon,
        allowCategoryList: gear.allowCategoryList,
        purchaseQuantity: gear.purchaseQuantity,
        bonus: gear.bonus,
        weaponBonus: gear.weaponBonus,
        isFlechetteAmmo: gear.isFlechetteAmmo,
        flechetteWeaponBonus: gear.flechetteWeaponBonus,
        ammoForWeaponType: gear.ammoForWeaponType,
        explosiveWeight: gear.explosiveWeight,
        userSelectable: gear.userSelectable,
        allowedGearList: gearNameList,
        includedGearList: includedGearList,
        deviceRating: gear.deviceRating,
        programs: gear.programs,
        attributeArray: gear.attributeArray,
        attack: gear.attack,
        sleaze: gear.sleaze,
        dataProcessing: gear.dataProcessing,
        firewall: gear.firewall,
        canFormPersona: gear.canFormPersona,
        capacityInformation: gear.capacityInformation,
        armourCapacityInformation: gear.armourCapacityInformation,
        requirements: gear.requirements,
        requireParent: gear.requireParent,
        forbidden: gear.forbidden,
        modifyAttributeArray: gear.modifyAttributeArray,
        modifyAttack: gear.modifyAttack,
        modifySleaze: gear.modifySleaze,
        modifyDataProcessing: gear.modifyDataProcessing,
        modifyFirewall: gear.modifyFirewall,
        addMatrixBoxes: gear.addMatrixBoxes,
        renameCustomLabel: gear.renameCustomLabel,
        availability: gear.availability,
        cost: gear.cost,
        source: gear.source,
        page: gear.page,
      };
      return gearFormatted;
    })
  );
  return gearsResponse;
}

async function getQualities() {
  const db = await init();
  const qualities = await db.em.findAll(Qualities, {
    populate: ["*", "includedWeaponList", "sharedLimitQualityList"],
  });
  const qualitiesResponse: QualityListType = qualities.map((quality) => {
    const includedWeapons = quality.includedWeaponList.$;
    const includedWeaponsNameList = includedWeapons.map((weapon) => {
      return weapon.name;
    });
    const sharedLimitQualityList = quality.sharedLimitQualityList.$;
    const includedQualitiesNameList = sharedLimitQualityList.map((quality) => {
      return quality.name;
    });
    const bonus =
      quality.bonus !== undefined ? convertDBBonus(quality.bonus.$) : undefined;
    const qualityFormatted: QualityType = {
      name: quality.name,
      description: quality.description,
      category: quality.category,
      karma: quality.karma,
      charGenOnly: quality.charGenOnly,
      charGenLimit: quality.charGenLimit,
      charGenDoNotContributeToKarmaLimit:
        quality.charGenDoNotContributeToKarmaLimit,
      charGenNoKarma: quality.charGenNoKarma,
      chargenQualityOnly_NotSelectableIfPriorityChargen:
        quality.chargenQualityOnly_NotSelectableIfPriorityChargen,
      careerOnly: quality.careerOnly,
      charGenCostInCareer: quality.charGenCostInCareer,
      limit: quality.limit,
      sharedLimitQualityList: includedQualitiesNameList,
      karmaDiscount: quality.karmaDiscount,
      noLevels: quality.noLevels,
      firstLevelBonus: quality.firstLevelBonus,
      addWeapons: includedWeaponsNameList,
      isMetagenic: quality.isMetagenic,
      canBuyWithSpellPoints: quality.canBuyWithSpellPoints,
      userSelectable: quality.userSelectable,
      bonus: bonus,
      requirements: quality.requirements,
      forbidden: quality.forbidden,
      source: quality.source,
      page: quality.page,
    };
    return qualityFormatted;
  });
  return qualitiesResponse;
}

async function getPriorityTable() {
  const db = await init();
  const priorities = await db.em.findAll(Priorities, {
    populate: ["*", "heritageList", "talentList"],
  });
  const parsedPriorities = priorities.map((priority) => {
    return parsePriority(priority);
  });
  const A = parsedPriorities.find(
    (priorities) => priorities.priority === priorityLetterEnum.A
  );
  const B = parsedPriorities.find(
    (priorities) => priorities.priority === priorityLetterEnum.B
  );
  const C = parsedPriorities.find(
    (priorities) => priorities.priority === priorityLetterEnum.C
  );
  const D = parsedPriorities.find(
    (priorities) => priorities.priority === priorityLetterEnum.D
  );
  const E = parsedPriorities.find(
    (priorities) => priorities.priority === priorityLetterEnum.E
  );
  if (
    A === undefined ||
    B === undefined ||
    C === undefined ||
    D === undefined ||
    E === undefined
  ) {
    throw Error("Priority table not loaded in DB");
  }
  const priorityTableResponse: PriorityTableType = {
    A: (({ priority: _, ...o }) => o)(A),
    B: (({ priority: _, ...o }) => o)(B),
    C: (({ priority: _, ...o }) => o)(C),
    D: (({ priority: _, ...o }) => o)(D),
    E: (({ priority: _, ...o }) => o)(E),
  };
  return priorityTableResponse;
}

async function getHeritages() {
  const db = await init();
  const heritages = await db.em.findAll(Heritages, {
    populate: [
      "*",
      "includedWeaponList",
      "includedQualityList",
      "forbiddenQualityList",
    ],
  });

  return Promise.all(
    heritages.map(async (heritage) => {
      let typeInformation:
        | {
            category: heritageCategoryEnum.Metahuman;
            metavariantList?: Array<string>;
          }
        | {
            category: heritageCategoryEnum.Metasapient;
            metavariantList?: Array<string>;
          }
        | {
            category: heritageCategoryEnum.Shapeshifter;
            metavariantList?: Array<string>;
          }
        | {
            category: heritageCategoryEnum.Metavariant;
            baseHeritage: string;
          }
        | undefined;
      if (heritage instanceof Metavariants) {
        const fullBaseHeritage = await heritage.baseHeritage.load();
        if (fullBaseHeritage === null) {
          throw Error("metavariant base heritage is not loaded");
        }
        typeInformation = {
          category: heritageCategoryEnum.Metavariant as const,
          baseHeritage: fullBaseHeritage.name,
        };
      } else {
        const variantHeritages = (heritage as unknown as BaseHeritages)
          .variantHeritages;

        if (heritage.type === heritageCategoryEnum.Metahuman) {
          typeInformation = {
            category: heritageCategoryEnum.Metahuman as const,
          };
        } else if (heritage.type === heritageCategoryEnum.Metasapient) {
          typeInformation = {
            category: heritageCategoryEnum.Metasapient as const,
          };
        } else {
          typeInformation = {
            category: heritageCategoryEnum.Shapeshifter as const,
          };
        }

        if (variantHeritages.length > 0) {
          const metavariantList = variantHeritages.map((metavariant) => {
            return metavariant.name;
          });
          typeInformation.metavariantList = metavariantList;
        }
      }
      const parsedHeritage: HeritageType = {
        name: heritage.name,
        ...typeInformation,
        pointBuyKarmaCost: heritage.pointBuyKarmaCost,
        halveAttributePoints: heritage.halveAttributePoints,
        bodyAttributeRange: heritage.bodyAttributeRange,
        agilityAttributeRange: heritage.agilityAttributeRange,
        reactionAttributeRange: heritage.reactionAttributeRange,
        strengthAttributeRange: heritage.strengthAttributeRange,
        charismaAttributeRange: heritage.charismaAttributeRange,
        intuitionAttributeRange: heritage.intuitionAttributeRange,
        logicAttributeRange: heritage.logicAttributeRange,
        willpowerAttributeRange: heritage.willpowerAttributeRange,
        initiativeAttributeRange: heritage.initiativeAttributeRange,
        edgeAttributeRange: heritage.edgeAttributeRange,
        magicAttributeRange: heritage.magicAttributeRange,
        resonanceAttributeRange: heritage.resonanceAttributeRange,
        essenceAttributeRange: heritage.essenceAttributeRange,
        depthAttributeRange: heritage.depthAttributeRange,
        initiative: heritage.initiative,
        nonStandardMovement: heritage.nonStandardMovement,
        movement: heritage.movement,
        addWeaponList: heritage.includedWeaponList.map((weapon) => weapon.name),
        addQualityList: heritage.includedQualityList.$.map((quality) => {
          return { name: quality.quality.$.name, rating: quality.rating };
        }),
        forbiddenQualityList: heritage.forbiddenQualityList.map(
          (quality) => quality.name
        ),
        bonus: heritage.bonus,
        source: heritage.source,
        page: heritage.page,
        description: heritage.description,
      };
      return parsedHeritage;
    })
  );
}

const skills = privateProcedure.query(async () => {
  try {
    const skillsResponse: SkillListType = await getSkills();
    return skillsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const traditions = privateProcedure.query(async () => {
  try {
    const traditionsResponse: TraditionListType = await getTraditions();
    return traditionsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const mentors = privateProcedure.query(async () => {
  try {
    const mentorsResponse: MentorListType = await getMentors();
    return mentorsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const critters = privateProcedure.query(async () => {
  try {
    const crittersResponse: CritterListType = await getCritters();
    return crittersResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const spells = privateProcedure.query(async () => {
  try {
    const spellsResponse: SpellListType = await getSpells();
    return spellsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const complexForms = privateProcedure.query(async () => {
  try {
    const complexFormsResponse: ComplexFormListType = await getComplexForms();
    return complexFormsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const adeptPowers = privateProcedure.query(async () => {
  try {
    const adeptPowersResponse: AdeptPowerListType = await getAdeptPowers();
    return adeptPowersResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const programs = privateProcedure.query(async () => {
  try {
    const programsResponse: ProgramListType = await getPrograms();
    return programsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const weaponAccessory = privateProcedure.query(async () => {
  try {
    const weaponsResponse: WeaponListType = await getWeapons();
    // logger.log(JSON.stringify(weaponsResponse, null, 2));
    return weaponsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const armours = privateProcedure.query(async () => {
  try {
    const armoursResponse: ArmourListType = await getArmours();
    // logger.log(JSON.stringify(armoursResponse, null, 2));
    return armoursResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const gears = privateProcedure.query(async () => {
  try {
    const gearResponse: GearListType = await getGears();
    // logger.log(JSON.stringify(gearResponse, null, 2));
    return gearResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const augmentations = privateProcedure.query(async () => {
  try {
    const augmentationsResponse: AugmentationListType =
      await getAugmentations();
    // logger.log(JSON.stringify(augmentationsResponse, null, 2));
    return augmentationsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const vehiclesAndDrones = privateProcedure.query(async () => {
  try {
    const vehiclesAndDronesResponse: VehicleListType = await getVehicles();
    // logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
    return vehiclesAndDronesResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const martialArts = privateProcedure.query(async () => {
  try {
    const martialArtsResponse: MartialArtListType = await getMartialArts();
    // logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
    return martialArtsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const martialArtTechniques = privateProcedure.query(async () => {
  try {
    const martialArtTechniquesResponse: MartialArtTechniqueListType =
      await getMartialArtTechniques();
    // logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
    return martialArtTechniquesResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const lifestyles = privateProcedure.query(async () => {
  try {
    const lifestylesResponse: LifestyleListType = await getLifestyles();
    // logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
    return lifestylesResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const lifestyleQualities = privateProcedure.query(async () => {
  try {
    const lifestyleQualitiesResponse: LifestyleQualityListType =
      await getLifestyleQualities();
    // logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
    return lifestyleQualitiesResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const equipmentPacks = privateProcedure.query(async () => {
  try {
    const EquipmentPacksResponse: EquipmentPackListType =
      await getEquipmentPacks();
    // logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
    return EquipmentPacksResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const qualities = privateProcedure.query(async () => {
  try {
    const qualitiesResponse: QualityListType = await getQualities();
    // logger.log(JSON.stringify(qualitiesResponse, null, 2));
    return qualitiesResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const priorities = privateProcedure.query(async () => {
  try {
    const prioritiesResponse: PriorityTableType = await getPriorityTable();
    // logger.log(JSON.stringify(prioritiesResponse, null, 2));
    return prioritiesResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const heritages = privateProcedure.query(async () => {
  try {
    const prioritiesResponse: HeritageListType = await getHeritages();
    // logger.log(JSON.stringify(prioritiesResponse, null, 2));
    return prioritiesResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const all = privateProcedure.query(async () => {
  try {
    const [
      equipmentPacksResponse,
      weaponsResponse,
      weaponAccessoriesResponse,
      armoursResponse,
      armourModificationsResponse,
      gearsResponse,
      augmentationsResponse,
      vehiclesResponse,
      vehicleModificationsResponse,
    ] = await Promise.all([
      getEquipmentPacks(),
      getWeapons(),
      getWeaponAccessories(),
      getArmours(),
      getArmourModifications(),
      getGears(),
      getAugmentations(),
      getVehicles(),
      getVehicleModifications(),
    ]);
    const equipmentResponse: EquipmentListType = {
      equipmentPackList: equipmentPacksResponse,
      weaponList: weaponsResponse,
      weaponAccessoryList: weaponAccessoriesResponse,
      armourList: armoursResponse,
      armourModificationList: armourModificationsResponse,
      gearList: gearsResponse,
      augmentationList: augmentationsResponse,
      vehicleList: vehiclesResponse,
      vehicleModificationList: vehicleModificationsResponse,
    };
    // logger.log(JSON.stringify(equipmentResponse, null, 2));
    return equipmentResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});
const CharacterInformationSchema = zod
  .object({
    // TODO: Maybe a union for this with other creation types?
    priorityInfo: PriorityLevelsSchema,
    heritageInfo: HeritagePrioritySelectedSchema,
    attributeInfo: AttributesSchema,
    specialAttributeInfo: SpecialAttributesSchema,
    talentInfo: TalentInfoSchema,
    positiveQualityListSelected: QualitySelectedListSchema,
    negativeQualityListSelected: QualitySelectedListSchema,
    skillSelections: CustomSkillListSchema,
    skillGroupSelections: CustomSkillGroupListSchema,
    martialArtSelected: zod.optional(MartialArtSelectedSchema),
    equipmentSelections: SelectedEquipmentListSchema,
    lifestyleSelections: LifestyleSelectedListSchema,
    karmaPoints: zod.number(),
    nuyen: zod.number(),
    bonusInfo: CharacterCreatorBonusListSchema,
  })
  .strict();

const createCharacter = privateProcedure
  .input(CharacterInformationSchema)
  .mutation(async (opts) => {
    const db = await init();
    let heritage = await db.em.findOne(
      Heritages,
      { name: opts.input.heritageInfo.heritage },
      {
        populate: ["*"],
      }
    );
    if (heritage === null) {
      throw new Error("Heritage does not exist");
    }
    if (opts.input.heritageInfo.metavariant !== undefined) {
      heritage = await db.em.findOne(
        Metavariants,
        {
          name: opts.input.heritageInfo.metavariant,
          baseHeritage: ref(heritage),
        },
        {
          populate: ["*"],
        }
      );
      if (heritage === null) {
        throw new Error("Heritage does not exist");
      }
    }
    if (opts.input.lifestyleSelections === undefined) {
      throw new Error("Lifestyle not selected");
    }

    const character = new Characters({
      name: "",
      heritage: ref(Heritages, heritage),
      priorities: opts.input.priorityInfo,
      attributes: opts.input.attributeInfo,
      specialAttributes: opts.input.specialAttributeInfo,
      nuyen: opts.input.nuyen,
      karmaPoints: opts.input.karmaPoints,
      user: ref(Users, opts.ctx.id),
    });

    const characterReference = ref(character);

    for (const selectedSkill of opts.input.skillSelections) {
      const skill = await db.em.findOne(Skills, {
        name: selectedSkill.name,
      });
      if (skill === null) {
        throw new Error("Skill does not exist");
      }
      const activeSkill = new CustomisedSkills(
        characterReference,
        ref(skill),
        selectedSkill.skillPoints,
        selectedSkill.karmaPoints,
        selectedSkill.specialisationsSelected
      );
      db.em.persist(activeSkill);
    }

    let activeTalent: ActiveTalents;
    switch (opts.input.talentInfo.type) {
      case talentCategoryEnum.Magic:
        {
          activeTalent = new ActiveMagicTalents(opts.input.talentInfo);
          activeTalent.character = characterReference;
          assert(activeTalent instanceof ActiveMagicTalents);
          db.em.persist(activeTalent);
          const magicTalent = opts.input.talentInfo;
          const loadedTradition = await db.em.findOne(Traditions, {
            name: magicTalent.selectedTradition.name,
          });
          if (loadedTradition === null) {
            throw new Error(
              `Tradition ${magicTalent.selectedTradition.name} does not exist`
            );
          }
          activeTalent.tradition = ref(loadedTradition);
          if (magicTalent.selectedTradition.customSpirits.customSpirits) {
            const spiritTypes =
              magicTalent.selectedTradition.customSpirits.selectedSpiritTypes;
            let loadedSpirit = await db.em.findOne(Critters, {
              name: spiritTypes.combat,
            });
            if (loadedSpirit === null) {
              throw new Error(`Spirit ${spiritTypes.combat} does not exist`);
            }
            activeTalent.combatSpirit = ref(loadedSpirit);

            loadedSpirit = await db.em.findOne(Critters, {
              name: spiritTypes.detection,
            });
            if (loadedSpirit === null) {
              throw new Error(`Spirit ${spiritTypes.detection} does not exist`);
            }
            activeTalent.detectionSpirit = ref(loadedSpirit);

            loadedSpirit = await db.em.findOne(Critters, {
              name: spiritTypes.health,
            });
            if (loadedSpirit === null) {
              throw new Error(`Spirit ${spiritTypes.health} does not exist`);
            }
            activeTalent.healthSpirit = ref(loadedSpirit);

            loadedSpirit = await db.em.findOne(Critters, {
              name: spiritTypes.health,
            });
            if (loadedSpirit === null) {
              throw new Error(`Spirit ${spiritTypes.health} does not exist`);
            }
            activeTalent.illusionSpirit = ref(loadedSpirit);

            loadedSpirit = await db.em.findOne(Critters, {
              name: spiritTypes.illusion,
            });
            if (loadedSpirit === null) {
              throw new Error(`Spirit ${spiritTypes.combat} does not exist`);
            }
            activeTalent.manipulationSpirit = ref(loadedSpirit);
          }

          if (magicTalent.selectedMentor !== undefined) {
            const loadedMentor = await db.em.findOne(MentorSpirits, {
              name: magicTalent.selectedMentor.name,
            });
            if (loadedMentor === null) {
              throw new Error(
                `Mentor ${magicTalent.selectedMentor.name} does not exist`
              );
            }
            const activeMentorSpirit = new ActiveMentorSpirits(
              magicTalent.selectedMentor.choices
            );
            activeMentorSpirit.mentorSpirit = ref(loadedMentor);
            activeTalent.mentorSpirit = ref(activeMentorSpirit);
          }

          if (magicTalent.selectedFormulae.selectFormulae) {
            for (const spell of magicTalent.selectedFormulae.spells) {
              const loadedSpell = await db.em.findOne(Spells, {
                name: spell,
              });
              if (loadedSpell === null) {
                throw new Error(`Spell ${spell} does not exist`);
              }
              activeTalent.spellList.add(loadedSpell);
            }
            for (const ritual of magicTalent.selectedFormulae.rituals) {
              const loadedRitual = await db.em.findOne(Spells, {
                name: ritual,
              });
              if (loadedRitual === null) {
                throw new Error(`Ritual ${ritual} does not exist`);
              }
              activeTalent.ritualList.add(loadedRitual);
            }
            for (const alchemicalPreparation of magicTalent.selectedFormulae
              .alchemicalPreparations) {
              const loadedAlchemicalPreparation = await db.em.findOne(Spells, {
                name: alchemicalPreparation,
              });
              if (loadedAlchemicalPreparation === null) {
                throw new Error(
                  `Alchemical Preparation ${alchemicalPreparation} does not exist`
                );
              }
              activeTalent.alchemicalPreparationList.add(
                loadedAlchemicalPreparation
              );
            }
          }

          if (magicTalent.selectedAdeptPowers.selectAdeptPowers) {
            for (const adeptPower of magicTalent.selectedAdeptPowers
              .adeptPowers) {
              const loadedAdeptPower = await db.em.findOne(AdeptPowers, {
                name: adeptPower,
              });
              if (loadedAdeptPower === null) {
                throw new Error(`Adept Power ${adeptPower} does not exist`);
              }
              activeTalent.adeptPowerList.add(loadedAdeptPower);
            }
          }
        }
        break;
      case talentCategoryEnum.Resonance:
        {
          const resonanceTalent = opts.input.talentInfo;
          activeTalent = new ActiveResonanceTalents(opts.input.talentInfo);
          activeTalent.character = characterReference;
          assert(activeTalent instanceof ActiveResonanceTalents);
          db.em.persist(activeTalent);
          for (const complexForm of opts.input.talentInfo.complexForms) {
            const loadedComplexForm = await db.em.findOne(ComplexForms, {
              name: complexForm,
            });
            if (loadedComplexForm === null) {
              throw new Error(`Complex Form ${complexForm} does not exist`);
            }
            activeTalent.complexFormList.add(loadedComplexForm);
          }

          if (resonanceTalent.selectedMentor !== undefined) {
            const loadedMentor = await db.em.findOne(Paragons, {
              name: resonanceTalent.selectedMentor.name,
            });
            if (loadedMentor === null) {
              throw new Error(
                `Mentor ${resonanceTalent.selectedMentor.name} does not exist`
              );
            }
            const activeParagon = new ActiveParagons();
            activeParagon.paragon = ref(loadedMentor);
            activeTalent.paragon = ref(activeParagon);
          }
        }
        break;
      case talentCategoryEnum.Depth:
        {
          activeTalent = new ActiveDepthTalents(opts.input.talentInfo);
          activeTalent.character = characterReference;
          db.em.persist(activeTalent);
          for (const program of opts.input.talentInfo.programs) {
            const loadedProgram = await db.em.findOne(Programs, {
              name: program.name,
            });
            if (loadedProgram === null) {
              throw new Error(`Program ${program.name} does not exist`);
            }
            const activeProgram = new ActivePrograms(
              ref(loadedProgram),
              ref(activeTalent),
              program.rating
            );
            db.em.persist(activeProgram);
          }
        }
        break;
      case talentCategoryEnum.Mundane:
        // Do nothing
        break;
    }

    for (const selectedSkillGroup of opts.input.skillGroupSelections) {
      const skillGroup = await db.em.findOne(SkillGroups, {
        name: selectedSkillGroup.name,
      });
      if (skillGroup === null) {
        throw new Error(
          `Skill Group ${selectedSkillGroup.name} does not exist`
        );
      }
      const activeSkillGroup = new CustomisedSkillGroups(
        characterReference,
        ref(skillGroup),
        selectedSkillGroup.skillGroupPoints,
        selectedSkillGroup.karmaPoints
      );
      db.em.persist(activeSkillGroup);
    }

    const rawQualityList = opts.input.positiveQualityListSelected.concat(
      opts.input.negativeQualityListSelected
    );
    for (const selectedQuality of rawQualityList) {
      const quality = await db.em.findOne(Qualities, {
        name: selectedQuality.name,
      });
      if (quality === null) {
        throw new Error(`Quality ${selectedQuality.name} does not exist`);
      }
      const activeQuality = new CustomisedQualities(
        characterReference,
        ref(quality),
        selectedQuality.rating
      );
      db.em.persist(activeQuality);
    }

    for (const unlinkedWeapon of opts.input.equipmentSelections.weaponList) {
      const weapon = await db.em.findOne(Weapons, {
        name: unlinkedWeapon.baseWeapon,
      });
      if (weapon === null) {
        throw new Error(`Weapon ${unlinkedWeapon.baseWeapon} does not exist`);
      }
      const activeWeapon = new CustomisedWeapons(
        characterReference,
        ref(weapon)
      );
      db.em.persist(activeWeapon);
      if (unlinkedWeapon.accessoryList === undefined) {
        continue;
      }
      for (const unlinkedAccessory of unlinkedWeapon.accessoryList) {
        const accessory = await db.em.findOne(WeaponAccessories, {
          name: unlinkedAccessory.baseAccessory,
        });
        if (accessory === null) {
          throw new Error(
            `Weapon Accessory ${unlinkedAccessory.baseAccessory} does not exist`
          );
        }
        // TODO: confirm this cascades properly
        db.em.persist(
          new CustomisedWeaponAccessories(
            ref(activeWeapon),
            ref(accessory),
            unlinkedAccessory.mountList,
            unlinkedAccessory.rating
          )
        );
      }
    }

    for (const unlinkedArmour of opts.input.equipmentSelections.armourList) {
      const armour = await db.em.findOne(Armours, {
        name: unlinkedArmour.baseArmour,
      });
      if (armour === null) {
        throw new Error(`Armour ${unlinkedArmour.baseArmour} does not exist`);
      }
      const activeArmour = new CustomisedArmours(
        characterReference,
        ref(armour)
      );
      db.em.persist(activeArmour);
      if (unlinkedArmour.modList === undefined) {
        continue;
      }
      for (const unlinkedMod of unlinkedArmour.modList) {
        const mod = await db.em.findOne(ArmourModifications, {
          name: unlinkedMod.baseMod,
        });
        if (mod === null) {
          throw new Error(`Armour Mod ${unlinkedMod.baseMod} does not exist`);
        }
        // TODO: confirm this cascades properly
        db.em.persist(
          new CustomisedArmourModifications(
            ref(activeArmour),
            ref(mod),
            unlinkedMod.rating
          )
        );
      }
    }

    for (const unlinkedGear of opts.input.equipmentSelections.gearList) {
      const gear = await db.em.findOne(Gears, {
        name: unlinkedGear.baseGear,
      });
      if (gear === null) {
        throw new Error(`Gear ${unlinkedGear.baseGear} does not exist`);
      }
      const activeGear = new CustomisedGears(characterReference, ref(gear));
      db.em.persist(activeGear);
      if (unlinkedGear.innerGearList === undefined) {
        continue;
      }
      // TODO: make this recursive
      for (const unlinkedChildGear of unlinkedGear.innerGearList) {
        const childGear = await db.em.findOne(Gears, {
          name: unlinkedChildGear.baseGear,
        });
        if (childGear === null) {
          throw new Error(`Gear ${unlinkedChildGear.baseGear} does not exist`);
        }
        // TODO: confirm this cascades properly
        db.em.persist(new ChildGears(ref(activeGear), ref(childGear)));
      }
    }

    for (const unlinkedAugmentation of opts.input.equipmentSelections
      .augmentationList) {
      const augmentation = await db.em.findOne(Augmentations, {
        name: unlinkedAugmentation.baseAugmentation,
      });
      if (augmentation === null) {
        throw new Error(
          `Augmentation ${unlinkedAugmentation.baseAugmentation} does not exist`
        );
      }
      const activeAugmentation = new CustomisedAugmentations(
        characterReference,
        ref(augmentation),
        unlinkedAugmentation.grade
      );
      db.em.persist(activeAugmentation);
      if (unlinkedAugmentation.gearList === undefined) {
        continue;
      }
      for (const unlinkedGear of unlinkedAugmentation.gearList) {
        const gear = await db.em.findOne(Gears, {
          name: unlinkedGear.baseGear,
        });
        if (gear === null) {
          throw new Error(`Gear ${unlinkedGear.baseGear} does not exist`);
        }
        // TODO: confirm this cascades properly
        db.em.persist(
          new ActiveAugmentationGears(ref(activeAugmentation), ref(gear))
        );
      }
    }

    for (const unlinkedVehicle of opts.input.equipmentSelections.vehicleList) {
      const vehicle = await db.em.findOne(Vehicles, {
        name: unlinkedVehicle.baseVehicle,
      });
      if (vehicle === null) {
        throw new Error(
          `Vehicle ${unlinkedVehicle.baseVehicle} does not exist`
        );
      }
      const activeVehicle = new CustomisedVehicles(
        characterReference,
        ref(vehicle)
      );
      db.em.persist(activeVehicle);
      if (unlinkedVehicle.modList === undefined) {
        continue;
      }
      for (const unlinkedMods of unlinkedVehicle.modList) {
        const mod = await db.em.findOne(VehicleModifications, {
          name: unlinkedMods.baseMod,
        });
        if (mod === null) {
          throw new Error(`Vehicle Mod ${unlinkedMods.baseMod} does not exist`);
        }
        // TODO: confirm this cascades properly
        db.em.persist(
          new CustomisedVehicleModifications(ref(activeVehicle), ref(mod))
        );
      }
    }

    if (opts.input.martialArtSelected !== undefined) {
      const martialArtName = opts.input.martialArtSelected.martialArt.name;
      const martialArt = await db.em.findOne(MartialArts, {
        name: martialArtName,
      });
      if (martialArt === null) {
        throw new Error(`Martial Art : ${martialArtName} does not exist`);
      }
      const activeMartialArt = new ActiveMartialArts(
        ref(martialArt),
        characterReference
      );
      for (const unlinkedTechnique of opts.input.martialArtSelected
        .techniqueList) {
        const technique = await db.em.findOne(MartialArtTechniques, {
          name: unlinkedTechnique.name,
        });
        if (technique === null) {
          throw new Error(
            `Martial Art Technique: ${unlinkedTechnique.name} does not exist`
          );
        }
        activeMartialArt.selectedTechniqueList.add(technique);
      }
      db.em.persist(activeMartialArt);
    }

    for (const selectedLifestyle of opts.input.lifestyleSelections) {
      const lifestyle = await db.em.findOne(Lifestyles, {
        name: selectedLifestyle.lifestyle.name,
      });
      if (lifestyle === null) {
        throw new Error("Lifestyle does not exist");
      }

      const activeLifestyle = new CustomisedLifestyles(
        characterReference,
        ref(lifestyle),
        selectedLifestyle.purchasedDuration
      );
      for (const selectedLifestyleQuality of selectedLifestyle.lifestyleQualityList) {
        const lifestyleQuality = await db.em.findOne(LifestyleQualities, {
          name: selectedLifestyleQuality.name,
        });
        if (lifestyleQuality === null) {
          throw new Error("lifestyleQuality does not exist");
        }
        activeLifestyle.lifestyleQualityList.add(lifestyleQuality);
      }
      db.em.persist(activeLifestyle);
    }

    await db.em.persistAndFlush(character);
    // logger.log(JSON.stringify(character, null, 2));
    return character.id;
  });

const getCharacterList = privateProcedure.query(async (opts) => {
  try {
    const { ctx } = opts;
    const db = await init();
    const characterList = await db.em.findAll(Characters, {
      where: { user: { username: ctx.username } },
      populate: ["heritage"],
    });
    if (characterList === null) {
      throw new Error("Character does not exist");
    }

    const loadedCharacterList: CharacterSummaryListType = [];
    for (const character of characterList) {
      const loadedCharacter: CharacterSummaryType = {
        id: character.id,
        name: character.name,
        heritage: {
          name: character.heritage.$.name,
          ...(await getHeritageTypeInformation(character.heritage.$)),
        },
      };
      loadedCharacterList.push(loadedCharacter);
    }

    return loadedCharacterList;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const getCharacter = privateProcedure
  .input(zod.string())
  .query(async (opts) => {
    try {
      const { input } = opts;
      const id = Number(input);
      if (isNaN(id)) {
        throw new Error("Invalid Character ID");
      }
      const db = await init();
      const character = await db.em.findOne(Characters, id, {
        populate: ["*"],
      });
      if (character === null) {
        throw new Error("Character does not exist");
      }

      let talentInfo;
      if (character.talent === undefined) {
        talentInfo = {
          type: talentCategoryEnum.Mundane as const,
        };
      } else {
        if (character.talent.$ instanceof ActiveMagicTalents) {
          const talent = await db.em.findOne(
            ActiveMagicTalents,
            character.talent.id,
            {
              populate: ["*"],
            }
          );
          if (talent === null) {
            throw new Error("Talent does not exist");
          }

          let spirits: CustomSpiritsType = {
            customSpirits: false as const,
          };
          if (
            talent.combatSpirit !== undefined &&
            talent.detectionSpirit !== undefined &&
            talent.healthSpirit !== undefined &&
            talent.illusionSpirit !== undefined &&
            talent.manipulationSpirit !== undefined
          ) {
            spirits = {
              customSpirits: true as const,
              selectedSpiritTypes: {
                combat: talent.combatSpirit.$.name,
                detection: talent.detectionSpirit.$.name,
                health: talent.healthSpirit.$.name,
                illusion: talent.illusionSpirit.$.name,
                manipulation: talent.manipulationSpirit.$.name,
              },
            };
          }
          const tradition = {
            name: talent.tradition.$.name,
            customSpirits: spirits,
          };

          let mentorSpirit;
          if (talent.mentorSpirit !== undefined) {
            const sourceMentorSpirit = talent.mentorSpirit.$.mentorSpirit.$;
            mentorSpirit = {
              name: sourceMentorSpirit.name,
              description: sourceMentorSpirit.description,
              advantage: sourceMentorSpirit.advantage,
              disadvantage: sourceMentorSpirit.disadvantage,
              bonus: sourceMentorSpirit.bonus,
              source: sourceMentorSpirit.source,
              page: sourceMentorSpirit.page,
              category: mentorCategoryEnum.MentorSpirit as const,
              choices: talent.mentorSpirit.$.choices,
              choiceCount: sourceMentorSpirit.choiceCount,
              required: sourceMentorSpirit.required,
            };
          }

          let formulae: FormulaListSelectedType = { selectFormulae: false };
          // TODO: this assumes we selected at char gen,
          // there is probably a case where this isn't true
          // need to check based on char gen method e.g. priority
          // to see if we allow the selection of formulae
          if (
            talent.spellList.length > 0 ||
            talent.ritualList.length > 0 ||
            talent.alchemicalPreparationList.length > 0
          ) {
            formulae = {
              selectFormulae: true as const,
              spells: talent.spellList.$.map((spell) => {
                return spell.name;
              }),
              rituals: talent.ritualList.$.map((ritual) => {
                return ritual.name;
              }),
              alchemicalPreparations: talent.alchemicalPreparationList.$.map(
                (alchemicalPreparation) => {
                  return alchemicalPreparation.name;
                }
              ),
            };
          }
          let adeptPowers: AdeptPowerListSelectedType = {
            selectAdeptPowers: false as const,
          };
          if (talent.adeptPowerList.length > 0) {
            adeptPowers = {
              selectAdeptPowers: true as const,
              adeptPowers: talent.adeptPowerList.$.map((adeptPower) => {
                return adeptPower.name;
              }),
            };
          }
          talentInfo = {
            type: talentCategoryEnum.Magic as const,
            selectedTradition: tradition,
            selectedFormulae: formulae,
            selectedAdeptPowers: adeptPowers,
            selectedMentor: mentorSpirit,
          };
        } else if (character.talent.$ instanceof ActiveResonanceTalents) {
          const talent = await db.em.findOne(
            ActiveResonanceTalents,
            character.talent.id,
            {
              populate: ["*"],
            }
          );
          if (talent === null) {
            throw new Error("Talent does not exist");
          }
          let paragon;
          if (talent.paragon !== undefined) {
            const sourceParagon = talent.paragon.$.paragon.$;
            paragon = {
              name: sourceParagon.name,
              description: sourceParagon.description,
              advantage: sourceParagon.advantage,
              disadvantage: sourceParagon.disadvantage,
              bonus: sourceParagon.bonus,
              source: sourceParagon.source,
              page: sourceParagon.page,
              category: mentorCategoryEnum.Paragon as const,
            };
          }
          talentInfo = {
            type: talentCategoryEnum.Resonance as const,
            complexForms: talent.complexFormList.$.map((complexForm) => {
              return complexForm.name;
            }),
            selectedMentor: paragon,
          };
        } else if (character.talent.$ instanceof ActiveDepthTalents) {
          const talent = await db.em.findOne(
            ActiveDepthTalents,
            character.talent.id,
            {
              populate: ["*"],
            }
          );
          if (talent === null) {
            throw new Error("Talent does not exist");
          }
          const programList: ProgramSelectedListType = [];
          for (const activeProgram of talent.ProgramList.$) {
            const program = await db.em.findOne(Programs, activeProgram.id);
            if (program === null) {
              throw new Error("Program does not exist");
            }
            programList.push({
              name: program.name,
              ...(activeProgram.rating !== undefined && {
                rating: activeProgram.rating,
              }),
            });
          }
          talentInfo = {
            type: talentCategoryEnum.Depth as const,
            programs: programList,
          };
        } else {
          throw new Error(
            `Unknown talent type for ${character.id}, class ${character.constructor.name}`
          );
        }
      }
      const skills = await Promise.all(
        character.skillList.map(async (skill) => {
          return await convertActiveSkillDBToDTO(skill);
        })
      );
      const qualities = await Promise.all(
        character.qualityList.map(async (quality) => {
          return await convertActiveQualityDBToDTO(quality);
        })
      );

      // logger.log(JSON.stringify(character, null, 2));
      const loadedCharacter: CharacterType = {
        name: character.name,
        heritage: await convertHeritageDBToDTO(character.heritage.$),
        priorities: character.priorities,
        attributes: character.attributes,
        specialAttributes: character.specialAttributes,
        talentInfo: talentInfo,
        skillList: skills,
        qualityList: qualities,
        nuyen: character.nuyen,
        karmaPoints: character.karmaPoints,
        weaponList: await Promise.all(
          character.weaponList.$.map(async (weapon) => {
            return await convertActiveWeaponDBToDTO(weapon);
          })
        ),
        armourList: await Promise.all(
          character.armourList.$.map(async (armour) => {
            return await convertActiveArmourDBToDTO(armour);
          })
        ),
        gearList: await Promise.all(
          character.gearList.$.map(async (gear) => {
            return await convertActiveGearDBToDTO(gear);
          })
        ),
        augmentationList: await Promise.all(
          character.augmentationList.$.map(async (augmentation) => {
            return await convertCustomAugmentationDBToDTO(augmentation);
          })
        ),
        vehicleList: await Promise.all(
          character.vehicleList.$.map(async (vehicle) => {
            return await convertActiveVehicleDBToDTO(vehicle);
          })
        ),
        martialArtList: await Promise.all(
          character.martialArtList.$.map(async (martialArt) => {
            return await convertActiveMartialArtDBToDTO(martialArt);
          })
        ),
        lifestyleList: await Promise.all(
          character.lifestyleList.$.map(async (lifestyle) => {
            return await convertActiveLifestyleDBToDTO(lifestyle);
          })
        ),
      };
      return loadedCharacter;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  });

const convertHeritageDBToDTO = async function (
  heritageDB: Heritages
): Promise<HeritageType> {
  const typeInformation = await getHeritageTypeInformation(heritageDB);

  return {
    name: heritageDB.name,
    ...typeInformation,
    ...(heritageDB.halveAttributePoints !== undefined && {
      halveAttributePoints: true,
    }),
    pointBuyKarmaCost: heritageDB.pointBuyKarmaCost,
    bodyAttributeRange: heritageDB.bodyAttributeRange,
    agilityAttributeRange: heritageDB.agilityAttributeRange,
    reactionAttributeRange: heritageDB.reactionAttributeRange,
    strengthAttributeRange: heritageDB.strengthAttributeRange,
    charismaAttributeRange: heritageDB.charismaAttributeRange,
    intuitionAttributeRange: heritageDB.intuitionAttributeRange,
    logicAttributeRange: heritageDB.logicAttributeRange,
    willpowerAttributeRange: heritageDB.willpowerAttributeRange,
    initiativeAttributeRange: heritageDB.initiativeAttributeRange,
    edgeAttributeRange: heritageDB.edgeAttributeRange,
    magicAttributeRange: heritageDB.magicAttributeRange,
    resonanceAttributeRange: heritageDB.resonanceAttributeRange,
    essenceAttributeRange: heritageDB.essenceAttributeRange,
    depthAttributeRange: heritageDB.depthAttributeRange,
    ...(heritageDB.initiative !== undefined && {
      initiative: heritageDB.initiative,
    }),
    ...(heritageDB.nonStandardMovement !== undefined && {
      nonStandardMovement: heritageDB.nonStandardMovement,
    }),
    ...(heritageDB.movement !== undefined && {
      movement: heritageDB.movement,
    }),
    ...(heritageDB.includedWeaponList !== undefined && {
      addWeaponList: heritageDB.includedWeaponList.map((weapon) => {
        return weapon.name;
      }),
    }),
    // ...(heritageDB.addPowerList !== undefined && {
    //   addPowerList: heritageDB.addPowerList,
    // }),
    ...(heritageDB.includedQualityList !== undefined && {
      addQualityList: await Promise.all(
        heritageDB.includedQualityList.map(async (activeQuality) => {
          const db = await init();
          const quality = await db.em.findOne(
            Qualities,
            activeQuality.quality.id,
            {
              populate: ["*"],
            }
          );
          if (quality === null) {
            throw new Error("Heritage does not exist");
          }
          return { name: quality.name, rating: activeQuality.rating };
        })
      ),
    }),
    ...(heritageDB.forbiddenQualityList !== undefined && {
      forbiddenQualityList: heritageDB.forbiddenQualityList.map((quality) => {
        return quality.name;
      }),
    }),
    ...(heritageDB.bonus !== undefined && {
      bonus: heritageDB.bonus,
    }),
    source: heritageDB.source,
    page: heritageDB.page,
    description: heritageDB.description,
  };
};

const convertActiveSkillDBToDTO = async function (
  activeSkillDB: CustomisedSkills
): Promise<CustomSkillType> {
  const db = await init();
  const skillDB = await db.em.findOne(Skills, activeSkillDB.skill.id, {
    populate: ["*"],
  });
  if (skillDB === null) {
    throw new Error("Skill does not exist");
  }

  return {
    name: skillDB.name,
    isKnowledgeSkill: skillDB.isKnowledgeSkill,
    description: skillDB.description,
    category: skillDB.category,
    attribute: skillDB.attribute,
    default: skillDB.default,
    exotic: skillDB.exotic,
    ...(skillDB.skillGroup !== undefined && {
      skillGroup: skillDB.skillGroup.$.name,
    }),
    specialisations: skillDB.defaultSpecialisations,
    source: skillDB.source,
    page: skillDB.page,

    skillPoints: activeSkillDB.skillPoints,
    karmaPoints: activeSkillDB.karmaPoints,
    specialisationsSelected: activeSkillDB.specialisationsSelected,
  };
};

const convertActiveQualityDBToDTO = async function (
  activeQualityDB: ActiveQualities
): Promise<CustomQualityType> {
  const db = await init();
  const qualityDB = await db.em.findOne(Qualities, activeQualityDB.quality.id, {
    populate: ["*"],
  });
  if (qualityDB === null) {
    throw new Error("Character does not exist");
  }
  const bonus =
    qualityDB.bonus !== undefined
      ? convertDBBonus(qualityDB.bonus.$)
      : undefined;

  return {
    name: qualityDB.name,
    description: qualityDB.description,
    category: qualityDB.category,
    karma: qualityDB.karma,
    charGenOnly: qualityDB.charGenOnly,
    charGenLimit: qualityDB.charGenLimit,
    charGenDoNotContributeToKarmaLimit:
      qualityDB.charGenDoNotContributeToKarmaLimit,
    charGenNoKarma: qualityDB.charGenNoKarma,
    chargenQualityOnly_NotSelectableIfPriorityChargen:
      qualityDB.chargenQualityOnly_NotSelectableIfPriorityChargen,
    careerOnly: qualityDB.careerOnly,
    charGenCostInCareer: qualityDB.charGenCostInCareer,
    limit: qualityDB.limit,
    sharedLimitQualityList: qualityDB.sharedLimitQualityList.$.map(
      (quality) => quality.name
    ),
    karmaDiscount: qualityDB.karmaDiscount,
    noLevels: qualityDB.noLevels,
    firstLevelBonus: qualityDB.firstLevelBonus,
    addWeapons: qualityDB.includedWeaponList.$.map((weapon) => weapon.name),
    isMetagenic: qualityDB.isMetagenic,
    canBuyWithSpellPoints: qualityDB.canBuyWithSpellPoints,
    userSelectable: qualityDB.userSelectable,
    bonus: bonus,
    requirements: qualityDB.requirements,
    forbidden: qualityDB.forbidden,
    source: qualityDB.source,
    page: qualityDB.page,

    rating: activeQualityDB.rating,
  };
};
const convertActiveWeaponDBToDTO = async function (
  activeWeaponDB: ActiveWeapons
): Promise<CustomisedWeaponType> {
  const db = await init();
  const weaponDB = await db.em.findOne(Weapons, activeWeaponDB.weapon.id, {
    populate: ["*"],
  });
  if (weaponDB === null) {
    throw new Error("Weapon does not exist");
  }
  const convertedWeapon = await convertWeaponDBToDTO(weaponDB);
  const convertedAccessories = await Promise.all(
    activeWeaponDB.accessoryList.map((accessory) => {
      return convertActiveWeaponAccessoryDBToDTO(accessory);
    })
  );

  return {
    baseWeapon: convertedWeapon.name,
    accessoryList: convertedAccessories,
    rating: activeWeaponDB.rating,
    customName: activeWeaponDB.customName,
  };
};

const convertWeaponDBToDTO = async function (
  weaponDB: Weapons
): Promise<WeaponType> {
  const hostWeaponRequirements = {
    requirements: weaponDB.requirements,
    hostWeaponMountsRequired: weaponDB.hostWeaponMountsRequired,
  };

  const relatedSkill = await weaponDB.relatedSkill.load();
  if (relatedSkill === null) {
    throw new Error("Related skill is unknown");
  }

  const weaponTypeInformation = convertWeaponDBTypeInformationToDTO(weaponDB);

  return {
    name: weaponDB.name,
    ...weaponTypeInformation,
    description: weaponDB.description,
    wireless: weaponDB.wireless,
    concealability: weaponDB.concealability,
    accuracy: weaponDB.accuracy,
    damage: weaponDB.damage,
    armourPenetration: weaponDB.armourPenetration,
    ammunition: weaponDB.ammunition,
    allowedGearList: weaponDB.allowedGearList.map((gear) => {
      return gear.name;
    }),
    allowedGearCategories: weaponDB.allowedGearCategories,
    includedAccessoryList: await Promise.all(
      weaponDB.includedAccessoryList.map((accessory) => {
        return convertActiveWeaponAccessoryDBToDTO(accessory);
      })
    ),
    allowAccessories: weaponDB.allowAccessories,
    userSelectable: weaponDB.userSelectable,
    augmentationType: weaponDB.augmentationType,
    alternativeWeaponForms: weaponDB.alternativeWeaponForms.map((weapon) => {
      return weapon.name;
    }),
    hostWeaponRequirements: hostWeaponRequirements,
    relatedSkill: relatedSkill.name,
    relatedSkillSpecialisations: weaponDB.relatedSkillSpecialisations,
    availability: weaponDB.availability,
    cost: weaponDB.cost,
    source: weaponDB.source,
    page: weaponDB.page,
  };
};

const convertWeaponDBTypeInformationToDTO = function (weaponDB: Weapons) {
  if (weaponDB instanceof MeleeWeapons) {
    return {
      type: weaponTypeEnum.Melee as const,
      subtype: weaponDB.subtype,
      meleeOptions: {
        reach: weaponDB.reach,
      },
    };
  } else if (weaponDB instanceof ProjectileWeapons) {
    return {
      type: weaponTypeEnum.Projectile as const,
      subtype: weaponDB.subtype,
      extraClassification: weaponDB.extraClassification,
      rangeList: weaponDB.ranges.map((range) => {
        return range.name;
      }),
    };
  } else if (weaponDB instanceof FirearmWeapons) {
    return {
      type: weaponTypeEnum.Firearm as const,
      subtype: weaponDB.subtype,
      extraClassification: weaponDB.extraClassification,
      firearmOptions: {
        mode: weaponDB.mode,
        recoilCompensation: weaponDB.recoilCompensation,
        ammoCategory: weaponDB.ammoCategory,
        ammoSlots: weaponDB.ammoSlots,
        ...(weaponDB.underbarrelWeapons.length > 0 && {
          underbarrelWeapons: weaponDB.underbarrelWeapons.map((weapon) => {
            return weapon.name;
          }),
        }),
        accessoryMounts: weaponDB.accessoryMounts,
        doubleCostAccessoryMounts: weaponDB.doubleCostAccessoryMounts,
      },
      rangeList: weaponDB.ranges.map((range) => {
        return range.name;
      }),
    };
  } else if (weaponDB instanceof Explosives) {
    return {
      type: weaponTypeEnum.Explosive as const,
      subtype: weaponDB.subtype,
      rangeList: weaponDB.ranges.map((range) => {
        return range.name;
      }),
    };
  } else {
    throw new Error(
      `Unknown Weapon type weapon ${weaponDB.name}, class ${weaponDB.constructor.name}`
    );
  }
};

const convertActiveWeaponAccessoryDBToDTO = async function (
  includedAccessoryDB: ActiveWeaponAccessories
): Promise<CustomisedWeaponAccessoryType> {
  const db = await init();

  const weaponAccessoryDB = await db.em.findOne(
    WeaponAccessories,
    includedAccessoryDB.weaponAccessory.id,
    {
      populate: ["*"],
    }
  );
  if (weaponAccessoryDB === null) {
    throw new Error("Weapon does not exist");
  }

  return {
    baseAccessory: weaponAccessoryDB.name,
    mountList: includedAccessoryDB.weaponMountsUsed,
    rating: includedAccessoryDB.rating,
    gearList: await Promise.all(
      includedAccessoryDB.includedGearList.map(async (gear) => {
        return await convertActiveGearDBToDTO(gear);
      })
    ),
  };
};

const convertActiveArmourDBToDTO = async function (
  activeArmourDB: ActiveArmours
): Promise<CustomisedArmourType> {
  const db = await init();
  const armourDB = await db.em.findOne(Armours, activeArmourDB.armour.id, {
    populate: ["*"],
  });
  if (armourDB === null) {
    throw new Error("Armour does not exist");
  }
  const modList = await Promise.all(
    activeArmourDB.modList.map((mod) => {
      return convertActiveArmourModDBToDTO(mod);
    })
  );
  const gearList = await Promise.all(
    activeArmourDB.gearList.map(async (gear) => {
      return convertActiveGearDBToDTO(gear);
    })
  );
  return {
    baseArmour: armourDB.name,
    modList: modList,
    gearList: gearList,
    customName: activeArmourDB.customName,
  };
};

const convertActiveArmourModDBToDTO = async function (
  activeArmourModificationDB: ActiveArmourModifications
): Promise<CustomisedArmourModType> {
  const db = await init();
  const modDB = await db.em.findOne(
    ActiveArmourModifications,
    activeArmourModificationDB.id,
    {
      populate: ["*"],
    }
  );
  if (modDB === null) {
    throw new Error("Armour mod does not exist");
  }
  const gearList = await Promise.all(
    modDB.includedGearList.map(async (gear) => {
      return convertActiveGearDBToDTO(gear);
    })
  );
  return {
    baseMod: modDB.armourModification.$.name,
    gearList: gearList,
    rating: modDB.rating,
  };
};

export const convertArmourDBToDTO = async function (
  armourDB: Armours
): Promise<ArmourType> {
  // let includedWeapon;
  // const db = await init();
  // if (armourDB.includedWeapon !== undefined) {
  //   const weaponDB = await db.em.findOne(
  //     CustomisedWeapons,
  //     armourDB.includedWeapon,
  //     {
  //       populate: ["*"],
  //     }
  //   );
  //   if (weaponDB === null) {
  //     throw new Error("Weapon does not exist");
  //   }
  //   includedWeapon = {
  //     name: weaponDB.weapon.$.name,
  //     // TODO: fix this conversion..
  //     // rating: weaponDB.rating
  //   };
  // }
  return {
    name: armourDB.name,
    description: armourDB.description,
    category: armourDB.category,
    maxRating: armourDB.maxRating,
    damageReduction: armourDB.damageReduction,
    customFitStackDamageReduction: armourDB.customFitStackDamageReduction,
    capacity: armourDB.capacity,
    ...(armourDB.linkedWeapon !== undefined && { isWeapon: true }),
    // TODO: add
    // includedGearList: armourDB.includedGearList,
    bonus: armourDB.bonus,
    wirelessBonus: armourDB.wirelessBonus,
    // TODO: Add
    // includedMods: armourDB.includedMods,
    allowModsFromCategory: armourDB.allowModsFromCategory,
    addModFromCategory: armourDB.addModFromCategory,
    availability: armourDB.availability,
    cost: armourDB.cost,
    source: armourDB.source,
    page: armourDB.page,
  };
};

const convertActiveGearDBToDTO = async function (
  customisedGearDB: ActiveGears
): Promise<CustomisedGearType> {
  const db = await init();
  const gearDB = await db.em.findOne(Gears, customisedGearDB.gear.id, {
    populate: ["*"],
  });
  if (gearDB === null) {
    throw new Error("Gear does not exist");
  }

  return {
    baseGear: gearDB.name,
    innerGearList: await Promise.all(
      customisedGearDB.childrenGear.map(async (childGear) => {
        return await convertActiveGearDBToDTO(childGear);
      })
    ),
    specificOption: customisedGearDB.specificOption,
    rating: customisedGearDB.rating,
    consumeCapacity: customisedGearDB.consumeCapacity,
    currentQuantity: customisedGearDB.currentQuantity,
  };
};

export const convertGearDBToDTO = async function (
  gearDB: Gears
): Promise<GearType> {
  let includedWeapon;
  const db = await init();
  if (gearDB.includedWeapon !== undefined) {
    const weaponDB = await db.em.findOne(
      CustomisedWeapons,
      gearDB.includedWeapon,
      {
        populate: ["*"],
      }
    );
    if (weaponDB === null) {
      throw new Error("Weapon does not exist");
    }
    includedWeapon = {
      name: weaponDB.weapon.$.name,
      // TODO: fix this conversion..
      // rating: weaponDB.rating
    };
  }
  return {
    name: gearDB.name,
    description: gearDB.description,
    category: gearDB.category,
    minRating: gearDB.minRating,
    maxRating: gearDB.maxRating,
    ratingMeaning: gearDB.ratingMeaning,
    includedWeapon: includedWeapon,
    allowCategoryList: gearDB.allowCategoryList,
    purchaseQuantity: gearDB.purchaseQuantity,
    bonus: gearDB.bonus,
    weaponBonus: gearDB.weaponBonus,
    isFlechetteAmmo: gearDB.isFlechetteAmmo,
    flechetteWeaponBonus: gearDB.flechetteWeaponBonus,
    ammoForWeaponType: gearDB.ammoForWeaponType,
    explosiveWeight: gearDB.explosiveWeight,
    userSelectable: gearDB.userSelectable,
    allowedGearList: gearDB.allowedGearList.map((gear) => {
      return gear.name;
    }),
    includedGearList: await Promise.all(
      gearDB.includedGearList.map(async (gear) => {
        return convertActiveGearDBToDTO(gear);
      })
    ),
    deviceRating: gearDB.deviceRating,
    programs: gearDB.programs,
    attributeArray: gearDB.attributeArray,
    attack: gearDB.attack,
    sleaze: gearDB.sleaze,
    dataProcessing: gearDB.dataProcessing,
    firewall: gearDB.firewall,
    canFormPersona: gearDB.canFormPersona,
    capacityInformation: gearDB.capacityInformation,
    armourCapacityInformation: gearDB.armourCapacityInformation,
    requirements: gearDB.requirements,
    requireParent: gearDB.requireParent,
    forbidden: gearDB.forbidden,
    modifyAttributeArray: gearDB.modifyAttributeArray,
    modifyAttack: gearDB.modifyAttack,
    modifySleaze: gearDB.modifySleaze,
    modifyDataProcessing: gearDB.modifyDataProcessing,
    modifyFirewall: gearDB.modifyFirewall,
    addMatrixBoxes: gearDB.addMatrixBoxes,
    renameCustomLabel: gearDB.renameCustomLabel,
    availability: gearDB.availability,
    cost: gearDB.cost,
    source: gearDB.source,
    page: gearDB.page,
  };
};

const convertCustomAugmentationDBToDTO = async function (
  customisedAugmentationDB: CustomisedAugmentations
): Promise<CustomisedAugmentationType> {
  const db = await init();
  const augmentationDB = await db.em.findOne(
    Augmentations,
    customisedAugmentationDB.augmentation.id,
    {
      populate: ["*"],
    }
  );
  if (augmentationDB === null) {
    throw new Error("Augmentation does not exist");
  }

  return {
    baseAugmentation: augmentationDB.name,
    gearList: await Promise.all(
      customisedAugmentationDB.gearList.map(async (childGear) => {
        return convertActiveGearDBToDTO(childGear);
      })
    ),
    grade: customisedAugmentationDB.grade,
  };
};

export const convertAugmentationDBToDTO = async function (
  augmentationDB: Augmentations
): Promise<AugmentationType> {
  const typeInformation = await convertAugmentationTypeInformation(
    augmentationDB
  );

  let addWeapon;
  if (augmentationDB.addWeapon !== undefined) {
    addWeapon = await augmentationDB.addWeapon.load();
    if (addWeapon === null) {
      throw new Error("Weapon does not exist");
    }
    addWeapon = addWeapon.name;
  }

  return {
    ...typeInformation,
    name: augmentationDB.name,
    description: augmentationDB.description,
    wireless: augmentationDB.wireless,
    augmentationLimit: augmentationDB.augmentationLimit,
    unavailableGrades: augmentationDB.unavailableGrades,
    essenceCost: augmentationDB.essenceCost,
    modification: augmentationDB.modification,
    rating: augmentationDB.rating,
    ratingMeaning: augmentationDB.ratingMeaning,
    addWeapon: addWeapon,
    blockedMountList: augmentationDB.blockedMountList,
    selectSide: augmentationDB.selectSide,
    bonus: augmentationDB.bonus,
    pairBonus: augmentationDB.pairBonus,
    pairIncludeList: augmentationDB.pairIncludeList.map((augmentation) => {
      return augmentation.name;
    }),
    requirements: augmentationDB.requirements,
    forbidden: augmentationDB.forbidden,
    allowedGearList: augmentationDB.allowedGearList.map((gear) => {
      return gear.name;
    }),
    includedGearList: await Promise.all(
      augmentationDB.includedGearList.map(async (gear) => {
        const loadedGear = await gear.gear.load();
        if (loadedGear === null) {
          throw new Error("Gear does not exist");
        }
        return await convertActiveGearDBToDTO(gear);
      })
    ),
    allowedGearCategories: augmentationDB.allowedGearCategories,
    userSelectable: augmentationDB.userSelectable,
    allowSubsystemCategoryList: augmentationDB.allowSubsystemCategoryList,
    availability: augmentationDB.availability,
    cost: augmentationDB.cost,
    source: augmentationDB.source,
    page: augmentationDB.page,
  };
};

const convertAugmentationTypeInformation = async function (
  augmentationDB: Augmentations
) {
  if (augmentationDB instanceof Cyberwares) {
    let addVechicle;
    if (augmentationDB.linkedVehicle !== undefined) {
      addVechicle = await augmentationDB.linkedVehicle.load();
      if (addVechicle === null) {
        throw new Error("Vehicle does not exist");
      }
    }
    return {
      type: augmentationTypeEnum.Cyberware as const,
      subtype: augmentationDB.subtype,
      programs: augmentationDB.programs,
      capacity: augmentationDB.capacity,
      capacityCost: augmentationDB.capacityCost,
      addToParentCapacity: augmentationDB.addToParentCapacity,
      addParentWeaponAccessory: augmentationDB.addParentWeaponAccessory,
      removalCost: augmentationDB.removalCost,
      inheritAttributes: augmentationDB.inheritAttributes,
      limbSlot: augmentationDB.limbSlot,
      useBothLimbSlots: augmentationDB.useBothLimbSlots,
      mountsLocation: augmentationDB.mountsLocation,
      modularMount: augmentationDB.modularMount,
      wirelessBonus: augmentationDB.wirelessBonus,
      wirelessPairBonus: augmentationDB.wirelessPairBonus,
      ...(augmentationDB.wirelessPairLinkedCyberware !== undefined && {
        wirelessPairInclude: augmentationDB.wirelessPairLinkedCyberware.name,
      }),
      subsystemList: augmentationDB.subsystemList,
      forceGrade: augmentationDB.forceGrade,
      deviceRating: augmentationDB.deviceRating,
      addVechicle: addVechicle,
      wireless: augmentationDB.wireless,
    };
  } else if (augmentationDB instanceof Biowares) {
    return {
      type: augmentationTypeEnum.Bioware as const,
      subtype: augmentationDB.subtype,
      ...(augmentationDB.isGeneware !== undefined && {
        isGeneware: true as const,
      }),
    };
  } else {
    throw new Error(
      `Augmentation type unknown augmentation ${augmentationDB.name}, class ${augmentationDB.constructor.name}`
    );
  }
};

const convertActiveVehicleModDBToDTO = async function (
  activeVehicleModificationDB: ActiveVehicleModifications
): Promise<CustomisedVehicleModType> {
  const db = await init();
  const modDB = await db.em.findOne(
    ActiveVehicleModifications,
    activeVehicleModificationDB.id,
    {
      populate: ["*"],
    }
  );
  if (modDB === null) {
    throw new Error("Vehicle mod does not exist");
  }
  const subsystemList = modDB.associatedCyberwareList.map((cyberware) => {
    return cyberware.name;
  });
  return {
    baseMod: modDB.vehicleModification.$.name,
    subsystemList: subsystemList,
    rating: modDB.rating,
  };
};
const convertActiveVehicleDBToDTO = async function (
  activeVehicleDB: ActiveVehicles
): Promise<CustomisedVehicleType> {
  const db = await init();
  const vehicleDB = await db.em.findOne(Vehicles, activeVehicleDB.vehicle.id, {
    populate: ["*"],
  });
  if (vehicleDB === null) {
    throw new Error("Vehicle does not exist");
  }
  return {
    baseVehicle: vehicleDB.name,
    gearList: await Promise.all(
      activeVehicleDB.gearList.map((gear) => {
        return convertActiveGearDBToDTO(gear);
      })
    ),
    weaponMountList: await Promise.all(
      activeVehicleDB.weaponMountList.map((weaponMount) => {
        return convertActiveWeaponMountDBToDTO(weaponMount);
      })
    ),
    customName: activeVehicleDB.customName,
  };
};
const convertActiveWeaponMountDBToDTO = async function (
  activeWeaponMountDB: ActiveWeaponMounts
): Promise<CustomisedWeaponMountType> {
  const db = await init();
  const weaponMountDB = await db.em.findOne(
    WeaponMounts,
    activeWeaponMountDB.weaponMount.id,
    {
      populate: ["*"],
    }
  );
  if (weaponMountDB === null) {
    throw new Error("Weapon Mount does not exist");
  }
  let weaponId;
  if (activeWeaponMountDB.mountedWeapon !== undefined) {
    weaponId = activeWeaponMountDB.mountedWeapon.id;
  }
  let weaponMounted;
  if (weaponId !== undefined) {
    const weaponMounted = await db.em.findOne(WeaponMountWeapons, weaponId, {
      populate: ["*"],
    });
    if (weaponMounted === null) {
      throw new Error("Weapon does not exist");
    }
  }

  return {
    control: weaponMountDB.control,
    flexibility: weaponMountDB.flexibility,
    size: weaponMountDB.size,
    visibility: weaponMountDB.visibility,
    weaponExchangeable: activeWeaponMountDB.weaponExchangeable,
    weaponMounted: weaponMounted,
    weaponMountModList: activeWeaponMountDB.mountMods.map((mod) => {
      return mod.name;
    }),
  };
};

export const convertVehicleDBToDTO = async function (
  vehicleDB: Vehicles
): Promise<VehicleType> {
  const typeInformation = convertVehicleTypeInformation(vehicleDB);
  return {
    ...typeInformation,
    name: vehicleDB.name,
    description: vehicleDB.description,
    handling: vehicleDB.handling,
    speed: vehicleDB.speed,
    acceleration: vehicleDB.acceleration,
    body: vehicleDB.body,
    armour: vehicleDB.armour,
    pilot: vehicleDB.pilot,
    sensor: vehicleDB.sensor,
    includedGearList: await Promise.all(
      vehicleDB.includedGearList.map(async (gear) => {
        const loadedGear = await gear.gear.load();
        if (loadedGear === null) {
          throw new Error("Gear does not exist");
        }
        return await convertActiveGearDBToDTO(gear);
      })
    ),
    includedModList: await Promise.all(
      vehicleDB.includedModList.map(async (mod) => {
        const loadedMod = await mod.vehicleModification.load();
        if (loadedMod === null) {
          throw new Error("Vehicle Mod does not exist");
        }
        return {
          baseMod: loadedMod.name,
          // TODO: fix all these conversions up to include all the missing
          rating: mod.rating,
        };
      })
    ),
    modSlots: vehicleDB.modSlots,
    powerTrainModSlots: vehicleDB.powerTrainModSlots,
    protectionModSlots: vehicleDB.protectionModSlots,
    weaponModSlots: vehicleDB.weaponModSlots,
    bodyModSlots: vehicleDB.bodyModSlots,
    electromagneticModSlots: vehicleDB.electromagneticModSlots,
    cosmeticModSlots: vehicleDB.cosmeticModSlots,
    // TODO: add
    // weaponList: vehicleDB.weaponList,
    // weaponMountList: vehicleDB.weaponMountList,
    userSelectable: vehicleDB.userSelectable,
    availability: vehicleDB.availability,
    cost: vehicleDB.cost,
    source: vehicleDB.source,
    page: vehicleDB.page,
  };
};

const convertVehicleTypeInformation = function (vehicleDB: Vehicles) {
  if (vehicleDB instanceof Groundcrafts) {
    return {
      type: vehicleTypeEnum.Groundcraft as const,
      subtype: vehicleDB.subtype,
      seats: vehicleDB.seats,
    };
  } else if (vehicleDB instanceof Watercrafts) {
    return {
      type: vehicleTypeEnum.Watercraft as const,
      subtype: vehicleDB.subtype,
      seats: vehicleDB.seats,
    };
  } else if (vehicleDB instanceof Aircrafts) {
    return {
      type: vehicleTypeEnum.Aircraft as const,
      subtype: vehicleDB.subtype,
      seats: vehicleDB.seats,
    };
  } else if (vehicleDB instanceof Drones) {
    return {
      type: vehicleTypeEnum.Drone as const,
      subtype: vehicleDB.subtype,
    };
  } else {
    throw new Error(
      `Vehicle type unknown vehicle ${vehicleDB.name}, class ${vehicleDB.constructor.name}`
    );
  }
};

const convertActiveMartialArtDBToDTO = async function (
  activeMartialArtDB: ActiveMartialArts
): Promise<MartialArtSelectedType> {
  const db = await init();
  const martialArtDB = await db.em.findOne(
    MartialArts,
    activeMartialArtDB.martialArt.id,
    {
      populate: ["*"],
    }
  );
  if (martialArtDB === null) {
    throw new Error("Martial Art does not exist");
  }
  const martialArt = {
    name: martialArtDB.name,
    bonus: martialArtDB.bonus,
    techniqueList: martialArtDB.techniqueList.$.map((technique) => {
      return technique.name;
    }),
    karmaCost: martialArtDB.karmaCost,
    requirements: martialArtDB.requirements,
    description: martialArtDB.description,
    source: martialArtDB.source,
    page: martialArtDB.page,
  };
  const techniqueList = activeMartialArtDB.selectedTechniqueList.map(
    (technique) => {
      return {
        name: technique.name,
        bonus: technique.bonus,
        requirements: technique.requirements,
        description: technique.description,
        source: technique.source,
        page: technique.page,
      };
    }
  );

  return {
    martialArt: martialArt,
    techniqueList: techniqueList,
  };
};

const convertActiveLifestyleDBToDTO = async function (
  activeLifestyleDB: ActiveLifestyles
): Promise<LifestyleSelectedType> {
  const db = await init();
  const lifestyleDB = await db.em.findOne(
    Lifestyles,
    activeLifestyleDB.lifestyle.id,
    {
      populate: ["*"],
    }
  );
  if (lifestyleDB === null) {
    throw new Error("Lifestyle does not exist");
  }
  const lifestyle = {
    name: lifestyleDB.name,
    cost: lifestyleDB.cost,
    lifestylePoints: lifestyleDB.lifestylePoints,
    allowBonusLifestylePoints: lifestyleDB.allowBonusLifestylePoints,
    freegridList: lifestyleDB.freegridList,
    dice: lifestyleDB.dice,
    startingNuyenMultiplier: lifestyleDB.startingNuyenMultiplier,
    costIncreasePerCategoryLevelIncrease:
      lifestyleDB.costIncreasePerCategoryLevelIncrease,
    lifestyleCategoryDefaults: lifestyleDB.lifestyleCategoryDefaults,
    bonus: lifestyleDB.bonus,
    requirements: lifestyleDB.requirements,
    forbidden: lifestyleDB.forbidden,
    source: lifestyleDB.source,
    page: lifestyleDB.page,
    description: lifestyleDB.description,
  };
  const lifestyleQualityList = activeLifestyleDB.lifestyleQualityList.map(
    (lifestyleQuality) => {
      return {
        name: lifestyleQuality.name,
        category: lifestyleQuality.category,
        monthlyCost: lifestyleQuality.monthlyCost,
        lifestylePointCost: lifestyleQuality.lifestylePointCost,
        lifestyleCostMultiplier: lifestyleQuality.lifestyleCostMultiplier,
        requiredLifestyleList: lifestyleQuality.requiredLifestyleList.map(
          (lifestyle) => {
            return lifestyle.name;
          }
        ),
        multipleAllowed: lifestyleQuality.multipleAllowed,
        bonus: lifestyleQuality.bonus,
        requirements: lifestyleQuality.requirements,
        forbidden: lifestyleQuality.forbidden,
        source: lifestyleQuality.source,
        page: lifestyleQuality.page,
        description: lifestyleQuality.description,
      };
    }
  );

  return {
    lifestyle: lifestyle,
    lifestyleQualityList: lifestyleQualityList,
    purchasedDuration: activeLifestyleDB.purchasedDuration,
  };
};

export const characterRouter = router({
  traditions: traditions,
  mentors: mentors,
  critters: critters,
  spells: spells,
  complexForms: complexForms,
  adeptPowers: adeptPowers,
  programs: programs,
  skills: skills,
  qualities: qualities,
  priorities: priorities,
  heritages: heritages,
  weapons: weaponAccessory,
  armours: armours,
  gear: gears,
  augmentations: augmentations,
  vehiclesAndDrones: vehiclesAndDrones,
  martialArts: martialArts,
  martialArtTechniques: martialArtTechniques,
  lifestyles: lifestyles,
  lifestyleQualities: lifestyleQualities,
  equipmentPacks: equipmentPacks,
  all: all,
  createCharacter: createCharacter,
  getCharacter: getCharacter,
  getCharacterList: getCharacterList,
});

async function getHeritageTypeInformation(heritageDB: Heritages) {
  let typeInformation;
  if (heritageDB instanceof Metahumans) {
    typeInformation = {
      category: heritageCategoryEnum.Metahuman as const,
    };
  } else if (heritageDB instanceof Metasapients) {
    typeInformation = {
      category: heritageCategoryEnum.Metasapient as const,
    };
  } else if (heritageDB instanceof Shapeshifters) {
    typeInformation = {
      category: heritageCategoryEnum.Shapeshifter as const,
    };
  } else if (heritageDB instanceof Metavariants) {
    const db = await init();
    const baseHeritage = await db.em.findOne(
      BaseHeritages,
      heritageDB.baseHeritage.id,
      {
        populate: ["*"],
      }
    );
    if (baseHeritage === null) {
      throw new Error("Heritage does not exist");
    }
    typeInformation = {
      category: heritageCategoryEnum.Metavariant as const,
      baseHeritage: baseHeritage.name,
    };
  } else {
    throw new Error(
      `Unknown heritage type heritage ${heritageDB.name}, class ${heritageDB.constructor.name}`
    );
  }
  return typeInformation;
}

function parsePriority(
  priority: Loaded<Priorities, "*" | "heritageList" | "talentList", "*", never>
): PriorityRowType {
  const heritageList = priority.heritageList.$.map((heritage) => {
    let metavariantList;
    if (heritage.metavariantList.$.length > 0) {
      metavariantList = heritage.metavariantList.$.map((metavariant) => {
        return {
          name: metavariant.linkedHeritage.$.name,
          specialAttributePoints: metavariant.specialAttributePoints,
          karmaCost: metavariant.karmaCost,
        };
      });
    }

    return {
      name: heritage.linkedHeritage.$.name,
      specialAttributePoints: heritage.specialAttributePoints,
      karmaCost: heritage.karmaCost,
      metavariantList: metavariantList,
    };
  });

  const talentList = priority.talentList.$.map((talent) => {
    let includedSkills;
    if (talent.includedSkills !== undefined) {
      includedSkills = {
        points: talent.includedSkills.points,
        rating: talent.includedSkills.rating,
        skillList: talent.includedSkills.skillList.$.map((skill) => {
          return skill.name;
        }),
      };
    }
    let includedSkillSource;
    if (talent.includedSkillSource !== undefined) {
      includedSkillSource = {
        points: talent.includedSkillSource.points,
        rating: talent.includedSkillSource.rating,
        source: talent.includedSkillSource.source,
      };
    }
    let includedSkillGroups;
    if (talent.includedSkillGroups !== undefined) {
      includedSkillGroups = {
        points: talent.includedSkillGroups.points,
        rating: talent.includedSkillGroups.rating,
        groupList: talent.includedSkillGroups.skillGroupList.$.map((group) => {
          return group.name;
        }),
      };
    }

    const baseTalent = {
      name: talent.name,
      label: talent.label,
      includedQuality: talent.includedQuality?.$.name,
      includedSkills: includedSkills || includedSkillSource,
      includedSkillGroups: includedSkillGroups,
      required: talent.requirements,
      forbidden: talent.forbidden,
    };

    if (talent instanceof MagicTalentPriorityDetails) {
      return {
        ...baseTalent,
        category: talentCategoryEnum.Magic as const,
        magic: talent.magic,
        formulae: talent.formulae,
      };
    } else if (talent instanceof ResonanceTalentPriorityDetails) {
      return {
        ...baseTalent,
        category: talentCategoryEnum.Resonance as const,
        resonance: talent.resonance,
        complexForms: talent.complexForms,
      };
    } else if (talent instanceof DepthTalentPriorityDetails) {
      return {
        ...baseTalent,
        category: talentCategoryEnum.Depth as const,
        depth: talent.depth,
      };
    } else if (talent instanceof MundaneTalentPriorityDetails) {
      return {
        ...baseTalent,
        category: talentCategoryEnum.Mundane as const,
      };
    } else {
      throw Error(
        `Talent type is unknown talent ${talent.name}, class ${talent.constructor.name}`
      );
    }
  });

  return {
    priority: priority.rowLetter,
    heritages: {
      name: priority.heritageLabel,
      heritageList: heritageList,
    },

    talents: {
      name: priority.talentLabel,
      talentList: talentList,
    },
    attributes: priority.attributes,
    skills: priority.skills,
    resources: priority.resources,
  };
}
