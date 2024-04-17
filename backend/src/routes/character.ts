import { z as zod } from "zod";
import * as logger from "../utils/logger.js";
import { router, privateProcedure } from "../trpc.js";
import { Skills } from "@neon-codex/database/build/models/rpg/abilities/skillModel.js";
import { init } from "../utils/db.js";
import {
  CustomSkillListSchema,
  type SkillListType,
} from "@neon-codex/common/build/schemas/abilities/skillSchemas.js";
import type {
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
} from "@neon-codex/common/build/enums.js";
import type {
  AugmentationListType,
  AugmentationType,
} from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type {
  GearListType,
  GearType,
} from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type {
  WeaponSummaryListType,
  WeaponSummaryType,
} from "@neon-codex/common/build/schemas/equipment/combat/weaponSchemas.js";
import {
  EquipmentListSchema,
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
} from "@neon-codex/common/build/schemas/equipment/combat/armourSchemas.js";
import {
  AttributesSchema,
  PriorityLevelsSchema,
  SpecialAttributesSchema,
} from "@neon-codex/common/build/schemas/characters/characterSchemas.js";
import { Armours } from "@neon-codex/database/build/models/rpg/equipment/combat/armourModel.js";
import { Characters } from "@neon-codex/database/build/models/rpg/characters/characterModel.js";
import {
  QualityListSchema,
  type QualityListType,
  type QualityType,
} from "@neon-codex/common/build/schemas/abilities/qualitySchemas.js";
import { Qualities } from "@neon-codex/database/build/models/rpg/traits/qualityModel.js";
import {
  BaseHeritages,
  Heritages,
  Metavariants,
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

async function getWeapons(): Promise<WeaponSummaryListType> {
  const db = await init();
  const weapons = await db.em.findAll(Weapons, {
    populate: ["*", "includedAccessories.weaponAccessory"],
  });
  const weaponsResponse = Promise.all(
    weapons.map(async (weapon) => {
      const skill = weapon.relatedSkill.$.name;
      const dbAccessories = weapon.includedAccessories;
      const accessories = dbAccessories.$.map((accessory) => {
        const originalAccessory = accessory.weaponAccessory.$.name;
        return { name: originalAccessory };
      });
      const gearList = weapon.allowedGearList.$;
      const gearNameList = gearList.map((gear) => gear.name);
      const alternativeWeaponNameForms = weapon.alternativeWeaponForms.$.map(
        (weapon) => weapon.name
      );

      const weaponTypeInformation = await getWeaponTypeInformation(weapon);
      const weaponFormatted: WeaponSummaryType = {
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
        ...(accessories.length > 0 && {
          accessories: accessories,
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
      throw new Error(`Weapon type unexpected: ${weapon.type}`);
    }
  }
  throw new Error(`Weapon type unexpected: ${weapon.type}`);
}

async function getArmours() {
  const db = await init();
  const armours = await db.em.findAll(Armours, {
    populate: ["*"],
  });
  const armoursResponse: ArmourListType = armours.map((armour) => {
    const isWeapon = armour.linkedWeapon !== undefined ? true : undefined;
    const includedGearNameList = armour.includedGearList.$.map((activeGear) => {
      const gear = activeGear.gear.$.name;
      return { name: gear };
    });
    const includedMods = armour.includedMods.$.map((activeMod) => {
      const mod = activeMod.armourModification.$.name;
      return { name: mod };
    });

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
      includedMods: includedMods,
      allowModsFromCategory: armour.allowModsFromCategory,
      addModFromCategory: armour.addModFromCategory,
      availability: armour.availability,
      cost: armour.cost,
      source: armour.source,
      page: armour.page,
    };
    return armourFormatted;
  });

  return armoursResponse;
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
      const includedGearNameList = augmentation.includedGearList.$.map(
        (activeGear) => {
          const gear = activeGear.gear.$.name;
          return { name: gear };
        }
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
        includedGearList: includedGearNameList,
        allowedGearCategories: augmentation.allowedGearCategories,
        userSelectable: augmentation.userSelectable,
        allowCategoryList: augmentation.allowCategoryList,
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
  throw new Error(`Augmentation type unexpected: ${augmentation.type}`);
}

async function getVehicles() {
  const db = await init();
  const vehicles = await db.em.findAll(Vehicles, { populate: ["*"] });
  const vehiclesResponse: VehicleListType = vehicles.map((vehicle) => {
    const includedGearList = vehicle.includedGearList.$;
    const includedGearNameList = includedGearList.map((activeGear) => {
      const gear = activeGear.gear.$.name;
      return { name: gear };
    });
    const includedModNames = vehicle.includedModList.$.map((mod) => {
      const loadedMod = mod.vehicleModification.$.name;
      return { name: loadedMod };
    });
    const includedWeaponMountNameList = vehicle.includedWeaponMountList.$.map(
      (includedMount) => {
        const loadedMount = includedMount.weaponMount.$;
        return {
          control: loadedMount.control,
          flexibility: loadedMount.flexibility,
          size: loadedMount.size,
          visibility: loadedMount.visibility,
        };
      }
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
      includedGearList: includedGearNameList,
      includedMods: includedModNames,
      modSlots: vehicle.modSlots,
      powerTrainModSlots: vehicle.powerTrainModSlots,
      protectionModSlots: vehicle.protectionModSlots,
      weaponModSlots: vehicle.weaponModSlots,
      bodyModSlots: vehicle.bodyModSlots,
      electromagneticModSlots: vehicle.electromagneticModSlots,
      cosmeticModSlots: vehicle.cosmeticModSlots,
      weaponMountList: includedWeaponMountNameList,
      userSelectable: vehicle.userSelectable,
      availability: vehicle.availability,
      cost: vehicle.cost,
      source: vehicle.source,
      page: vehicle.page,
    };
    return vehicleFormatted;
  });
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

  throw new Error(`Vehicle type unexpected: ${vehicle.type}`);
}

export async function getGears(): Promise<GearListType> {
  const db = await init();
  const gears = await db.em.findAll(Gears, {
    populate: ["*", "includedWeapon.weapon"],
  });
  const gearsResponse: GearListType = gears.map((gear) => {
    const gearList = gear.allowedGearList.$;
    const gearNameList = gearList.map((linkedGear) => linkedGear.name);
    const includedGearList = gear.includedGearList.$;
    const includedGearNameList = includedGearList.map((activeGear) => {
      return { name: activeGear.name };
    });
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
      quantity: gear.quantity,
      bonus: gear.bonus,
      weaponBonus: gear.weaponBonus,
      isFlechetteAmmo: gear.isFlechetteAmmo,
      flechetteWeaponBonus: gear.flechetteWeaponBonus,
      ammoForWeaponType: gear.ammoForWeaponType,
      explosiveWeight: gear.explosiveWeight,
      userSelectable: gear.userSelectable,
      allowedGearList: gearNameList,
      includedGearList: includedGearNameList,
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
  });
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
      bonus: quality.bonus,
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

const weapons = privateProcedure.query(async () => {
  try {
    const weaponsResponse: WeaponSummaryListType = await getWeapons();
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
      weaponsResponse,
      armoursResponse,
      gearsResponse,
      augmentationsResponse,
      vehiclesResponse,
    ] = await Promise.all([
      getWeapons(),
      getArmours(),
      getGears(),
      getAugmentations(),
      getVehicles(),
    ]);
    const equipmentResponse: EquipmentListType = {
      weapons: weaponsResponse,
      armours: armoursResponse,
      gears: gearsResponse,
      augmentations: augmentationsResponse,
      vehicles: vehiclesResponse,
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
    attributeInfo: AttributesSchema,
    specialAttributeInfo: SpecialAttributesSchema,
    positiveQualitiesSelected: QualityListSchema,
    negativeQualitiesSelected: QualityListSchema,
    skillSelections: CustomSkillListSchema,
    equipmentSelected: EquipmentListSchema,
    karmaPoints: zod.number(),
    nuyen: zod.number(),
  })
  .strict();

const createCharacter = privateProcedure
  .input(CharacterInformationSchema)
  .mutation(async (opts) => {
    const db = await init();
    const character = new Characters({
      name: "",
      metatype: "",
      priorities: "opts.input.priorityInfo",
      attributes: opts.input.attributeInfo,
      specialAttributes: opts.input.specialAttributeInfo,
      qualities: "",
      nuyen: opts.input.nuyen,
      karmaPoints: opts.input.karmaPoints,
    });
    await db.em.persistAndFlush(character);
    // logger.log(JSON.stringify(character, null, 2));
    return character.id;
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
      // logger.log(JSON.stringify(character, null, 2));
      return character;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  });

export const characterRouter = router({
  skills: skills,
  qualities: qualities,
  priorities: priorities,
  heritages: heritages,
  weapons: weapons,
  armours: armours,
  gear: gears,
  augmentations: augmentations,
  vehiclesAndDrones: vehiclesAndDrones,
  all: all,
  createCharacter: createCharacter,
  getCharacter: getCharacter,
});

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
        spells: talent.spells,
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
      throw Error("Talent type is unknown");
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
