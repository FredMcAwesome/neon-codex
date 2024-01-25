import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/postgresql";
import type { Ref } from "@mikro-orm/postgresql";
import Threads from "./threadModel.js";
import Users from "../accounts/userModel.js";

@Entity()
export default class Comments {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  title!: string;

  @Property({ length: 1000 })
  content!: string;

  @ManyToOne(() => Users)
  user!: Ref<Users>;

  @ManyToOne({ entity: () => Threads, ref: true })
  thread!: Ref<Threads>;
}
