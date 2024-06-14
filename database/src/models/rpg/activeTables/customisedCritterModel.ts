import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import { Characters } from "../characters/characterModel.js";
import { Critters } from "../creatures/critterModel.js";
import { CustomisedCritterPowers } from "./activeCritterPowerModel.js";

@Entity()
export class CustomisedCritters {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Characters, ref: true })
  character!: Ref<Characters>;

  @ManyToOne({ entity: () => Critters, ref: true })
  critter!: Ref<Critters>;

  @OneToMany(
    () => CustomisedCritterPowers,
    (customisedCritterPower) => customisedCritterPower.customisedCritter
  )
  customisedCritterPowerList = new Collection<CustomisedCritterPowers>(this);

  @Property({ nullable: true })
  customName?: string;

  constructor(character: Ref<Characters>, critter: Ref<Critters>) {
    this.character = character;
    this.critter = critter;
  }
}
