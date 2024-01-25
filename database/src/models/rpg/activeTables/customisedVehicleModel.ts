import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { CustomisedVehicleModifications } from "./activeVehicleModificationModel.js";
import { Weapons } from "../gear/combatGear/weaponModel.js";
import { Vehicles } from "../gear/riggerGear/vehicleModel.js";

@Entity()
export class CustomisedVehicles {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Weapons, ref: true })
  vehicle!: Ref<Vehicles>;

  @OneToMany(
    () => CustomisedVehicleModifications,
    (vehicleModification) => vehicleModification.customisedVehicle
  )
  accessories = new Collection<CustomisedVehicleModifications>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: string;

  @Property({ nullable: true })
  customName?: string;

  constructor(vehicle: Ref<Vehicles>) {
    this.vehicle = vehicle;
  }
}
