import express from "express";
import "dotenv/config";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import type { ThreadListType } from "@shadowrun/common/src/types.js";

const router = express.Router();

router.get("/thread", async function (_req, res) {
  try {
    const threads = await Database.threadRepository.findAll({
      populate: ["user"],
    });
    const threadsResponse: ThreadListType = threads.map((thread) => {
      return { title: thread.title, user: thread.user.username, id: thread.id };
    });
    logger.log(JSON.stringify(threadsResponse, null, 2));
    res.json(threadsResponse);
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    res.sendStatus(500);
  }
});

router.post("/thread", async (req, res) => {
  logger.log(req.body);
  const note = await Database.threadRepository.create(req.body);
  res.json(note);
});

export default router;
