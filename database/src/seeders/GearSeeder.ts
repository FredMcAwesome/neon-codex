import { EntityManager } from "@mikro-orm/core";
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
} from "../models/gear/combatGear/weaponModel.js";
import { IncludedWeaponAccessories } from "../models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { WeaponRanges } from "../models/gear/combatGear/helperTables/weaponRangeModel.js";
import { getRanges } from "../seeds/newSeeds/rangesSeed.js";
import { WeaponRangeLinks } from "../models/chummerdb/customTables/weaponRangeLinkModel.js";

export class GearSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const stagedSkills: Array<Skills> = getSkills();
    const stagedWeaponRanges: Array<WeaponRanges> = getRanges();
    const stagedWeaponAccessories: Array<WeaponAccessories> =
      getWeaponAccessories();
    const {
      stagedMeleeWeapons,
      stagedProjectileWeapons,
      stagedFirearmWeapons,
      stagedExplosiveWeapons,
      stagedAccessories,
      stagedRanges,
    } = getWeapons(stagedSkills, stagedWeaponRanges, stagedWeaponAccessories);

    stagedSkills.forEach((skill) => {
      em.create(Skills, skill);
    });

    stagedWeaponRanges.forEach((range) => {
      em.create(WeaponRanges, range);
    });

    stagedWeaponAccessories.forEach((weaponAccessory) => {
      em.create(WeaponAccessories, weaponAccessory);
    });
    //   // weapon related
    stagedMeleeWeapons.forEach((meleeWeapon) => {
      em.create(MeleeWeapons, meleeWeapon);
    });
    stagedProjectileWeapons.forEach((projectileWeapon) => {
      em.create(ProjectileWeapons, projectileWeapon);
    });
    stagedFirearmWeapons.forEach((firearmWeapon) => {
      em.create(FirearmWeapons, firearmWeapon);
    });
    stagedExplosiveWeapons.forEach((explosive) => {
      em.create(Explosives, explosive);
    });
    stagedAccessories.forEach((weaponAccessories) => {
      weaponAccessories.forEach((accessory) => {
        em.create(IncludedWeaponAccessories, accessory);
      });
    });
    stagedRanges.forEach((weaponRanges) => {
      weaponRanges.forEach((range) => {
        em.create(WeaponRangeLinks, range);
      });
    });
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
    //   armoursList.forEach((armour) => {
    //     em.create(Armours, armour);
    //   });
    //   armourAccessoriesList.forEach((armourAccessory) => {
    //     em.create(ArmourAccessories, armourAccessory);
    //   });
    //   armourModificationsList.forEach((armourModification) => {
    //     em.create(ArmourModifications, armourModification);
    //   });

    //   // electronics (matrix) stuff
    //   commlinksList.forEach((commlink) => {
    //     em.create(Commlinks, commlink);
    //   });
    //   cyberdecksList.forEach((cyberdeck) => {
    //     em.create(Cyberdecks, cyberdeck);
    //   });
    //   RFIDTagsList.forEach((RFIDTag) => {
    //     em.create(RFIDTags, RFIDTag);
    //   });
    //   communicationCountermeasuresList.forEach((countermeasure) => {
    //     em.create(CommunicationCountermeasures, countermeasure);
    //   });
    //   softwaresList.forEach((software) => {
    //     em.create(Softwares, software);
    //   });
    //   skillsoftList.forEach((skillsoft) => {
    //     em.create(Skillsofts, skillsoft);
    //   });
    //   // electronics (tools) stuff
    //   credSticksList.forEach((skillsoft) => {
    //     em.create(CredSticks, skillsoft);
    //   });
    //   identiticationsList.forEach((skillsoft) => {
    //     em.create(Identifications, skillsoft);
    //   });
    //   toolsList.forEach((skillsoft) => {
    //     em.create(Tools, skillsoft);
    //   });
    //   opticalDevicesList.forEach((skillsoft) => {
    //     em.create(OpticalDevices, skillsoft);
    //   });
    //   visionEnhancementsList.forEach((skillsoft) => {
    //     em.create(VisionEnhancements, skillsoft);
    //   });
    //   audioDevicesList.forEach((skillsoft) => {
    //     em.create(AudioDevices, skillsoft);
    //   });
    //   audioEnhancementsList.forEach((skillsoft) => {
    //     em.create(AudioEnhancements, skillsoft);
    //   });
    //   sensorsList.forEach((skillsoft) => {
    //     em.create(Sensors, skillsoft);
    //   });
    //   securityDevicesList.forEach((skillsoft) => {
    //     em.create(SecurityDevices, skillsoft);
    //   });
    //   breakingAndEnteringDevicesList.forEach((skillsoft) => {
    //     em.create(BreakingAndEnteringDevices, skillsoft);
    //   });
    //   // other (miscellaneous) stuff
    //   industrialChemicalsList.forEach((industrialChemical) => {
    //     em.create(IndustrialChemicals, industrialChemical);
    //   });
    //   survivalGearList.forEach((survivalItem) => {
    //     em.create(SurvivalGear, survivalItem);
    //   });
    //   grappleGunList.forEach((grappleItem) => {
    //     em.create(GrappleGun, grappleItem);
    //   });
    //   biotechList.forEach((biotechItem) => {
    //     em.create(Biotech, biotechItem);
    //   });
    //   docWagonContractList.forEach((docWagonContract) => {
    //     em.create(DocWagonContract, docWagonContract);
    //   });
    //   slapPatchesList.forEach((slapPatch) => {
    //     em.create(SlapPatches, slapPatch);
    //   });
    //   // augmentations
    //   headwaresList.forEach((headware) => {
    //     em.create(Headwares, headware);
    //   });
    //   eyewaresList.forEach((eyewear) => {
    //     em.create(Eyewares, eyewear);
    //   });
    //   earwaresList.forEach((earware) => {
    //     em.create(Earwares, earware);
    //   });
    //   bodywareList.forEach((bodyware) => {
    //     em.create(Bodywares, bodyware);
    //   });
    //   cyberlimbsList.forEach((cyberlimb) => {
    //     em.create(Cyberlimbs, cyberlimb);
    //   });
    //   biowaresList.forEach((bioware) => {
    //     em.create(Biowares, bioware);
    //   });
    //   // augmentation accessories
    //   cyberlimbAccessoriesList.forEach((cyberlimbAccessory) => {
    //     em.create(CyberlimbAccessories, cyberlimbAccessory);
    //   });
    //   implantWeaponsList.forEach((implantWeapon) => {
    //     em.create(ImplantWeapons, implantWeapon);
    //   });
    //   // magical equipment
    //   fociList.forEach((focus) => {
    //     em.create(Foci, focus);
    //   });
    //   formulaeList.forEach((formula) => {
    //     em.create(Formulae, formula);
    //   });
    //   magicalSuppliesList.forEach((magicalSupply) => {
    //     em.create(MagicalSupplies, magicalSupply);
    //   });
    //   //vehicles
    //   groundcraftsList.forEach((groundcraft) => {
    //     em.create(Groundcrafts, groundcraft);
    //   });
    //   watercraftsList.forEach((watercraft) => {
    //     em.create(Watercrafts, watercraft);
    //   });
    //   aircraftsList.forEach((aircraft) => {
    //     em.create(Aircrafts, aircraft);
    //   });
    //   dronesList.forEach((drone) => {
    //     em.create(Drones, drone);
    //   });
  }
}
