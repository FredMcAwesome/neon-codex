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
import { Weapons } from "../equipment/combat/weaponModel.js";
import { Vehicles } from "../equipment/rigger/vehicleModel.js";
import { Characters } from "../characters/characterModel.js";

@Entity()
export class CustomisedVehicles {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @ManyToOne({ entity: () => Weapons, ref: true })
  vehicle!: Ref<Vehicles>;

  @OneToMany(
    () => CustomisedVehicleModifications,
    (vehicleModification) => vehicleModification.customisedVehicle
  )
  mods = new Collection<CustomisedVehicleModifications>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: string;

  @Property({ nullable: true })
  customName?: string;

  constructor(vehicle: Ref<Vehicles>) {
    this.vehicle = vehicle;
  }
}
