import express from "express";
import {
  augmentationTypeEnum,
  MatrixType,
  matrixWareAccessoryTypeEnum,
  matrixWareTypeEnum,
  otherWareTypeEnum,
  weaponTypeEnum,
} from "@shadowrun/common";
import type { AugmentationListType, GearListType } from "@shadowrun/common";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { IAuthRequest, isLoggedIn } from "./authentication.js";
import {
  MatrixListType,
  OtherGearListType,
} from "@shadowrun/common/build/serverResponse.js";
import {
  MagicGearListType,
  MatrixAccessoriesListType,
  VehiclesAndDronesListType,
} from "@shadowrun/common/build/schemas/gearSchemas.js";
import { MatrixAccessoryType } from "@shadowrun/common/build/schemas/electronicSchemas.js";
import { VehiclesAndDronesType } from "@shadowrun/common/build/schemas/riggerSchema.js";
import {
  WeaponUnlinkedSummaryListType,
  WeaponUnlinkedSummaryType,
} from "@shadowrun/common/build/schemas/weaponSchemas.js";
import { SkillListType } from "@shadowrun/common/build/schemas/skillSchema.js";
import { Cyberlimbs } from "@shadowrun/database/build/models/gear/augmentationGear/augmentationModel.js";
import {
  MeleeWeapons,
  ProjectileWeapons,
  FirearmWeapons,
  Explosives,
} from "@shadowrun/database/build/models/gear/combatGear/weaponModel.js";
import {
  CredSticks,
  Identifications,
  Tools,
  OpticalDevices,
  VisionEnhancements,
  AudioDevices,
  AudioEnhancements,
  Sensors,
  SecurityDevices,
  BreakingAndEnteringDevices,
} from "@shadowrun/database/build/models/gear/electronicsGear/matrixWareAccessoryModel.js";
import {
  Cyberdecks,
  RFIDTags,
  CommunicationCountermeasures,
} from "@shadowrun/database/build/models/gear/electronicsGear/matrixWareModel.js";
import { GrappleGun } from "@shadowrun/database/build/models/gear/otherGear/otherWareModel.js";

const router = express.Router();

router.get(
  "/all",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const weaponsResponse: WeaponUnlinkedSummaryListType = await getWeapons();
      const electronicsResponse: MatrixListType = await getElectronics();
      const electronicAccessoriesResponse: MatrixAccessoriesListType =
        await getElectronicAccessories();
      const otherGearResponse: OtherGearListType = await getOtherGear();
      const augmentationsResponse: AugmentationListType =
        await getAugmentations();
      const magicalEqipmentResponse: MagicGearListType =
        await getMagicalEquipment();
      const vehiclesAndDronesResponse: VehiclesAndDronesListType =
        await getVehiclesAndDrones();
      const gearResponse: GearListType = {
        weapons: weaponsResponse,
        electronics: electronicsResponse,
        electronicAccessories: electronicAccessoriesResponse,
        otherGear: otherGearResponse,
        augmentations: augmentationsResponse,
        magicalEquipment: magicalEqipmentResponse,
        vehiclesAndDrones: vehiclesAndDronesResponse,
      };
      // logger.log(JSON.stringify(gearResponse, null, 2));
      res.json(gearResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/skills",
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const skillsResponse: SkillListType = await getSkills();
      // logger.log(JSON.stringify(skillsResponse, null, 2));
      res.json(skillsResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/weapons",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const weaponsResponse: WeaponUnlinkedSummaryListType = await getWeapons();
      logger.log(JSON.stringify(weaponsResponse, null, 2));
      res.json(weaponsResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/electronics",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const matrixResponse: MatrixListType = await getElectronics();
      logger.log(JSON.stringify(matrixResponse, null, 2));
      res.json(matrixResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/electronicsAccessories",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const matrixAccessoriesResponse: MatrixAccessoriesListType =
        await getElectronicAccessories();
      logger.log(JSON.stringify(matrixAccessoriesResponse, null, 2));
      res.json(matrixAccessoriesResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/otherGear",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const matrixResponse = await getOtherGear();
      logger.log(JSON.stringify(matrixResponse, null, 2));
      res.json(matrixResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/augmentations",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const augmentationsResponse: AugmentationListType =
        await getAugmentations();
      logger.log(JSON.stringify(augmentationsResponse, null, 2));
      res.json(augmentationsResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/magicalEquipment",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const magicalEquipmentResponse: MagicGearListType =
        await getMagicalEquipment();
      logger.log(JSON.stringify(magicalEquipmentResponse, null, 2));
      res.json(magicalEquipmentResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.get(
  "/vehiclesAndDrones",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
    try {
      const vehiclesAndDronesResponse: VehiclesAndDronesListType =
        await getVehiclesAndDrones();
      logger.log(JSON.stringify(vehiclesAndDronesResponse, null, 2));
      res.json(vehiclesAndDronesResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      res.status(500).send("Database error");
    }
  }
);

export default router;

async function getSkills() {
  const skills = await Database.skillRepository.findAll();
  const skillsResponse: SkillListType = skills.map((skill) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...noIdSkill } = skill;
    return noIdSkill;
  });
  return skillsResponse;
}

async function getWeapons() {
  const weapons = await Database.weaponRespository.findAll();
  const weaponsResponse: WeaponUnlinkedSummaryListType = await Promise.all(
    weapons.map(async (weapon) => {
      const meleeWeapon = weapon as MeleeWeapons;
      const projectileWeapon = weapon as ProjectileWeapons;
      const firearmWeapon = weapon as FirearmWeapons;
      const explosiveWeapon = weapon as Explosives;
      const skill = await weapon.relatedSkill.load();
      const accessories = await weapon.accessories.loadItems();
      const weaponFormatted: WeaponUnlinkedSummaryType = {
        // id: weapon.id,
        name: weapon.name,
        ...(weapon.type === weaponTypeEnum.Melee
          ? {
              typeInformation: {
                type: weaponTypeEnum.Melee,
                subtype: meleeWeapon.subtypeMelee,
                meleeOptions: {
                  reach: meleeWeapon.reach,
                },
              },
            }
          : weapon.type === weaponTypeEnum.Projectile
          ? {
              typeInformation: {
                type: weaponTypeEnum.Projectile,
                subtype: projectileWeapon.subtypeProjectile,
                range: projectileWeapon.range,
              },
            }
          : weapon.type === weaponTypeEnum.Firearm
          ? {
              typeInformation: {
                type: weaponTypeEnum.Firearm,
                subtype: firearmWeapon.subtypeFirearm,
                firearmOptions: {
                  mode: firearmWeapon.mode,
                  recoilCompensation: firearmWeapon.recoilCompensation,
                  ...(firearmWeapon.ammoCategory && {
                    ammoCategory: firearmWeapon.ammoCategory,
                  }),
                  ammoSlots: firearmWeapon.ammoSlots,
                  ...((firearmWeapon.weaponRequirements ||
                    firearmWeapon.hostWeaponMountsRequired) && {
                    hostWeaponRequirements: {
                      ...(firearmWeapon.weaponRequirements && {
                        weaponRequirements: firearmWeapon.weaponRequirements,
                      }),
                      ...(firearmWeapon.hostWeaponMountsRequired &&
                        firearmWeapon.hostWeaponMountsRequired.length > 0 && {
                          hostWeaponMountsRequired:
                            firearmWeapon.hostWeaponMountsRequired,
                        }),
                    },
                  }),
                  ...(firearmWeapon.underbarrelWeapons &&
                    firearmWeapon.underbarrelWeapons.length > 0 && {
                      underbarrelWeapons: firearmWeapon.underbarrelWeapons,
                    }),
                  ...(firearmWeapon.addWeapons &&
                    firearmWeapon.addWeapons.length > 0 && {
                      addWeapons: firearmWeapon.addWeapons,
                    }),
                  ...(firearmWeapon.accessoryMounts &&
                    firearmWeapon.accessoryMounts.length > 0 && {
                      accessoryMounts: firearmWeapon.accessoryMounts,
                    }),
                  ...(firearmWeapon.doubleCostAccessoryMounts &&
                    firearmWeapon.doubleCostAccessoryMounts.length > 0 && {
                      doubleCostAccessoryMounts:
                        firearmWeapon.doubleCostAccessoryMounts,
                    }),
                },
                range: firearmWeapon.range,
              },
            }
          : {
              typeInformation: {
                type: weaponTypeEnum.Explosive,
                subtype: explosiveWeapon.subtypeExplosive,
                range: explosiveWeapon.range,
              },
            }),
        concealability: weapon.concealability,
        accuracy: weapon.accuracy,
        damage: weapon.damage,
        armourPenetration: weapon.armourPenetration,
        ...(weapon.ammunition &&
          weapon.ammunition.length > 0 && { ammunition: weapon.ammunition }),
        availability: weapon.availability,
        cost: weapon.cost,
        ...(weapon.allowedGear &&
          weapon.allowedGear.length > 0 && { allowedGear: weapon.allowedGear }),
        ...(weapon.accessories &&
          weapon.accessories.length > 0 && {
            accessories: await Promise.all(
              accessories.map(async (accessory) => {
                const originalAccessory =
                  await accessory.weaponAccessory.load();
                return { name: originalAccessory.name };
              })
            ),
          }),
        allowAccessories: weapon.allowAccessories,
        isCyberware: weapon.cyberware,
        augmentationType: weapon.augmentationCategory,
        description: weapon.description,
        ...(weapon.wireless && { wireless: weapon.wireless }),
        relatedSkill: skill.name,
        ...(weapon.relatedSkillSpecialisations &&
          weapon.relatedSkillSpecialisations.length > 0 && {
            relatedSkillSpecialisations: weapon.relatedSkillSpecialisations,
          }),
        source: weapon.source,
        page: weapon.page,
      };
      return weaponFormatted;
    })
  );
  return weaponsResponse;
}

async function getElectronics() {
  const matrixWare = await Database.matrixWareRespository.findAll();
  const matrixResponse: MatrixListType = matrixWare.map((matrixItem) => {
    const cyberdeck = matrixItem as Cyberdecks;
    const rfidTag = matrixItem as RFIDTags;
    const communicationCountermeasure =
      matrixItem as CommunicationCountermeasures;
    const matrixItemFormatted: MatrixType = {
      ...(matrixItem.type === matrixWareTypeEnum.Commlink
        ? {
            typeInformation: {
              type: matrixWareTypeEnum.Commlink,
            },
          }
        : matrixItem.type === matrixWareTypeEnum.Cyberdeck
        ? {
            typeInformation: {
              type: matrixWareTypeEnum.Cyberdeck,
              attributeArray: cyberdeck.attributeArray,
              programs: cyberdeck.programs,
            },
          }
        : matrixItem.type === matrixWareTypeEnum.RFIDTag
        ? {
            typeInformation: {
              type: matrixWareTypeEnum.RFIDTag,
              description: rfidTag.description,
              wireless: rfidTag.wireless || undefined,
            },
          }
        : matrixItem.type === matrixWareTypeEnum.CommunicationCountermeasure
        ? {
            typeInformation: {
              type: matrixWareTypeEnum.CommunicationCountermeasure,
              description: communicationCountermeasure.description,
              wireless: communicationCountermeasure.wireless || undefined,
            },
          }
        : matrixItem.type === matrixWareTypeEnum.Software
        ? {
            typeInformation: {
              type: matrixWareTypeEnum.Software,
            },
          }
        : {
            typeInformation: {
              type: matrixWareTypeEnum.Skillsoft,
            },
          }),
      name: matrixItem.name,
      rating: matrixItem.rating || undefined,
      availability: matrixItem.availability,
      cost: matrixItem.cost,
    };
    return matrixItemFormatted;
  });
  return matrixResponse;
}

async function getElectronicAccessories() {
  const matrixWare = await Database.matrixWareAccessoryRespository.findAll();
  const matrixResponse: MatrixAccessoriesListType = matrixWare.map(
    (matrixItem) => {
      const credstick = matrixItem as CredSticks;
      const identication = matrixItem as Identifications;
      const tool = matrixItem as Tools;
      const opticalDevice = matrixItem as OpticalDevices;
      const visionEnhancement = matrixItem as VisionEnhancements;
      const audioDevice = matrixItem as AudioDevices;
      const audioEnhancement = matrixItem as AudioEnhancements;
      const sensor = matrixItem as Sensors;
      const securityDevice = matrixItem as SecurityDevices;
      const breakingAndEnteringDevice =
        matrixItem as BreakingAndEnteringDevices;
      const matrixAccessoryFormatted: MatrixAccessoryType = {
        ...(matrixItem.type === matrixWareAccessoryTypeEnum.CredStick
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.CredStick,
                maxValue: credstick.maxValue,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.Identification
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.Identification,
                description: identication.description,
                wireless: identication.wireless || undefined,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.Tool
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.Tool,
                description: tool.description,
                wireless: tool.wireless || undefined,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.OpticalDevice
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.OpticalDevice,
                capacity: opticalDevice.capacity,
                description: opticalDevice.description,
                wireless: opticalDevice.wireless || undefined,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.VisionEnhancement
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.VisionEnhancement,
                capacity: visionEnhancement.capacity,
                description: visionEnhancement.description,
                wireless: visionEnhancement.wireless || undefined,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.AudioDevice
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.AudioDevice,
                capacity: audioDevice.capacity,
                description: audioDevice.description,
                wireless: audioDevice.wireless || undefined,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.AudioEnhancement
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.AudioEnhancement,
                capacityCost: audioEnhancement.capacityCost,
                description: audioEnhancement.description,
                wireless: audioEnhancement.wireless || undefined,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.Sensor
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.Sensor,
                capacity: sensor.capacity,
              },
            }
          : matrixItem.type === matrixWareAccessoryTypeEnum.SecurityDevice
          ? {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.SecurityDevice,
                description: securityDevice.description,
                wireless: securityDevice.wireless || undefined,
              },
            }
          : {
              typeInformation: {
                type: matrixWareAccessoryTypeEnum.BreakingAndEnteringDevice,
                description: breakingAndEnteringDevice.description,
                wireless: breakingAndEnteringDevice.wireless || undefined,
              },
            }),
        name: matrixItem.name,
        rating: matrixItem.rating || undefined,
        availability: matrixItem.availability,
        cost: matrixItem.cost,
      };
      return matrixAccessoryFormatted;
    }
  );
  return matrixResponse;
}

async function getOtherGear() {
  const otherWares = await Database.otherWaresRespository.findAll();
  const otherGearResponse: OtherGearListType = otherWares.map((otherWare) => {
    const grappleGun = otherWare as GrappleGun;
    return {
      ...(otherWare.type === otherWareTypeEnum.IndustrialChemical
        ? {
            typeInformation: {
              type: otherWareTypeEnum.IndustrialChemical,
            },
          }
        : otherWare.type === otherWareTypeEnum.SurvivalGear
        ? {
            typeInformation: {
              type: otherWareTypeEnum.SurvivalGear,
            },
          }
        : otherWare.type === otherWareTypeEnum.GrappleGun
        ? {
            typeInformation: {
              type: otherWareTypeEnum.GrappleGun,
              accessory: grappleGun.accessory,
              lengthForCost: grappleGun.lengthForCost || undefined,
            },
          }
        : otherWare.type === otherWareTypeEnum.Biotech
        ? {
            typeInformation: {
              type: otherWareTypeEnum.Biotech,
            },
          }
        : otherWare.type === otherWareTypeEnum.DocWagonContract
        ? {
            typeInformation: {
              type: otherWareTypeEnum.DocWagonContract,
            },
          }
        : {
            typeInformation: {
              type: otherWareTypeEnum.SlapPatch,
            },
          }),
      name: otherWare.name,
      rating: otherWare.rating || undefined,
      availability: otherWare.availability,
      cost: otherWare.cost,
      description: otherWare.description,
      wireless: otherWare.wireless || undefined,
    };
  });
  return otherGearResponse;
}

async function getMagicalEquipment() {
  const magicalEqipment = await Database.magicalEqipmentRespository.findAll();
  const MagicalEquipmentResponse: MagicGearListType = magicalEqipment.map(
    (magicalItem) => {
      return {
        type: magicalItem.type,
        subtype: magicalItem.subtype || undefined,
        name: magicalItem.name,
        availability: magicalItem.availability,
        cost: magicalItem.cost,
        description: magicalItem.description,
      };
    }
  );
  return MagicalEquipmentResponse;
}

async function getAugmentations() {
  const augmentations = await Database.augmentationRespository.findAll();
  const augmentationsResponse: AugmentationListType = augmentations.map(
    (augmentation) => {
      const cyberlimb: Cyberlimbs = augmentation as Cyberlimbs;
      return {
        ...(augmentation.type === augmentationTypeEnum.Headware
          ? {
              typeInformation: {
                type: augmentationTypeEnum.Headware,
              },
            }
          : augmentation.type === augmentationTypeEnum.Eyeware
          ? {
              typeInformation: {
                type: augmentationTypeEnum.Eyeware,
              },
            }
          : augmentation.type === augmentationTypeEnum.Earware
          ? {
              typeInformation: {
                type: augmentationTypeEnum.Earware,
              },
            }
          : augmentation.type === augmentationTypeEnum.Bodyware
          ? {
              typeInformation: {
                type: augmentationTypeEnum.Bodyware,
              },
            }
          : augmentation.type === augmentationTypeEnum.Cyberlimbs
          ? {
              typeInformation: {
                type: augmentationTypeEnum.Cyberlimbs,
                syntheticCapacity: cyberlimb.syntheticCapacity,
                syntheticCost: cyberlimb.syntheticCost,
              },
            }
          : augmentation.type === augmentationTypeEnum.Bioware
          ? {
              typeInformation: {
                type: augmentationTypeEnum.Bioware,
              },
            }
          : {
              typeInformation: {
                type: augmentationTypeEnum.CulturedBioware,
              },
            }),
        name: augmentation.name,
        rating: augmentation.rating || undefined,
        essense: augmentation.essence,
        capacity: augmentation.capacity || undefined,
        capacityCost: augmentation.capacityCost || undefined,
        availability: augmentation.availability,
        cost: augmentation.cost,
        description: augmentation.description,
        wireless: augmentation.wireless || undefined,
      };
    }
  );
  return augmentationsResponse;
}

async function getVehiclesAndDrones() {
  const vehiclesAndDrones = await Database.vehicleAndDroneRespository.findAll();
  const vehiclesAndDronesResponse: VehiclesAndDronesListType =
    vehiclesAndDrones.map((vehicleOrDrone) => {
      const vehicleOrDroneFormatted: VehiclesAndDronesType = {
        type: vehicleOrDrone.type,
        subtype: vehicleOrDrone.subtype,
        name: vehicleOrDrone.name,
        handling: vehicleOrDrone.handling,
        speed: vehicleOrDrone.speed,
        acceleration: vehicleOrDrone.acceleration,
        body: vehicleOrDrone.body,
        armour: vehicleOrDrone.armour,
        pilot: vehicleOrDrone.pilot,
        sensor: vehicleOrDrone.sensor,
        seats: vehicleOrDrone.seats,
        availability: vehicleOrDrone.availability,
        cost: vehicleOrDrone.cost,
        description: vehicleOrDrone.description,
      };
      return vehicleOrDroneFormatted;
    });
  return vehiclesAndDronesResponse;
}
