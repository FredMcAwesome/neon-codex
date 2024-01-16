import assert from "assert";
import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { getSkills } from "../seeds/newSeeds/skillsSeed.js";
import { getWeapons } from "../seeds/newSeeds/weaponsSeed.js";
import { getWeaponAccessories } from "../seeds/newSeeds/weaponAccessoriesSeed.js";
import { Skills } from "../models/chummerdb/skillModel.js";
import { WeaponAccessories } from "../models/gear/combatGear/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  FirearmWeapons,
  ProjectileWeapons,
  Explosives,
  Weapons,
} from "../models/gear/combatGear/weaponModel.js";
import { IncludedWeaponAccessories } from "../models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { WeaponRanges } from "../models/gear/combatGear/helperTables/weaponRangeModel.js";
import { getRanges } from "../seeds/newSeeds/rangesSeed.js";
import { WeaponRangeLinks } from "../models/chummerdb/customTables/weaponRangeLinkModel.js";
import { Armours } from "../models/gear/combatGear/armourModel.js";
import { getArmours } from "../seeds/newSeeds/armoursSeed.js";
import { ArmourModifications } from "../models/gear/combatGear/armourModificationModel.js";
import { getArmourModifications } from "../seeds/newSeeds/armourModificationsSeed.js";
import {
  Biowares,
  Cyberwares,
} from "../models/gear/augmentationGear/augmentationModel.js";
import { getAugmentations } from "../seeds/newSeeds/augmentationsSeed.js";
import { getDrugComponents, getDrugs } from "../seeds/newSeeds/drugSeed.js";
import { Drugs } from "../models/gear/otherGear/drugModel.js";
import { DrugComponents } from "../models/gear/otherGear/drugComponentModel.js";
import { getVehicles } from "../seeds/newSeeds/vehicleSeed.js";
import {
  Aircrafts,
  Drones,
  Groundcrafts,
  Watercrafts,
} from "../models/gear/riggerGear/vehicleModel.js";
import { getVehicleModifications } from "../seeds/newSeeds/vehicleModificationSeed.js";
import {
  VehicleChasisMods,
  WeaponMountMods,
} from "../models/gear/riggerGear/vehicleModificationModel.js";
import { Gears } from "../models/gear/otherGear/gearModel.js";
import { getGears } from "../seeds/newSeeds/gearSeed.js";

export class GearSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const stagedSkills: Array<Skills> = getSkills();
    const stagedWeaponRanges: Array<WeaponRanges> = getRanges();
    const stagedWeaponAccessories: Array<WeaponAccessories> =
      getWeaponAccessories();
    const { weaponsUnlinked, stagedWeapons, stagedAccessories, stagedRanges } =
      getWeapons(stagedSkills, stagedWeaponRanges, stagedWeaponAccessories);
    const stagedArmours: Array<Armours> = getArmours();
    const stagedArmourModifications: Array<ArmourModifications> =
      getArmourModifications();
    const { stagedBiowares, stagedCyberwares } = getAugmentations();
    const stagedDrugs = getDrugs();
    const stagedDrugComponents = getDrugComponents();
    const stagedVehicles = getVehicles();
    const stagedVehicleModifications = getVehicleModifications();
    const stagedGears = getGears();

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
        await em.persistAndFlush(em.create(MeleeWeapons, weapon));
      } else if (weapon instanceof ProjectileWeapons) {
        await em.persistAndFlush(em.create(ProjectileWeapons, weapon));
      } else if (weapon instanceof FirearmWeapons) {
        await em.persistAndFlush(em.create(FirearmWeapons, weapon));
      } else if (weapon instanceof Explosives) {
        await em.persistAndFlush(em.create(Explosives, weapon));
      } else {
        assert(false, `Unhandled weapon type: ${weapon.type}`);
      }
    }
    console.log("Weapons created");

    stagedAccessories.forEach((weaponAccessories) => {
      weaponAccessories.forEach((accessory) => {
        em.create(IncludedWeaponAccessories, accessory);
      });
    });
    console.log("Included Weapon Accessories created");

    stagedRanges.forEach((weaponRanges) => {
      weaponRanges.forEach((range) => {
        em.create(WeaponRangeLinks, range);
      });
    });
    console.log("Ranges created");
    //   ammosList.forEach((ammo) => {
    //     em.create(Ammos, ammo);
    //   });
    //   projectileAmmosList.forEach((projectileAmmo) => {
    //     em.create(ProjectilesAmmos, projectileAmmo);
    //   });
    //   grenadesList.forEach((grenade) => {
    //     em.create(Grenades, grenade);
    //   });
    //   rocketsMissilesList.forEach((rocketMissile) => {
    //     em.create(RocketsMissiles, rocketMissile);
    //   });
    stagedArmours.forEach((armour) => {
      em.create(Armours, armour);
    });
    console.log("Armours created");
    stagedArmourModifications.forEach((armourMod) => {
      em.create(ArmourModifications, armourMod);
    });
    console.log("Armour Modifications created");
    stagedDrugs.forEach((drug) => {
      em.create(Drugs, drug);
    });
    console.log("Drugs created");
    stagedDrugComponents.forEach((drugComponent) => {
      em.create(DrugComponents, drugComponent);
    });
    console.log("Drug Components created");
    // augmentations
    for (const cyberware of stagedCyberwares) {
      await em.persistAndFlush(em.create(Cyberwares, cyberware));
    }
    console.log("Cyberware created");
    for (const bioware of stagedBiowares) {
      await em.persistAndFlush(em.create(Biowares, bioware));
    }
    console.log("Bioware created");
    //vehicles
    for (const vehicle of stagedVehicles) {
      if (vehicle instanceof Groundcrafts) {
        await em.persistAndFlush(em.create(Groundcrafts, vehicle));
      } else if (vehicle instanceof Watercrafts) {
        await em.persistAndFlush(em.create(Watercrafts, vehicle));
      } else if (vehicle instanceof Aircrafts) {
        await em.persistAndFlush(em.create(Aircrafts, vehicle));
      } else if (vehicle instanceof Drones) {
        await em.persistAndFlush(em.create(Drones, vehicle));
      } else {
        assert(false, `Unhandled vehicle type: ${vehicle.type}`);
      }
    }
    console.log("Vehicles created");
    for (const vehicleMod of stagedVehicleModifications) {
      if (vehicleMod instanceof VehicleChasisMods) {
        await em.persistAndFlush(em.create(VehicleChasisMods, vehicleMod));
      } else if (vehicleMod instanceof WeaponMountMods) {
        await em.persistAndFlush(em.create(WeaponMountMods, vehicleMod));
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

    // Connect references that "may" need things in the database first
    // Weapons referring to other weapons
    for (const weapon of weaponsUnlinked) {
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
        // Probably don't need to flush everytime to update the db
        // but this is offline so whatever
        await em.flush();
      }
    }
  }
}
