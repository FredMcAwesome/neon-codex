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
import { Weapons } from "../equipment/combat/weaponModel.js";
import { Characters } from "../characters/characterModel.js";

// Only custom weapons not included
// This assumes weapons included in weapon mounts have no accessories
@Entity()
export class CustomisedWeapons {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @ManyToOne({ entity: () => Weapons, ref: true })
  weapon!: Ref<Weapons>;

  @OneToMany(
    () => CustomisedWeaponAccessories,
    (weaponAccessories) => weaponAccessories.customisedWeapon
  )
  accessories = new Collection<CustomisedWeaponAccessories>(this);

  // rating is only used in a few weapons
  @Property({ nullable: true })
  rating?: number;

  @Property({ nullable: true })
  customName?: string;

  constructor(weapon: Ref<Weapons>) {
    this.weapon = weapon;
  }
}
