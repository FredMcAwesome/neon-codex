import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import {
  Ammos,
  Grenades,
  ProjectilesAmmos,
  RocketsMissiles,
} from "../../../src/models/gear/combatGear/ammunitionModel.js";
import {
  ArmourAccessories,
  ArmourModifications,
} from "../../../src/models/gear/combatGear/armourAccessoryModel.js";
import { Armours } from "../../../src/models/gear/combatGear/armourModel.js";
import {
  FirearmAccessories,
  WeaponAccessories,
} from "../../../src/models/gear/combatGear/weaponAccessoryModel.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "../../../src/models/gear/combatGear/weaponModel.js";
import {
  AudioDevices,
  AudioEnhancements,
  BreakingAndEnteringDevices,
  CredSticks,
  Identifications,
  OpticalDevices,
  SecurityDevices,
  Sensors,
  Tools,
  VisionEnhancements,
} from "../../../src/models/gear/electronicsGear/matrixWareAccessoryModel.js";
import {
  Commlinks,
  CommunicationCountermeasures,
  Cyberdecks,
  RFIDTags,
  Skillsofts,
  Softwares,
} from "../../../src/models/gear/electronicsGear/matrixWareModel.js";
import {
  ammosList,
  grenadesList,
  projectileAmmosList,
  rocketsMissilesList,
} from "../seeds/gear/combatGear/AmmunitionsSeed.js";
import {
  armourAccessoriesList,
  armourModificationsList,
} from "../seeds/gear/combatGear/ArmourAccessoriesSeed.js";
import { armoursList } from "../seeds/gear/combatGear/ArmourSeed.js";
import {
  firearmAccessoriesList,
  weaponAccessoriesList,
} from "../seeds/gear/combatGear/WeaponAccessoriesSeed.js";
import {
  explosivesList,
  firearmWeaponsList,
  meleeWeaponsList,
  projectileWeaponsList,
} from "../seeds/gear/combatGear/WeaponsSeed.js";
import {
  audioDevicesList,
  credSticksList,
  identiticationsList,
  opticalDevicesList,
  toolsList,
  visionEnhancementsList,
  audioEnhancementsList,
  sensorsList,
  securityDevicesList,
  breakingAndEnteringDevicesList,
} from "../seeds/gear/electronicsGear/matrixWareAccessoriesSeed.js";
import {
  commlinksList,
  communicationCountermeasuresList,
  cyberdecksList,
  RFIDTagsList,
  skillsoftList,
  softwaresList,
} from "../seeds/gear/electronicsGear/matrixWaresSeed.js";

export class GearSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // weapon related
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
    firearmAccessoriesList.forEach((firearmAccessory) => {
      em.create(FirearmAccessories, firearmAccessory);
    });
    weaponAccessoriesList.forEach((weaponAccessory) => {
      em.create(WeaponAccessories, weaponAccessory);
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
    armoursList.forEach((armour) => {
      em.create(Armours, armour);
    });
    armourAccessoriesList.forEach((armourAccessory) => {
      em.create(ArmourAccessories, armourAccessory);
    });
    armourModificationsList.forEach((armourModification) => {
      em.create(ArmourModifications, armourModification);
    });

    // electronics (matrix) stuff
    commlinksList.forEach((commlink) => {
      em.create(Commlinks, commlink);
    });
    cyberdecksList.forEach((cyberdeck) => {
      em.create(Cyberdecks, cyberdeck);
    });
    RFIDTagsList.forEach((RFIDTag) => {
      em.create(RFIDTags, RFIDTag);
    });
    communicationCountermeasuresList.forEach((countermeasure) => {
      em.create(CommunicationCountermeasures, countermeasure);
    });
    softwaresList.forEach((software) => {
      em.create(Softwares, software);
    });
    skillsoftList.forEach((skillsoft) => {
      em.create(Skillsofts, skillsoft);
    });
    // electronics (tools) stuff
    credSticksList.forEach((skillsoft) => {
      em.create(CredSticks, skillsoft);
    });
    identiticationsList.forEach((skillsoft) => {
      em.create(Identifications, skillsoft);
    });
    toolsList.forEach((skillsoft) => {
      em.create(Tools, skillsoft);
    });
    opticalDevicesList.forEach((skillsoft) => {
      em.create(OpticalDevices, skillsoft);
    });
    visionEnhancementsList.forEach((skillsoft) => {
      em.create(VisionEnhancements, skillsoft);
    });
    audioDevicesList.forEach((skillsoft) => {
      em.create(AudioDevices, skillsoft);
    });
    audioEnhancementsList.forEach((skillsoft) => {
      em.create(AudioEnhancements, skillsoft);
    });
    sensorsList.forEach((skillsoft) => {
      em.create(Sensors, skillsoft);
    });
    securityDevicesList.forEach((skillsoft) => {
      em.create(SecurityDevices, skillsoft);
    });
    breakingAndEnteringDevicesList.forEach((skillsoft) => {
      em.create(BreakingAndEnteringDevices, skillsoft);
    });
  }
}
