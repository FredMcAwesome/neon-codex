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
import { augmentationTypeEnum } from "@shadowrun/common/build/enums.js";

export class GearSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const stagedSkills: Array<Skills> = getSkills();
    const stagedWeaponRanges: Array<WeaponRanges> = getRanges();
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

    // Weapon Accessories that are weapons
    for (const weaponAccessory of unlinkedWeaponAccessories) {
      if (weaponAccessory.isWeapon) {
        const relatedWeaponAccessory = await em.findOne(WeaponAccessories, {
          name: weaponAccessory.name,
        });
        assert(
          relatedWeaponAccessory !== null,
          `undefined weapon Accessory name: ${weaponAccessory.name}`
        );
        const linkedWeapon = await em.findOne(Weapons, {
          name: weaponAccessory.name,
        });
        assert(
          linkedWeapon !== null,
          `undefined weapon name: ${weaponAccessory.name}`
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
          `undefined weapon Accessory name: ${weaponAccessory.name}`
        );

        for (const gear of weaponAccessory.allowedGearList) {
          const allowedGear = await em.findOne(Gears, {
            name: gear,
          });
          assert(allowedGear !== null, `undefined allowed gear: ${gear}`);
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
          `undefined weapon Accessory name: ${weaponAccessory.name}`
        );
        const referencedWeaponAccessory = ref(relatedWeaponAccessory);
        for (const gear of weaponAccessory.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: gear.name,
          });
          assert(
            includedGear !== null,
            `undefined included gear: ${gear.name}`
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
        assert(relatedWeapon !== null, `undefined weapon name: ${weapon.name}`);

        for (const gear of weapon.allowedGearList) {
          const allowedGear = await em.findOne(Gears, {
            name: gear,
          });
          assert(allowedGear !== null, `undefined allowed gear: ${gear}`);
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
        assert(relatedWeapon !== null, `undefined weapon name: ${weapon.name}`);
        const referencedWeapon = ref(relatedWeapon);
        for (const accessory of weapon.accessories) {
          const includeWeaponAccessory = await em.findOne(WeaponAccessories, {
            name: accessory.name,
          });
          assert(
            includeWeaponAccessory !== null,
            `undefined weapon accessory: ${accessory.name}`
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
              assert(includedGear !== null, `undefined gear: ${gear.name}`);
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
        assert(relatedWeapon !== null, `undefined weapon name: ${weapon.name}`);
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
        assert(relatedWeapon !== null, `undefined weapon name: ${weapon.name}`);
        const rangeList = weapon.rangeList;
        assert(rangeList.length > 0, "rangeList.length = 0");
        for (const currentRange of rangeList) {
          // console.log(`Range: ${currentRange}`);
          const foundRange = await em.findOne(WeaponRanges, {
            name: currentRange,
          });
          assert(foundRange !== null, `undefined range: ${currentRange}`);
          assert(
            relatedWeapon instanceof RangedWeapons,
            `Assertion to type narrow`
          );
          relatedWeapon.ranges.add(foundRange);
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
        assert(relatedArmour !== null, `undefined armour name: ${armour.name}`);
        const linkedWeapon = await em.findOne(Weapons, {
          name: armour.name,
        });
        assert(
          linkedWeapon !== null,
          `undefined linked weapon: ${armour.name}`
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
        assert(relatedArmour !== null, `undefined armour name: ${armour.name}`);
        const referencedArmour = ref(relatedArmour);
        for (const gear of armour.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: gear.name,
          });
          assert(includedGear !== null, `undefined gear: ${gear.name}`);
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
        assert(relatedArmour !== null, `undefined armour name: ${armour.name}`);
        const referencedArmour = ref(relatedArmour);
        for (const mod of armour.includedMods) {
          const includedMod = await em.findOne(ArmourModifications, {
            name: mod.name,
          });
          assert(includedMod !== null, `undefined mod: ${mod.name}`);
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
          `undefined armour Mod name: ${armourMod.name}`
        );
        const referencedArmourMod = ref(relatedArmourMod);
        for (const gear of armourMod.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: gear.name,
          });
          assert(includedGear !== null, `undefined gear: ${gear.name}`);
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
          `undefined augmentation name: ${augmentation.name}`
        );
        const linkedWeapon = await em.findOne(Weapons, {
          name: augmentation.addWeapon,
        });
        assert(
          linkedWeapon !== null,
          `undefined linked weapon: ${augmentation.addWeapon}`
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
          `undefined augmentation name: ${augmentation.name}`
        );
        for (const pairInclude of augmentation.pairIncludeList) {
          const linkedAugmentation = await em.findOne(Augmentations, {
            name: pairInclude,
          });
          assert(
            linkedAugmentation !== null,
            `undefined linked augmentation: ${pairInclude}`
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
          `undefined augmentation name: ${augmentation.name}`
        );

        for (const gear of augmentation.allowedGearList) {
          // TODO: add 2050 stuff
          if (gear.includes("2050")) {
            continue;
          }
          const allowedGear = await em.findOne(Gears, {
            name: gear,
          });
          assert(allowedGear !== null, `undefined allowed gear: ${gear}`);
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
          `undefined augmentation name: ${augmentation.name}`
        );
        const referencedAugmentation = ref(relatedAugmentation);
        for (const gear of augmentation.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: gear.name,
          });
          assert(includedGear !== null, `undefined gear: ${gear.name}`);
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
            `undefined augmentation name: ${augmentation.name}`
          );
          const linkedAugmentation = await em.findOne(Cyberwares, {
            name: augmentation.wirelessPairInclude,
          });
          assert(
            linkedAugmentation !== null,
            `undefined linked augmentation: ${augmentation.wirelessPairInclude}`
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
            `undefined augmentation name: ${augmentation.name}`
          );
          const linkedVehicle = await em.findOne(Vehicles, {
            name: augmentation.addVehicle,
          });
          assert(
            linkedVehicle !== null,
            `undefined vehicle: ${augmentation.addVehicle}`
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
          `undefined vehicle name: ${vehicle.name}`
        );
        const referencedVehicle = ref(relatedVehicle);
        for (const gear of vehicle.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: gear.name,
          });
          assert(includedGear !== null, `undefined gear: ${gear.name}`);
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
          `undefined vehicle name: ${vehicle.name}`
        );
        const referencedVehicle = ref(relatedVehicle);
        for (const mod of vehicle.includedMods) {
          const includedMod = await em.findOne(VehicleChasisModifications, {
            name: mod.name,
          });
          assert(includedMod !== null, `undefined mod: ${mod.name}`);
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
              `undefined mod cyberware: ${mod.addCyberware}`
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
          `undefined vehicle name: ${vehicle.name}`
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
            `undefined weapon mount: ${JSON.stringify(weaponMount)}`
          );

          let referencedWeapon = undefined;
          if (weaponMount.includedWeapon !== undefined) {
            const relatedWeapon = await em.findOne(Weapons, {
              name: weaponMount.includedWeapon,
            });
            assert(
              relatedWeapon !== null,
              `undefined weapon name: ${weaponMount.includedWeapon}`
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
              `undefined weapon name: ${weaponMount.includedMountMod}`
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
        assert(relatedGear !== null, `undefined gear name: ${gear.name}`);
        const referencedLinkedGear = ref(relatedGear);
        for (const unlinkedIncludedGear of gear.includedGearList) {
          const includedGear = await em.findOne(Gears, {
            name: unlinkedIncludedGear.name,
          });
          assert(
            includedGear !== null,
            `undefined included gear: ${unlinkedIncludedGear.name}`
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
        assert(relatedGear !== null, `undefined gear name: ${gear.name}`);

        for (const unlinkedAllowedGear of gear.allowedGearList) {
          const allowedGear = await em.findOne(Gears, {
            name: unlinkedAllowedGear,
          });
          assert(
            allowedGear !== null,
            `undefined allowed gear: ${unlinkedAllowedGear}`
          );
          const referencedGear = ref(allowedGear);
          relatedGear.allowedGearList.add(referencedGear);
        }
      }
    }
    console.log("Gear relationships associated");
  }
}
