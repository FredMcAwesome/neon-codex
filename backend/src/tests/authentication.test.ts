import supertest from "supertest";
import app, { dbInitialised } from "../app.js";
import { Database } from "../utils/db.js";
import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import Comments from "../models/commentModel.js";
import Threads from "../models/threadModel.js";
import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import { postLoginAPI } from "@shadowrun/common";

const api = supertest(app);
class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const saltRounds = 10;
    const hash1 = await bcrypt.hash("password1", saltRounds);
    const hash2 = await bcrypt.hash("password2", saltRounds);
    // will get persisted automatically
    const user1 = em.create(Users, {
      username: "User 1",
      password: hash1,
      admin: true,
    });
    const user2 = em.create(Users, {
      username: "User 2",
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

beforeAll(async () => {
  await dbInitialised;
  await Database.orm.getSchemaGenerator().refreshDatabase();
  const seeder = Database.orm.getSeeder();
  await seeder.seed(DatabaseSeeder);
});

test("correct login returns jwt token", async () => {
  await api
    .post(postLoginAPI)
    .send({
      username: "User 1",
      password: "password1",
    })
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("incorrect login returns unauthorised", async () => {
  await api
    .post(postLoginAPI)
    .send({
      username: "User 1",
      password: "badPassword",
    })
    .expect(401);
});

afterAll(async () => {
  await Database.orm.close();
});
