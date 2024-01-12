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

export class GearSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const stagedSkills: Array<Skills> = getSkills();
    const stagedWeaponRanges: Array<WeaponRanges> = getRanges();
    const stagedWeaponAccessories: Array<WeaponAccessories> =
      getWeaponAccessories();
    const {
      weaponsUnlinked,
      stagedMeleeWeapons,
      stagedProjectileWeapons,
      stagedFirearmWeapons,
      stagedExplosiveWeapons,
      stagedAccessories,
      stagedRanges,
    } = getWeapons(stagedSkills, stagedWeaponRanges, stagedWeaponAccessories);
    const stagedArmours: Array<Armours> = getArmours();
    const stagedArmourModifications: Array<ArmourModifications> =
      getArmourModifications();
    const { stagedBiowares, stagedCyberwares } = getAugmentations();

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
    for (const meleeWeapon of stagedMeleeWeapons) {
      await em.persistAndFlush(em.create(MeleeWeapons, meleeWeapon));
    }
    for (const projectileWeapon of stagedProjectileWeapons) {
      await em.persistAndFlush(em.create(ProjectileWeapons, projectileWeapon));
    }
    for (const firearmWeapon of stagedFirearmWeapons) {
      await em.persistAndFlush(em.create(FirearmWeapons, firearmWeapon));
    }
    for (const explosive of stagedExplosiveWeapons) {
      await em.persistAndFlush(em.create(Explosives, explosive));
    }

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
    stagedArmours.forEach((armour) => {
      em.create(Armours, armour);
    });
    stagedArmourModifications.forEach((armourMod) => {
      em.create(ArmourModifications, armourMod);
    });

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
    for (const cyberware of stagedCyberwares) {
      await em.persistAndFlush(em.create(Cyberwares, cyberware));
    }
    for (const bioware of stagedBiowares) {
      await em.persistAndFlush(em.create(Biowares, bioware));
    }
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
