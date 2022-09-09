import express from "express";
import "dotenv/config";
import { Thread } from "../models/models.js";
import * as logger from "../utils/logger.js";

const router = express.Router();

router.get("/", async function (_req, res) {
  try {
    const threads = await Thread.findAll();
    logger.log(JSON.stringify(threads, null, 2));
    res.json(threads);
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
});

router.post("/", async (req, res) => {
  logger.log(req.body);
  const note = await Thread.create(req.body);
  res.json(note);
});

export default router;
