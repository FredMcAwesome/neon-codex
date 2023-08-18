import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type { Ref } from "@mikro-orm/core";
import { Weapons } from "../../models.js";
import { CustomisedWeaponAccessories } from "./activeWeaponAccessoryModel.js";

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
