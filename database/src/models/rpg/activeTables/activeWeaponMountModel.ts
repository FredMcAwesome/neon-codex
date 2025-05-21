import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Vehicles } from "../equipment/rigger/vehicleModel.js";
import { WeaponMounts } from "../equipment/rigger/weaponMountModel.js";
import { CustomisedVehicles, PackVehicles } from "./activeVehicleModel.js";
import { ActiveWeapons } from "./activeWeaponModel.js";
import { WeaponMountModifications } from "../equipment/rigger/weaponMountModModel.js";

// Links to either a custom vehicle, or a vehicle in the table.
// When we create a custom vehicle that already has a modification
// we will need to create a new accessory with the same base details.

// one link to customised vehicle and one to vehicle as we don't have polymorphic relationships yet
// https://github.com/mikro-orm/mikro-orm/issues/706
@Entity({
  discriminatorColumn: "discr",
  abstract: true,
})
export abstract class ActiveWeaponMounts {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => WeaponMounts, ref: true })
  weaponMount: Ref<WeaponMounts>;

  @ManyToOne({ entity: () => ActiveWeapons, nullable: true, ref: true })
  mountedWeapon?: Ref<ActiveWeapons>;

  @ManyToMany({
    entity: () => WeaponMountModifications,
    owner: true,
    joinColumn: "join_id",
  })
  mountMods = new Collection<WeaponMountModifications>(this);

  @Property()
  weaponExchangeable!: boolean;

  @Property({ nullable: true })
  rating?: number;

  constructor(
    weaponMount: Ref<WeaponMounts>,
    weaponExchangeable: boolean,
    rating?: number
  ) {
    this.weaponMount = weaponMount;
    this.weaponExchangeable = weaponExchangeable;
    if (rating) this.rating = rating;
  }
}

@Entity({ discriminatorValue: "included" })
export class IncludedWeaponMounts extends ActiveWeaponMounts {
  @ManyToOne({ entity: () => Vehicles, ref: true })
  standardVehicle: Ref<Vehicles>;

  constructor(
    vehicle: Ref<Vehicles>,
    weaponMount: Ref<WeaponMounts>,
    weaponExchangeable: boolean,
    rating?: number,
    mountedWeapon?: Ref<ActiveWeapons>
  ) {
    super(weaponMount, weaponExchangeable, rating);
    this.standardVehicle = vehicle;
    if (mountedWeapon !== undefined) {
      this.mountedWeapon = mountedWeapon;
    }
  }
}

@Entity({ discriminatorValue: "packVehicle" })
export class PackVehicleWeaponMounts extends ActiveWeaponMounts {
  @ManyToOne({ entity: () => PackVehicles, ref: true })
  packVehicle: Ref<PackVehicles>;

  constructor(
    vehicle: Ref<PackVehicles>,
    weaponMount: Ref<WeaponMounts>,
    weaponExchangeable: boolean,
    rating?: number
  ) {
    super(weaponMount, weaponExchangeable, rating);
    this.packVehicle = vehicle;
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedWeaponMounts extends ActiveWeaponMounts {
  @ManyToOne({ entity: () => CustomisedVehicles, ref: true })
  customisedVehicle: Ref<CustomisedVehicles>;

  constructor(
    vehicle: Ref<CustomisedVehicles>,
    weaponMount: Ref<WeaponMounts>,
    weaponExchangeable: boolean,
    rating?: number
  ) {
    super(weaponMount, weaponExchangeable, rating);
    this.customisedVehicle = vehicle;
  }
}
