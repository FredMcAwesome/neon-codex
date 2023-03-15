import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import bcrypt from "bcrypt";
import Comments from "../models/commentModel.js";
import Threads from "../models/threadModel.js";
import Users from "../models/userModel.js";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const saltRounds = 10;
    const hash0 = await bcrypt.hash("admin", saltRounds);
    const hash1 = await bcrypt.hash("pw1", saltRounds);
    const hash2 = await bcrypt.hash("pw2", saltRounds);
    // will get persisted automatically
    em.create(Users, {
      username: "admin",
      password: hash0,
      admin: true,
    });
    const user1 = em.create(Users, {
      username: "User1",
      password: hash1,
      admin: true,
    });
    const user2 = em.create(Users, {
      username: "User2",
      password: hash2,
      admin: false,
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
