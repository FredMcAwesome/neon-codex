import express from "express";
import type { ThreadListType } from "@shadowrun/common";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { IAuthRequest, isLoggedIn } from "./authentication.js";

const router = express.Router();

router.get(
  "/threads",
  isLoggedIn,
  async function (_req: IAuthRequest, res: express.Response) {
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
      res.json(threadsResponse);
    } catch (error) {
      logger.error("Unable to connect to the database:", error);

      res.status(500).send("Database error");
    }
  }
);

router.post(
  "/threads",
  isLoggedIn,
  (req: IAuthRequest, res: express.Response) => {
    logger.log(req.body);
    const note = Database.threadRepository.create(req.body);
    res.json(note);
  }
);

export default router;
