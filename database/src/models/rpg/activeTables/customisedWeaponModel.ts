import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { CustomisedWeaponAccessories } from "./activeWeaponAccessoryModel.js";
import { Weapons } from "../gear/combatGear/weaponModel.js";

// Only custom weapons not included
// This assumes weapons included in weapon mounts have no accessories
@Entity()
export class CustomisedWeapons {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Weapons, ref: true })
  weapon!: Ref<Weapons>;

  @OneToMany(
    () => CustomisedWeaponAccessories,
    (weaponAccessories) => weaponAccessories.customisedWeapon
  )
  accessories = new Collection<CustomisedWeaponAccessories>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: string;

  @Property({ nullable: true })
  customName?: string;

  constructor(weapon: Ref<Weapons>) {
    this.weapon = weapon;
  }
}
