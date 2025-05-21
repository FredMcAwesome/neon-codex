import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import { equipmentPackCategoryEnum } from "@neon-codex/common/build/enums.js";
import { PackArmours } from "../activeTables/activeArmourModel.js";
import { PackAugmentations } from "../activeTables/activeAugmentationModel.js";
import { PackVehicles } from "../activeTables/activeVehicleModel.js";
import { PackGears } from "../activeTables/activeGearModel.js";
import { PackWeapons } from "../activeTables/activeWeaponModel.js";
import { PackLifestyles } from "../activeTables/activeLIfestyleModel.js";

@Entity()
export class EquipmentPacks {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @Enum(() => equipmentPackCategoryEnum)
  type!: equipmentPackCategoryEnum;

  @Property()
  nuyen!: number;

  @OneToMany(() => PackArmours, (packArmour) => packArmour.equipmentPack)
  armourList = new Collection<PackArmours>(this);

  @OneToMany(
    () => PackAugmentations,
    (packAugmentation) => packAugmentation.equipmentPack
  )
  augmentationList = new Collection<PackAugmentations>(this);

  @OneToMany(() => PackGears, (packGear) => packGear.equipmentPack)
  gearList = new Collection<PackGears>(this);

  @OneToMany(() => PackVehicles, (packVehicle) => packVehicle.equipmentPack)
  vehicleList = new Collection<PackVehicles>(this);

  @OneToMany(() => PackWeapons, (packWeapon) => packWeapon.equipmentPack)
  weaponList = new Collection<PackWeapons>(this);

  @OneToMany(
    () => PackLifestyles,
    (activeLifestyle) => activeLifestyle.equipmentPack
  )
  lifestyleList = new Collection<PackLifestyles>(this);

  @Property({ length: 5000 })
  description!: string;

  constructor(
    name: string,
    category: equipmentPackCategoryEnum,
    nuyen: number,
    description: string
  ) {
    this.name = name;
    this.type = category;
    this.nuyen = nuyen;
    this.description = description;
  }
}
