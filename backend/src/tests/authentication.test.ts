import supertest from "supertest";
import { postLoginAPI } from "@shadowrun/common";
import app from "../app.js";

const api = supertest(app);

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
