import { init } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { router, privateProcedure } from "../trpc.js";
import { z as zod } from "zod";
import Threads from "@neon-codex/database/build/models/forum/threadModel.js";
import Users from "@neon-codex/database/build/models/accounts/userModel.js";
import type {
  ThreadSummaryListType,
  ThreadType,
} from "@neon-codex/common/build/serverResponse.js";

const getThreadList = privateProcedure.query(async () => {
  const db = await init();
  try {
    const threads = await db.em.findAll(Threads, {
      populate: ["user"],
    });
    const threadsResponse: ThreadSummaryListType = threads.map((thread) => {
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
});

const getThread = privateProcedure.input(zod.string()).query(async (opts) => {
  try {
    const { input } = opts;
    const id = Number(input);
    if (isNaN(id)) {
      throw new Error("Invalid Thread ID");
    }
    const db = await init();

    const thread = await db.em.findOne(Threads, id, {
      populate: ["*"],
    });
    if (thread === null) {
      throw new Error("Thread does not exist");
    }

    const threadResponse: ThreadType = {
      title: thread.title,
      username: thread.user.$.username,
      comments: await Promise.all(
        thread.comments.$.map(async (comment) => {
          const user = await db.em.findOne(Users, comment.user);
          if (user === null) {
            throw new Error("User does not exist");
          }
          return {
            username: user.username,
            content: comment.content,
          };
        })
      ),
    };

    return threadResponse;
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw new Error("Database error");
  }
});

const createThread = privateProcedure
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
  });

export const forumRouter = router({
  getThread: getThread,
  getThreadList: getThreadList,
  createThread: createThread,
});
