import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import MikroORMConfig from "../../../build/mikro-orm.config.js";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Users, Threads, Comments } from "../../../build/models/models.js";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // will get persisted automatically
    const user1 = em.create(Users, {
      username: "User 1",
      password: "Hash 1",
    });
    const user2 = em.create(Users, {
      username: "User 2",
      password: "Hash 2",
    });

    const thread1 = em.create(Threads, {
      title: "Thread Title 1",
      user: user1,
    });
    const thread2 = em.create(Threads, {
      title: "Thread Title 2",
      user: user1,
    });
    const thread3 = em.create(Threads, {
      title: "Thread Title 3",
      user: user2,
    });

    em.create(Comments, {
      title: "Comment Title 1",
      content: "Comment Content 1",
      user: user1,
      thread: thread1,
    });
    em.create(Comments, {
      title: "Comment Title 2",
      content: "Comment Content 2",
      user: user2,
      thread: thread1,
    });

    em.create(Comments, {
      title: "Comment Title 3",
      content: "Comment Content 3",
      user: user2,
      thread: thread2,
    });

    em.create(Comments, {
      title: "Comment Title 4",
      content: "Comment Content 4",
      user: user1,
      thread: thread3,
    });
    em.create(Comments, {
      title: "Comment Title 5",
      content: "Comment Content 5",
      user: user2,
      thread: thread3,
    });
  }
}
