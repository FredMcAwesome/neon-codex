import "dotenv/config";
// import * as logger from "./logger.js";
// import { DATABASE_URL } from "./config.js";
import MikroORMConfig from "@shadowrun/database/build/mikro-orm.config.js";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { MikroORM } from "@mikro-orm/postgresql";
import {
  Users,
  Threads,
  Comments,
} from "@shadowrun/database/build/models/models.js";
import { Skills } from "@shadowrun/database/build/models/chummerdb/skillModel.js";
import { WeaponAccessories } from "@shadowrun/database/build/models/gear/combatGear/weaponAccessoryModel.js";
import { ActiveWeaponAccessories } from "@shadowrun/database/build/models/chummerdb/customTables/activeWeaponAccessoryModel.js";
import { Weapons } from "@shadowrun/database/build/models/gear/combatGear/weaponModel.js";
import { Augmentations } from "@shadowrun/database/build/models/gear/augmentationGear/augmentationModel.js";
import { AugmentationAccessories } from "@shadowrun/database/build/models/gear/augmentationGear/augmentationAccessoryModel.js";
import { Armours } from "@shadowrun/database/build/models/gear/combatGear/armourModel.js";
import { ArmourModifications } from "@shadowrun/database/build/models/gear/combatGear/armourModificationModel.js";
import { Ammunitions } from "@shadowrun/database/build/models/gear/combatGear/ammunitionModel.js";
import { MatrixWares } from "@shadowrun/database/build/models/gear/electronicsGear/matrixWareModel.js";
import { MatrixWareAccessories } from "@shadowrun/database/build/models/gear/electronicsGear/matrixWareAccessoryModel.js";
import { OtherWares } from "@shadowrun/database/build/models/gear/otherGear/otherWareModel.js";
import { VehiclesAndDrones } from "@shadowrun/database/build/models/gear/riggerGear/vehicleAndDroneModel.js";

interface IDatabase {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<Users>;
  threadRepository: EntityRepository<Threads>;
  commentRespository: EntityRepository<Comments>;
  skillRepository: EntityRepository<Skills>;
  activeWeaponAccessoryRespository: EntityRepository<ActiveWeaponAccessories>;
  weaponAccessoryRespository: EntityRepository<WeaponAccessories>;
  weaponRespository: EntityRepository<Weapons>;
  augmentationRespository: EntityRepository<Augmentations>;
  augmentationAccessoryRespository: EntityRepository<AugmentationAccessories>;
  armourRespository: EntityRepository<Armours>;
  armourAccessoryRespository: EntityRepository<ArmourModifications>;
  ammunitionRespository: EntityRepository<Ammunitions>;
  matrixWareRespository: EntityRepository<MatrixWares>;
  matrixWareAccessoryRespository: EntityRepository<MatrixWareAccessories>;
  otherWaresRespository: EntityRepository<OtherWares>;
  vehicleAndDroneRespository: EntityRepository<VehiclesAndDrones>;
}

export const Database = {} as IDatabase;

export const init = async () => {
  const orm = await MikroORM.init(MikroORMConfig);
  const em = orm.em;
  Database.orm = orm;
  Database.em = em.fork();
  Database.userRepository = em.getRepository(Users);
  Database.threadRepository = em.getRepository(Threads);
  Database.commentRespository = em.getRepository(Comments);
  Database.skillRepository = em.getRepository(Skills);
  Database.activeWeaponAccessoryRespository = em.getRepository(
    ActiveWeaponAccessories
  );
  Database.weaponAccessoryRespository = em.getRepository(WeaponAccessories);
  Database.weaponRespository = em.getRepository(Weapons);
  Database.augmentationRespository = em.getRepository(Augmentations);
  Database.augmentationAccessoryRespository = em.getRepository(
    AugmentationAccessories
  );
  Database.armourRespository = em.getRepository(Armours);
  Database.armourAccessoryRespository = em.getRepository(ArmourModifications);
  Database.ammunitionRespository = em.getRepository(Ammunitions);
  Database.matrixWareRespository = em.getRepository(MatrixWares);
  Database.matrixWareAccessoryRespository = em.getRepository(
    MatrixWareAccessories
  );
  Database.otherWaresRespository = em.getRepository(OtherWares);
  Database.vehicleAndDroneRespository = em.getRepository(VehiclesAndDrones);
};
