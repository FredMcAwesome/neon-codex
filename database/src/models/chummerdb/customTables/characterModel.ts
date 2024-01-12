import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import { CustomisedWeapons } from "./customisedWeaponModel.js";

@Entity()
export class Characters {
  @PrimaryKey()
  id!: number;

  @Property()
  priorities!: string;

  @Property()
  metatype!: string;

  @Property()
  attributes!: string;

  @Property()
  qualities!: string;

  @Property()
  skillGroupPoints = 0;

  @Property()
  skillPoints = 0;

  @Property()
  karmaPoints = 0;

  @OneToMany(() => CustomisedWeapons, (weapons) => weapons.id)
  weapons = new Collection<CustomisedWeapons>(this);
}
