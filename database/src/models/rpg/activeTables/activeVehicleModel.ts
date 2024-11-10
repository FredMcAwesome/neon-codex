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
import { Weapons } from "../equipment/combat/weaponModel.js";
import { Vehicles } from "../equipment/rigger/vehicleModel.js";
import { Characters } from "../characters/characterModel.js";
import { EquipmentPacks } from "../equipment/equipmentPackModel.js";
import { ActiveVehicleGears } from "./activeGearModel.js";
import { VehicleWeapons } from "./activeWeaponModel.js";

@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveVehicles {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Weapons, ref: true })
  vehicle!: Ref<Vehicles>;

  @OneToMany(
    () => CustomisedVehicleModifications,
    (vehicleModification) => vehicleModification.customisedVehicle
  )
  mods = new Collection<CustomisedVehicleModifications>(this);

  @OneToMany(() => VehicleWeapons, (weapon) => weapon.vehicle)
  weaponList = new Collection<VehicleWeapons>(this);

  @OneToMany(() => ActiveVehicleGears, (activeGear) => activeGear.activeVehicle)
  gearList = new Collection<ActiveVehicleGears>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: string;

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

  constructor(vehicle: Ref<Vehicles>) {
    super(vehicle);
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedVehicles extends ActiveVehicles {
  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @Property({ nullable: true })
  customName?: string;

  constructor(vehicle: Ref<Vehicles>) {
    super(vehicle);
  }
}
