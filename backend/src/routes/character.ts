import * as logger from "../utils/logger.js";

import { router, privateProcedure, type LoggedInContext } from "../trpc.js";
import {
  ActiveArmourModifications,
  ActiveArmours,
  ActiveAugmentationGears,
  ActiveDepthTalents,
  ActiveGears,
  ActiveLifestyles,
  ActiveMagicTalents,
  ActiveMartialArts,
  ActiveMentorSpirits,
  ActiveParagons,
  ActivePrograms,
  ActiveQualities,
  ActiveResonanceTalents,
  ActiveTalents,
  ActiveVehicleModifications,
  ActiveVehicles,
  ActiveWeaponAccessories,
  ActiveWeaponMounts,
  ActiveWeapons,
  AdeptPowers,
  Aircrafts,
  AllSpiritsTraditions,
  ArmourModifications,
  Armours,
  Augmentations,
  BaseHeritages,
  Biowares,
  Bonuses,
  Characters,
  DraftCharacters,
  ChildGears,
  ComplexForms,
  Critters,
  CritterPowers,
  CustomisedArmourModifications,
  CustomisedArmours,
  CustomisedAugmentations,
  CustomisedGears,
  CustomisedLifestyles,
  CustomisedQualities,
  CustomisedSkillGroups,
  CustomisedSkills,
  CustomisedVehicleModifications,
  CustomisedVehicles,
  CustomisedWeaponAccessories,
  CustomisedWeapons,
  Cyberwares,
  DepthTalentPriorityDetails,
  Drones,
  EquipmentPacks,
  Explosives,
  FirearmWeapons,
  Gears,
  Groundcrafts,
  Heritages,
  LifestyleQualities,
  Lifestyles,
  LinkedSpiritsTraditions,
  MagicTalentPriorityDetails,
  MartialArtTechniques,
  MartialArts,
  MeleeWeapons,
  MentorSpirits,
  Mentors,
  Metahumans,
  Metasapients,
  Metavariants,
  MundaneTalentPriorityDetails,
  Paragons,
  Priorities,
  Programs,
  ProjectileWeapons,
  Qualities,
  ResonanceTalentPriorityDetails,
  Shapeshifters,
  SkillGroups,
  Skills,
  Spells,
  Traditions,
  UnlinkedSpiritsTraditions,
  Users,
  VehicleChasisModifications,
  VehicleModifications,
  Vehicles,
  Watercrafts,
  WeaponAccessories,
  WeaponMountModifications,
  WeaponMountWeapons,
  WeaponMounts,
  Weapons,
  BaseActiveAugmentations,
  Requirements,
} from "@neon-codex/database";
import { init } from "../utils/db.js";
import { ref } from "@mikro-orm/postgresql";
import {
  AttributesSchema,
  SpecialAttributesSchema,
  CharacterCreatorBonusListSchema,
  CustomSkillGroupListSchema,
  CustomSkillListSchema,
  HeritagePrioritySelectedSchema,
  LifestyleSelectedListSchema,
  MartialArtSelectedSchema,
  PriorityLevelsSchema,
  QualitySelectedListSchema,
  type AdeptPowerListSelectedType,
  CreateDraftCharacterSchema,
  UpdateDraftCharacterSchema,
  type DraftCharacterDataType,
  TalentInfoSchema,
  SelectedEquipmentListSchema,
  type AdeptPowerListType,
  type ArmourListType,
  type ArmourModListType,
  type ArmourModType,
  type ArmourType,
  type AugmentationListType,
  type AugmentationType,
  type BonusFreeSpellOngoingBonusType,
  type BonusSpellModifiersType,
  type BonusType,
  type BonusCombatAndWeaponOptionType,
  type BonusMovementAndLifestyleOptionType,
  type BonusGearAndVehicleOptionType,
  type BonusEssenceAndAugmentationType,
  type CharacterSummaryListType,
  type CharacterSummaryType,
  type CharacterType,
  type ComplexFormListType,
  type CritterListType,
  type CritterPowerType,
  type CustomQualityType,
  type CustomSkillType,
  type CustomSpiritsType,
  type CustomisedArmourListType,
  type CustomisedArmourModType,
  type CustomisedArmourType,
  type CustomisedAugmentationListType,
  type CustomisedAugmentationType,
  type CustomisedGearType,
  type CustomisedVehicleListType,
  type CustomisedVehicleModType,
  type CustomisedVehicleType,
  type CustomisedWeaponAccessoryType,
  type CustomisedWeaponMountType,
  type CustomisedWeaponType,
  type DraftCharacterResponseType,
  type DraftCharacterSummaryListType,
  type EquipmentListType,
  type EquipmentPackListType,
  type FormulaListSelectedType,
  type GearListType,
  type GearType,
  type HeritageListType,
  type HeritageType,
  type LifestyleListType,
  type LifestyleQualityListType,
  type LifestyleSelectedType,
  type LifestyleType,
  type MartialArtListType,
  type MartialArtSelectedType,
  type MartialArtTechniqueListType,
  type MentorBaseType,
  type MentorListType,
  type PriorityRowType,
  type PriorityTableType,
  type ProgramListType,
  type ProgramSelectedListType,
  type QualityListType,
  type QualityType,
  type SelectSkillType,
  type SkillListType,
  type SpellListType,
  type TraditionListType,
  type VehicleListType,
  type VehicleModListType,
  type VehicleModType,
  type VehicleType,
  type WeaponAccessoryListType,
  type WeaponAccessoryType,
  type WeaponListType,
  type WeaponMountModListType,
  type WeaponMountModType,
  type WeaponType,
  augmentationCategoryEnum,
  bonusSkillModifierTypeEnum,
  heritageCategoryEnum,
  inclusionTypeEnum,
  mentorCategoryEnum,
  priorityLetterEnum,
  talentCategoryEnum,
  vehicleCategoryEnum,
  weaponCategoryEnum,
  type AugmentationTypeInformationType,
  type CreateDraftCharacterType,
  type UpdateDraftCharacterType,
  type BonusDamageValueModifiersType,
  type RequirementsType,
  type RequirementOneOfType,
  type RequirementLeafType,
  type NonTopRequirementsType,
  type ParentRequirementsType,
  type RequirementOtherSubType,
  RequirementOtherSubSchema,
  commonRequirementTypeEnum,
  genericRequirementTypeEnum,
  weaponRequirementTypeEnum,
  otherRequirementTypeEnum,
  skillTypeEnum,
  type RequirementAllOfType,
  type ExplosiveWeaponSpecificType,
  type FirearmOptionsType,
  type FirearmWeaponSpecificType,
  type MeleeWeaponSpecificType,
  type ProjectileWeaponSpecificType,
  type MeleeOptionsType,
  type GroundcraftClassificationVehicleType,
  type WatercraftClassificationVehicleType,
  type AircraftClassificationVehicleType,
  type DroneClassificationVehicleType,
} from "@neon-codex/common";
import type { Loaded } from "@mikro-orm/postgresql";
import type { Reference } from "@mikro-orm/core";
import assert from "assert";
import { type } from "arktype";
import type { TRPCMutationProcedure } from "@trpc/server";

function isEmpty(obj: object): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export async function safeLoad<T extends object>(
  requirement: Reference<T>,
  errorMessage: string
): Promise<T> {
  const entity = await requirement.load();
  if (entity === null) {
    throw new Error(errorMessage);
  }
  return entity;
}

async function extractParentDetails(
  DBRequirement: Requirements
): Promise<ParentRequirementsType | undefined> {
  const dbParentDetails = DBRequirement.parentDetails;

  if (dbParentDetails === undefined || dbParentDetails === null) {
    return undefined;
  }

  if ("generic" in dbParentDetails) {
    const genericObj = dbParentDetails.generic;
    if (genericObj.type === genericRequirementTypeEnum.Name) {
      if (genericObj.value.partialName === true) {
        return {
          type: commonRequirementTypeEnum.Inner,
          generic: {
            type: genericRequirementTypeEnum.Name,
            value: {
              name: genericObj.value.name,
              partialName: true,
            },
          },
        };
      }

      let parentName: string | undefined;
      if (DBRequirement.parentWeapon !== undefined) {
        const weapon = await safeLoad(
          DBRequirement.parentWeapon,
          `Broken FK parentWeapon on requirement #${DBRequirement.id}`
        );
        parentName = weapon.name;
      }
      if (
        parentName === undefined &&
        DBRequirement.parentAugmentation !== undefined
      ) {
        const augmentation = await safeLoad(
          DBRequirement.parentAugmentation,
          `Broken FK parentAugmentation on requirement #${DBRequirement.id}`
        );
        parentName = augmentation.name;
      }
      if (parentName === undefined && DBRequirement.parentGear !== undefined) {
        const gear = await safeLoad(
          DBRequirement.parentGear,
          `Broken FK parentGear on requirement #${DBRequirement.id}`
        );
        parentName = gear.name;
      }
      if (
        parentName === undefined &&
        DBRequirement.parentVehicle !== undefined
      ) {
        const vehicle = await safeLoad(
          DBRequirement.parentVehicle,
          `Broken FK parentVehicle on requirement #${DBRequirement.id}`
        );
        parentName = vehicle.name;
      }
      if (
        parentName === undefined &&
        DBRequirement.parentArmour !== undefined
      ) {
        const armour = await safeLoad(
          DBRequirement.parentArmour,
          `Broken FK parentArmour on requirement #${DBRequirement.id}`
        );
        parentName = armour.name;
      }
      if (
        parentName === undefined &&
        DBRequirement.parentWeaponAccessory !== undefined
      ) {
        const weaponAccessory = await safeLoad(
          DBRequirement.parentWeaponAccessory,
          `Broken FK parentWeaponAccessory on requirement #${DBRequirement.id}`
        );
        parentName = weaponAccessory.name;
      }
      if (
        parentName === undefined &&
        DBRequirement.parentArmourModification !== undefined
      ) {
        const armourModification = await safeLoad(
          DBRequirement.parentArmourModification,
          `Broken FK parentArmourModification on requirement #${DBRequirement.id}`
        );
        parentName = armourModification.name;
      }
      if (
        parentName === undefined &&
        DBRequirement.parentCritter !== undefined
      ) {
        const critter = await safeLoad(
          DBRequirement.parentCritter,
          `Broken FK parentCritter on requirement #${DBRequirement.id}`
        );
        parentName = critter.name;
      }

      if (parentName === undefined) {
        throw new Error(
          `Generic Name parent has no linked entity for requirement #${DBRequirement.id}`
        );
      }

      return {
        type: commonRequirementTypeEnum.Inner,
        generic: {
          type: genericRequirementTypeEnum.Name,
          value: {
            name: parentName,
          },
        },
      };
    }
    return dbParentDetails;
  } else if ("gear" in dbParentDetails) {
    const gearObj = dbParentDetails.gear;
    if (gearObj.type === genericRequirementTypeEnum.Name) {
      if (
        "partialName" in gearObj.value &&
        gearObj.value.partialName === true
      ) {
        return {
          type: commonRequirementTypeEnum.Inner,
          gear: {
            type: genericRequirementTypeEnum.Name,
            value: {
              name: gearObj.value.name,
              partialName: true,
            },
          },
        };
      }
      assert(
        DBRequirement.parentGear !== undefined,
        `Parent gear FK is missing: ${DBRequirement.id}`
      );
      const gear = await safeLoad(
        DBRequirement.parentGear,
        `Broken FK parentGear on requirement #${DBRequirement.id}`
      );
      return {
        type: commonRequirementTypeEnum.Inner,
        gear: {
          type: genericRequirementTypeEnum.Name,
          value: {
            name: gear.name,
          },
        },
      };
    }
    return dbParentDetails;
  } else if ("vehicle" in dbParentDetails) {
    const vehicleObj = dbParentDetails.vehicle;
    if (vehicleObj.type === genericRequirementTypeEnum.Name) {
      if (
        "partialName" in vehicleObj.value &&
        vehicleObj.value.partialName === true
      ) {
        return {
          type: commonRequirementTypeEnum.Inner,
          vehicle: {
            type: genericRequirementTypeEnum.Name,
            value: {
              name: vehicleObj.value.name,
              partialName: true,
            },
          },
        };
      }
      assert(
        DBRequirement.parentVehicle !== undefined,
        `Parent vehicle FK is missing: ${DBRequirement.id}`
      );
      const vehicle = await safeLoad(
        DBRequirement.parentVehicle,
        `Broken FK parentVehicle on requirement #${DBRequirement.id}`
      );
      return {
        type: commonRequirementTypeEnum.Inner,
        vehicle: {
          type: genericRequirementTypeEnum.Name,
          value: {
            name: vehicle.name,
          },
        },
      };
    }
    return dbParentDetails;
  } else if ("weapon" in dbParentDetails) {
    const weaponObj = dbParentDetails.weapon;
    if (weaponObj.type === genericRequirementTypeEnum.Name) {
      if (
        "partialName" in weaponObj.value &&
        weaponObj.value.partialName === true
      ) {
        return {
          type: commonRequirementTypeEnum.Inner,
          weapon: {
            type: genericRequirementTypeEnum.Name,
            value: {
              name: weaponObj.value.name,
              partialName: true,
            },
          },
        };
      }
      assert(
        DBRequirement.parentWeapon !== undefined,
        `Parent weapon FK is missing: ${DBRequirement.id}`
      );
      const weapon = await safeLoad(
        DBRequirement.parentWeapon,
        `Broken FK parentWeapon on requirement #${DBRequirement.id}`
      );
      return {
        type: commonRequirementTypeEnum.Inner,
        weapon: {
          type: genericRequirementTypeEnum.Name,
          value: {
            name: weapon.name,
          },
        },
      };
    } else if (weaponObj.type === weaponRequirementTypeEnum.Skill) {
      if ("noOverride" in weaponObj.value) {
        return dbParentDetails;
      }
      assert(
        DBRequirement.parentWeaponSkill !== undefined,
        `Parent weapon skill FK is missing: ${DBRequirement.id}`
      );
      const skill = await safeLoad(
        DBRequirement.parentWeaponSkill,
        `Broken FK parentWeaponSkill on requirement #${DBRequirement.id}`
      );
      let specialisation: string | undefined;
      if ("specialisation" in weaponObj.value) {
        specialisation = weaponObj.value.specialisation;
      }
      return {
        type: commonRequirementTypeEnum.Inner,
        weapon: {
          type: weaponRequirementTypeEnum.Skill,
          value: {
            ...(skill.name !== undefined ? { skill: skill.name } : {}),
            ...(specialisation !== undefined ? { specialisation } : {}),
          },
        },
      };
    }
    return dbParentDetails;
  } else if ("weaponMount" in dbParentDetails) {
    // Control/Flexibility/Visibility are JSON-only (no FK column).
    // This covers leaves and nested AllOf/OneOf groups (e.g. multi-control OneOf).
    return dbParentDetails;
  }

  assert(
    false,
    `non undefined dbParentDetails ${JSON.stringify(dbParentDetails)}`
  );
}

async function extractOtherDetails(
  DBRequirement: Requirements
): Promise<RequirementOtherSubType | undefined> {
  const dbOtherDetails = DBRequirement.otherDetails;
  let reconstructed: RequirementOtherSubType | undefined;

  if (DBRequirement.otherQuality !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherQuality,
      `Broken FK otherQuality on requirement #${DBRequirement.id}`
    );
    let select: string | undefined;
    if (dbOtherDetails !== undefined && dbOtherDetails !== null) {
      assert(
        dbOtherDetails.type === otherRequirementTypeEnum.Quality,
        `Expected otherDetails.type to be Quality is ${dbOtherDetails.type}`
      );
      select = dbOtherDetails.value.select;
    }
    reconstructed = {
      type: otherRequirementTypeEnum.Quality,
      value: {
        quality: entity.name,
        ...(select !== undefined && { select }),
      },
    };
  } else if (DBRequirement.otherMartialArt !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherMartialArt,
      `Broken FK otherMartialArt on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.MartialArt,
      value: entity.name,
    };
  } else if (DBRequirement.otherMartialTechnique !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherMartialTechnique,
      `Broken FK otherMartialTechnique on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.MartialTechnique,
      value: entity.name,
    };
  } else if (DBRequirement.otherBioware !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherBioware,
      `Broken FK otherBioware on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Bioware,
      value: entity.name,
    };
  } else if (
    dbOtherDetails !== undefined &&
    dbOtherDetails !== null &&
    dbOtherDetails.type === otherRequirementTypeEnum.Cyberware &&
    "name" in dbOtherDetails.value &&
    "partialName" in dbOtherDetails.value &&
    dbOtherDetails.value.partialName === true
  ) {
    reconstructed = {
      type: otherRequirementTypeEnum.Cyberware,
      value: {
        name: dbOtherDetails.value.name,
        partialName: true as const,
      },
    };
  } else if (DBRequirement.otherCyberware !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherCyberware,
      `Broken FK otherCyberware on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Cyberware,
      value: {
        name: entity.name,
      },
    };
  } else if (DBRequirement.otherMetatype !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherMetatype,
      `Broken FK otherMetatype on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Metatype,
      value: entity.name,
    };
  } else if (DBRequirement.otherGear !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherGear,
      `Broken FK otherGear on requirement #${DBRequirement.id}`
    );
    let minimumRating: number | undefined;
    if (
      dbOtherDetails !== undefined &&
      dbOtherDetails !== null &&
      dbOtherDetails.type === otherRequirementTypeEnum.Gear
    ) {
      minimumRating = dbOtherDetails.value.minimumRating;
    }
    reconstructed = {
      type: otherRequirementTypeEnum.Gear,
      value: {
        name: entity.name,
        ...(minimumRating !== undefined ? { minimumRating } : {}),
      },
    };
  } else if (DBRequirement.otherSkill !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherSkill,
      `Broken FK otherSkill on requirement #${DBRequirement.id}`
    );
    let skillVal: number | undefined;
    let specialisation: string | undefined;
    let skillType: skillTypeEnum | undefined;

    if (
      dbOtherDetails !== undefined &&
      dbOtherDetails !== null &&
      dbOtherDetails.type === otherRequirementTypeEnum.Skill
    ) {
      skillVal = dbOtherDetails.value.value;
      specialisation = dbOtherDetails.value.specialisation;
      skillType = dbOtherDetails.value.type;
    }
    if (skillVal === undefined) {
      throw new Error(
        `Skill value missing for otherSkill requirement #${DBRequirement.id}`
      );
    }
    reconstructed = {
      type: otherRequirementTypeEnum.Skill,
      value: {
        name: entity.name,
        value: skillVal,
        ...(specialisation !== undefined ? { specialisation } : {}),
        ...(skillType !== undefined ? { type: skillType } : {}),
      },
    };
  } else if (DBRequirement.otherAccessory !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherAccessory,
      `Broken FK otherAccessory on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Accessory,
      value: entity.name,
    };
  } else if (DBRequirement.otherArmourMod !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherArmourMod,
      `Broken FK otherArmourMod on requirement #${DBRequirement.id}`
    );
    let sameParent: boolean | undefined;
    if (
      dbOtherDetails !== undefined &&
      dbOtherDetails !== null &&
      dbOtherDetails.type === otherRequirementTypeEnum.ArmourMod
    ) {
      sameParent = dbOtherDetails.value.sameParent;
    }
    reconstructed = {
      type: otherRequirementTypeEnum.ArmourMod,
      value: {
        name: entity.name,
        ...(sameParent === true ? { sameParent: true as const } : {}),
      },
    };
  } else if (DBRequirement.otherProgram !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherProgram,
      `Broken FK otherProgram on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Program,
      value: entity.name,
    };
  } else if (DBRequirement.otherLifestyle !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherLifestyle,
      `Broken FK otherLifestyle on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Lifestyle,
      value: entity.name,
    };
  } else if (DBRequirement.otherLifestyleQuality !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherLifestyleQuality,
      `Broken FK otherLifestyleQuality on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.LifestyleQuality,
      value: entity.name,
    };
  } else if (DBRequirement.otherTradition !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherTradition,
      `Broken FK otherTradition on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Tradition,
      value: entity.name,
    };
  } else if (DBRequirement.otherMetamagic !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherMetamagic,
      `Broken FK otherMetamagic on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Metamagic,
      value: entity.name,
    };
  } else if (DBRequirement.otherSpell !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherSpell,
      `Broken FK otherSpell on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.Spell,
      value: entity.name,
    };
  } else if (DBRequirement.otherAdeptPower !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherAdeptPower,
      `Broken FK otherAdeptPower on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.AdeptPower,
      value: entity.name,
    };
  } else if (DBRequirement.otherCritterPower !== undefined) {
    const entity = await safeLoad(
      DBRequirement.otherCritterPower,
      `Broken FK otherCritterPower on requirement #${DBRequirement.id}`
    );
    reconstructed = {
      type: otherRequirementTypeEnum.CritterPower,
      value: entity.name,
    };
  }

  if (
    reconstructed === undefined &&
    dbOtherDetails !== undefined &&
    dbOtherDetails !== null
  ) {
    const parsed = RequirementOtherSubSchema(dbOtherDetails);
    if (parsed instanceof type.errors) {
      throw new Error(
        `Invalid OtherDetails for Req #${DBRequirement.id}: ${parsed.summary}`
      );
    }
    return parsed;
  }

  if (reconstructed !== undefined) {
    const parsed = RequirementOtherSubSchema(reconstructed);
    if (parsed instanceof type.errors) {
      throw new Error(
        `Invalid OtherDetails for Req #${DBRequirement.id}: ${parsed.summary}`
      );
    }
    return parsed;
  }

  return undefined;
}

async function convertDBRequirementInternal(
  DBRequirement: Requirements,
  alreadyPopulated: boolean = false
): Promise<NonTopRequirementsType> {
  if (!alreadyPopulated) {
    const db = await init();
    await db.em.populate(DBRequirement, [
      "subRequirements.subRequirements",
      "parentWeapon",
      "parentAugmentation",
      "parentGear",
      "parentVehicle",
      "parentArmour",
      "parentWeaponAccessory",
      "parentArmourModification",
      "parentCritter",
      "parentWeaponSkill",
      "otherQuality",
      "otherMartialArt",
      "otherMartialTechnique",
      "otherBioware",
      "otherCyberware",
      "otherMetatype",
      "otherGear",
      "otherSkill",
      "otherAccessory",
      "otherArmourMod",
      "otherProgram",
      "otherLifestyle",
      "otherLifestyleQuality",
      "otherTradition",
      "otherMetamagic",
      "otherSpell",
      "otherAdeptPower",
      "otherCritterPower",
    ] as const);
  }

  const parentDetails = await extractParentDetails(DBRequirement);
  const otherDetails = await extractOtherDetails(DBRequirement);

  const leaf: RequirementLeafType | undefined =
    parentDetails !== undefined && otherDetails !== undefined
      ? {
          type: commonRequirementTypeEnum.Inner,
          parentDetails,
          otherDetails,
        }
      : parentDetails !== undefined
        ? { type: commonRequirementTypeEnum.Inner, parentDetails }
        : otherDetails !== undefined
          ? { type: commonRequirementTypeEnum.Inner, otherDetails }
          : undefined;

  const subRequirements = await DBRequirement.subRequirements.loadItems();
  let operator: RequirementAllOfType | RequirementOneOfType | undefined;
  if (subRequirements.length > 0) {
    if (DBRequirement.subRequirementsType === commonRequirementTypeEnum.AllOf) {
      operator = {
        type: commonRequirementTypeEnum.AllOf,
        allOf: await Promise.all(
          subRequirements.map((r) => convertDBRequirementInternal(r, true))
        ),
      };
    } else if (
      DBRequirement.subRequirementsType === commonRequirementTypeEnum.OneOf
    ) {
      operator = {
        type: commonRequirementTypeEnum.OneOf,
        oneOf: await Promise.all(
          subRequirements.map((r) => convertDBRequirementInternal(r, true))
        ),
      };
    }
  }

  if (leaf !== undefined && operator !== undefined) {
    throw new Error(
      `Requirement #${DBRequirement.id} has both leaf details and subRequirements; refusing to silently drop either`
    );
  }
  if (operator !== undefined) {
    return operator;
  }
  if (leaf !== undefined) {
    return leaf;
  }
  assert(false, `No details found for requirement #${DBRequirement.id}`);
}

// Type predicate functions
export function isInnerLeaf(
  req: RequirementsType | NonTopRequirementsType
): req is RequirementLeafType {
  return req.type === commonRequirementTypeEnum.Inner;
}

export function isStrictlyAllOf(
  req: RequirementsType | NonTopRequirementsType
): req is RequirementAllOfType {
  return req.type === commonRequirementTypeEnum.AllOf;
}

export function isStrictlyOneOf(
  req: RequirementsType | NonTopRequirementsType
): req is RequirementOneOfType {
  return req.type === commonRequirementTypeEnum.OneOf;
}

export async function convertDBRequirement(
  DBRequirement: Requirements
): Promise<RequirementsType> {
  const req = await convertDBRequirementInternal(DBRequirement);
  if (isStrictlyAllOf(req) || isStrictlyOneOf(req)) {
    return req;
  }
  return {
    type: commonRequirementTypeEnum.AllOf,
    allOf: [req],
  };
}

export async function convertDBBonus(DBbonus: Bonuses): Promise<BonusType> {
  const db = await init();
  await db.em.populate(DBbonus, [
    "skillIncreaseList.skill",
    "skillGroupList.skillGroup",
    "skillGroupList.excludeSkill",
    "unlockSkillList",
    "selectSkillRestrictionSkillList",
    "selectSkillRestrictionSkillGroupList",
    "selectExpertiseFromSkillList",
    "skillDisableSkillList",
    "skillDisableSkillGroupList",
    "swapSkillAttributeSkill",
    "swapSkillSpecialisationAttributeSkill",
    "blockSkillGroupAndDefaultingGroup",
    "addSkillSpecialisation.skillList",
    "specificPowerList.adeptPower",
    "specificPowerList.adeptPowerSelectSkillRestrictionSkillList",
    "specificPowerList.adeptPowerSelectSkillRestrictionSkillGroupList",
    "optionalCritterPowerList.critterPower",
    "addCritterPowerList.critterPower",
    "selectPowerLimitedPowerList",
    "addSpell",
    "addMetamagicList",
    "metamagicChoiceOrderRestrictionList.metamagic",
    "freeSpellOngoingBonusSkillLinked",
    "specificSpellDiceList.spell",
    "fadingModificationList.complexForm",
    "addEcho",
    "addWeaponList",
    "weaponLimitModifier.weapon",
    "weaponSkillDamageSelectionOptions.skillList",
    "weaponSkillDamageSelectionOptions.skillGroupList",
    "rangeModifiersReachWeaponName",
    "addMartialArt",
    "lifestyleCostModifierList.lifestyle",
    "addGear",
    "addGearIncludedGearList.gear",
    "addAugmentation",
    "addQualityList.quality",
    "freeQuality",
    "selectBonusQualityList",
    "reducedBonusQualityList.quality",
    "disableQualityList",
  ] as const);

  const bonus: BonusType = {};

  // --- attribute category ---
  if (DBbonus.attribute !== undefined) {
    bonus.attribute = {
      ...(DBbonus.attribute !== undefined && DBbonus.attribute),
    };
  }

  // --- skill category ---
  const skillIncreases = await DBbonus.skillIncreaseList.loadItems();
  const skillIncreasesForAttribute =
    await DBbonus.skillIncreaseForAttributeList.loadItems();
  const skillGroups = await DBbonus.skillGroupList.loadItems();
  const unlockSkills = await DBbonus.unlockSkillList.loadItems();
  const restrictSkills =
    await DBbonus.selectSkillRestrictionSkillList.loadItems();
  const restrictSkillGroups =
    await DBbonus.selectSkillRestrictionSkillGroupList.loadItems();
  const expertiseSkills =
    await DBbonus.selectExpertiseFromSkillList.loadItems();
  const disableSkills = await DBbonus.skillDisableSkillList.loadItems();
  const disableSkillGroups =
    await DBbonus.skillDisableSkillGroupList.loadItems();

  if (
    DBbonus.skill !== undefined ||
    skillIncreases.length > 0 ||
    skillIncreasesForAttribute.length > 0 ||
    skillGroups.length > 0 ||
    unlockSkills.length > 0 ||
    DBbonus.swapSkillAttributeSkill !== undefined ||
    DBbonus.swapSkillSpecialisationAttributeSkill !== undefined ||
    DBbonus.blockSkillGroupAndDefaultingGroup !== undefined ||
    restrictSkills.length > 0 ||
    restrictSkillGroups.length > 0 ||
    expertiseSkills.length > 0 ||
    disableSkills.length > 0 ||
    disableSkillGroups.length > 0 ||
    DBbonus.addSkillSpecialisation !== undefined
  ) {
    bonus.skill = {
      ...(DBbonus.skill !== undefined && DBbonus.skill),
      ...(skillIncreases.length > 0 && {
        skillIncreaseList: await Promise.all(
          skillIncreases.map(async (m) => {
            return {
              name: (await safeLoad(m.skill, "m.skill")).name,
              bonus: m.skillBonus,
              ...(m.precedence !== undefined && {
                precedence: m.precedence,
              }),
              ...(m.condition !== undefined && { condition: m.condition }),
              modifierType: m.modifierType,
            };
          })
        ),
      }),
      ...(skillIncreasesForAttribute.length > 0 && {
        skillIncreaseForAttributeList: skillIncreasesForAttribute.map((m) => {
          return {
            name: m.attribute,
            bonus: m.skillBonus,
            ...(m.precedence !== undefined && {
              precedence: m.precedence,
            }),
            ...(m.condition !== undefined && { condition: m.condition }),
            modifierType: m.modifierType,
          };
        }),
      }),
      ...(skillGroups.length > 0 && {
        skillGroupList: await Promise.all(
          skillGroups.map(async (m) => {
            return {
              name: (await safeLoad(m.skillGroup, "m.skillGroup")).name,
              bonus: m.skillBonus,
              ...(m.precedence !== undefined && {
                precedence: m.precedence,
              }),
              ...(m.condition !== undefined && { condition: m.condition }),
              ...(m.excludeSkill !== undefined && {
                exclude: (await safeLoad(m.excludeSkill, "m.excludeSkill"))
                  .name,
              }),
              modifierType: m.modifierType,
            };
          })
        ),
      }),
      ...(unlockSkills.length > 0 && {
        unlockSkillList: unlockSkills.map((s) => s.name),
      }),
      ...(DBbonus.unlockTalentSkillCategoryList !== undefined &&
        DBbonus.unlockTalentSkillCategoryList.length > 0 && {
          unlockTalentSkillCategoryList: DBbonus.unlockTalentSkillCategoryList,
        }),
      ...(DBbonus.swapSkillAttributeSkill !== undefined && {
        swapSkillAttribute: {
          skill: (
            await safeLoad(
              DBbonus.swapSkillAttributeSkill,
              "DBbonus.swapSkillAttributeSkill"
            )
          ).name,
          ...DBbonus.swapSkillAttributeConfig!,
        },
      }),
      ...(DBbonus.swapSkillSpecialisationAttributeSkill !== undefined && {
        swapSkillSpecialisationAttribute: {
          skill: (
            await safeLoad(
              DBbonus.swapSkillSpecialisationAttributeSkill,
              "DBbonus.swapSkillSpecialisationAttributeSkill"
            )
          ).name,
          ...DBbonus.swapSkillSpecialisationAttributeConfig!,
        },
      }),
      ...(DBbonus.blockSkillGroupAndDefaultingGroup !== undefined && {
        blockSkillGroupAndDefaulting: (
          await safeLoad(
            DBbonus.blockSkillGroupAndDefaultingGroup,
            "DBbonus.blockSkillGroupAndDefaultingGroup"
          )
        ).name,
      }),
      ...((restrictSkills.length > 0 || restrictSkillGroups.length > 0) && {
        selectSkill: {
          skill: {
            enterName: false as const,
            restriction: {
              ...(restrictSkills.length > 0 && {
                skillList: {
                  skillList: restrictSkills.map((s) => s.name),
                  limit: inclusionTypeEnum.Include,
                },
              }),
              ...(restrictSkillGroups.length > 0 && {
                skillGroupList: {
                  skillGroupList: restrictSkillGroups.map((g) => g.name),
                  limit: inclusionTypeEnum.Include as const,
                },
              }),
            },
          } satisfies SelectSkillType,
          bonus: {
            modifierType: bonusSkillModifierTypeEnum.Linked,
          },
        },
      }),
      ...(expertiseSkills.length > 0 && {
        selectExpertise: {
          availableSkillList: expertiseSkills.map((s) => s.name),
        },
      }),
      ...((disableSkills.length > 0 || disableSkillGroups.length > 0) && {
        skillDisableList: {
          ...(disableSkills.length > 0 && {
            skillList: disableSkills.map((s) => s.name),
          }),
          ...(disableSkillGroups.length > 0 && {
            skillGroupList: disableSkillGroups.map((g) => g.name),
          }),
        },
      }),
      ...(DBbonus.addSkillSpecialisation !== undefined && {
        addSkillSpecialisation: {
          spec: (
            await safeLoad(
              DBbonus.addSkillSpecialisation,
              "DBbonus.addSkillSpecialisation"
            )
          ).specialisation,
          skillList: (
            await (
              await safeLoad(
                DBbonus.addSkillSpecialisation,
                "DBbonus.addSkillSpecialisation"
              )
            ).skillList.loadItems()
          ).map((s) => s.name),
        },
      }),
    };
  }

  // --- power category ---
  const specificPowers = await DBbonus.specificPowerList.loadItems();
  const optionalPowers = await DBbonus.optionalCritterPowerList.loadItems();
  const critterPowers = await DBbonus.addCritterPowerList.loadItems();
  const limitedPowers = await DBbonus.selectPowerLimitedPowerList.loadItems();

  if (
    DBbonus.bonusAdeptPowerPoints !== undefined ||
    DBbonus.selectPower !== undefined ||
    limitedPowers.length > 0 ||
    specificPowers.length > 0 ||
    optionalPowers.length > 0 ||
    DBbonus.unlockCritterPowerCategory !== undefined ||
    critterPowers.length > 0
  ) {
    bonus.power = {
      ...(DBbonus.bonusAdeptPowerPoints !== undefined && {
        bonusAdeptPowerPoints: DBbonus.bonusAdeptPowerPoints,
      }),
      ...(DBbonus.selectPower !== undefined && {
        selectPower: {
          ...DBbonus.selectPower,
          ...(limitedPowers.length > 0 && {
            limitedPowerList: limitedPowers.map((p) => p.name),
          }),
        },
      }),
      ...(specificPowers.length > 0 && {
        specificPowerList: await Promise.all(
          specificPowers.map(async (m) => {
            const restrictSpecificPowerSkills =
              await m.adeptPowerSelectSkillRestrictionSkillList.loadItems();
            const restrictSpecificPowerSkillGroups =
              await m.adeptPowerSelectSkillRestrictionSkillGroupList.loadItems();

            let selectskillOverride;
            if (m.selectSkill !== undefined) {
              let selectSkill: SelectSkillType;
              if (m.selectSkill.enterName) {
                selectSkill = m.selectSkill;
              } else {
                selectSkill = {
                  ...m.selectSkill,
                  ...((restrictSpecificPowerSkills.length > 0 ||
                    restrictSpecificPowerSkillGroups.length > 0) && {
                    restriction: {
                      ...m.selectSkill?.restriction,
                      ...(restrictSpecificPowerSkills.length > 0 && {
                        skillList: {
                          skillList: restrictSpecificPowerSkills.map(
                            (s) => s.name
                          ),
                          limit: m.limitAttribute!,
                        },
                      }),
                      ...(restrictSpecificPowerSkillGroups.length > 0 && {
                        skillGroupList: {
                          skillGroupList: restrictSpecificPowerSkillGroups.map(
                            (g) => g.name
                          ),
                          limit: m.limitAttribute!,
                        },
                      }),
                    },
                  }),
                };
              }
              selectskillOverride = {
                select: {
                  skill: selectSkill,
                },
              };
            }
            return {
              name: (await safeLoad(m.adeptPower, "m.adeptPower")).name,
              ...(m.powerBonus !== undefined && {
                bonusOverride: {
                  value: m.powerBonus,
                  ...(selectskillOverride !== undefined && selectskillOverride),
                },
              }),
            };
          })
        ),
      }),
      ...(optionalPowers.length > 0 && {
        unlockOptionalCritterPowerList: {
          selectOptionalPowerCount: DBbonus.unlockOptionalPowerConfig!,
          optionalPowerList: await Promise.all(
            optionalPowers.map(async (m) => ({
              name: (await safeLoad(m.critterPower, "m.critterPower")).name,
              ...(m.select !== undefined && { select: m.select }),
            }))
          ),
        },
      }),
      ...(DBbonus.unlockCritterPowerCategory !== undefined && {
        unlockCritterPowerCategory: DBbonus.unlockCritterPowerCategory,
      }),
      ...(critterPowers.length > 0 && {
        addCritterPowerList: await Promise.all(
          critterPowers.map(async (m) => ({
            name: (await safeLoad(m.critterPower, "m.critterPower")).name,
            ...(m.select !== undefined && { select: m.select }),
            ...(m.rating !== undefined && { rating: m.rating }),
          }))
        ),
      }),
    };
  }

  // --- spellAndMagic category ---
  const specificSpellDice = await DBbonus.specificSpellDiceList.loadItems();
  const metamagicRestrictions =
    await DBbonus.metamagicChoiceOrderRestrictionList.loadItems();
  const addMetamagics = await DBbonus.addMetamagicList.loadItems();
  const fadingMods = await DBbonus.fadingModificationList.loadItems();

  if (
    DBbonus.linkMentorSpirit ||
    DBbonus.linkParagon ||
    DBbonus.linkTradition ||
    DBbonus.linkSprite ||
    DBbonus.drainModification !== undefined ||
    DBbonus.addSpell !== undefined ||
    addMetamagics.length > 0 ||
    metamagicRestrictions.length > 0 ||
    DBbonus.freeSpellOngoingBonus !== undefined ||
    DBbonus.linkSpell !== undefined ||
    DBbonus.limitSpellOptionsToCategoryList !== undefined ||
    DBbonus.limitSpiritOptionsToList !== undefined ||
    DBbonus.unlockSpellList !== undefined ||
    DBbonus.spellModifiers !== undefined ||
    specificSpellDice.length > 0 ||
    DBbonus.blockSpellDescriptorList !== undefined ||
    DBbonus.penaltyFreeSustainCount !== undefined ||
    DBbonus.newSpellKarmaCostModification !== undefined ||
    DBbonus.focusBindingKarmaCostModificationList !== undefined ||
    DBbonus.addSpiritOptionList.count() > 0 ||
    fadingMods.length > 0 ||
    DBbonus.addEcho !== undefined ||
    DBbonus.livingPersonaModification !== undefined ||
    DBbonus.resonanceLossDueToAugmentationModificationPercentageIncrease !==
      undefined
  ) {
    bonus.spellAndMagic = {
      ...(DBbonus.linkMentorSpirit && { linkMentorSpirit: true }),
      ...(DBbonus.linkParagon && { linkParagon: true }),
      ...(DBbonus.linkTradition && { linkTradition: true }),
      ...(DBbonus.linkSprite && { linkSprite: true }),
      ...(DBbonus.drainModification !== undefined && {
        drainModification: DBbonus.drainModification,
      }),
      ...(DBbonus.addSpell !== undefined && {
        addSpell: {
          name: (await safeLoad(DBbonus.addSpell, "DBbonus.addSpell")).name,
          ...(DBbonus.addSpellAlchemical && { alchemical: true }),
        },
      }),
      ...(addMetamagics.length > 0 && {
        addMetamagicList: addMetamagics.map((m) => m.name),
      }),
      ...(metamagicRestrictions.length > 0 && {
        metamagicChoiceOrderRestriction: await Promise.all(
          metamagicRestrictions.map(async (m) => ({
            metamagic: (await safeLoad(m.metamagic, "m.metamagic")).name,
            initiationOrder: m.initiationOrder,
          }))
        ),
      }),
      ...(DBbonus.freeSpellOngoingBonus !== undefined && {
        freeSpellOngoingBonus: {
          ...DBbonus.freeSpellOngoingBonus,
          ...(DBbonus.freeSpellOngoingBonusSkillLinked !== undefined && {
            linkType: {
              skillLinked: (
                await safeLoad(
                  DBbonus.freeSpellOngoingBonusSkillLinked,
                  "DBbonus.freeSpellOngoingBonusSkillLinked"
                )
              ).name,
            },
          }),
        } as const satisfies BonusFreeSpellOngoingBonusType,
      }),
      ...(DBbonus.linkSpell !== undefined && {
        linkSpell: DBbonus.linkSpell,
      }),
      ...(DBbonus.limitSpellOptionsToCategoryList !== undefined && {
        limitSpellOptionsToCategoryList:
          DBbonus.limitSpellOptionsToCategoryList,
      }),
      ...(DBbonus.limitSpiritOptionsToList !== undefined && {
        limitSpiritOptionsToList: DBbonus.limitSpiritOptionsToList,
      }),
      ...(DBbonus.unlockSpellList !== undefined && {
        unlockSpellList: DBbonus.unlockSpellList,
      }),
      ...((DBbonus.spellModifiers !== undefined ||
        specificSpellDice.length > 0) && {
        spellModifiers: {
          ...DBbonus.spellModifiers,
          ...(specificSpellDice.length > 0 && {
            spellBonusDice: [
              {
                specificSpell: await Promise.all(
                  specificSpellDice.map(async (m) => ({
                    name: (await safeLoad(m.spell, "m.spell")).name,
                    bonus: m.diceBonus,
                  }))
                ),
              },
            ],
          }),
        } as const satisfies BonusSpellModifiersType,
      }),
      ...(DBbonus.blockSpellDescriptorList !== undefined && {
        blockSpellDescriptorList: DBbonus.blockSpellDescriptorList,
      }),
      ...(DBbonus.penaltyFreeSustainCount !== undefined && {
        penaltyFreeSustainCount: DBbonus.penaltyFreeSustainCount,
      }),
      ...(DBbonus.newSpellKarmaCostModification !== undefined && {
        newSpellKarmaCostModification: DBbonus.newSpellKarmaCostModification,
      }),
      ...(DBbonus.focusBindingKarmaCostModificationList !== undefined && {
        focusBindingKarmaCostModificationList:
          DBbonus.focusBindingKarmaCostModificationList,
      }),
      ...((DBbonus.addSpiritOptionList.count() > 0 ||
        (DBbonus.addSpiritOptionSelectList?.length ?? 0) > 0) && {
        addSpiritOptionList: [
          ...(DBbonus.addSpiritOptionSelectList?.map(() => ({
            selectSpirit: true as const,
          })) ?? []),
          ...(await DBbonus.addSpiritOptionList.loadItems()).map((s) => ({
            name: s.name,
          })),
        ],
      }),
      ...(fadingMods.length > 0 && {
        fadingModificationList: await Promise.all(
          fadingMods.map(async (m) => ({
            ...(m.complexForm !== undefined && {
              specificComplexForm: (
                await safeLoad(m.complexForm, "m.complexForm")
              ).name,
            }),
            modifier: m.modifier,
          }))
        ),
      }),
      ...(DBbonus.addEcho !== undefined && {
        addEcho: (await safeLoad(DBbonus.addEcho, "DBbonus.addEcho")).name,
      }),
      ...(DBbonus.livingPersonaModification !== undefined && {
        livingPersonaModification: DBbonus.livingPersonaModification,
      }),
      ...(DBbonus.resonanceLossDueToAugmentationModificationPercentageIncrease !==
        undefined && {
        resonanceLossDueToAugmentationModificationPercentageIncrease:
          DBbonus.resonanceLossDueToAugmentationModificationPercentageIncrease,
      }),
    };
  }

  // --- combatAndWeapon category ---
  const addWeapons = await DBbonus.addWeaponList.loadItems();
  if (
    DBbonus.weaponCategoryDicePoolModifier !== undefined ||
    DBbonus.weaponClassificationDicePoolModifier !== undefined ||
    DBbonus.smartLinkModifier !== undefined ||
    DBbonus.unarmedAttackModifier !== undefined ||
    DBbonus.weaponLimitModifier !== undefined ||
    DBbonus.weaponLimitModifierPartial !== undefined ||
    DBbonus.thrownWeaponDamageModifier !== undefined ||
    DBbonus.unarmedDamageModifier !== undefined ||
    DBbonus.weaponSkillDamageModifier !== undefined ||
    DBbonus.unarmedDamageType !== undefined ||
    DBbonus.rangeModifiersThrownWeaponRangeModifier !== undefined ||
    DBbonus.rangeModifiersReachModifier !== undefined ||
    DBbonus.rangeModifiersReachWeaponName !== undefined ||
    DBbonus.rangeModifiersUnarmedReachModifier !== undefined ||
    DBbonus.linkWeapon !== undefined ||
    DBbonus.defenseTestModifier !== undefined ||
    DBbonus.linkArmour !== undefined ||
    DBbonus.armourModifiers !== undefined ||
    DBbonus.damageResistanceModifiers !== undefined ||
    DBbonus.toxinAndPathogen !== undefined ||
    addWeapons.length > 0 ||
    DBbonus.addNaturalWeaponList !== undefined ||
    DBbonus.addMartialArt !== undefined
  ) {
    // Build attackModifiers if any sub-fields exist
    const hasAttackModifiers =
      DBbonus.weaponCategoryDicePoolModifier !== undefined ||
      DBbonus.weaponClassificationDicePoolModifier !== undefined ||
      DBbonus.smartLinkModifier !== undefined ||
      DBbonus.unarmedAttackModifier !== undefined ||
      DBbonus.weaponLimitModifier !== undefined ||
      DBbonus.weaponLimitModifierPartial !== undefined;
    // Build damageValueModifiers if any sub-fields exist
    const hasDamageValueModifiers =
      DBbonus.thrownWeaponDamageModifier !== undefined ||
      DBbonus.unarmedDamageModifier !== undefined ||
      DBbonus.weaponSkillDamageModifier !== undefined;
    // Build rangeModifiers if any sub-fields exist
    const hasRangeModifiers =
      DBbonus.rangeModifiersThrownWeaponRangeModifier !== undefined ||
      DBbonus.rangeModifiersReachModifier !== undefined ||
      DBbonus.rangeModifiersReachWeaponName !== undefined ||
      DBbonus.rangeModifiersUnarmedReachModifier !== undefined;
    const weaponLimitModifier =
      DBbonus.weaponLimitModifier !== undefined
        ? await DBbonus.weaponLimitModifier.weapon.load()
        : undefined;
    // Flexible partial match stored as JSON on Bonuses with no join row.
    const weaponLimitModifierPartial = DBbonus.weaponLimitModifierPartial;

    const attackModifiers = hasAttackModifiers
      ? {
          attackModifiers: {
            ...(DBbonus.weaponCategoryDicePoolModifier !== undefined && {
              weaponCategoryDicePoolModifier:
                DBbonus.weaponCategoryDicePoolModifier,
            }),
            ...(DBbonus.weaponClassificationDicePoolModifier !== undefined && {
              weaponClassificationDicePoolModifier:
                DBbonus.weaponClassificationDicePoolModifier,
            }),
            ...(DBbonus.smartLinkModifier !== undefined && {
              smartLinkModifier: DBbonus.smartLinkModifier,
            }),
            ...(DBbonus.unarmedAttackModifier !== undefined && {
              unarmedModifier: DBbonus.unarmedAttackModifier,
            }),
            ...(weaponLimitModifierPartial !== undefined && {
              weaponLimitModifier: {
                weapon: weaponLimitModifierPartial.weapon,
                modifier: weaponLimitModifierPartial.modifier,
                partialName: true as const,
              },
            }),
            ...(weaponLimitModifierPartial === undefined &&
              DBbonus.weaponLimitModifier !== undefined &&
              weaponLimitModifier != null && {
                weaponLimitModifier: {
                  weapon: weaponLimitModifier.name,
                  modifier: DBbonus.weaponLimitModifier.limitModifier,
                },
              }),
          },
        }
      : undefined;
    let damageValueModifiers: BonusDamageValueModifiersType | undefined;
    if (hasDamageValueModifiers) {
      let weaponSkillDamageSelectionOptions;
      if (
        DBbonus.weaponSkillDamageModifier !== undefined &&
        DBbonus.weaponSkillDamageSelectionOptions !== undefined
      ) {
        if (DBbonus.weaponSkillDamageSelectionOptions.enterName) {
          weaponSkillDamageSelectionOptions = {
            enterName: true as const,
            ...(DBbonus.weaponSkillDamageSelectionOptions
              .knowledgeSkillRestrictionLimit !== undefined && {
              knowledgeSkillRestrictionLimit:
                DBbonus.weaponSkillDamageSelectionOptions
                  .knowledgeSkillRestrictionLimit,
            }),
          };
        } else {
          const skillList = DBbonus.weaponSkillDamageSelectionOptions.skillList;
          const skillGroupList =
            DBbonus.weaponSkillDamageSelectionOptions.skillGroupList;
          const skillCategoryList =
            DBbonus.weaponSkillDamageSelectionOptions.skillCategoryList;
          const skillAttributeList =
            DBbonus.weaponSkillDamageSelectionOptions.skillAttributeList;

          weaponSkillDamageSelectionOptions = {
            enterName: false as const,
            restriction: {
              ...(skillList.length > 0 && {
                skillList: {
                  skillList: skillList.map((s) => s.name),
                  limit:
                    DBbonus.weaponSkillDamageSelectionOptions.skillListLimit!,
                },
              }),
              ...(skillGroupList.length > 0 && {
                skillGroupList: {
                  skillGroupList: skillGroupList.map((s) => s.name),
                  limit:
                    DBbonus.weaponSkillDamageSelectionOptions
                      .skillGroupListLimit!,
                },
              }),
              ...(skillCategoryList !== undefined &&
                skillCategoryList.length > 0 && {
                  skillCategoryList: {
                    skillCategoryList: skillCategoryList,
                    limit:
                      DBbonus.weaponSkillDamageSelectionOptions
                        .skillCategoryListLimit!,
                  },
                }),
              ...(skillAttributeList !== undefined &&
                skillAttributeList.length > 0 && {
                  attributeList: {
                    attributeList: skillAttributeList,
                    limit:
                      DBbonus.weaponSkillDamageSelectionOptions
                        .skillAttributeListLimit!,
                  },
                }),
            },
          };
        }
      }
      damageValueModifiers = {
        ...(DBbonus.thrownWeaponDamageModifier !== undefined && {
          thrownWeaponModifier: DBbonus.thrownWeaponDamageModifier,
        }),
        ...(DBbonus.unarmedDamageModifier !== undefined && {
          unarmedModifier: DBbonus.unarmedDamageModifier,
        }),
        ...(DBbonus.weaponSkillDamageModifier !== undefined &&
          weaponSkillDamageSelectionOptions !== undefined && {
            weaponSkillDamage: {
              selectionOptions: weaponSkillDamageSelectionOptions,
              modifier: DBbonus.weaponSkillDamageModifier,
            },
          }),
      };
    }

    bonus.combatAndWeapon = {
      ...attackModifiers,
      ...(damageValueModifiers !== undefined && { damageValueModifiers }),
      ...(DBbonus.unarmedDamageType !== undefined && {
        unarmedDamageType: DBbonus.unarmedDamageType,
      }),
      ...(hasRangeModifiers && {
        rangeModifiers: {
          ...(DBbonus.rangeModifiersThrownWeaponRangeModifier !== undefined && {
            thrownWeaponRangeModifier:
              DBbonus.rangeModifiersThrownWeaponRangeModifier,
          }),
          ...((DBbonus.rangeModifiersReachModifier !== undefined ||
            DBbonus.rangeModifiersReachWeaponName !== undefined) && {
            reach: {
              modifier: DBbonus.rangeModifiersReachModifier!,
              ...(DBbonus.rangeModifiersReachWeaponName !== undefined && {
                weaponName: (
                  await safeLoad(
                    DBbonus.rangeModifiersReachWeaponName,
                    "DBbonus.rangeModifiersReachWeaponName"
                  )
                ).name,
              }),
            },
          }),
          ...(DBbonus.rangeModifiersUnarmedReachModifier !== undefined && {
            unarmedReach: DBbonus.rangeModifiersUnarmedReachModifier,
          }),
        },
      }),
      ...(DBbonus.linkWeapon !== undefined && {
        linkWeapon: (DBbonus.linkWeapon === true &&
        DBbonus.linkWeaponRequirementsReloadList !== undefined
          ? {
              restrictions: true as const,
              weaponRequirements: {
                reloadMethodList: DBbonus.linkWeaponRequirementsReloadList,
                ...(DBbonus.linkWeaponWeaponList.count() > 0 && {
                  disallowedWeaponList: (
                    await DBbonus.linkWeaponWeaponList.loadItems()
                  ).map((w) => w.name),
                }),
              },
            }
          : {
              restrictions: false as const,
            }) satisfies NonNullable<
          BonusCombatAndWeaponOptionType["linkWeapon"]
        >,
      }),
      ...(DBbonus.defenseTestModifier !== undefined && {
        defenseTestModifier: DBbonus.defenseTestModifier,
      }),
      ...(DBbonus.linkArmour && { linkArmour: true }),
      ...(DBbonus.armourModifiers !== undefined && {
        armourModifiers: DBbonus.armourModifiers,
      }),
      ...(DBbonus.damageResistanceModifiers !== undefined && {
        damageResistanceModifiers: DBbonus.damageResistanceModifiers,
      }),
      ...(DBbonus.toxinAndPathogen !== undefined && {
        toxinAndPathogen: DBbonus.toxinAndPathogen,
      }),
      ...(addWeapons.length > 0 && {
        addWeaponList: addWeapons.map((w) => ({ name: w.name })),
      }),
      ...(DBbonus.addNaturalWeaponList !== undefined && {
        addWeaponList: [
          ...(addWeapons.length > 0
            ? addWeapons.map((w) => ({ name: w.name }))
            : []),
          ...DBbonus.addNaturalWeaponList.map((nw) => ({ naturalWeapon: nw })),
        ],
      }),
      ...(DBbonus.addMartialArt !== undefined && {
        addMartialArt: (
          await safeLoad(DBbonus.addMartialArt, "DBbonus.addMartialArt")
        ).name,
      }),
    };
  }

  // --- conditionAndRecovery category ---
  if (DBbonus.conditionAndRecovery !== undefined) {
    bonus.conditionAndRecovery = DBbonus.conditionAndRecovery;
  }

  // --- movementAndLifestyle category ---
  const lifestyleCostModifiers =
    await DBbonus.lifestyleCostModifierList.loadItems();
  if (
    DBbonus.movementAndLifestyle !== undefined ||
    lifestyleCostModifiers.length > 0
  ) {
    bonus.movementAndLifestyle = {
      ...DBbonus.movementAndLifestyle,
      ...(lifestyleCostModifiers.length > 0 && {
        lifestyleCostModifierList: await Promise.all(
          lifestyleCostModifiers.map(
            async (m) =>
              ({
                lifestyle: (await safeLoad(m.lifestyle, "m.lifestyle")).name,
                cost: m.cost,
                ...(m.basicLifestyle !== undefined && {
                  basicLifestyle: m.basicLifestyle,
                }),
              }) as const satisfies NonNullable<
                BonusMovementAndLifestyleOptionType["lifestyleCostModifierList"]
              >[number]
          )
        ),
      }),
    };
  }

  // --- testAndResistance category ---
  if (DBbonus.testAndResistance !== undefined) {
    bonus.testAndResistance = DBbonus.testAndResistance;
  }

  // --- initiative category ---
  if (DBbonus.initiative !== undefined) {
    bonus.initiative = DBbonus.initiative;
  }

  // --- gearAndVehicle category ---
  const addGearIncludes = await DBbonus.addGearIncludedGearList.loadItems();
  if (DBbonus.gearAndVehicle !== undefined || DBbonus.addGear !== undefined) {
    bonus.gearAndVehicle = {
      ...DBbonus.gearAndVehicle,
      ...(DBbonus.addGear !== undefined && {
        addGear: {
          name: (await safeLoad(DBbonus.addGear, "DBbonus.addGear")).name,
          category: DBbonus.addGearCategory!,
          ...(DBbonus.addGearRating !== undefined && {
            rating: DBbonus.addGearRating,
          }),
          ...(addGearIncludes.length > 0 && {
            includedGearList: await Promise.all(
              addGearIncludes.map(async (m) => ({
                name: (await safeLoad(m.gear, "m.gear")).name,
                category: m.category,
                ...(m.rating !== undefined && { rating: m.rating }),
              }))
            ),
          }),
        } as const satisfies NonNullable<
          BonusGearAndVehicleOptionType["addGear"]
        >,
      }),
    };
  }

  // --- essenceAndAugmentation category ---
  if (
    DBbonus.essenceAndAugmentation !== undefined ||
    DBbonus.addAugmentation !== undefined
  ) {
    bonus.essenceAndAugmentation = {
      ...DBbonus.essenceAndAugmentation,
      ...(DBbonus.addAugmentation !== undefined && {
        addAugmentation: {
          name: (
            await safeLoad(DBbonus.addAugmentation, "DBbonus.addAugmentation")
          ).name,
          grade: DBbonus.addAugmentationGrade!,
          category: DBbonus.addAugmentationCategory!,
        } as const satisfies NonNullable<
          BonusEssenceAndAugmentationType["addAugmentation"]
        >,
      }),
    };
  }

  // --- contactAndReputation category ---
  if (DBbonus.contactAndReputation !== undefined) {
    bonus.contactAndReputation = DBbonus.contactAndReputation;
  }

  // --- quality category ---
  const addQualities = await DBbonus.addQualityList.loadItems();
  const selectBonusQualities = await DBbonus.selectBonusQualityList.loadItems();
  const reducedBonusQualities =
    await DBbonus.reducedBonusQualityList.loadItems();
  const disableQualities = await DBbonus.disableQualityList.loadItems();

  if (
    addQualities.length > 0 ||
    DBbonus.freeQuality !== undefined ||
    selectBonusQualities.length > 0 ||
    reducedBonusQualities.length > 0 ||
    DBbonus.metagenicLimitIncrease !== undefined ||
    disableQualities.length > 0
  ) {
    bonus.quality = {
      ...(addQualities.length > 0 && {
        addQualityList: await Promise.all(
          addQualities.map(async (m) => ({
            name: (await safeLoad(m.quality, "m.quality")).name,
            ...(m.rating !== undefined && { rating: m.rating }),
          }))
        ),
      }),
      ...(DBbonus.freeQuality !== undefined && {
        freeQuality: (
          await safeLoad(DBbonus.freeQuality, "DBbonus.freeQuality")
        ).name,
      }),
      ...((selectBonusQualities.length > 0 ||
        reducedBonusQualities.length > 0) && {
        selectQualityFromList: {
          bonusQualityList:
            selectBonusQualities.length > 0
              ? selectBonusQualities.map((m) => m.name)
              : [],
          ...(reducedBonusQualities.length > 0 && {
            reducedBonusQualityList: await Promise.all(
              reducedBonusQualities.map(async (m) => ({
                name: (await safeLoad(m.quality, "m.quality")).name,
                karmaReduction: m.karmaReduction ?? 0,
              }))
            ),
          }),
        },
      }),
      ...(DBbonus.metagenicLimitIncrease !== undefined && {
        metagenicLimitIncrease: DBbonus.metagenicLimitIncrease,
      }),
      ...(disableQualities.length > 0 && {
        disableQualityList: disableQualities.map((q) => q.name),
      }),
    };
  }

  // --- specificQuality category ---
  if (DBbonus.specificQuality !== undefined) {
    bonus.specificQuality = DBbonus.specificQuality;
  }

  // --- miscellaneous category ---
  if (DBbonus.miscellaneous !== undefined) {
    bonus.miscellaneous = DBbonus.miscellaneous;
  }

  if (isEmpty(bonus)) {
    return {};
  }
  return bonus;
}

export async function getSkills(): Promise<SkillListType> {
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
      ...(skillGroup !== undefined && { skillGroup: skillGroup }),
      ...(skill.defaultSpecialisations !== undefined && {
        specialisations: skill.defaultSpecialisations,
      }),
      source: skill.source,
      page: skill.page,
    };
  });
  return skillsResponse;
}

export async function getTraditions(): Promise<TraditionListType> {
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
        ...(tradition.spiritForm !== undefined && {
          spiritForm: tradition.spiritForm,
        }),
        spiritTypes: spiritTypes,
        ...(tradition.bonus !== undefined && {
          bonus: await convertDBBonus(tradition.bonus.$),
        }),
        ...(tradition.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(tradition.requirements, "tradition.requirements")
          ),
        }),
        source: tradition.source,
        page: tradition.page,
        description: tradition.description,
      };
    })
  );
  return traditionsResponse;
}

export async function getMentors(): Promise<MentorListType> {
  const db = await init();
  const mentors = await db.em.findAll(Mentors, {
    populate: ["*"],
  });
  const mentorsResponse: MentorListType = await Promise.all(
    mentors.map(async (mentor) => {
      const baseMentor: MentorBaseType = {
        name: mentor.name,
        description: mentor.description,
        advantage: mentor.advantage,
        disadvantage: mentor.disadvantage,
        ...(mentor.bonus !== undefined && {
          bonus: await convertDBBonus(mentor.bonus.$),
        }),
        source: mentor.source,
        page: mentor.page,
      };
      if (mentor instanceof MentorSpirits) {
        return {
          ...baseMentor,
          category: mentorCategoryEnum.MentorSpirit,
          choices: mentor.choices,
          choiceCount: mentor.choiceCount,
          ...(mentor.required && {
            required: await convertDBRequirement(
              await safeLoad(mentor.required, "mentor.required")
            ),
          }),
        };
      } else if (mentor instanceof Paragons) {
        return {
          ...baseMentor,
          category: mentorCategoryEnum.Paragon,
        };
      } else {
        throw new Error(`Mentor: ${mentor.name} has unknown class`);
      }
    })
  );
  return mentorsResponse;
}

export async function getCritters(): Promise<CritterListType> {
  const db = await init();
  const critters = await db.em.findAll(Critters, {
    populate: ["*"],
  });
  const crittersResponse: CritterListType = await Promise.all(
    critters.map(async (critter) => {
      return {
        name: critter.name,
        category: critter.category,
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
        ...(critter.nonStandardMovement !== undefined && {
          nonStandardMovement: critter.nonStandardMovement,
        }),
        ...(critter.movement !== undefined && { movement: critter.movement }),
        includedPowerList: await Promise.all(
          critter.includedPowerList.map(async (power) => {
            const powerLoaded = await power.critterPower.load();
            if (powerLoaded === null) {
              throw new Error("Power does not exist");
            }

            return {
              name: powerLoaded.name,
              ...(power.rating !== undefined && { rating: power.rating }),
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
              ...(power.rating !== undefined && { rating: power.rating }),
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
              ...(complexForm.matrixAttribute !== undefined && {
                select: complexForm.matrixAttribute,
              }),
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
                ...(skill.specialisationsSelected !== undefined && {
                  specialised: skill.specialisationsSelected,
                }),
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
        ...(critter.bonus !== undefined && {
          bonus: await convertDBBonus(critter.bonus.$),
        }),
        source: critter.source,
        page: critter.page,
        description: critter.description,
      };
    })
  );
  return crittersResponse;
}

export async function getSpells(): Promise<SpellListType> {
  const db = await init();
  const spells = await db.em.findAll(Spells, {
    populate: ["*"],
  });
  const spellsResponse: SpellListType = await Promise.all(
    spells.map(async (spell) => {
      return {
        name: spell.name,
        category: spell.category,
        type: spell.type,
        damage: spell.damage,
        damageType: spell.damageType,
        descriptorList: spell.descriptorList,
        duration: spell.duration,
        range: spell.range,
        ...(spell.bonus !== undefined && {
          bonus: await convertDBBonus(spell.bonus.$),
        }),
        ...(spell.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(spell.requirements, "spell.requirements")
          ),
        }),
        source: spell.source,
        page: spell.page,
        description: spell.description,
      };
    })
  );
  return spellsResponse;
}

export async function getComplexForms(): Promise<ComplexFormListType> {
  const db = await init();
  const complexForms = await db.em.findAll(ComplexForms, {
    populate: ["*"],
  });
  const complexFormsResponse: ComplexFormListType = await Promise.all(
    complexForms.map(async (complexForm) => {
      return {
        name: complexForm.name,
        target: complexForm.target,
        duration: complexForm.duration,
        fadingValue: complexForm.fadingValue,
        ...(complexForm.bonus !== undefined && {
          bonus: await convertDBBonus(complexForm.bonus.$),
        }),
        ...(complexForm.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(complexForm.requirements, "complexForm.requirements")
          ),
        }),
        source: complexForm.source,
        page: complexForm.page,
        description: complexForm.description,
      };
    })
  );
  return complexFormsResponse;
}

export async function getAdeptPowers(): Promise<AdeptPowerListType> {
  const db = await init();
  const adeptPowers = await db.em.findAll(AdeptPowers, {
    populate: ["*"],
  });
  const adeptPowersResponse: AdeptPowerListType = await Promise.all(
    adeptPowers.map(async (adeptPower) => {
      return {
        name: adeptPower.name,
        description: adeptPower.description,
        pointCost: adeptPower.pointCost,
        ...(adeptPower.extraFirstLevelPointCost !== undefined && {
          extraFirstLevelPointCost: adeptPower.extraFirstLevelPointCost,
        }),
        levels: adeptPower.levels,
        limit: adeptPower.limit,
        sharedLimitAdeptPowerList: adeptPower.sharedLimitAdeptPowerList.map(
          (power) => {
            return power.name;
          }
        ),
        ...(adeptPower.action !== undefined && { action: adeptPower.action }),
        ...(adeptPower.adeptWayPointCost !== undefined && {
          adeptWay: {
            pointCost: adeptPower.adeptWayPointCost,
            ...(adeptPower.adeptWayRequirements !== undefined && {
              requirements: await convertDBRequirement(
                await safeLoad(
                  adeptPower.adeptWayRequirements,
                  "adeptPower.adeptWayRequirements"
                )
              ),
            }),
          },
        }),
        ...(adeptPower.doubleCost !== undefined && {
          doubleCost: adeptPower.doubleCost,
        }),
        ...(adeptPower.maxLevels !== undefined && {
          maxLevels: adeptPower.maxLevels,
        }),
        ...(adeptPower.userSelectable !== undefined && {
          userSelectable: adeptPower.userSelectable,
        }),
        ...(adeptPower.bonus !== undefined && {
          bonus: await convertDBBonus(adeptPower.bonus.$),
        }),
        ...(adeptPower.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(adeptPower.requirements, "adeptPower.requirements")
          ),
        }),
        ...(adeptPower.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(adeptPower.forbidden, "adeptPower.forbidden")
          ),
        }),
        source: adeptPower.source,
        page: adeptPower.page,
      };
    })
  );
  return adeptPowersResponse;
}

export async function getPrograms(): Promise<ProgramListType> {
  const db = await init();
  const programs = await db.em.findAll(Programs, {
    populate: ["*"],
  });
  const programsResponse: ProgramListType = await Promise.all(
    programs.map(async (program) => {
      return {
        name: program.name,
        description: program.description,
        category: program.category,
        ...(program.rating !== undefined && { rating: program.rating }),
        availability: program.availability,
        cost: program.cost,
        ...(program.bonus !== undefined && {
          bonus: await convertDBBonus(program.bonus.$),
        }),
        ...(program.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(program.requirements, "program.requirements")
          ),
        }),
        source: program.source,
        page: program.page,
      };
    })
  );
  return programsResponse;
}

export async function getWeapons(names?: string[]): Promise<WeaponListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const weapons = await db.em.find(Weapons, where, {
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
            ...(accessory.rating !== undefined && { rating: accessory.rating }),
          };
        })
      );
      const gearList = weapon.allowedGearList.$;
      const gearNameList = gearList.map((gear) => gear.name);
      const alternativeWeaponNameForms = weapon.alternativeWeaponForms.$.map(
        (alternativeWeapon) => alternativeWeapon.name
      );

      const weaponTypeInformation =
        await convertWeaponDBTypeInformationToDTO(weapon);
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
        ...(weapon.userSelectable !== undefined && {
          userSelectable: weapon.userSelectable,
        }),
        ...(weapon.augmentationCategory !== undefined && {
          augmentationCategory: weapon.augmentationCategory,
        }),
        ...(weapon.hostWeaponMountsRequired && {
          hostWeaponMountsRequired: weapon.hostWeaponMountsRequired,
        }),
        ...(weapon.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(weapon.requirements, "weapon.requirements")
          ),
        }),
        ...(alternativeWeaponNameForms.length > 0 && {
          alternativeWeaponForms: alternativeWeaponNameForms,
        }),
        relatedSkill: skill,
        ...(weapon.relatedSkillSpecialisationList !== undefined &&
          weapon.relatedSkillSpecialisationList.length > 0 && {
            relatedSkillSpecialisationList:
              weapon.relatedSkillSpecialisationList,
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

export async function getWeaponAccessories(
  names?: string[]
): Promise<WeaponAccessoryListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const weaponAccessories = await db.em.find(WeaponAccessories, where, {
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
        ...(weaponAccessory.wireless !== undefined && {
          wireless: weaponAccessory.wireless,
        }),
        maxRating: weaponAccessory.maxRating,
        ...(weaponAccessory.linkedWeapon !== undefined && {
          isWeapon: true as const,
        }),
        ...(weaponAccessory.accuracyIncrease !== undefined && {
          accuracyIncrease: weaponAccessory.accuracyIncrease,
        }),
        ...(weaponAccessory.damageIncrease !== undefined && {
          damageIncrease: weaponAccessory.damageIncrease,
        }),
        ...(weaponAccessory.newDamageType !== undefined && {
          newDamageType: weaponAccessory.newDamageType,
        }),
        ...(weaponAccessory.reachIncrease !== undefined && {
          reachIncrease: weaponAccessory.reachIncrease,
        }),
        ...(weaponAccessory.armourPiercingIncrease !== undefined && {
          armourPiercingIncrease: weaponAccessory.armourPiercingIncrease,
        }),
        ...(weaponAccessory.recoilCompensationIncrease !== undefined && {
          recoilCompensationIncrease:
            weaponAccessory.recoilCompensationIncrease,
        }),
        ...(weaponAccessory.recoilCompensationType !== undefined && {
          recoilCompensationType: weaponAccessory.recoilCompensationType,
        }),
        ...(weaponAccessory.deploymentRequired !== undefined && {
          deploymentRequired: weaponAccessory.deploymentRequired,
        }),
        ...(weaponAccessory.accessoryCostMultiplier !== undefined && {
          accessoryCostMultiplier: weaponAccessory.accessoryCostMultiplier,
        }),
        allowedGearList: weaponAccessory.allowedGearList.$.map((gear) => {
          return gear.name;
        }),
        ...(weaponAccessory.allowedGearCategories !== undefined && {
          allowedGearCategories: weaponAccessory.allowedGearCategories,
        }),
        includedGearList: gearList,
        ...(weaponAccessory.specialModification !== undefined && {
          specialModification: weaponAccessory.specialModification,
        }),
        ...(weaponAccessory.extraAmmoSlots !== undefined && {
          extraAmmoSlots: weaponAccessory.extraAmmoSlots,
        }),
        ...(weaponAccessory.ammoCapacityCalculation !== undefined && {
          ammoCapacityCalculation: weaponAccessory.ammoCapacityCalculation,
        }),
        ...(weaponAccessory.newAmmoType !== undefined && {
          newAmmoType: weaponAccessory.newAmmoType,
        }),
        ...(weaponAccessory.hostWeaponMountsRequired !== undefined && {
          hostWeaponMountsRequired: weaponAccessory.hostWeaponMountsRequired,
        }),
        ...(weaponAccessory.rangePenaltyDecrease !== undefined && {
          rangePenaltyDecrease: weaponAccessory.rangePenaltyDecrease,
        }),
        ...(weaponAccessory.concealabilityModification !== undefined && {
          concealabilityModification:
            weaponAccessory.concealabilityModification,
        }),
        ...(weaponAccessory.userSelectable !== undefined && {
          userSelectable: weaponAccessory.userSelectable,
        }),
        ...(weaponAccessory.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(
              weaponAccessory.requirements,
              "weaponAccessory.requirements"
            )
          ),
        }),
        ...(weaponAccessory.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(
              weaponAccessory.forbidden,
              "weaponAccessory.fobidden"
            )
          ),
        }),
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

export async function getArmours(names?: string[]): Promise<ArmourListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const armoursDB = await db.em.find(Armours, where, {
    populate: ["*"],
  });
  const armoursResponse: ArmourListType = await Promise.all(
    armoursDB.map(async (armour) => {
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
        ...(armour.maxRating !== undefined && { maxRating: armour.maxRating }),
        damageReduction: armour.damageReduction,
        ...(armour.customFitStackDamageReduction !== undefined && {
          customFitStackDamageReduction: armour.customFitStackDamageReduction,
        }),
        capacity: armour.capacity,
        ...(isWeapon !== undefined && { isWeapon: isWeapon }),
        includedGearList: includedGearNameList,
        ...(armour.bonus !== undefined && {
          bonus: await convertDBBonus(armour.bonus.$),
        }),
        ...(armour.wirelessBonus !== undefined && {
          wirelessBonus: await convertDBBonus(armour.wirelessBonus.$),
        }),
        includedModList: includedMods,
        ...(armour.allowModsFromCategory !== undefined && {
          allowModsFromCategory: armour.allowModsFromCategory,
        }),
        ...(armour.addModFromCategory !== undefined && {
          addModFromCategory: armour.addModFromCategory,
        }),
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

export async function getArmourModifications(
  names?: string[]
): Promise<ArmourModListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const armourModsDB = await db.em.find(ArmourModifications, where, {
    populate: ["*"],
  });
  const armourModsResponse: ArmourModListType = await Promise.all(
    armourModsDB.map(async (armourMod) => {
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
        includedGearList: includedGearList,
        ...(armourMod.bonus !== undefined && {
          bonus: await convertDBBonus(armourMod.bonus.$),
        }),
        ...(armourMod.wirelessBonus !== undefined && {
          wirelessBonus: await convertDBBonus(armourMod.wirelessBonus.$),
        }),
        ...(armourMod.userSelectable !== undefined && {
          userSelectable: armourMod.userSelectable,
        }),
        ...(armourMod.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(armourMod.requirements, "armourMod.requirements")
          ),
        }),
        ...(armourMod.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(armourMod.forbidden, "armourMod.forbidden")
          ),
        }),
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

export async function getAugmentations(
  names?: string[]
): Promise<AugmentationListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const augmentations = await db.em.find(Augmentations, where, {
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

      const typeInformation =
        await convertAugmentationTypeInformation(augmentation);
      const augmentationFormatted: AugmentationType = {
        name: augmentation.name,
        description: augmentation.description,
        ...(augmentation.wireless !== undefined && {
          wireless: augmentation.wireless,
        }),
        ...typeInformation,
        ...(augmentation.augmentationLimit !== undefined && {
          augmentationLimit: augmentation.augmentationLimit,
        }),
        ...(augmentation.unavailableGrades !== undefined && {
          unavailableGrades: augmentation.unavailableGrades,
        }),
        essenceCost: augmentation.essenceCost,
        ...(augmentation.modification !== undefined && {
          modification: augmentation.modification,
        }),
        ...(augmentation.requireParent !== undefined && {
          requireParent: augmentation.requireParent,
        }),
        rating: augmentation.rating,
        ...(augmentation.ratingMeaning !== undefined && {
          ratingMeaning: augmentation.ratingMeaning,
        }),
        ...(weaponName !== undefined && { addWeapon: weaponName }),
        ...(augmentation.blockedMountList !== undefined && {
          blockedMountList: augmentation.blockedMountList,
        }),
        ...(augmentation.selectSide !== undefined && {
          selectSide: augmentation.selectSide,
        }),
        ...(augmentation.bonus !== undefined && {
          bonus: await convertDBBonus(augmentation.bonus.$),
        }),
        ...(augmentation.pairBonus !== undefined && {
          pairBonus: await convertDBBonus(augmentation.pairBonus.$),
        }),
        ...(augmentation.wirelessBonus !== undefined && {
          wirelessBonus: await convertDBBonus(augmentation.wirelessBonus.$),
        }),
        ...(augmentation.wirelessPairBonus !== undefined && {
          wirelessPairBonus: await convertDBBonus(
            augmentation.wirelessPairBonus.$
          ),
        }),
        pairIncludeList: pairIncludeNameList,
        ...(augmentation.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(
              augmentation.requirements,
              "augmentation.requirements"
            )
          ),
        }),
        ...(augmentation.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(augmentation.forbidden, "augmentation.forbidden")
          ),
        }),
        allowedGearList: allowedGearNameList,
        includedGearList: includedGearList,
        ...(augmentation.allowedGearCategories !== undefined && {
          allowedGearCategories: augmentation.allowedGearCategories,
        }),
        ...(augmentation.userSelectable !== undefined && {
          userSelectable: augmentation.userSelectable,
        }),
        ...(augmentation.allowSubsystemCategoryList !== undefined && {
          allowSubsystemCategoryList: augmentation.allowSubsystemCategoryList,
        }),
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

export async function getVehicles(names?: string[]): Promise<VehicleListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const vehicles = await db.em.find(Vehicles, where, { populate: ["*"] });
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
            weapon = await convertActiveWeaponDBToDTO(
              includedMount.mountedWeapon.$
            );
          }
          return {
            control: loadedMount.control,
            flexibility: loadedMount.flexibility,
            size: loadedMount.size,
            visibility: loadedMount.visibility,
            weaponMountModList: includedMount.mountMods.$.map((mod) => {
              return mod.name;
            }),
            ...(weapon !== undefined && { weaponMounted: weapon }),
            ...(includedMount.weaponExchangeable !== undefined && {
              weaponExchangeable: includedMount.weaponExchangeable,
            }),
          } satisfies CustomisedWeaponMountType;
        })
      );
      const vehicleTypeInformation = convertVehicleTypeInformation(vehicle);
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
        ...(vehicle.modSlots !== undefined && { modSlots: vehicle.modSlots }),
        ...(vehicle.powerTrainModSlots !== undefined && {
          powerTrainModSlots: vehicle.powerTrainModSlots,
        }),
        ...(vehicle.protectionModSlots !== undefined && {
          protectionModSlots: vehicle.protectionModSlots,
        }),
        ...(vehicle.weaponModSlots !== undefined && {
          weaponModSlots: vehicle.weaponModSlots,
        }),
        ...(vehicle.bodyModSlots !== undefined && {
          bodyModSlots: vehicle.bodyModSlots,
        }),
        ...(vehicle.electromagneticModSlots !== undefined && {
          electromagneticModSlots: vehicle.electromagneticModSlots,
        }),
        ...(vehicle.cosmeticModSlots !== undefined && {
          cosmeticModSlots: vehicle.cosmeticModSlots,
        }),
        includedWeaponMountList: includedWeaponMountNameList,
        ...(vehicle.userSelectable !== undefined && {
          userSelectable: vehicle.userSelectable,
        }),
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

export async function getVehicleModifications(
  names?: string[]
): Promise<VehicleModListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const vehicleModificationsDB = await db.em.find(VehicleModifications, where, {
    populate: ["*"],
  });
  const vehicleModificationsResponse: VehicleModListType = await Promise.all(
    vehicleModificationsDB.map(async (vehicleModification) => {
      const vehicleModificationFormatted: VehicleModType = {
        name: vehicleModification.name,
        description: vehicleModification.description,
        category: vehicleModification.category,
        maxRating: vehicleModification.maxRating,
        ...(vehicleModification.minRating !== undefined && {
          minRating: vehicleModification.minRating,
        }),
        ...(vehicleModification.ratingMeaning !== undefined && {
          ratingMeaning: vehicleModification.ratingMeaning,
        }),
        ...(vehicleModification.capacity !== undefined && {
          capacity: vehicleModification.capacity,
        }),
        ...(vehicleModification.addPhysicalBoxes !== undefined && {
          addPhysicalBoxes: vehicleModification.addPhysicalBoxes,
        }),
        ...(vehicleModification.isDowngrade !== undefined && {
          isDowngrade: vehicleModification.isDowngrade,
        }),
        ...(vehicleModification.requiresDroneParent !== undefined && {
          requiresDroneParent: vehicleModification.requiresDroneParent,
        }),
        slotCost: vehicleModification.slotCost,
        ...(vehicleModification.allowedSubsystemList !== undefined && {
          allowedSubsystemList: vehicleModification.allowedSubsystemList,
        }),
        ...(vehicleModification instanceof VehicleChasisModifications &&
          (vehicleModification as VehicleChasisModifications)
            .weaponMountValidCategoryList !== undefined && {
            weaponMountValidCategoryList: (
              vehicleModification as VehicleChasisModifications
            ).weaponMountValidCategoryList,
          }),
        ...(vehicleModification.bonus !== undefined && {
          bonus: await convertDBBonus(vehicleModification.bonus.$),
        }),
        ...(vehicleModification.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(
              vehicleModification.requirements,
              "vehicleModification.requirements"
            )
          ),
        }),
        ...(vehicleModification.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(
              vehicleModification.forbidden,
              "vehicleModification.forbidden"
            )
          ),
        }),
        ...(vehicleModification.userSelectable !== undefined && {
          userSelectable: vehicleModification.userSelectable,
        }),
        availability: vehicleModification.availability,
        cost: vehicleModification.cost,
        source: vehicleModification.source,
        page: vehicleModification.page,
      };
      return vehicleModificationFormatted;
    })
  );
  return vehicleModificationsResponse;
}

export async function getWeaponMountModifications(
  names?: string[]
): Promise<WeaponMountModListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const weaponMountModifications = await db.em.find(
    WeaponMountModifications,
    where,
    {
      populate: ["*"],
    }
  );
  const weaponMountModificationsResponse: WeaponMountModListType =
    await Promise.all(
      weaponMountModifications.map(async (weaponMountModification) => {
        const weaponMountModificationFormatted: WeaponMountModType = {
          name: weaponMountModification.name,
          description: weaponMountModification.description,
          category: weaponMountModification.category,
          slotCost: weaponMountModification.slotCost,
          ...(weaponMountModification.additionalAmmo !== undefined && {
            additionalAmmo: weaponMountModification.additionalAmmo,
          }),
          ...(weaponMountModification.percentageAmmoIncrease !== undefined && {
            percentageAmmoIncrease:
              weaponMountModification.percentageAmmoIncrease,
          }),
          ...(weaponMountModification.replaceAmmo !== undefined && {
            replaceAmmo: weaponMountModification.replaceAmmo,
          }),
          ...(weaponMountModification.requirements !== undefined && {
            requirements: await convertDBRequirement(
              await safeLoad(
                weaponMountModification.requirements,
                "weaponMountModification.requirements"
              )
            ),
          }),
          ...(weaponMountModification.userSelectable !== undefined && {
            userSelectable: weaponMountModification.userSelectable,
          }),
          availability: weaponMountModification.availability,
          cost: weaponMountModification.cost,
          source: weaponMountModification.source,
          page: weaponMountModification.page,
        };
        return weaponMountModificationFormatted;
      })
    );
  return weaponMountModificationsResponse;
}

export async function getMartialArts(): Promise<MartialArtListType> {
  const db = await init();
  const martialArts = await db.em.findAll(MartialArts, { populate: ["*"] });
  const martialArtsResponse: MartialArtListType = await Promise.all(
    martialArts.map(async (martialArt) => {
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
      const bonus =
        martialArt.bonus !== undefined
          ? await convertDBBonus(martialArt.bonus.$)
          : undefined;
      return {
        name: martialArt.name,
        ...(bonus !== undefined && { bonus: bonus }),
        techniqueList: techniqueList,
        ...(martialArt.karmaCost !== undefined && {
          karmaCost: martialArt.karmaCost,
        }),
        ...(martialArt.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(martialArt.requirements, "martialArt.requirements")
          ),
        }),
        description: martialArt.description,
        source: martialArt.source,
        page: martialArt.page,
      };
    })
  );
  return martialArtsResponse;
}

export async function getMartialArtTechniques(): Promise<MartialArtTechniqueListType> {
  const db = await init();
  const techniques = await db.em.findAll(MartialArtTechniques, {
    populate: ["*"],
  });
  const techniquesResponse: MartialArtTechniqueListType = await Promise.all(
    techniques.map(async (technique) => {
      const bonus =
        technique.bonus !== undefined
          ? await convertDBBonus(technique.bonus.$)
          : undefined;
      return {
        name: technique.name,
        ...(bonus !== undefined && { bonus: bonus }),
        ...(technique.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(technique.requirements, "technique.requirements")
          ),
        }),
        description: technique.description,
        source: technique.source,
        page: technique.page,
      };
    })
  );
  return techniquesResponse;
}

export async function getLifestyles(): Promise<LifestyleListType> {
  const db = await init();
  const lifestyles = await db.em.findAll(Lifestyles, {
    populate: ["*"],
  });
  const lifestylesResponse: LifestyleListType = await Promise.all(
    lifestyles.map(async (lifestyle) => {
      return await convertLifestyleDBToDTO(lifestyle);
    })
  );
  return lifestylesResponse;
}

export async function getLifestyleQualities(): Promise<LifestyleQualityListType> {
  const db = await init();
  const lifestyleQualities = await db.em.findAll(LifestyleQualities, {
    populate: ["*"],
  });
  const lifestyleQualitiesResponse: LifestyleQualityListType =
    await Promise.all(
      lifestyleQualities.map(async (lifestyleQuality) => {
        const bonus =
          lifestyleQuality.bonus !== undefined
            ? await convertDBBonus(lifestyleQuality.bonus.$)
            : undefined;
        return {
          name: lifestyleQuality.name,
          category: lifestyleQuality.category,
          monthlyCost: lifestyleQuality.monthlyCost,
          lifestylePointCost: lifestyleQuality.lifestylePointCost,
          ...(lifestyleQuality.lifestyleCostMultiplier !== undefined && {
            lifestyleCostMultiplier: lifestyleQuality.lifestyleCostMultiplier,
          }),
          requiredLifestyleList: lifestyleQuality.requiredLifestyleList.$.map(
            (lifestyle) => {
              return lifestyle.name;
            }
          ),
          ...(lifestyleQuality.multipleAllowed !== undefined && {
            multipleAllowed: lifestyleQuality.multipleAllowed,
          }),
          ...(bonus !== undefined && { bonus: bonus }),
          ...(lifestyleQuality.requirements !== undefined && {
            requirements: await convertDBRequirement(
              await safeLoad(
                lifestyleQuality.requirements,
                "lifestyleQuality.requirements"
              )
            ),
          }),
          ...(lifestyleQuality.forbidden !== undefined && {
            forbidden: await convertDBRequirement(
              await safeLoad(
                lifestyleQuality.forbidden,
                "lifestyleQuality.forbidden"
              )
            ),
          }),
          description: lifestyleQuality.description,
          source: lifestyleQuality.source,
          page: lifestyleQuality.page,
        };
      })
    );
  return lifestyleQualitiesResponse;
}

export async function getEquipmentPacks(
  names?: string[]
): Promise<EquipmentPackListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const equipmentPacks = await db.em.find(EquipmentPacks, where, {
    populate: ["*"],
  });
  const equipmentPacksResponse: EquipmentPackListType = [];
  for (const equipmentPack of equipmentPacks) {
    const armourList: CustomisedArmourListType = await Promise.all(
      equipmentPack.armourList.$.map(async (armour) => {
        return await convertActiveArmourDBToDTO(armour);
      })
    );

    const augmentationList: CustomisedAugmentationListType = await Promise.all(
      equipmentPack.augmentationList.$.map(async (augmentation) => {
        return await convertCustomAugmentationDBToDTO(augmentation);
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
    const lifestyleList = await Promise.all(
      equipmentPack.lifestyleList.$.map((lifestyle) => {
        return {
          baseLifestyle: lifestyle.lifestyle.$.name,
          purchasedDuration: lifestyle.purchasedDuration,
        };
      })
    );
    equipmentPacksResponse.push({
      name: equipmentPack.name,
      category: equipmentPack.category,
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

export async function getGears(names?: string[]): Promise<GearListType> {
  const db = await init();
  const where = names !== undefined ? { name: { $in: names } } : {};
  const gearsDB = await db.em.find(Gears, where, {
    populate: ["*", "includedWeapon.weapon"],
  });
  const gearsResponse: GearListType = await Promise.all(
    gearsDB.map(async (gear) => {
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
        ...(gear.minRating !== undefined && { minRating: gear.minRating }),
        ...(gear.maxRating !== undefined && { maxRating: gear.maxRating }),
        ...(gear.ratingMeaning !== undefined && {
          ratingMeaning: gear.ratingMeaning,
        }),
        ...(includedWeapon !== undefined && { includedWeapon: includedWeapon }),
        ...(gear.allowCategoryList !== undefined && {
          allowCategoryList: gear.allowCategoryList,
        }),
        ...(gear.purchaseQuantity !== undefined && {
          purchaseQuantity: gear.purchaseQuantity,
        }),
        ...(gear.userSelectable !== undefined && {
          userSelectable: gear.userSelectable,
        }),
        allowedGearList: gearNameList,
        includedGearList: includedGearList,
        ...(gear.deviceRating !== undefined && {
          deviceRating: gear.deviceRating,
        }),
        ...(gear.programs !== undefined && { programs: gear.programs }),
        ...(gear.attributeArray !== undefined && {
          attributeArray: gear.attributeArray,
        }),
        ...(gear.attack !== undefined && { attack: gear.attack }),
        ...(gear.sleaze !== undefined && { sleaze: gear.sleaze }),
        ...(gear.dataProcessing !== undefined && {
          dataProcessing: gear.dataProcessing,
        }),
        ...(gear.firewall !== undefined && { firewall: gear.firewall }),
        ...(gear.canFormPersona !== undefined && {
          canFormPersona: gear.canFormPersona,
        }),
        ...(gear.capacityInformation !== undefined && {
          capacityInformation: gear.capacityInformation,
        }),
        ...(gear.armourCapacityInformation !== undefined && {
          armourCapacityInformation: gear.armourCapacityInformation,
        }),
        ...(gear.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(gear.requirements, "gear.requirements")
          ),
        }),
        ...(gear.requireParent !== undefined && {
          requireParent: gear.requireParent,
        }),
        ...(gear.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(gear.forbidden, "gear.forbidden")
          ),
        }),
        ...(gear.modifyAttributeArray !== undefined && {
          modifyAttributeArray: gear.modifyAttributeArray,
        }),
        ...(gear.modifyAttack !== undefined && {
          modifyAttack: gear.modifyAttack,
        }),
        ...(gear.modifySleaze !== undefined && {
          modifySleaze: gear.modifySleaze,
        }),
        ...(gear.modifyDataProcessing !== undefined && {
          modifyDataProcessing: gear.modifyDataProcessing,
        }),
        ...(gear.modifyFirewall !== undefined && {
          modifyFirewall: gear.modifyFirewall,
        }),
        ...(gear.addMatrixBoxes !== undefined && {
          addMatrixBoxes: gear.addMatrixBoxes,
        }),
        ...(gear.renameCustomLabel !== undefined && {
          renameCustomLabel: gear.renameCustomLabel,
        }),
        availability: gear.availability,
        cost: gear.cost,
        source: gear.source,
        page: gear.page,
      };
      const bonus =
        gear.bonus !== undefined
          ? await convertDBBonus(gear.bonus.$)
          : undefined;
      return {
        ...gearFormatted,
        ...(bonus !== undefined && { bonus: bonus }),
      } satisfies GearType;
    })
  );
  return gearsResponse;
}

export async function getQualities(): Promise<QualityListType> {
  const db = await init();
  const qualities = await db.em.findAll(Qualities, {
    populate: ["*", "includedWeaponList", "sharedLimitQualityList"],
  });
  const qualitiesResponse: QualityListType = await Promise.all(
    qualities.map(async (quality) => {
      const includedWeapons = quality.includedWeaponList.$;
      const includedWeaponsNameList = includedWeapons.map((weapon) => {
        return weapon.name;
      });
      const sharedLimitQualityList = quality.sharedLimitQualityList.$;
      const includedQualitiesNameList = sharedLimitQualityList.map(
        (includedQuality) => {
          return includedQuality.name;
        }
      );
      const bonus =
        quality.bonus !== undefined && quality.bonus.$ !== undefined
          ? await convertDBBonus(quality.bonus.$)
          : undefined;
      const qualityFormatted: QualityType = {
        name: quality.name,
        description: quality.description,
        category: quality.category,
        karma: quality.karma,
        ...(quality.charGenOnly !== undefined && {
          charGenOnly: quality.charGenOnly,
        }),
        ...(quality.charGenLimit !== undefined && {
          charGenLimit: quality.charGenLimit,
        }),
        ...(quality.charGenDoNotContributeToKarmaLimit !== undefined && {
          charGenDoNotContributeToKarmaLimit:
            quality.charGenDoNotContributeToKarmaLimit,
        }),
        ...(quality.charGenNoKarma !== undefined && {
          charGenNoKarma: quality.charGenNoKarma,
        }),
        ...(quality.chargenQualityOnly_NotSelectableIfPriorityChargen !==
          undefined && {
          chargenQualityOnly_NotSelectableIfPriorityChargen:
            quality.chargenQualityOnly_NotSelectableIfPriorityChargen,
        }),
        ...(quality.careerOnly !== undefined && {
          careerOnly: quality.careerOnly,
        }),
        ...(quality.charGenCostInCareer !== undefined && {
          charGenCostInCareer: quality.charGenCostInCareer,
        }),
        ...(quality.limit !== undefined && { limit: quality.limit }),
        sharedLimitQualityList: includedQualitiesNameList,
        ...(quality.karmaDiscountValue !== undefined &&
          quality.karmaDiscountRequirements !== undefined && {
            karmaDiscount: {
              value: quality.karmaDiscountValue,
              requirements: await convertDBRequirement(
                await safeLoad(
                  quality.karmaDiscountRequirements,
                  "quality.karmaDiscountRequirements"
                )
              ),
            },
          }),
        ...(quality.noLevels !== undefined && { noLevels: quality.noLevels }),
        ...(quality.firstLevelBonus !== undefined && {
          firstLevelBonus: quality.firstLevelBonus,
        }),
        addWeapons: includedWeaponsNameList,
        ...(quality.isMetagenic !== undefined && {
          isMetagenic: quality.isMetagenic,
        }),
        ...(quality.canBuyWithSpellPoints !== undefined && {
          canBuyWithSpellPoints: quality.canBuyWithSpellPoints,
        }),
        ...(quality.userSelectable !== undefined && {
          userSelectable: quality.userSelectable,
        }),
        ...(bonus !== undefined && { bonus: bonus }),
        ...(quality.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(quality.requirements, "quality.requirements")
          ),
        }),
        ...(quality.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(quality.forbidden, "quality.forbidden")
          ),
        }),
        source: quality.source,
        page: quality.page,
      };
      return qualityFormatted;
    })
  );
  return qualitiesResponse;
}

export async function getPriorityTable(): Promise<PriorityTableType> {
  const db = await init();
  const priorities = await db.em.findAll(Priorities, {
    populate: [
      "*",
      "heritageList.*",
      "heritageList.corePriorityHeritage",
      "heritageList.metavariantList.*",
      "talentList.*",
      "talentList.includedSkills.skillOptionList",
      "talentList.includedSkillGroups.skillGroupList",
    ],
  });
  const parsedPriorities = await Promise.all(
    priorities.map(async (priority) => {
      return await parsePriority(priority);
    })
  );
  const A = parsedPriorities.find(
    (parsedPriority) => parsedPriority.priority === priorityLetterEnum.A
  );
  const B = parsedPriorities.find(
    (parsedPriority) => parsedPriority.priority === priorityLetterEnum.B
  );
  const C = parsedPriorities.find(
    (parsedPriority) => parsedPriority.priority === priorityLetterEnum.C
  );
  const D = parsedPriorities.find(
    (parsedPriority) => parsedPriority.priority === priorityLetterEnum.D
  );
  const E = parsedPriorities.find(
    (parsedPriority) => parsedPriority.priority === priorityLetterEnum.E
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

export async function getHeritages(): Promise<HeritageListType> {
  const db = await init();
  const heritagesDB = await db.em.findAll(Heritages, {
    populate: [
      "*",
      "includedWeaponList",
      "includedQualityList",
      "forbiddenQualityList",
    ],
  });

  return Promise.all(
    heritagesDB.map(async (heritage) => {
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
      } else if (heritage instanceof BaseHeritages) {
        const variantHeritages = heritage.variantHeritages;

        if (heritage.category === heritageCategoryEnum.Metahuman) {
          typeInformation = {
            category: heritageCategoryEnum.Metahuman as const,
          };
        } else if (heritage.category === heritageCategoryEnum.Metasapient) {
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
      } else {
        throw new Error(
          `heritage is neither Metavariants nor BaseHeritages: ${heritage.constructor.name}`
        );
      }
      const parsedHeritage: HeritageType = {
        name: heritage.name,
        ...typeInformation,
        pointBuyKarmaCost: heritage.pointBuyKarmaCost,
        ...(heritage.halveAttributePoints !== undefined && {
          halveAttributePoints: heritage.halveAttributePoints,
        }),
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
        ...(heritage.initiative !== undefined && {
          initiative: heritage.initiative,
        }),
        ...(heritage.nonStandardMovement !== undefined && {
          nonStandardMovement: heritage.nonStandardMovement,
        }),
        ...(heritage.movement !== undefined && { movement: heritage.movement }),
        addWeaponList: heritage.includedWeaponList.map((weapon) => weapon.name),
        addQualityList: await Promise.all(
          heritage.includedQualityList.$.map(async (quality) => {
            return {
              name: (await safeLoad(quality.quality, "quality.quality")).name,
              rating: quality.rating,
            };
          })
        ),
        forbiddenQualityList: heritage.forbiddenQualityList.map(
          (quality) => quality.name
        ),
        ...(heritage.bonus !== undefined && {
          bonus: await convertDBBonus(heritage.bonus.$),
        }),
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

const weapons = privateProcedure.query(async () => {
  try {
    const weaponsResponse: WeaponListType = await getWeapons();
    // logger.log(JSON.stringify(weaponsResponse, null, 2));
    return weaponsResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const weaponAccessories = privateProcedure.query(async () => {
  try {
    const weaponAccessoriesResponse: WeaponAccessoryListType =
      await getWeaponAccessories();
    // logger.log(JSON.stringify(weaponAccessoriesResponse, null, 2));
    return weaponAccessoriesResponse;
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
      weaponMountModificationResponse,
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
      getWeaponMountModifications(),
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
      weaponMountModificationList: weaponMountModificationResponse,
    };
    // logger.log(JSON.stringify(equipmentResponse, null, 2));
    return equipmentResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});
const CharacterInformationSchema = type({
  "+": "reject",
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
  "martialArtSelected?": MartialArtSelectedSchema,
  equipmentSelections: SelectedEquipmentListSchema,
  lifestyleSelections: LifestyleSelectedListSchema,
  karmaPoints: "number",
  nuyen: "number",
  bonusInfo: CharacterCreatorBonusListSchema,
});
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
    switch (opts.input.talentInfo.category) {
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
  .input(type("string"))
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
          category: talentCategoryEnum.Mundane as const,
        };
      } else {
        if (character.talent.$ instanceof ActiveMagicTalents) {
          const talentDB = await db.em.findOne(
            ActiveMagicTalents,
            character.talent.id,
            {
              populate: ["*"],
            }
          );
          if (talentDB === null) {
            throw new Error("Talent does not exist");
          }

          let spirits: CustomSpiritsType = {
            customSpirits: false as const,
          };
          if (
            talentDB.combatSpirit !== undefined &&
            talentDB.detectionSpirit !== undefined &&
            talentDB.healthSpirit !== undefined &&
            talentDB.illusionSpirit !== undefined &&
            talentDB.manipulationSpirit !== undefined
          ) {
            spirits = {
              customSpirits: true as const,
              selectedSpiritTypes: {
                combat: talentDB.combatSpirit.$.name,
                detection: talentDB.detectionSpirit.$.name,
                health: talentDB.healthSpirit.$.name,
                illusion: talentDB.illusionSpirit.$.name,
                manipulation: talentDB.manipulationSpirit.$.name,
              },
            };
          }
          const tradition = {
            name: talentDB.tradition.$.name,
            customSpirits: spirits,
          };

          let mentorSpirit;
          if (talentDB.mentorSpirit !== undefined) {
            const sourceMentorSpirit = talentDB.mentorSpirit.$.mentorSpirit.$;
            mentorSpirit = {
              name: sourceMentorSpirit.name,
              description: sourceMentorSpirit.description,
              advantage: sourceMentorSpirit.advantage,
              disadvantage: sourceMentorSpirit.disadvantage,
              ...(sourceMentorSpirit.bonus !== undefined && {
                bonus: await convertDBBonus(
                  await safeLoad(
                    sourceMentorSpirit.bonus,
                    "sourceMentorSpirit.bonus"
                  )
                ),
              }),
              source: sourceMentorSpirit.source,
              page: sourceMentorSpirit.page,
              category: mentorCategoryEnum.MentorSpirit as const,
              choices: talentDB.mentorSpirit.$.choices,
              choiceCount: sourceMentorSpirit.choiceCount,
              ...(sourceMentorSpirit.required !== undefined && {
                required: await convertDBRequirement(
                  await safeLoad(
                    sourceMentorSpirit.required,
                    "sourceMentorSpirit.required"
                  )
                ),
              }),
            };
          }

          let formulae: FormulaListSelectedType = {
            selectFormulae: false as const,
          };
          // TODO: this assumes we selected at char gen,
          // there is probably a case where this isn't true
          // need to check based on char gen method e.g. priority
          // to see if we allow the selection of formulae
          if (
            talentDB.spellList.length > 0 ||
            talentDB.ritualList.length > 0 ||
            talentDB.alchemicalPreparationList.length > 0
          ) {
            formulae = {
              selectFormulae: true as const,
              spells: talentDB.spellList.$.map((spell) => {
                return spell.name;
              }),
              rituals: talentDB.ritualList.$.map((ritual) => {
                return ritual.name;
              }),
              alchemicalPreparations: talentDB.alchemicalPreparationList.$.map(
                (alchemicalPreparation) => {
                  return alchemicalPreparation.name;
                }
              ),
            };
          }
          let selectedAdeptPowers: AdeptPowerListSelectedType = {
            selectAdeptPowers: false as const,
          };
          if (talentDB.adeptPowerList.length > 0) {
            selectedAdeptPowers = {
              selectAdeptPowers: true as const,
              adeptPowers: talentDB.adeptPowerList.$.map((adeptPower) => {
                return adeptPower.name;
              }),
            };
          }
          talentInfo = {
            category: talentCategoryEnum.Magic as const,
            selectedTradition: tradition,
            selectedFormulae: formulae,
            selectedAdeptPowers: selectedAdeptPowers,
            ...(mentorSpirit !== undefined && { selectedMentor: mentorSpirit }),
          };
        } else if (character.talent.$ instanceof ActiveResonanceTalents) {
          const talentDB = await db.em.findOne(
            ActiveResonanceTalents,
            character.talent.id,
            {
              populate: ["*"],
            }
          );
          if (talentDB === null) {
            throw new Error("Talent does not exist");
          }
          let paragon;
          if (talentDB.paragon !== undefined) {
            const sourceParagon = talentDB.paragon.$.paragon.$;
            paragon = {
              name: sourceParagon.name,
              description: sourceParagon.description,
              advantage: sourceParagon.advantage,
              disadvantage: sourceParagon.disadvantage,
              ...(sourceParagon.bonus !== undefined && {
                bonus: await convertDBBonus(
                  await safeLoad(sourceParagon.bonus, "sourceParagon.bonus")
                ),
              }),
              source: sourceParagon.source,
              page: sourceParagon.page,
              category: mentorCategoryEnum.Paragon as const,
            };
          }
          talentInfo = {
            category: talentCategoryEnum.Resonance as const,
            complexForms: talentDB.complexFormList.$.map((complexForm) => {
              return complexForm.name;
            }),
            ...(paragon !== undefined && { selectedMentor: paragon }),
          };
        } else if (character.talent.$ instanceof ActiveDepthTalents) {
          const talentDB = await db.em.findOne(
            ActiveDepthTalents,
            character.talent.id,
            {
              populate: ["*"],
            }
          );
          if (talentDB === null) {
            throw new Error("Talent does not exist");
          }
          const programList: ProgramSelectedListType = [];
          for (const activeProgram of talentDB.ProgramList.$) {
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
            category: talentCategoryEnum.Depth as const,
            programs: programList,
          };
        } else {
          throw new Error(
            `Unknown talent type for ${character.id}, class ${character.constructor.name}`
          );
        }
      }
      const activeSkills = await Promise.all(
        character.skillList.map(async (skill) => {
          return await convertActiveSkillDBToDTO(skill);
        })
      );
      const activeQualities = await Promise.all(
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
        skillList: activeSkills,
        qualityList: activeQualities,
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
      bonus: await convertDBBonus(
        await safeLoad(heritageDB.bonus, "heritageDB.bonus")
      ),
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
    ...(skillDB.defaultSpecialisations !== undefined && {
      specialisations: skillDB.defaultSpecialisations,
    }),
    source: skillDB.source,
    page: skillDB.page,

    skillPoints: activeSkillDB.skillPoints,
    karmaPoints: activeSkillDB.karmaPoints,
    ...(activeSkillDB.specialisationsSelected !== undefined && {
      specialisationsSelected: activeSkillDB.specialisationsSelected,
    }),
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
      ? await convertDBBonus(qualityDB.bonus.$)
      : undefined;

  return {
    name: qualityDB.name,
    description: qualityDB.description,
    category: qualityDB.category,
    karma: qualityDB.karma,
    ...(qualityDB.charGenOnly !== undefined && {
      charGenOnly: qualityDB.charGenOnly,
    }),
    ...(qualityDB.charGenLimit !== undefined && {
      charGenLimit: qualityDB.charGenLimit,
    }),
    ...(qualityDB.charGenDoNotContributeToKarmaLimit !== undefined && {
      charGenDoNotContributeToKarmaLimit:
        qualityDB.charGenDoNotContributeToKarmaLimit,
    }),
    ...(qualityDB.charGenNoKarma !== undefined && {
      charGenNoKarma: qualityDB.charGenNoKarma,
    }),
    ...(qualityDB.chargenQualityOnly_NotSelectableIfPriorityChargen !==
      undefined && {
      chargenQualityOnly_NotSelectableIfPriorityChargen:
        qualityDB.chargenQualityOnly_NotSelectableIfPriorityChargen,
    }),
    ...(qualityDB.careerOnly !== undefined && {
      careerOnly: qualityDB.careerOnly,
    }),
    ...(qualityDB.charGenCostInCareer !== undefined && {
      charGenCostInCareer: qualityDB.charGenCostInCareer,
    }),
    ...(qualityDB.limit !== undefined && { limit: qualityDB.limit }),
    sharedLimitQualityList: qualityDB.sharedLimitQualityList.$.map(
      (quality) => quality.name
    ),
    ...(qualityDB.karmaDiscountValue !== undefined &&
      qualityDB.karmaDiscountRequirements !== undefined && {
        karmaDiscount: {
          value: qualityDB.karmaDiscountValue,
          requirements: await convertDBRequirement(
            await safeLoad(
              qualityDB.karmaDiscountRequirements,
              "quality.karmaDiscountRequirements"
            )
          ),
        },
      }),
    ...(qualityDB.noLevels !== undefined && { noLevels: qualityDB.noLevels }),
    ...(qualityDB.firstLevelBonus !== undefined && {
      firstLevelBonus: qualityDB.firstLevelBonus,
    }),
    addWeapons: qualityDB.includedWeaponList.$.map((weapon) => weapon.name),
    ...(qualityDB.isMetagenic !== undefined && {
      isMetagenic: qualityDB.isMetagenic,
    }),
    ...(qualityDB.canBuyWithSpellPoints !== undefined && {
      canBuyWithSpellPoints: qualityDB.canBuyWithSpellPoints,
    }),
    ...(qualityDB.userSelectable !== undefined && {
      userSelectable: qualityDB.userSelectable,
    }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(qualityDB.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(qualityDB.requirements, "qualityDB.requirements")
      ),
    }),
    ...(qualityDB.forbidden !== undefined && {
      forbidden: await convertDBRequirement(
        await safeLoad(qualityDB.forbidden, "qualityDB.forbidden")
      ),
    }),
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
    ...(activeWeaponDB.rating !== undefined && {
      rating: activeWeaponDB.rating,
    }),
    ...(activeWeaponDB.customName !== undefined && {
      customName: activeWeaponDB.customName,
    }),
  };
};

const convertWeaponDBToDTO = async function (
  weaponDB: Weapons
): Promise<WeaponType> {
  const relatedSkill = await weaponDB.relatedSkill.load();
  if (relatedSkill === null) {
    throw new Error("Related skill is unknown");
  }

  const weaponTypeInformation =
    await convertWeaponDBTypeInformationToDTO(weaponDB);

  return {
    name: weaponDB.name,
    ...weaponTypeInformation,
    description: weaponDB.description,
    ...(weaponDB.wireless !== undefined && { wireless: weaponDB.wireless }),
    concealability: weaponDB.concealability,
    accuracy: weaponDB.accuracy,
    damage: weaponDB.damage,
    armourPenetration: weaponDB.armourPenetration,
    ...(weaponDB.ammunition !== undefined && {
      ammunition: weaponDB.ammunition,
    }),
    allowedGearList: weaponDB.allowedGearList.map((gear) => {
      return gear.name;
    }),
    ...(weaponDB.allowedGearCategories !== undefined && {
      allowedGearCategories: weaponDB.allowedGearCategories,
    }),
    includedAccessoryList: await Promise.all(
      weaponDB.includedAccessoryList.map((accessory) => {
        return convertActiveWeaponAccessoryDBToDTO(accessory);
      })
    ),
    allowAccessories: weaponDB.allowAccessories,
    ...(weaponDB.userSelectable !== undefined && {
      userSelectable: weaponDB.userSelectable,
    }),
    ...(weaponDB.augmentationCategory !== undefined && {
      augmentationCategory: weaponDB.augmentationCategory,
    }),
    alternativeWeaponForms: weaponDB.alternativeWeaponForms.map((weapon) => {
      return weapon.name;
    }),
    ...(weaponDB.hostWeaponMountsRequired !== undefined && {
      hostWeaponMountsRequired: weaponDB.hostWeaponMountsRequired,
    }),
    ...(weaponDB.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(weaponDB.requirements, "weapon.requirements")
      ),
    }),
    relatedSkill: relatedSkill.name,
    ...(weaponDB.relatedSkillSpecialisationList !== undefined && {
      relatedSkillSpecialisationList: weaponDB.relatedSkillSpecialisationList,
    }),
    availability: weaponDB.availability,
    cost: weaponDB.cost,
    source: weaponDB.source,
    page: weaponDB.page,
  };
};

const convertWeaponDBTypeInformationToDTO = async function (
  weaponDB: Weapons
): Promise<
  | FirearmWeaponSpecificType
  | MeleeWeaponSpecificType
  | ProjectileWeaponSpecificType
  | ExplosiveWeaponSpecificType
> {
  if (weaponDB instanceof MeleeWeapons) {
    const meleeTypeInformation: MeleeWeaponSpecificType = {
      category: weaponCategoryEnum.Melee as const,
      subtype: weaponDB.subtype,
      meleeOptions: {
        reach: weaponDB.reach,
      } satisfies MeleeOptionsType,
    };
    return meleeTypeInformation;
  } else if (weaponDB instanceof ProjectileWeapons) {
    const rangeLinkList = await weaponDB.ranges.loadItems();
    const projectileTypeInformation: ProjectileWeaponSpecificType = {
      category: weaponCategoryEnum.Projectile as const,
      subtype: weaponDB.subtype,
      ...(weaponDB.extraClassification !== undefined && {
        extraClassification: weaponDB.extraClassification,
      }),
      rangeList: rangeLinkList.map((range) => range.name),
    };
    return projectileTypeInformation;
  } else if (weaponDB instanceof FirearmWeapons) {
    const rangeLinkList = await weaponDB.ranges.loadItems();
    const firearmTypeInformation: FirearmWeaponSpecificType = {
      category: weaponCategoryEnum.Firearm as const,
      subtype: weaponDB.subtype,
      ...(weaponDB.extraClassification !== undefined && {
        extraClassification: weaponDB.extraClassification,
      }),
      firearmOptions: {
        mode: weaponDB.mode,
        recoilCompensation: weaponDB.recoilCompensation,
        ...(weaponDB.ammoWeaponClassification !== undefined && {
          ammoWeaponClassification: weaponDB.ammoWeaponClassification,
        }),
        ammoSlots: weaponDB.ammoSlots,
        ...(weaponDB.underbarrelWeapons.length > 0 && {
          underbarrelWeaponList: weaponDB.underbarrelWeapons.map((weapon) => {
            return weapon.name;
          }),
        }),
        ...(weaponDB.accessoryMountList !== undefined && {
          accessoryMountList: weaponDB.accessoryMountList,
        }),
        ...(weaponDB.doubleCostAccessoryMountList !== undefined && {
          doubleCostAccessoryMountList: weaponDB.doubleCostAccessoryMountList,
        }),
      } satisfies FirearmOptionsType,
      rangeList: rangeLinkList.map((range) => range.name),
    };
    return firearmTypeInformation;
  } else if (weaponDB instanceof Explosives) {
    const rangeLinkList = await weaponDB.ranges.loadItems();
    const explosiveTypeInformation: ExplosiveWeaponSpecificType = {
      category: weaponCategoryEnum.Explosive as const,
      subtype: weaponDB.subtype,
      rangeList: rangeLinkList.map((range) => range.name),
    };
    return explosiveTypeInformation;
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
    ...(includedAccessoryDB.rating !== undefined && {
      rating: includedAccessoryDB.rating,
    }),
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
    ...(activeArmourDB.customName !== undefined && {
      customName: activeArmourDB.customName,
    }),
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
    ...(modDB.rating !== undefined && { rating: modDB.rating }),
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
    ...(armourDB.maxRating !== undefined && { maxRating: armourDB.maxRating }),
    damageReduction: armourDB.damageReduction,
    ...(armourDB.customFitStackDamageReduction !== undefined && {
      customFitStackDamageReduction: armourDB.customFitStackDamageReduction,
    }),
    capacity: armourDB.capacity,
    ...(armourDB.linkedWeapon !== undefined && { isWeapon: true }),
    // TODO: add
    // includedGearList: armourDB.includedGearList,
    ...(armourDB.bonus !== undefined && {
      bonus: await convertDBBonus(
        await safeLoad(armourDB.bonus, "armourDB.bonus")
      ),
    }),
    ...(armourDB.wirelessBonus !== undefined && {
      wirelessBonus: await convertDBBonus(
        await safeLoad(armourDB.wirelessBonus, "armourDB.wirelessBonus")
      ),
    }),
    // TODO: Add
    // includedMods: armourDB.includedMods,
    ...(armourDB.allowModsFromCategory !== undefined && {
      allowModsFromCategory: armourDB.allowModsFromCategory,
    }),
    ...(armourDB.addModFromCategory !== undefined && {
      addModFromCategory: armourDB.addModFromCategory,
    }),
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
    ...(customisedGearDB.specificOption !== undefined && {
      specificOption: customisedGearDB.specificOption,
    }),
    ...(customisedGearDB.rating !== undefined && {
      rating: customisedGearDB.rating,
    }),
    ...(customisedGearDB.consumeCapacity !== undefined && {
      consumeCapacity: customisedGearDB.consumeCapacity,
    }),
    ...(customisedGearDB.currentQuantity !== undefined && {
      currentQuantity: customisedGearDB.currentQuantity,
    }),
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
    ...(gearDB.minRating !== undefined && { minRating: gearDB.minRating }),
    ...(gearDB.maxRating !== undefined && { maxRating: gearDB.maxRating }),
    ...(gearDB.ratingMeaning !== undefined && {
      ratingMeaning: gearDB.ratingMeaning,
    }),
    ...(includedWeapon !== undefined && { includedWeapon: includedWeapon }),
    ...(gearDB.allowCategoryList !== undefined && {
      allowCategoryList: gearDB.allowCategoryList,
    }),
    ...(gearDB.purchaseQuantity !== undefined && {
      purchaseQuantity: gearDB.purchaseQuantity,
    }),
    ...(gearDB.bonus !== undefined && {
      bonus: await convertDBBonus(await safeLoad(gearDB.bonus, "gearDB.bonus")),
    }),
    ...(gearDB.weaponBonus !== undefined && {
      weaponBonus: gearDB.weaponBonus,
    }),
    ...(gearDB.isFlechetteAmmo !== undefined && {
      isFlechetteAmmo: gearDB.isFlechetteAmmo,
    }),
    ...(gearDB.flechetteWeaponBonus !== undefined && {
      flechetteWeaponBonus: gearDB.flechetteWeaponBonus,
    }),
    ...(gearDB.ammoForWeaponType !== undefined && {
      ammoForWeaponType: gearDB.ammoForWeaponType,
    }),
    ...(gearDB.explosiveWeight !== undefined && {
      explosiveWeight: gearDB.explosiveWeight,
    }),
    ...(gearDB.userSelectable !== undefined && {
      userSelectable: gearDB.userSelectable,
    }),
    allowedGearList: gearDB.allowedGearList.map((gear) => {
      return gear.name;
    }),
    includedGearList: await Promise.all(
      gearDB.includedGearList.map(async (gear) => {
        return convertActiveGearDBToDTO(gear);
      })
    ),
    ...(gearDB.deviceRating !== undefined && {
      deviceRating: gearDB.deviceRating,
    }),
    ...(gearDB.programs !== undefined && { programs: gearDB.programs }),
    ...(gearDB.attributeArray !== undefined && {
      attributeArray: gearDB.attributeArray,
    }),
    ...(gearDB.attack !== undefined && { attack: gearDB.attack }),
    ...(gearDB.sleaze !== undefined && { sleaze: gearDB.sleaze }),
    ...(gearDB.dataProcessing !== undefined && {
      dataProcessing: gearDB.dataProcessing,
    }),
    ...(gearDB.firewall !== undefined && { firewall: gearDB.firewall }),
    ...(gearDB.canFormPersona !== undefined && {
      canFormPersona: gearDB.canFormPersona,
    }),
    ...(gearDB.capacityInformation !== undefined && {
      capacityInformation: gearDB.capacityInformation,
    }),
    ...(gearDB.armourCapacityInformation !== undefined && {
      armourCapacityInformation: gearDB.armourCapacityInformation,
    }),
    ...(gearDB.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(gearDB.requirements, "gearDB.requirements")
      ),
    }),
    ...(gearDB.requireParent !== undefined && {
      requireParent: gearDB.requireParent,
    }),
    ...(gearDB.forbidden !== undefined && {
      forbidden: await convertDBRequirement(
        await safeLoad(gearDB.forbidden, "gearDB.forbidden")
      ),
    }),
    ...(gearDB.modifyAttributeArray !== undefined && {
      modifyAttributeArray: gearDB.modifyAttributeArray,
    }),
    ...(gearDB.modifyAttack !== undefined && {
      modifyAttack: gearDB.modifyAttack,
    }),
    ...(gearDB.modifySleaze !== undefined && {
      modifySleaze: gearDB.modifySleaze,
    }),
    ...(gearDB.modifyDataProcessing !== undefined && {
      modifyDataProcessing: gearDB.modifyDataProcessing,
    }),
    ...(gearDB.modifyFirewall !== undefined && {
      modifyFirewall: gearDB.modifyFirewall,
    }),
    ...(gearDB.addMatrixBoxes !== undefined && {
      addMatrixBoxes: gearDB.addMatrixBoxes,
    }),
    ...(gearDB.renameCustomLabel !== undefined && {
      renameCustomLabel: gearDB.renameCustomLabel,
    }),
    availability: gearDB.availability,
    cost: gearDB.cost,
    source: gearDB.source,
    page: gearDB.page,
  };
};

const convertCustomAugmentationDBToDTO = async function (
  customisedAugmentationDB: BaseActiveAugmentations
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
  const typeInformation =
    await convertAugmentationTypeInformation(augmentationDB);

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
    ...(augmentationDB.wireless !== undefined && {
      wireless: augmentationDB.wireless,
    }),
    ...(augmentationDB.augmentationLimit !== undefined && {
      augmentationLimit: augmentationDB.augmentationLimit,
    }),
    ...(augmentationDB.unavailableGrades !== undefined && {
      unavailableGrades: augmentationDB.unavailableGrades,
    }),
    essenceCost: augmentationDB.essenceCost,
    ...(augmentationDB.modification !== undefined && {
      modification: augmentationDB.modification,
    }),
    ...(augmentationDB.requireParent !== undefined && {
      requireParent: augmentationDB.requireParent,
    }),
    rating: augmentationDB.rating,
    ...(augmentationDB.ratingMeaning !== undefined && {
      ratingMeaning: augmentationDB.ratingMeaning,
    }),
    ...(addWeapon !== undefined && { addWeapon: addWeapon }),
    ...(augmentationDB.blockedMountList !== undefined && {
      blockedMountList: augmentationDB.blockedMountList,
    }),
    ...(augmentationDB.selectSide !== undefined && {
      selectSide: augmentationDB.selectSide,
    }),
    ...(augmentationDB.bonus !== undefined && {
      bonus: await convertDBBonus(
        await safeLoad(augmentationDB.bonus, "augmentationDB.bonus")
      ),
    }),
    ...(augmentationDB.pairBonus !== undefined && {
      pairBonus: await convertDBBonus(
        await safeLoad(augmentationDB.pairBonus, "augmentationDB.pairBonus")
      ),
    }),
    pairIncludeList: augmentationDB.pairIncludeList.map((augmentation) => {
      return augmentation.name;
    }),
    ...(augmentationDB.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(
          augmentationDB.requirements,
          "augmentationDB.requirements"
        )
      ),
    }),
    ...(augmentationDB.forbidden !== undefined && {
      forbidden: await convertDBRequirement(
        await safeLoad(augmentationDB.forbidden, "augmentationDB.forbidden")
      ),
    }),
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
    ...(augmentationDB.allowedGearCategories !== undefined && {
      allowedGearCategories: augmentationDB.allowedGearCategories,
    }),
    ...(augmentationDB.userSelectable !== undefined && {
      userSelectable: augmentationDB.userSelectable,
    }),
    ...(augmentationDB.allowSubsystemCategoryList !== undefined && {
      allowSubsystemCategoryList: augmentationDB.allowSubsystemCategoryList,
    }),
    availability: augmentationDB.availability,
    cost: augmentationDB.cost,
    source: augmentationDB.source,
    page: augmentationDB.page,
  };
};

export const convertCritterPowerDBToDTO = async function (
  critterPowerDB: CritterPowers
): Promise<CritterPowerType> {
  return {
    name: critterPowerDB.name,
    category: critterPowerDB.category,
    description: critterPowerDB.description,
    ...(critterPowerDB.karmaCost !== undefined && {
      karmaCost: critterPowerDB.karmaCost,
    }),
    ...(critterPowerDB.rating !== undefined && {
      rating: critterPowerDB.rating,
    }),
    ...(critterPowerDB.type !== undefined && {
      type: critterPowerDB.type,
    }),
    ...(critterPowerDB.action !== undefined && {
      action: critterPowerDB.action,
    }),
    ...(critterPowerDB.range !== undefined && {
      range: critterPowerDB.range,
    }),
    ...(critterPowerDB.duration !== undefined && {
      duration: critterPowerDB.duration,
    }),
    ...(critterPowerDB.userSelectable !== undefined && {
      userSelectable: critterPowerDB.userSelectable,
    }),
    ...(critterPowerDB.bonus !== undefined && {
      bonus: await convertDBBonus(
        await safeLoad(critterPowerDB.bonus, "critterPowerDB.bonus")
      ),
    }),
    ...(critterPowerDB.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(
          critterPowerDB.requirements,
          "critterPowerDB.requirements"
        )
      ),
    }),
    ...(critterPowerDB.forbidden !== undefined && {
      forbidden: await convertDBRequirement(
        await safeLoad(critterPowerDB.forbidden, "critterPowerDB.forbidden")
      ),
    }),
    source: critterPowerDB.source,
    page: critterPowerDB.page,
  };
};

export const convertLifestyleDBToDTO = async function (
  lifestyle: Lifestyles
): Promise<LifestyleType> {
  const bonus =
    lifestyle.bonus !== undefined
      ? await convertDBBonus(await safeLoad(lifestyle.bonus, "lifestyle.bonus"))
      : undefined;
  return {
    name: lifestyle.name,
    cost: lifestyle.cost,
    lifestylePoints: lifestyle.lifestylePoints,
    ...(lifestyle.allowBonusLifestylePoints !== undefined && {
      allowBonusLifestylePoints: lifestyle.allowBonusLifestylePoints,
    }),
    freegridList: lifestyle.freegridList,
    dice: lifestyle.dice,
    startingNuyenMultiplier: lifestyle.startingNuyenMultiplier,
    ...(lifestyle.costIncreasePerCategoryLevelIncrease !== undefined && {
      costIncreasePerCategoryLevelIncrease:
        lifestyle.costIncreasePerCategoryLevelIncrease,
    }),
    ...(lifestyle.lifestyleCategoryDefaults !== undefined && {
      lifestyleCategoryDefaults: lifestyle.lifestyleCategoryDefaults,
    }),
    ...(lifestyle.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(lifestyle.requirements, "lifestyle.requirements")
      ),
    }),
    ...(bonus !== undefined && { bonus: bonus }),
    ...(lifestyle.forbidden !== undefined && {
      forbidden: await convertDBRequirement(
        await safeLoad(lifestyle.forbidden, "lifestyle.forbidden")
      ),
    }),
    description: lifestyle.description,
    source: lifestyle.source,
    page: lifestyle.page,
  };
};

const convertAugmentationTypeInformation = async function (
  augmentationDB: Augmentations
): Promise<AugmentationTypeInformationType> {
  if (augmentationDB instanceof Cyberwares) {
    let addVehicle;
    if (augmentationDB.linkedVehicle !== undefined) {
      addVehicle = await augmentationDB.linkedVehicle.load();
      if (addVehicle === null) {
        throw new Error("Vehicle does not exist");
      }
    }
    return {
      category: augmentationCategoryEnum.Cyberware as const,
      subtype: augmentationDB.subtype,
      ...(augmentationDB.programs !== undefined && {
        programs: augmentationDB.programs,
      }),
      ...(augmentationDB.capacity !== undefined && {
        capacity: augmentationDB.capacity,
      }),
      ...(augmentationDB.capacityCost !== undefined && {
        capacityCost: augmentationDB.capacityCost,
      }),
      ...(augmentationDB.addToParentCapacity !== undefined && {
        addToParentCapacity: augmentationDB.addToParentCapacity,
      }),
      ...(augmentationDB.addParentWeaponAccessory !== undefined && {
        addParentWeaponAccessory: augmentationDB.addParentWeaponAccessory,
      }),
      ...(augmentationDB.removalCost !== undefined && {
        removalCost: augmentationDB.removalCost,
      }),
      ...(augmentationDB.inheritAttributes !== undefined && {
        inheritAttributes: augmentationDB.inheritAttributes,
      }),
      ...(augmentationDB.limbSlot !== undefined && {
        limbSlot: augmentationDB.limbSlot,
      }),
      ...(augmentationDB.useBothLimbSlots !== undefined && {
        useBothLimbSlots: augmentationDB.useBothLimbSlots,
      }),
      ...(augmentationDB.mountsLocation !== undefined && {
        mountsLocation: augmentationDB.mountsLocation,
      }),
      ...(augmentationDB.modularMount !== undefined && {
        modularMount: augmentationDB.modularMount,
      }),
      ...(augmentationDB.wirelessBonus !== undefined && {
        wirelessBonus: await convertDBBonus(
          await safeLoad(
            augmentationDB.wirelessBonus,
            "augmentationDB.wirelessBonus"
          )
        ),
      }),
      ...(augmentationDB.wirelessPairBonus !== undefined && {
        wirelessPairBonus: await convertDBBonus(
          await safeLoad(
            augmentationDB.wirelessPairBonus,
            "augmentationDB.wirelessPairBonus"
          )
        ),
      }),
      ...(augmentationDB.wirelessPairLinkedCyberware !== undefined && {
        wirelessPairInclude: augmentationDB.wirelessPairLinkedCyberware.name,
      }),
      ...(augmentationDB.subsystemList !== undefined && {
        includedSubsystemList: augmentationDB.subsystemList,
      }),
      ...(augmentationDB.forceGrade !== undefined && {
        forceGrade: augmentationDB.forceGrade,
      }),
      ...(augmentationDB.deviceRating !== undefined && {
        deviceRating: augmentationDB.deviceRating,
      }),
      ...(addVehicle !== undefined && { addVehicle: addVehicle.name }),
      ...(augmentationDB.wireless !== undefined && {
        wireless: augmentationDB.wireless,
      }),
    };
  } else if (augmentationDB instanceof Biowares) {
    return {
      category: augmentationCategoryEnum.Bioware as const,
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
    ...(modDB.rating !== undefined && { rating: modDB.rating }),
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
    ...(activeVehicleDB.customName !== undefined && {
      customName: activeVehicleDB.customName,
    }),
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
    weaponMounted = await db.em.findOne(WeaponMountWeapons, weaponId, {
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
    ...(activeWeaponMountDB.weaponExchangeable !== undefined && {
      weaponExchangeable: activeWeaponMountDB.weaponExchangeable,
    }),
    ...(weaponMounted !== undefined && {
      weaponMounted: await convertActiveWeaponDBToDTO(weaponMounted),
    }),
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
          ...(mod.rating !== undefined && { rating: mod.rating }),
        };
      })
    ),
    ...(vehicleDB.modSlots !== undefined && { modSlots: vehicleDB.modSlots }),
    ...(vehicleDB.powerTrainModSlots !== undefined && {
      powerTrainModSlots: vehicleDB.powerTrainModSlots,
    }),
    ...(vehicleDB.protectionModSlots !== undefined && {
      protectionModSlots: vehicleDB.protectionModSlots,
    }),
    ...(vehicleDB.weaponModSlots !== undefined && {
      weaponModSlots: vehicleDB.weaponModSlots,
    }),
    ...(vehicleDB.bodyModSlots !== undefined && {
      bodyModSlots: vehicleDB.bodyModSlots,
    }),
    ...(vehicleDB.electromagneticModSlots !== undefined && {
      electromagneticModSlots: vehicleDB.electromagneticModSlots,
    }),
    ...(vehicleDB.cosmeticModSlots !== undefined && {
      cosmeticModSlots: vehicleDB.cosmeticModSlots,
    }),
    // TODO: add
    // weaponList: vehicleDB.weaponList,
    // weaponMountList: vehicleDB.weaponMountList,
    ...(vehicleDB.userSelectable !== undefined && {
      userSelectable: vehicleDB.userSelectable,
    }),
    availability: vehicleDB.availability,
    cost: vehicleDB.cost,
    source: vehicleDB.source,
    page: vehicleDB.page,
  };
};

const convertVehicleTypeInformation = function (
  vehicleDB: Vehicles
):
  | GroundcraftClassificationVehicleType
  | WatercraftClassificationVehicleType
  | AircraftClassificationVehicleType
  | DroneClassificationVehicleType {
  if (vehicleDB instanceof Groundcrafts) {
    return {
      category: vehicleCategoryEnum.Groundcraft as const,
      subtype: vehicleDB.subtype,
      seats: vehicleDB.seats,
    };
  } else if (vehicleDB instanceof Watercrafts) {
    return {
      category: vehicleCategoryEnum.Watercraft as const,
      subtype: vehicleDB.subtype,
      seats: vehicleDB.seats,
    };
  } else if (vehicleDB instanceof Aircrafts) {
    return {
      category: vehicleCategoryEnum.Aircraft as const,
      subtype: vehicleDB.subtype,
      seats: vehicleDB.seats,
    };
  } else if (vehicleDB instanceof Drones) {
    return {
      category: vehicleCategoryEnum.Drone as const,
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
    ...(martialArtDB.bonus !== undefined && {
      bonus: await convertDBBonus(martialArtDB.bonus.$),
    }),
    techniqueList: martialArtDB.techniqueList.$.map((technique) => {
      return technique.name;
    }),
    ...(martialArtDB.karmaCost !== undefined && {
      karmaCost: martialArtDB.karmaCost,
    }),
    ...(martialArtDB.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(martialArtDB.requirements, "martialArtDB.requirements")
      ),
    }),
    description: martialArtDB.description,
    source: martialArtDB.source,
    page: martialArtDB.page,
  };
  const techniqueList = await Promise.all(
    activeMartialArtDB.selectedTechniqueList.map(async (technique) => {
      return {
        name: technique.name,
        ...(technique.bonus !== undefined && {
          bonus: await convertDBBonus(
            await safeLoad(technique.bonus, "technique.bonus")
          ),
        }),
        ...(technique.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(technique.requirements, "technique.requirements")
          ),
        }),
        description: technique.description,
        source: technique.source,
        page: technique.page,
      };
    })
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
    ...(lifestyleDB.allowBonusLifestylePoints !== undefined && {
      allowBonusLifestylePoints: lifestyleDB.allowBonusLifestylePoints,
    }),
    freegridList: lifestyleDB.freegridList,
    dice: lifestyleDB.dice,
    startingNuyenMultiplier: lifestyleDB.startingNuyenMultiplier,
    ...(lifestyleDB.costIncreasePerCategoryLevelIncrease !== undefined && {
      costIncreasePerCategoryLevelIncrease:
        lifestyleDB.costIncreasePerCategoryLevelIncrease,
    }),
    ...(lifestyleDB.lifestyleCategoryDefaults !== undefined && {
      lifestyleCategoryDefaults: lifestyleDB.lifestyleCategoryDefaults,
    }),
    ...(lifestyleDB.bonus !== undefined && {
      bonus: await convertDBBonus(lifestyleDB.bonus.$),
    }),
    ...(lifestyleDB.requirements !== undefined && {
      requirements: await convertDBRequirement(
        await safeLoad(lifestyleDB.requirements, "lifestyleDB.requirements")
      ),
    }),
    ...(lifestyleDB.forbidden !== undefined && {
      forbidden: await convertDBRequirement(
        await safeLoad(lifestyleDB.forbidden, "lifestyleDB.forbidden")
      ),
    }),
    source: lifestyleDB.source,
    page: lifestyleDB.page,
    description: lifestyleDB.description,
  };
  const lifestyleQualityList = await Promise.all(
    activeLifestyleDB.lifestyleQualityList.map(async (lifestyleQuality) => {
      return {
        name: lifestyleQuality.name,
        category: lifestyleQuality.category,
        monthlyCost: lifestyleQuality.monthlyCost,
        lifestylePointCost: lifestyleQuality.lifestylePointCost,
        ...(lifestyleQuality.lifestyleCostMultiplier !== undefined && {
          lifestyleCostMultiplier: lifestyleQuality.lifestyleCostMultiplier,
        }),
        requiredLifestyleList: lifestyleQuality.requiredLifestyleList.map(
          (requiredLifestyle) => {
            return requiredLifestyle.name;
          }
        ),
        ...(lifestyleQuality.multipleAllowed !== undefined && {
          multipleAllowed: lifestyleQuality.multipleAllowed,
        }),
        ...(lifestyleQuality.bonus !== undefined && {
          bonus: await convertDBBonus(
            await safeLoad(lifestyleQuality.bonus, "lifestyleQuality.bonus")
          ),
        }),
        ...(lifestyleQuality.requirements !== undefined && {
          requirements: await convertDBRequirement(
            await safeLoad(
              lifestyleQuality.requirements,
              "lifestyleQuality.requirements"
            )
          ),
        }),
        ...(lifestyleQuality.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(
              lifestyleQuality.forbidden,
              "lifestyleQuality.forbidden"
            )
          ),
        }),
        source: lifestyleQuality.source,
        page: lifestyleQuality.page,
        description: lifestyleQuality.description,
      };
    })
  );

  return {
    lifestyle: lifestyle,
    lifestyleQualityList: lifestyleQualityList,
    purchasedDuration: activeLifestyleDB.purchasedDuration,
  };
};

const createDraftCharacter: TRPCMutationProcedure<{
  input: CreateDraftCharacterType;
  output: { id: number; version: number };
  meta: object;
}> = privateProcedure
  .input((input: unknown): CreateDraftCharacterType =>
    CreateDraftCharacterSchema.assert(input)
  )
  .mutation(
    async (opts: {
      ctx: LoggedInContext;
      input: CreateDraftCharacterType;
    }): Promise<{ id: number; version: number }> => {
      try {
        const db = await init();
        const draft = new DraftCharacters({
          user: ref(Users, opts.ctx.id),
          currentStep: opts.input.currentStep,
          characterData: opts.input.characterData,
          ...(opts.input.name !== undefined && { name: opts.input.name }),
        });
        await db.em.persistAndFlush(draft);
        return {
          id: draft.id,
          version: draft.version,
        };
      } catch (error) {
        logger.error("Failed to create draft character:", error);
        throw new Error("Failed to create draft character");
      }
    }
  );

const getDraftCharacter = privateProcedure
  .input(type("number"))
  .query(async (opts) => {
    try {
      const db = await init();
      const draft = await db.em.findOne(
        DraftCharacters,
        { id: opts.input, user: { id: opts.ctx.id } },
        { populate: ["user"] }
      );
      if (draft === null) {
        throw new Error("Draft character not found");
      }
      const response: DraftCharacterResponseType = {
        id: draft.id,
        name: draft.name,
        currentStep: draft.currentStep,
        characterData: draft.characterData,
        version: draft.version,
        createdAt: draft.createdAt.toISOString(),
        updatedAt: draft.updatedAt.toISOString(),
      };
      return response;
    } catch (error) {
      logger.error("Failed to get draft character:", error);
      throw new Error("Failed to get draft character");
    }
  });

const updateDraftCharacter: TRPCMutationProcedure<{
  input: UpdateDraftCharacterType;
  output:
    | {
        conflict: true;
        serverVersion: number;
        serverData: {
          id: number;
          name: string;
          currentStep: string;
          characterData: DraftCharacterDataType;
          version: number;
          createdAt: string;
          updatedAt: string;
        };
      }
    | { conflict: false; id: number; version: number };
  meta: object;
}> = privateProcedure
  .input((input: unknown): UpdateDraftCharacterType =>
    UpdateDraftCharacterSchema.assert(input)
  )
  .mutation(
    async (opts: { ctx: LoggedInContext; input: UpdateDraftCharacterType }) => {
      try {
        const db = await init();
        const draft = await db.em.findOne(DraftCharacters, {
          id: opts.input.draftId,
          user: { id: opts.ctx.id },
        });
        if (draft === null) {
          throw new Error("Draft character not found");
        }
        // Check version for conflict detection
        if (
          opts.input.forceOverwrite === false &&
          draft.version !== opts.input.version
        ) {
          // Return conflict response with current server data
          return {
            conflict: true as const,
            serverVersion: draft.version,
            serverData: {
              id: draft.id,
              name: draft.name,
              currentStep: draft.currentStep,
              characterData: draft.characterData,
              version: draft.version,
              createdAt: draft.createdAt.toISOString(),
              updatedAt: draft.updatedAt.toISOString(),
            },
          };
        }
        // Update the draft
        draft.currentStep = opts.input.currentStep;
        draft.characterData = opts.input.characterData;
        if (opts.input.name !== undefined) {
          draft.name = opts.input.name;
        }
        draft.version = draft.version + 1;
        await db.em.flush();
        return {
          conflict: false as const,
          id: draft.id,
          version: draft.version,
        };
      } catch (error) {
        logger.error("Failed to update draft character:", error);
        throw new Error("Failed to update draft character");
      }
    }
  );

const deleteDraftCharacter = privateProcedure
  .input(type("number"))
  .mutation(async (opts) => {
    try {
      const db = await init();
      const draft = await db.em.findOne(DraftCharacters, {
        id: opts.input,
        user: { id: opts.ctx.id },
      });
      if (draft === null) {
        throw new Error("Draft character not found");
      }
      await db.em.removeAndFlush(draft);
      return { success: true };
    } catch (error) {
      logger.error("Failed to delete draft character:", error);
      throw new Error("Failed to delete draft character");
    }
  });

const getDraftCharacterList = privateProcedure.query(async (opts) => {
  try {
    const db = await init();
    const drafts = await db.em.findAll(DraftCharacters, {
      where: { user: { id: opts.ctx.id } },
      orderBy: { updatedAt: "DESC" },
    });
    const response: DraftCharacterSummaryListType = drafts.map((draft) => ({
      id: draft.id,
      name: draft.name,
      currentStep: draft.currentStep,
      updatedAt: draft.updatedAt.toISOString(),
    }));
    return response;
  } catch (error) {
    logger.error("Failed to get draft character list:", error);
    throw new Error("Failed to get draft character list");
  }
});

type routesType = {
  traditions: typeof traditions;
  mentors: typeof mentors;
  critters: typeof critters;
  spells: typeof spells;
  complexForms: typeof complexForms;
  adeptPowers: typeof adeptPowers;
  programs: typeof programs;
  skills: typeof skills;
  qualities: typeof qualities;
  priorities: typeof priorities;
  heritages: typeof heritages;
  weapons: typeof weapons;
  weaponAccessories: typeof weaponAccessories;
  armours: typeof armours;
  gear: typeof gears;
  augmentations: typeof augmentations;
  vehiclesAndDrones: typeof vehiclesAndDrones;
  martialArts: typeof martialArts;
  martialArtTechniques: typeof martialArtTechniques;
  lifestyles: typeof lifestyles;
  lifestyleQualities: typeof lifestyleQualities;
  equipmentPacks: typeof equipmentPacks;
  all: typeof all;
  createCharacter: typeof createCharacter;
  getCharacter: typeof getCharacter;
  getCharacterList: typeof getCharacterList;
  createDraftCharacter: typeof createDraftCharacter;
  getDraftCharacter: typeof getDraftCharacter;
  updateDraftCharacter: typeof updateDraftCharacter;
  deleteDraftCharacter: typeof deleteDraftCharacter;
  getDraftCharacterList: typeof getDraftCharacterList;
};

const routes: routesType = {
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
  weapons: weapons,
  weaponAccessories: weaponAccessories,
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
  createDraftCharacter: createDraftCharacter,
  getDraftCharacter: getDraftCharacter,
  updateDraftCharacter: updateDraftCharacter,
  deleteDraftCharacter: deleteDraftCharacter,
  getDraftCharacterList: getDraftCharacterList,
};

export const characterRouter = router(routes);

async function getHeritageTypeInformation(heritageDB: Heritages): Promise<
  | {
      category:
        | heritageCategoryEnum.Metahuman
        | heritageCategoryEnum.Metasapient
        | heritageCategoryEnum.Shapeshifter;
    }
  | { category: heritageCategoryEnum.Metavariant; baseHeritage: string }
> {
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

async function parsePriority(
  priority: Loaded<
    Priorities,
    | "*"
    | "heritageList.*"
    | "heritageList.corePriorityHeritage"
    | "heritageList.metavariantList.*"
    | "talentList.*"
    | "talentList.includedSkills.skillOptionList"
    | "talentList.includedSkillGroups.skillGroupList",
    "*",
    never
  >
): Promise<PriorityRowType> {
  const heritageItems = (await priority.heritageList.loadItems()).filter(
    (item) => item.corePriorityHeritage === undefined
  );
  const heritageList = await Promise.all(
    heritageItems.map(async (heritage) => {
      const metavariants = await heritage.metavariantList.loadItems();
      let metavariantList;
      if (metavariants.length > 0) {
        metavariantList = await Promise.all(
          metavariants.map(async (metavariant) => {
            return {
              name: (
                await safeLoad(
                  metavariant.linkedHeritage,
                  "heritage.linkedHeritage"
                )
              ).name,
              specialAttributePoints: metavariant.specialAttributePoints,
              karmaCost: metavariant.karmaCost,
            };
          })
        );
      }

      return {
        name: (
          await safeLoad(heritage.linkedHeritage, "heritage.linkedHeritage")
        ).name,
        specialAttributePoints: heritage.specialAttributePoints,
        karmaCost: heritage.karmaCost,
        ...(metavariantList !== undefined && {
          metavariantList: metavariantList,
        }),
      };
    })
  );

  const talentItems = await priority.talentList.loadItems();
  const talentList = await Promise.all(
    talentItems.map(async (talent) => {
      let includedSkills;
      if (talent.includedSkills !== undefined) {
        const skillOptions =
          await talent.includedSkills.skillOptionList.loadItems();
        includedSkills = {
          skillCount: talent.includedSkills.points,
          rating: talent.includedSkills.rating,
          skillOptionList: skillOptions.map((skill) => {
            return skill.name;
          }),
        };
        // TODO: these are all empty, take a look...
      } else if (talent.includedSkillSource !== undefined) {
        includedSkills = {
          skillCount: talent.includedSkillSource.points,
          rating: talent.includedSkillSource.rating,
          source: talent.includedSkillSource.source,
        };
      }
      let includedSkillGroups;
      if (talent.includedSkillGroups !== undefined) {
        const skillGroups =
          await talent.includedSkillGroups.skillGroupList.loadItems();
        includedSkillGroups = {
          skillCount: talent.includedSkillGroups.points,
          rating: talent.includedSkillGroups.rating,
          groupList: skillGroups.map((group) => {
            return group.name;
          }),
        };
      }

      const baseTalent = {
        name: talent.name,
        label: talent.label,
        ...(talent.includedQuality !== undefined && {
          includedQuality: (
            await safeLoad(talent.includedQuality, "talent.includedQuality")
          ).name,
        }),
        ...(includedSkills !== undefined && { includedSkills: includedSkills }),
        ...(includedSkillGroups !== undefined && {
          includedSkillGroups: includedSkillGroups,
        }),
        ...(talent.requirements !== undefined && {
          required: await convertDBRequirement(
            await safeLoad(talent.requirements, "talent.requirements")
          ),
        }),
        ...(talent.forbidden !== undefined && {
          forbidden: await convertDBRequirement(
            await safeLoad(talent.forbidden, "talent.forbidden")
          ),
        }),
      };

      if (talent instanceof MagicTalentPriorityDetails) {
        return {
          ...baseTalent,
          category: talentCategoryEnum.Magic as const,
          magic: talent.magic,
          ...(talent.formulae !== undefined && { formulae: talent.formulae }),
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
    })
  );

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
