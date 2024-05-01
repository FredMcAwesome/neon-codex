import { z as zod } from "zod";
import * as logger from "../utils/logger.js";
import { router, privateProcedure } from "../trpc.js";
import { Skills } from "@neon-codex/database/build/models/rpg/abilities/skillModel.js";
import { init } from "../utils/db.js";
import { ref } from "@mikro-orm/postgresql";
import {
  CustomSkillListSchema,
  type CustomSkillType,
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
  CustomisedAugmentationType,
} from "@neon-codex/common/build/schemas/equipment/bodyModification/augmentationSchemas.js";
import type {
  CustomisedGearType,
  GearListType,
  GearType,
} from "@neon-codex/common/build/schemas/equipment/other/gearSchemas.js";
import type {
  CustomisedWeaponType,
  UnlinkedWeaponAccessoryType,
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
import { ActiveSkills } from "@neon-codex/database/build/models/rpg/activeTables/activeSkillModel.js";
import { CustomisedWeapons } from "@neon-codex/database/build/models/rpg/activeTables/customisedWeaponModel.js";
import { CustomisedArmours } from "@neon-codex/database/build/models/rpg/activeTables/customisedArmourModel.js";
import { WeaponAccessories } from "@neon-codex/database/build/models/rpg/equipment/combat/weaponAccessoryModel.js";
import {
  ActiveAugmentationGears,
  ActiveGears,
  CustomisedGears,
} from "@neon-codex/database/build/models/rpg/activeTables/activeGearModel.js";
import type { useGearType } from "@neon-codex/common/build/schemas/shared/commonSchemas.js";
import {
  CustomisedWeaponAccessories,
  type ActiveWeaponAccessories,
} from "@neon-codex/database/build/models/rpg/activeTables/activeWeaponAccessoryModel.js";
import { CustomisedArmourModifications } from "@neon-codex/database/build/models/rpg/activeTables/activeArmourModificationModel.js";
import { ArmourModifications } from "@neon-codex/database/build/models/rpg/equipment/combat/armourModificationModel.js";
import { CustomisedAugmentations } from "@neon-codex/database/build/models/rpg/activeTables/customisedAugmentationModel.js";
import { VehicleModifications } from "@neon-codex/database/build/models/rpg/equipment/rigger/vehicleModificationModel.js";
import { CustomisedVehicleModifications } from "@neon-codex/database/build/models/rpg/activeTables/activeVehicleModificationModel.js";
import { CustomisedVehicles } from "@neon-codex/database/build/models/rpg/activeTables/customisedVehicleModel.js";

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
    heritageInfo: HeritagePrioritySelectedSchema,
    attributeInfo: AttributesSchema,
    specialAttributeInfo: SpecialAttributesSchema,
    positiveQualitiesSelected: QualitySelectedListSchema,
    negativeQualitiesSelected: QualitySelectedListSchema,
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

    const skillList = [];
    for (const selectedSkill of opts.input.skillSelections) {
      const skill = await db.em.findOne(Skills, {
        name: selectedSkill.name,
      });
      if (skill === null) {
        throw new Error("Skill does not exist");
      }
      const activeSkill = new ActiveSkills(
        ref(skill),
        selectedSkill.skillGroupPoints,
        selectedSkill.skillPoints,
        selectedSkill.karmaPoints,
        selectedSkill.specialisationsSelected
      );

      skillList.push(activeSkill);
    }

    const qualityList = [];
    const rawQualityList = opts.input.positiveQualitiesSelected.concat(
      opts.input.negativeQualitiesSelected
    );
    for (const selectedQuality of rawQualityList) {
      const quality = await db.em.findOne(Qualities, {
        name: selectedQuality.name,
      });
      if (quality === null) {
        throw new Error("Quality does not exist");
      }
      const activeQuality = new CustomisedQualities(
        ref(quality),
        selectedQuality.rating
      );

      qualityList.push(activeQuality);
    }

    const weaponList = [];
    for (const unlinkedWeapon of opts.input.equipmentSelected.weapons) {
      const weapon = await db.em.findOne(Weapons, {
        name: unlinkedWeapon.name,
      });
      if (weapon === null) {
        throw new Error("Weapon does not exist");
      }
      const activeWeapon = new CustomisedWeapons(ref(weapon));
      if (unlinkedWeapon.accessories === undefined) {
        continue;
      }
      for (const unlinkedAccessory of unlinkedWeapon.accessories) {
        const accessory = await db.em.findOne(WeaponAccessories, {
          name: unlinkedAccessory.name,
        });
        if (accessory === null) {
          throw new Error("Weapon Accessory does not exist");
        }
        // TODO: confirm this cascades properly
        new CustomisedWeaponAccessories(
          ref(activeWeapon),
          ref(accessory),
          unlinkedAccessory.rating,
          unlinkedAccessory.mount
        );
      }

      weaponList.push(activeWeapon);
    }

    const armourList = [];
    for (const unlinkedArmour of opts.input.equipmentSelected.armours) {
      const armour = await db.em.findOne(Armours, {
        name: unlinkedArmour.name,
      });
      if (armour === null) {
        throw new Error("Armour does not exist");
      }
      const activeArmour = new CustomisedArmours(ref(armour));
      if (unlinkedArmour.includedMods === undefined) {
        continue;
      }
      for (const unlinkedMod of unlinkedArmour.includedMods) {
        const mod = await db.em.findOne(ArmourModifications, {
          name: unlinkedMod.name,
        });
        if (mod === null) {
          throw new Error("Armour Mod does not exist");
        }
        // TODO: confirm this cascades properly
        new CustomisedArmourModifications(
          ref(activeArmour),
          ref(mod),
          unlinkedMod.rating
        );
      }

      armourList.push(activeArmour);
    }

    const gearList = [];
    for (const unlinkedGear of opts.input.equipmentSelected.gears) {
      const gear = await db.em.findOne(Gears, {
        name: unlinkedGear.name,
      });
      if (gear === null) {
        throw new Error("Gear does not exist");
      }
      const activeGear = new CustomisedGears(ref(gear));

      if (unlinkedGear.includedGearList === undefined) {
        continue;
      }
      for (const unlinkedChildGear of unlinkedGear.includedGearList) {
        const childGear = await db.em.findOne(Gears, {
          name: unlinkedChildGear.name,
        });
        if (childGear === null) {
          throw new Error("Gear does not exist");
        }
        // TODO: confirm this cascades properly
        new CustomisedGears(ref(childGear), ref(activeGear));
      }

      gearList.push(activeGear);
    }

    const augmentationList = [];
    for (const unlinkedAugmentation of opts.input.equipmentSelected
      .augmentations) {
      const augmentation = await db.em.findOne(Augmentations, {
        name: unlinkedAugmentation.name,
      });
      if (augmentation === null) {
        throw new Error("Augmentation does not exist");
      }
      const activeAugmentation = new CustomisedAugmentations(ref(augmentation));

      if (unlinkedAugmentation.includedGearList === undefined) {
        continue;
      }
      for (const unlinkedGear of unlinkedAugmentation.includedGearList) {
        const gear = await db.em.findOne(Gears, {
          name: unlinkedGear.name,
        });
        if (gear === null) {
          throw new Error("Gear does not exist");
        }
        // TODO: confirm this cascades properly
        new ActiveAugmentationGears(ref(gear), ref(activeAugmentation));
      }

      augmentationList.push(activeAugmentation);
    }

    const vehicleList = [];
    for (const unlinkedVehicle of opts.input.equipmentSelected.vehicles) {
      const vehicle = await db.em.findOne(Vehicles, {
        name: unlinkedVehicle.name,
      });
      if (vehicle === null) {
        throw new Error("Vehicle does not exist");
      }
      const activeVehicle = new CustomisedVehicles(ref(vehicle));
      if (unlinkedVehicle.includedMods === undefined) {
        continue;
      }
      for (const unlinkedMods of unlinkedVehicle.includedMods) {
        const mod = await db.em.findOne(VehicleModifications, {
          name: unlinkedMods.name,
        });
        if (mod === null) {
          throw new Error("Vehicle Mod does not exist");
        }
        // TODO: confirm this cascades properly
        new CustomisedVehicleModifications(ref(activeVehicle), ref(mod));
      }

      vehicleList.push(activeVehicle);
    }

    const character = new Characters({
      name: "",
      heritage: ref(Heritages, heritage),
      priorities: opts.input.priorityInfo,
      attributes: opts.input.attributeInfo,
      specialAttributes: opts.input.specialAttributeInfo,
      nuyen: opts.input.nuyen,
      karmaPoints: opts.input.karmaPoints,
    });
    for (const selectedSkill of skillList) {
      character.skills.add(selectedSkill);
    }
    for (const selectedQuality of qualityList) {
      character.qualities.add(selectedQuality);
    }
    for (const selectedWeapon of weaponList) {
      character.weapons.add(selectedWeapon);
    }
    for (const selectedArmour of armourList) {
      character.armours.add(selectedArmour);
    }
    for (const selectedGear of gearList) {
      character.gears.add(selectedGear);
    }
    for (const selectedAugmentation of augmentationList) {
      character.augmentations.add(selectedAugmentation);
    }
    for (const selectedVehicle of vehicleList) {
      character.vehicles.add(selectedVehicle);
    }
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

      const skills = await Promise.all(
        character.skills.map(async (skill) => {
          return await convertActiveSkillDBToDTO(skill);
        })
      );
      const qualities = await Promise.all(
        character.qualities.map(async (quality) => {
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
        skills: skills,
        qualities: qualities,
        nuyen: character.nuyen,
        karmaPoints: character.karmaPoints,
        weapons: await Promise.all(
          character.weapons.map(async (weapon) => {
            return await convertCustomWeaponDBToDTO(weapon);
          })
        ),
        armours: await Promise.all(
          character.armours.map(async (armour) => {
            return await convertCustomArmourDBToDTO(armour);
          })
        ),
        gears: await Promise.all(
          character.gears.map(async (gear) => {
            return await convertCustomGearDBToDTO(gear);
          })
        ),
        augmentations: await Promise.all(
          character.augmentations.map(async (augmentation) => {
            return await convertCustomAugmentationDBToDTO(augmentation);
          })
        ),
        vehicles: await Promise.all(
          character.vehicles.map(async (vehicle) => {
            return await convertCustomVehicleDBToDTO(vehicle);
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
    throw new Error("Unknown heritage type");
  }

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
  activeSkillDB: ActiveSkills
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

    skillGroupPoints: activeSkillDB.skillGroupPoints,
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
    bonus: qualityDB.bonus,
    requirements: qualityDB.requirements,
    forbidden: qualityDB.forbidden,
    source: qualityDB.source,
    page: qualityDB.page,

    rating: activeQualityDB.rating,
  };
};
const convertCustomWeaponDBToDTO = async function (
  customWeaponDB: CustomisedWeapons
): Promise<CustomisedWeaponType> {
  const db = await init();
  const weaponDB = await db.em.findOne(Weapons, customWeaponDB.weapon.id, {
    populate: ["*"],
  });
  if (weaponDB === null) {
    throw new Error("Weapon does not exist");
  }
  const convertedWeapon = await convertWeaponDBToDTO(weaponDB);
  const convertedAccessories = await Promise.all(
    customWeaponDB.accessories.map((accessory) => {
      return convertIncludedWeaponAccessoryDBToDTO(accessory);
    })
  );

  return {
    baseWeapon: convertedWeapon,
    accessories: convertedAccessories,
    rating: customWeaponDB.rating,
    customName: customWeaponDB.customName,
  };
};

const convertWeaponDBToDTO = async function (
  weaponDB: Weapons
): Promise<WeaponSummaryType> {
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
    accessories: await Promise.all(
      weaponDB.includedAccessories.map((accessory) => {
        return convertIncludedWeaponAccessoryDBToDTO(accessory);
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
    throw new Error("Unknown Weapon type");
  }
};

const convertIncludedWeaponAccessoryDBToDTO = async function (
  includedAccessoryDB: ActiveWeaponAccessories
): Promise<UnlinkedWeaponAccessoryType> {
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
    name: weaponAccessoryDB.name,
    mount: includedAccessoryDB.weaponMountsUsed,
    rating: includedAccessoryDB.rating,
    gears: await Promise.all(
      includedAccessoryDB.includedGearList.map(async (gear) => {
        return await convertActiveGearDBToDTO(gear);
      })
    ),
  };
};

const convertCustomArmourDBToDTO = async function (
  activeArmourDB: CustomisedArmours
): Promise<CustomisedArmourType> {
  const db = await init();
  const armourDB = await db.em.findOne(Armours, activeArmourDB.armour.id, {
    populate: ["*"],
  });
  if (armourDB === null) {
    throw new Error("Armour does not exist");
  }
  const baseArmour = await convertArmourDBToDTO(armourDB);
  return {
    baseArmour: baseArmour,
    // TODO add these...
    // modList: modList,
    // gearList: gearList,
    // rating?
    customName: activeArmourDB.customName,
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
  activeGearDB: ActiveGears
): Promise<useGearType> {
  const db = await init();
  const gearDB = await db.em.findOne(Gears, activeGearDB.gear.id, {
    populate: ["*"],
  });
  if (gearDB === null) {
    throw new Error("Gear does not exist");
  }

  return {
    name: gearDB.name,
    category: gearDB.category,
    specificOption: activeGearDB.specificOption,
    rating: activeGearDB.rating,
    ...(activeGearDB.consumeCapacity !== undefined && {
      consumeCapacity: true,
    }),
    quantity: activeGearDB.quantity,
  };
};

const convertCustomGearDBToDTO = async function (
  customisedGearDB: CustomisedGears
): Promise<CustomisedGearType> {
  const db = await init();
  const gearDB = await db.em.findOne(Gears, customisedGearDB.gear.id, {
    populate: ["*"],
  });
  if (gearDB === null) {
    throw new Error("Gear does not exist");
  }

  return {
    baseGear: await convertGearDBToDTO(gearDB),
    gearList: await Promise.all(
      customisedGearDB.childrenGear.map(async (childGear) => {
        const loadedChildGear = await childGear.gear.load();
        if (loadedChildGear === null) {
          throw new Error("Gear does not exist");
        }
        return convertGearDBToDTO(loadedChildGear);
      })
    ),
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
    quantity: gearDB.quantity,
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
    includedGearList: gearDB.includedGearList.map((gear) => {
      return {
        name: gear.name,
      };
    }),
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
    baseAugmentation: await convertAugmentationDBToDTO(augmentationDB),
    gearList: await Promise.all(
      customisedAugmentationDB.includedGearList.map(async (childGear) => {
        const loadedChildGear = await childGear.gear.load();
        if (loadedChildGear === null) {
          throw new Error("Gear does not exist");
        }
        return convertGearDBToDTO(loadedChildGear);
      })
    ),
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
        return {
          name: loadedGear.name,
          // TODO: add the rest...
        };
      })
    ),
    allowedGearCategories: augmentationDB.allowedGearCategories,
    userSelectable: augmentationDB.userSelectable,
    allowCategoryList: augmentationDB.allowCategoryList,
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
    throw new Error("Augmentation type unknown");
  }
};

const convertCustomVehicleDBToDTO = async function (
  activeVehicleDB: CustomisedVehicles
): Promise<CustomisedVehicleType> {
  const db = await init();
  const vehicleDB = await db.em.findOne(Vehicles, activeVehicleDB.vehicle.id, {
    populate: ["*"],
  });
  if (vehicleDB === null) {
    throw new Error("Vehicle does not exist");
  }
  const baseVehicle = await convertVehicleDBToDTO(vehicleDB);
  return {
    baseVehicle: baseVehicle,
    // TODO add these...
    // modList: modList,
    // gearList: gearList,
    // rating?
    customName: activeVehicleDB.customName,
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
        return {
          name: loadedGear.name,
          // TODO: add the rest...
        };
      })
    ),
    includedMods: await Promise.all(
      vehicleDB.includedModList.map(async (mod) => {
        const loadedMod = await mod.vehicleModification.load();
        if (loadedMod === null) {
          throw new Error("Vehicle Mod does not exist");
        }
        return {
          name: loadedMod.name,
          // TODO: add the rest...
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
    throw new Error("Vehicle type unknown");
  }
};

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
