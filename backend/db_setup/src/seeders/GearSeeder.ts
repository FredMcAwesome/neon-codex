import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
} from "../../../src/models/gear/weaponModel.js";
import {
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
  }
}
