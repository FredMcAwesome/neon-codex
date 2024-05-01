import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { CustomisedArmourModifications } from "./activeArmourModificationModel.js";
import { Armours } from "../equipment/combat/armourModel.js";
import { Characters } from "../characters/characterModel.js";

@Entity()
export class CustomisedArmours {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @ManyToOne({ entity: () => Armours, ref: true })
  armour!: Ref<Armours>;

  @OneToMany(
    () => CustomisedArmourModifications,
    (armourModifications) => armourModifications.customisedArmour
  )
  accessories = new Collection<CustomisedArmourModifications>(this);

  @Property({ nullable: true })
  customName?: string;

  constructor(armour: Ref<Armours>) {
    this.armour = armour;
  }
}
