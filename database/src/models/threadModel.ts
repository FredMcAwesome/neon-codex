import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import Users from "./userModel.js";
import Comments from "./commentModel.js";

@Entity()
export default class Threads {
  @PrimaryKey()
  id!: number;

  @Property({ length: 1000 })
  title!: string;

  @ManyToOne({ entity: () => Users, ref: true })
  user!: Ref<Users>;

  @OneToMany(() => Comments, (comment) => comment.thread)
  comments = new Collection<Comments>(this);
}
