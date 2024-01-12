import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/postgresql";
import { Threads, Comments } from "./models.js";

@Entity()
export default class Users {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
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
