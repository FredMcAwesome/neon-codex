import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import {
  CyberlimbAccessories,
  ImplantWeapons,
} from "../../../src/models/gear/augmentationGear/augmentationAccessoryModel.js";
import {
  Biowares,
  Bodywares,
  Cyberlimbs,
  Earwares,
  Eyewares,
  Headwares,
} from "../../../src/models/gear/augmentationGear/augmentationModel.js";
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
  Foci,
  Formulae,
  MagicalSupplies,
} from "../../../src/models/gear/magicGear/magicalGearEquipment.js";
import {
  Biotech,
  DocWagonContract,
  GrappleGun,
  IndustrialChemicals,
  SlapPatches,
  SurvivalGear,
} from "../../../src/models/gear/otherGear/otherWareModel.js";
import {
  Aircrafts,
  Drones,
  Groundcrafts,
  Watercrafts,
} from "../../../src/models/gear/riggerGear/vehicleAndDroneModel.js";
import {
  cyberlimbAccessoriesList,
  implantWeaponsList,
} from "../seeds/gear/augmentationGear/AugmentationAccessoriesSeed.js";
import {
  biowaresList,
  bodywareList,
  cyberlimbsList,
  earwaresList,
  eyewaresList,
  headwaresList,
} from "../seeds/gear/augmentationGear/AugmentationsSeed.js";
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
import { armoursList } from "../seeds/gear/combatGear/ArmoursSeed.js";
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
} from "../seeds/gear/electronicsGear/MatrixWareAccessoriesSeed.js";
import {
  commlinksList,
  communicationCountermeasuresList,
  cyberdecksList,
  RFIDTagsList,
  skillsoftList,
  softwaresList,
} from "../seeds/gear/electronicsGear/MatrixWaresSeed.js";
import { fociList } from "../seeds/gear/magicGear/FociSeed.js";
import { formulaeList } from "../seeds/gear/magicGear/FormulaeSeed.js";
import { magicalSuppliesList } from "../seeds/gear/magicGear/MagicalSuppliesSeed.js";
import {
  biotechList,
  docWagonContractList,
  grappleGunList,
  industrialChemicalsList,
  slapPatchesList,
  survivalGearList,
} from "../seeds/gear/otherGear/OtherGearSeed.js";
import {
  aircraftsList,
  dronesList,
  groundcraftsList,
  watercraftsList,
} from "../seeds/gear/riggerGear/vehicleAndDroneSeed.js";

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
    // other (miscellaneous) stuff
    industrialChemicalsList.forEach((industrialChemical) => {
      em.create(IndustrialChemicals, industrialChemical);
    });
    survivalGearList.forEach((survivalItem) => {
      em.create(SurvivalGear, survivalItem);
    });
    grappleGunList.forEach((grappleItem) => {
      em.create(GrappleGun, grappleItem);
    });
    biotechList.forEach((biotechItem) => {
      em.create(Biotech, biotechItem);
    });
    docWagonContractList.forEach((docWagonContract) => {
      em.create(DocWagonContract, docWagonContract);
    });
    slapPatchesList.forEach((slapPatch) => {
      em.create(SlapPatches, slapPatch);
    });
    // augmentations
    headwaresList.forEach((headware) => {
      em.create(Headwares, headware);
    });
    eyewaresList.forEach((eyewear) => {
      em.create(Eyewares, eyewear);
    });
    earwaresList.forEach((earware) => {
      em.create(Earwares, earware);
    });
    bodywareList.forEach((bodyware) => {
      em.create(Bodywares, bodyware);
    });
    cyberlimbsList.forEach((cyberlimb) => {
      em.create(Cyberlimbs, cyberlimb);
    });
    biowaresList.forEach((bioware) => {
      em.create(Biowares, bioware);
    });
    // augmentation accessories
    cyberlimbAccessoriesList.forEach((cyberlimbAccessory) => {
      em.create(CyberlimbAccessories, cyberlimbAccessory);
    });
    implantWeaponsList.forEach((implantWeapon) => {
      em.create(ImplantWeapons, implantWeapon);
    });
    // magical equipment
    fociList.forEach((focus) => {
      em.create(Foci, focus);
    });
    formulaeList.forEach((formula) => {
      em.create(Formulae, formula);
    });
    magicalSuppliesList.forEach((magicalSupply) => {
      em.create(MagicalSupplies, magicalSupply);
    });
    //vehicles
    groundcraftsList.forEach((groundcraft) => {
      em.create(Groundcrafts, groundcraft);
    });
    watercraftsList.forEach((watercraft) => {
      em.create(Watercrafts, watercraft);
    });
    aircraftsList.forEach((aircraft) => {
      em.create(Aircrafts, aircraft);
    });
    dronesList.forEach((drone) => {
      em.create(Drones, drone);
    });
  }
}
