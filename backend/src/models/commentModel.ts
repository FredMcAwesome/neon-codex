import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Threads, Users } from "./models.js";

@Entity()
export default class Comments {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  title!: string;

  @Property({ length: 1000 })
  content!: string;

  @ManyToOne(() => Users)
  user!: Users;

  @ManyToOne(() => Threads)
  thread!: Threads;
}
