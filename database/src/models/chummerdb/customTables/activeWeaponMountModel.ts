import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Vehicles } from "../../gear/riggerGear/vehicleModel.js";
import { CustomisedVehicles } from "./customisedVehicleModel.js";
import { WeaponMounts } from "../../gear/riggerGear/weaponMountModel.js";
import { Weapons } from "../../gear/combatGear/weaponModel.js";
import { CustomisedWeapons } from "./customisedWeaponModel.js";
import { WeaponMountModifications } from "../../gear/riggerGear/vehicleModificationModel.js";

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

  @ManyToMany({ entity: () => WeaponMountModifications, owner: true })
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

  @ManyToOne({ entity: () => Weapons, nullable: true, ref: true })
  standardWeapon?: Ref<Weapons>;

  constructor(
    vehicle: Ref<Vehicles>,
    weaponMount: Ref<WeaponMounts>,
    weaponExchangeable: boolean,
    rating?: number,
    standardWeapon?: Ref<Weapons>
  ) {
    super(weaponMount, weaponExchangeable, rating);
    this.standardVehicle = vehicle;
    if (standardWeapon !== undefined) {
      this.standardWeapon = standardWeapon;
    }
  }
}

@Entity({ discriminatorValue: "customised" })
export class CustomisedWeaponMounts extends ActiveWeaponMounts {
  @ManyToOne({ entity: () => CustomisedVehicles, ref: true })
  customisedVehicle: Ref<CustomisedVehicles>;

  @ManyToOne({ entity: () => CustomisedWeapons, nullable: true, ref: true })
  customisedWeapon?: Ref<CustomisedWeapons>;

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
