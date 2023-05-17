import type { ThreadListType } from "@shadowrun/common";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { router, privateProcedure } from "../trpc.js";
import { z as zod } from "zod";

export const forumRouter = router({
  getThreads: privateProcedure.query(async () => {
    try {
      const threads = await Database.threadRepository.findAll({
        populate: ["user"],
      });
      const threadsResponse: ThreadListType = threads.map((thread) => {
        return {
          title: thread.title,
          user: thread.user.username,
          id: thread.id,
        };
      });
      logger.log(JSON.stringify(threadsResponse, null, 2));
      return threadsResponse;
    } catch (error) {
      logger.error("Unable to connect to the database:", error);
      throw new Error("Database error");
    }
  }),
  createThread: privateProcedure
    .input(
      zod.object({
        title: zod.string(),
        username: zod.string(),
      })
    )
    .mutation(async (opts) => {
      const user = await Database.userRepository.findOne({
        username: opts.input.username,
      });
      logger.log(opts);
      if (user !== null) {
        const note = Database.threadRepository.create({
          title: opts.input.title,
          user: user,
        });
        return note;
      }
      throw new Error(`User ${opts.input.username} does not exist.`);
    }),
});
