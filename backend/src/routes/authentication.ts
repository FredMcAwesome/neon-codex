import express from "express";
import type { Loaded } from "@mikro-orm/core";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginSchema } from "@shadowrun/common";
import { Users } from "@shadowrun/database/build/models/models.js";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { TOKEN_SECRET } from "@shadowrun/database/build/utils/databaseConfig.js";
import { router, publicProcedure, adminProcedure } from "../trpc.js";

export const authenticationRouter = router({
  login: publicProcedure.input(LoginSchema).mutation(async (opts) => {
    const userCredentials = opts.input;
    const user = await Database.userRepository.findOne({
      username: userCredentials.username,
    });
    if (user === null) {
      throw new Error("User does not exist");
    }
    return await processPassword(userCredentials.password, user);
  }),
  signup: adminProcedure.input(LoginSchema).mutation(async (opts) => {
    const user = Database.userRepository.findOne({
      username: opts.input.username,
    });
    if (user !== null) {
      throw new Error("User already exists");
    }

    const creationSuccessful = await createUser(
      opts.input.username,
      opts.input.password
    );
    if (creationSuccessful) return `user ${opts.input.username} created`;
    else throw new Error("Database error - failed to create user");
  }),
});

function createUser(username: string, password: string) {
  const saltRounds = 10;
  return bcrypt
    .hash(password, saltRounds)
    .then((passwordHash) => {
      return Database.userRepository
        .findAll()
        .then(async (existingUsers) => {
          if (existingUsers.length !== 0) {
            logger.error(
              `Unable to create username: '${username}' already exists in database`
            );
            return false;
          }
          // become admin by manually editting database
          const newUser = new Users(username, passwordHash, false);
          Database.userRepository.persist(newUser);

          await Database.userRepository.flush();
          return true;
        })
        .catch((err) => {
          logger.error(err);
          return false;
        });
    })
    .catch((err) => {
      logger.error(err);
      return false;
    });
}

async function processPassword(password: string, user: Loaded<Users, never>) {
  const correctPW = await bcrypt.compare(password, user.password);
  if (correctPW) {
    return createAndSendJWT(user.username);
  } else {
    throw new Error("Failed to created JWT");
  }
}

function createAndSendJWT(username: string) {
  return jwt.sign({ username: username }, TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

interface IAuthRequest extends express.Request {
  // needs to be optional to allow use in place of Request as a parameter
  token?: string;
  username?: string;
  password?: string;
  admin?: boolean;
}

export default router;
export type { IAuthRequest };
