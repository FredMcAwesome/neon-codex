import * as logger from "../utils/logger.js";
import { router, privateProcedure } from "../trpc.js";
import { Skills } from "@shadowrun/database/build/models/rpg/abilities/skillModel.js";
import { init } from "../utils/db.js";
import type { SkillListType } from "@shadowrun/common/build/schemas/skillSchemas.js";
import type {
  VehicleListType,
  VehicleType,
} from "@shadowrun/common/build/schemas/vehicleSchemas.js";
import {
  weaponTypeEnum,
  augmentationTypeEnum,
  vehicleTypeEnum,
} from "@shadowrun/common/build/enums.js";
import type {
  AugmentationListType,
  AugmentationType,
} from "@shadowrun/common/build/schemas/augmentationSchemas.js";
import type {
  GearListType,
  GearType,
} from "@shadowrun/common/build/schemas/gearSchemas.js";
import type {
  WeaponSummaryListType,
  WeaponSummaryType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import type { EquipmentListType } from "@shadowrun/common/build/schemas/equipmentSchemas.js";
import {
  Augmentations,
  Cyberwares,
  Biowares,
} from "@shadowrun/database/build/models/rpg/equipment/bodyModification/augmentationModel.js";
import {
  Weapons,
  MeleeWeapons,
  RangedWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "@shadowrun/database/build/models/rpg/equipment/combat/weaponModel.js";
import {
  Vehicles,
  MannedVehicles,
  Groundcrafts,
  Watercrafts,
  Aircrafts,
  Drones,
} from "@shadowrun/database/build/models/rpg/equipment/rigger/vehicleModel.js";
import { Gears } from "@shadowrun/database/build/models/rpg/equipment/other/gearModel.js";

export async function getSkills() {
  const db = await init();
  const skills = await db.em.findAll(Skills);
  const skillsResponse: SkillListType = skills.map((skill) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...noIdSkill } = skill;
    return noIdSkill;
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

async function getAugmentations() {
  const db = await init();
  const augmentations = await db.em.findAll(Augmentations, {
    populate: ["*", "includedGearList.gear"],
  });
  const augmentationsResponse: AugmentationListType = await Promise.all(
    augmentations.map(async (augmentation) => {
      let weaponName;
      if (augmentation.addWeapon !== undefined) {
        const addWeapon = await augmentation.addWeapon.load();
        if (addWeapon == null) {
          throw new Error(
            `Augmentation weapon not linked: ${augmentation.addWeapon.id}`
          );
        }
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

export async function getGears() {
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

export const characterRouter = router({
  skills: privateProcedure.query(async () => {
    try {
      const skillsResponse = await getSkills();
      return skillsResponse;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  }),
  weapons: privateProcedure.query(async () => {
    try {
      const weaponsResponse: WeaponSummaryListType = await getWeapons();
      logger.log(JSON.stringify(weaponsResponse, null, 2));
      return weaponsResponse;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  }),
  gear: privateProcedure.query(async () => {
    try {
      const gearResponse = await getGears();
      logger.log(JSON.stringify(gearResponse, null, 2));
      return gearResponse;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  }),
  augmentations: privateProcedure.query(async () => {
    try {
      const augmentationsResponse: AugmentationListType =
        await getAugmentations();
      logger.log(JSON.stringify(augmentationsResponse, null, 2));
      return augmentationsResponse;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  }),
  vehiclesAndDrones: privateProcedure.query(async () => {
    try {
      const vehiclesAndDronesResponse: VehicleListType = await getVehicles();
      logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
      return vehiclesAndDronesResponse;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  }),
  all: privateProcedure.query(async () => {
    try {
      const start = Date.now();

      const weaponsResponse: WeaponSummaryListType = await getWeapons();
      let end = Date.now();
      console.log(`Execution time 1: ${end - start} ms`);
      let start1 = Date.now();
      const gearsResponse: GearListType = await getGears();
      end = Date.now();
      console.log(`Execution time 2: ${end - start1} ms`);
      start1 = Date.now();
      const augmentationsResponse: AugmentationListType =
        await getAugmentations();
      end = Date.now();
      console.log(`Execution time 3: ${end - start1} ms`);
      start1 = Date.now();
      const vehiclesResponse: VehicleListType = await getVehicles();
      end = Date.now();
      console.log(`Execution time 4: ${end - start1} ms`);
      const equipmentResponse: EquipmentListType = {
        weapons: weaponsResponse,
        gears: gearsResponse,
        augmentations: augmentationsResponse,
        vehicles: vehiclesResponse,
      };
      end = Date.now();
      console.log(`Execution time: ${end - start} ms`);
      // logger.log(JSON.stringify(equipmentResponse, null, 2));
      return equipmentResponse;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  }),
});
