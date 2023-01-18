import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import {
  Ammos,
  Grenades,
  ProjectilesAmmos,
  RocketsMissiles,
} from "../../../src/models/gear/ammunitionModel.js";
import {
  ArmourAccessories,
  ArmourModifications,
} from "../../../src/models/gear/armourAccessoryModel.js";
import { Armours } from "../../../src/models/gear/armourModel.js";
import {
  FirearmAccessories,
  WeaponAccessories,
} from "../../../src/models/gear/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "../../../src/models/gear/weaponModel.js";
import {
  ammosList,
  grenadesList,
  projectileAmmosList,
  rocketsMissilesList,
} from "../seeds/gear/AmmunitionsSeed.js";
import {
  armourAccessoriesList,
  armourModificationsList,
} from "../seeds/gear/ArmourAccessoriesSeed.js";
import { armoursList } from "../seeds/gear/ArmourSeed.js";
import {
  firearmAccessoriesList,
  weaponAccessoriesList,
} from "../seeds/gear/WeaponAccessoriesSeed.js";
import {
  explosivesList,
  firearmWeaponsList,
  meleeWeaponsList,
  projectileWeaponsList,
} from "../seeds/gear/WeaponsSeed.js";

export class GearSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    meleeWeaponsList.forEach((meleeWeapon) => {
      em.create(MeleeWeapons, meleeWeapon);
    });
    projectileWeaponsList.forEach((projectileWeapon) => {
      em.create(ProjectileWeapons, projectileWeapon);
    });
    firearmWeaponsList.forEach((firearmWeapon) => {
      em.create(FirearmWeapons, firearmWeapon);
    });
    explosivesList.forEach((explosive) => {
      em.create(Explosives, explosive);
    });
    ammosList.forEach((ammo) => {
      em.create(Ammos, ammo);
    });
    projectileAmmosList.forEach((projectileAmmo) => {
      em.create(ProjectilesAmmos, projectileAmmo);
    });
    grenadesList.forEach((grenade) => {
      em.create(Grenades, grenade);
    });
    rocketsMissilesList.forEach((rocketMissile) => {
      em.create(RocketsMissiles, rocketMissile);
    });
    firearmAccessoriesList.forEach((firearmAccessory) => {
      em.create(FirearmAccessories, firearmAccessory);
    });
    weaponAccessoriesList.forEach((weaponAccessory) => {
      em.create(WeaponAccessories, weaponAccessory);
    });
    armoursList.forEach((armour) => {
      em.create(Armours, armour);
    });
    armourAccessoriesList.forEach((armourAccessory) => {
      em.create(ArmourAccessories, armourAccessory);
    });
    armourModificationsList.forEach((armourModification) => {
      em.create(ArmourModifications, armourModification);
    });
  }
}
