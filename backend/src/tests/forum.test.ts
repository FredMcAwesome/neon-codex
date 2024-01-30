import supertest from "supertest";
import { getLoginStatusAPI, getThreadListAPI } from "@neon-codex/common/";
import app from "../app.js";

const api = supertest(app);

let token: string;

beforeAll(async () => {
  const response = await api.post("/api/authentication/login").send({
    username: "User 1",
    password: "password1",
  });
  token = response.body.token;
  console.log(token);
});

test("threads are returned when authenticated", async () => {
  await api
    .get(getThreadListAPI)
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("no threads are returned without authentication", async () => {
  await api.get(getThreadListAPI).expect(400);
});

test("verify user jwt with correct jwt", async () => {
  await api
    .get(getLoginStatusAPI)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});

test("invalidate user jwt with incorrect jwt", async () => {
  await api
    .get(getLoginStatusAPI)
    .set("Authorization", "Bearer BadToken")
    .expect(500);
});
