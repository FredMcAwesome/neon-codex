import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/postgresql";
import Comments from "../forum/commentModel.js";
import Threads from "../forum/threadModel.js";
import { Characters } from "../rpg/characters/characterModel.js";

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

  @OneToMany(() => Characters, (character) => character.user)
  characters = new Collection<Characters>(this);

  constructor(username: string, password: string, admin: boolean) {
    this.username = username;
    this.password = password;
    this.admin = admin;
  }
}
