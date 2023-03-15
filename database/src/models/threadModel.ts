import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { Users, Comments } from "./models.js";

@Entity()
export default class Threads {
  @PrimaryKey()
  id!: number;

  @Property({ length: 1000 })
  title!: string;

  @ManyToOne(() => Users)
  user!: Users;

  @OneToMany(() => Comments, (comment) => comment.thread)
  comments = new Collection<Comments>(this);
}
