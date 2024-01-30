import { init } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { router, privateProcedure } from "../trpc.js";
import { z as zod } from "zod";
import Threads from "@shadowrun/database/build/models/forum/threadModel.js";
import Users from "@shadowrun/database/build/models/accounts/userModel.js";
import type { ThreadListType } from "@shadowrun/common/build/serverResponse.js";

export const forumRouter = router({
  getThreads: privateProcedure.query(async () => {
    const db = await init();
    try {
      const threads = await db.em.findAll(Threads, {
        populate: ["user"],
      });
      const threadsResponse: ThreadListType = threads.map((thread) => {
        return {
          title: thread.title,
          user: thread.user.$.username,
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
      zod
        .object({
          title: zod.string(),
          username: zod.string(),
        })
        .strict()
    )
    .mutation(async (opts) => {
      const db = await init();
      const user = await db.em.findOne(Users, {
        username: opts.input.username,
      });
      logger.log(opts);
      if (user !== null) {
        const note = db.em.create(Threads, {
          title: opts.input.title,
          user: user,
        });
        return note;
      }
      throw new Error(`User ${opts.input.username} does not exist.`);
    }),
});
