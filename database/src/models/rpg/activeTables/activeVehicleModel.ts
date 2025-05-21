import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import {
  CustomisedVehicleModifications,
  PackVehicleModifications,
} from "./activeVehicleModificationModel.js";
import { Vehicles } from "../equipment/rigger/vehicleModel.js";
import { Characters } from "../characters/characterModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";
import { ActiveVehicleGears } from "./activeGearModel.js";
import { CustomisedWeaponMounts } from "./activeWeaponMountModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveVehicles {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Vehicles, ref: true })
  vehicle!: Ref<Vehicles>;

  @OneToMany(
    () => CustomisedVehicleModifications,
    (vehicleModification) => vehicleModification.customisedVehicle
  )
  mods = new Collection<CustomisedVehicleModifications>(this);

  @OneToMany(() => CustomisedWeaponMounts, (weapon) => weapon.customisedVehicle)
  weaponMountList = new Collection<CustomisedWeaponMounts>(this);

  @OneToMany(() => ActiveVehicleGears, (activeGear) => activeGear.activeVehicle)
  gearList = new Collection<ActiveVehicleGears>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: string;

  @Property({ nullable: true })
  customName?: string;

  constructor(vehicle: Ref<Vehicles>) {
    this.vehicle = vehicle;
  }
}

@Entity({ discriminatorValue: "pack" })
export class PackVehicles extends ActiveVehicles {
  @ManyToOne({ entity: () => EquipmentPacks, ref: true })
  equipmentPack!: Ref<EquipmentPacks>;

  @OneToMany(
    () => PackVehicleModifications,
    (vehicleModification) => vehicleModification.packVehicle
  )
  packMods = new Collection<PackVehicleModifications>(this);

  constructor(equipmentPack: Ref<EquipmentPacks>, vehicle: Ref<Vehicles>) {
    super(vehicle);
    this.equipmentPack = equipmentPack;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedVehicles extends ActiveVehicles {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  constructor(character: Ref<Characters>, vehicle: Ref<Vehicles>) {
    super(vehicle);
    this.character = character;
  }
}
