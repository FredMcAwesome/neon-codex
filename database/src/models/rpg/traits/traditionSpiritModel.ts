import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import { Critter } from "../creatures/critterModel.js";

@Entity()
export class TraditionSpirits {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  name!: string;

  @ManyToOne({ entity: () => Critter, ref: true })
  combat!: Ref<Critter>;

  @ManyToOne({ entity: () => Critter, ref: true })
  detection!: Ref<Critter>;

  @ManyToOne({ entity: () => Critter, ref: true })
  health!: Ref<Critter>;

  @ManyToOne({ entity: () => Critter, ref: true })
  illusion!: Ref<Critter>;

  @ManyToOne({ entity: () => Critter, ref: true })
  manipulation!: Ref<Critter>;
}
