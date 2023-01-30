import "dotenv/config";
// import * as logger from "./logger.js";
// import { DATABASE_URL } from "./config.js";
import MikroORMConfig from "../mikro-orm.config.js";
import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Users, Threads, Comments } from "../models/models.js";
import { Weapons } from "../models/gear/combatGear/weaponModel.js";
import { Augmentations } from "../models/gear/augmentationGear/augmentationModel.js";
import { AugmentationAccessories } from "../models/gear/augmentationGear/augmentationAccessoryModel.js";
import { Armours } from "../models/gear/combatGear/armourModel.js";
import { ArmourAccessories } from "../models/gear/combatGear/armourAccessoryModel.js";
import { Ammunitions } from "../models/gear/combatGear/ammunitionModel.js";
import { MatrixWares } from "../models/gear/electronicsGear/matrixWareModel.js";
import { MatrixWareAccessories } from "../models/gear/electronicsGear/matrixWareAccessoryModel.js";
import { OtherWares } from "../models/gear/otherGear/otherWareModel.js";
import { VehiclesAndDrones } from "../models/gear/riggerGear/vehicleAndDroneModel.js";
import { WeaponAccessories } from "../models/gear/combatGear/weaponAccessoryModel.js";
import { MagicalEquipment } from "../models/gear/magicGear/magicalGearEquipment.js";

interface IDatabase {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<Users>;
  threadRepository: EntityRepository<Threads>;
  commentRespository: EntityRepository<Comments>;
  weaponRespository: EntityRepository<Weapons>;
  augmentationRespository: EntityRepository<Augmentations>;
  augmentationAccessoryRespository: EntityRepository<AugmentationAccessories>;
  weaponAccessoryRespository: EntityRepository<WeaponAccessories>;
  armourRespository: EntityRepository<Armours>;
  armourAccessoryRespository: EntityRepository<ArmourAccessories>;
  ammunitionRespository: EntityRepository<Ammunitions>;
  matrixWareRespository: EntityRepository<MatrixWares>;
  matrixWareAccessoryRespository: EntityRepository<MatrixWareAccessories>;
  magicalEqipmentRespository: EntityRepository<MagicalEquipment>;
  otherWaresRespository: EntityRepository<OtherWares>;
  vehicleAndDroneRespository: EntityRepository<VehiclesAndDrones>;
}

export const Database = {} as IDatabase;

export const init = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(MikroORMConfig);
  const em = orm.em;
  Database.orm = orm;
  Database.em = em.fork();
  Database.userRepository = em.getRepository(Users);
  Database.threadRepository = em.getRepository(Threads);
  Database.commentRespository = em.getRepository(Comments);
  Database.weaponRespository = em.getRepository(Weapons);
  Database.augmentationRespository = em.getRepository(Augmentations);
  Database.augmentationAccessoryRespository = em.getRepository(
    AugmentationAccessories
  );
  Database.weaponAccessoryRespository = em.getRepository(WeaponAccessories);
  Database.armourRespository = em.getRepository(Armours);
  Database.armourAccessoryRespository = em.getRepository(ArmourAccessories);
  Database.ammunitionRespository = em.getRepository(Ammunitions);
  Database.matrixWareRespository = em.getRepository(MatrixWares);
  Database.matrixWareAccessoryRespository = em.getRepository(
    MatrixWareAccessories
  );
  Database.magicalEqipmentRespository = em.getRepository(MagicalEquipment);
  Database.otherWaresRespository = em.getRepository(OtherWares);
  Database.vehicleAndDroneRespository = em.getRepository(VehiclesAndDrones);
};
