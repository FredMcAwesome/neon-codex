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
import { CustomisedArmourModifications } from "./activeArmourModificationModel.js";
import { Armours } from "../gear/combatGear/armourModel.js";

@Entity()
export class CustomisedArmours {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Armours, ref: true })
  armour!: Ref<Armours>;

  @OneToMany(
    () => CustomisedArmourModifications,
    (armourModifications) => armourModifications.customisedArmour
  )
  accessories = new Collection<CustomisedWeaponAccessories>(this);

  @Property({ nullable: true })
  customName?: string;

  constructor(armour: Ref<Armours>) {
    this.armour = armour;
  }
}
