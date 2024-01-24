import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import Comments from "./commentModel.js";
import Threads from "./threadModel.js";

@Entity()
export default class Users {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  @Unique()
  username!: string;

  @Property({ length: 3000 })
  password!: string;

  @Property()
  admin!: boolean;

  @OneToMany(() => Threads, (thread) => thread.user)
  threads = new Collection<Threads>(this);

  @OneToMany(() => Comments, (comment) => comment.user)
  comments = new Collection<Comments>(this);

  constructor(username: string, password: string, admin: boolean) {
    this.username = username;
    this.password = password;
    this.admin = admin;
  }
}
