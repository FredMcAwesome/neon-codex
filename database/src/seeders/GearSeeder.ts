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
import {
  getVehicles,
  createVehicleWeaponMounts,
} from "../seeds/rpgSeeds/vehicleSeed.js";
import { Skills } from "../models/rpg/abilities/skillModel.js";
import { IncludedArmourModifications } from "../models/rpg/activeTables/activeArmourModificationModel.js";
import {
  WeaponAccessoryIncludedGears,
  ActiveWeaponAccessoryGears,
  ArmourIncludedGears,
  ArmourModificationIncludedGears,
  VehicleIncludedGears,
  GearIncludedGears,
  AugmentationIncludedGears,
} from "../models/rpg/activeTables/activeGearModel.js";
import { IncludedVehicleModifications } from "../models/rpg/activeTables/activeVehicleModificationModel.js";
import { IncludedWeaponAccessories } from "../models/rpg/activeTables/activeWeaponAccessoryModel.js";
import { IncludedWeaponMounts } from "../models/rpg/activeTables/activeWeaponMountModel.js";
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
  WeaponMountModifications,
} from "../models/rpg/equipment/rigger/vehicleModificationModel.js";
import { WeaponMounts } from "../models/rpg/equipment/rigger/weaponMountModel.js";
import {
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
import { IncludedQualities } from "../models/rpg/activeTables/activeQualityModel.js";

export class GearSeeder extends Seeder {
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
    const { unlinkedGears, stagedGears } = getGears();

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
      } else if (vehicleMod instanceof WeaponMountModifications) {
        em.create(WeaponMountModifications, vehicleMod);
      } else {
        assert(
          false,
          `Unhandled vehicle Modification type: ${vehicleMod.type}`
        );
      }
    }
    console.log("Vehicle Modifications created");

    for (const gear of stagedGears) {
      em.create(Gears, gear);
    }
    console.log("Gears created");

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
            `undefined metavariant name: ${metavariant}`
          );
          assert(
            loadedMetavariant.category === heritageCategoryEnum.Metavariant,
            `undefined metavariant category is wrong: ${loadedMetavariant.category}`
          );
          const stagedMetavariant = new Metavariants({
            heritage: loadedMetavariant,
            baseHeritage: ref(relatedHeritage as BaseHeritages),
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
          assert(linkedQuality !== null, `undefined Quality: ${quality.name}`);
          const referencedQuality = ref(linkedQuality);
          const customisedQuality = new IncludedQualities(
            referencedQuality,
            quality.rating
          );
          em.create(IncludedQualities, customisedQuality);
          relatedHeritage.includedQualityList.add(customisedQuality);
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
          assert(linkedQuality !== null, `undefined Quality: ${quality}`);
          const referencedQuality = ref(linkedQuality);
          relatedHeritage.forbiddenQualityList.add(referencedQuality);
        }
      }
    }

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
            name: gear.name,
          });
          assert(
            includedGear !== null,
            `undefined Included Gear: ${gear.name}`
          );
          const referencedGear = ref(includedGear);
          const stagedIncludedGear = new WeaponAccessoryIncludedGears(
            referencedGear,
            referencedWeaponAccessory,
            gear.specificOption,
            gear.rating,
            gear.consumeCapacity,
            gear.quantity
          );
          // this creates the link to weapon accessory
          em.create(WeaponAccessoryIncludedGears, stagedIncludedGear);
        }
      }
    }

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
      if (weapon.accessories !== undefined) {
        const relatedWeapon = await em.findOne(Weapons, {
          name: weapon.name,
        });
        assert(
          relatedWeapon !== null,
          `undefined Weapon name 4: ${weapon.name}`
        );
        const referencedWeapon = ref(relatedWeapon);
        for (const accessory of weapon.accessories) {
          const includeWeaponAccessory = await em.findOne(WeaponAccessories, {
            name: accessory.name,
          });
          assert(
            includeWeaponAccessory !== null,
            `undefined Weapon Accessory: ${accessory.name}`
          );
          const referencedWeaponAccessory = ref(includeWeaponAccessory);
          const stagedIncludedWeaponAccessory = new IncludedWeaponAccessories(
            referencedWeapon,
            referencedWeaponAccessory,
            accessory.rating,
            accessory.mount
          );
          // this creates the link to weapon accessory
          em.create(IncludedWeaponAccessories, stagedIncludedWeaponAccessory);
          const referencedIncludedWeaponAccessory = ref(
            stagedIncludedWeaponAccessory
          );
          if (accessory.gears !== undefined) {
            for (const gear of accessory.gears) {
              const includedGear = await em.findOne(Gears, {
                name: gear.name,
              });
              assert(includedGear !== null, `undefined Gear: ${gear.name}`);
              const referencedGear = ref(includedGear);
              const stagedIncludedGear = new ActiveWeaponAccessoryGears(
                referencedGear,
                referencedIncludedWeaponAccessory,
                gear.specificOption,
                gear.rating,
                gear.consumeCapacity,
                gear.quantity
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
            name: gear.name,
          });
          assert(includedGear !== null, `undefined Gear: ${gear.name}`);
          const referencedGear = ref(includedGear);
          const stagedIncludedGear = new ArmourIncludedGears(
            referencedGear,
            referencedArmour,
            gear.specificOption,
            gear.rating,
            gear.consumeCapacity,
            gear.quantity
          );
          // this creates the link to weapon accessory
          em.create(ArmourIncludedGears, stagedIncludedGear);
        }
      }
    }
    // Armours that include certain mods
    for (const armour of unlinkedArmours) {
      if (armour.includedMods !== undefined) {
        const relatedArmour = await em.findOne(Armours, {
          name: armour.name,
        });
        assert(relatedArmour !== null, `undefined Armour name: ${armour.name}`);
        const referencedArmour = ref(relatedArmour);
        for (const mod of armour.includedMods) {
          const includedMod = await em.findOne(ArmourModifications, {
            name: mod.name,
          });
          assert(includedMod !== null, `undefined Mod: ${mod.name}`);
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
            name: gear.name,
          });
          assert(includedGear !== null, `undefined Gear: ${gear.name}`);
          const referencedGear = ref(includedGear);
          const stagedIncludedGear = new ArmourModificationIncludedGears(
            referencedGear,
            referencedArmourMod,
            gear.specificOption,
            gear.rating,
            gear.consumeCapacity,
            gear.quantity
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
            name: gear.name,
          });
          assert(includedGear !== null, `undefined Gear: ${gear.name}`);
          const referencedGear = ref(includedGear);
          const stagedIncludedGear = new AugmentationIncludedGears(
            referencedGear,
            referencedAugmentation,
            gear.specificOption,
            gear.rating,
            gear.consumeCapacity,
            gear.quantity
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
            name: gear.name,
          });
          assert(includedGear !== null, `undefined Gear: ${gear.name}`);
          const referencedGear = ref(includedGear);
          const stagedIncludedGear = new VehicleIncludedGears(
            referencedGear,
            referencedVehicle,
            gear.specificOption,
            gear.rating,
            gear.consumeCapacity,
            gear.quantity
          );
          // this creates the link to vehicle
          em.create(VehicleIncludedGears, stagedIncludedGear);
        }
      }
    }
    // Vehicles that include certain mods
    for (const vehicle of unlinkedVehicles) {
      if (vehicle.includedMods !== undefined) {
        const relatedVehicle = await em.findOne(Vehicles, {
          name: vehicle.name,
        });
        assert(
          relatedVehicle !== null,
          `undefined Vehicle name: ${vehicle.name}`
        );
        const referencedVehicle = ref(relatedVehicle);
        for (const mod of vehicle.includedMods) {
          const includedMod = await em.findOne(VehicleChasisModifications, {
            name: mod.name,
          });
          assert(includedMod !== null, `undefined Mod: ${mod.name}`);
          const referencedMod = ref(includedMod);
          const stagedIncludedGear = new IncludedVehicleModifications(
            referencedVehicle,
            referencedMod,
            mod.specificOption,
            mod.rating
          );
          if (mod.addCyberware !== undefined) {
            const includedCyberware = await em.findOne(Cyberwares, {
              name: mod.addCyberware,
            });
            assert(
              includedCyberware !== null,
              `undefined Mod Cyberware: ${mod.addCyberware}`
            );
            stagedIncludedGear.actsAsCyberarm = true;
            stagedIncludedGear.associatedCyberwareList.add(includedCyberware);
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
        vehicle.weaponMountList !== undefined &&
        vehicle.weaponMountList.length > 0
      ) {
        const relatedVehicle = await em.findOne(Vehicles, {
          name: vehicle.name,
        });
        assert(
          relatedVehicle !== null,
          `undefined Vehicle name: ${vehicle.name}`
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
            `undefined Weapon Mount: ${JSON.stringify(weaponMount)}`
          );

          let referencedWeapon = undefined;
          if (weaponMount.includedWeapon !== undefined) {
            const relatedWeapon = await em.findOne(Weapons, {
              name: weaponMount.includedWeapon,
            });
            assert(
              relatedWeapon !== null,
              `undefined Weapon name 8: ${weaponMount.includedWeapon}`
            );
            referencedWeapon = ref(relatedWeapon);
          }
          const referencedVehicle = ref(relatedVehicle);
          const referencedWeaponMount = ref(relatedWeaponMount);

          const stagedIncludedWeaponMount = new IncludedWeaponMounts(
            referencedVehicle,
            referencedWeaponMount,
            referencedWeapon !== undefined,
            undefined,
            referencedWeapon
          );
          if (weaponMount.includedMountMod !== undefined) {
            const relatedVehicleMountMod = await em.findOne(
              WeaponMountModifications,
              {
                name: weaponMount.includedMountMod,
              }
            );
            assert(
              relatedVehicleMountMod !== null,
              `undefined Weapon name 9: ${weaponMount.includedMountMod}`
            );
            stagedIncludedWeaponMount.mountMods.add(relatedVehicleMountMod);
          }
          em.create(IncludedWeaponMounts, stagedIncludedWeaponMount);
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
        const referencedLinkedGear = ref(relatedGear);
        for (const unlinkedIncludedGear of gear.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: unlinkedIncludedGear.name,
          });
          assert(
            includedGear !== null,
            `undefined Included Gear: ${unlinkedIncludedGear.name}`
          );
          const referencedIncludedGear = ref(includedGear);
          const stagedIncludedGear = new GearIncludedGears(
            referencedIncludedGear,
            referencedLinkedGear,
            unlinkedIncludedGear.specificOption,
            unlinkedIncludedGear.rating,
            unlinkedIncludedGear.consumeCapacity,
            unlinkedIncludedGear.quantity
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
            `undefined Quality: ${talent.includedQuality}`
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
        const heritagePriority = new HeritagePriorityDetails({
          heritage: referencedHeritage,
          specialAttributePoints: heritage.specialAttributePoints,
          karmaCost: heritage.karmaCost,
        });
        // em.create(HeritagePriorityDetails, heritagePriority);
        // await em.flush();
        relatedPriority.heritageList.add(heritagePriority);
      }
    }
  }
}
