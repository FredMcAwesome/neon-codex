import express from "express";
import cors from "cors";
import path from "path";
import { RequestContext } from "@mikro-orm/core";
import type { Example } from "@shadowrun/common";
import * as logger from "./utils/logger.js";
import { HOST, PORT } from "./utils/config.js";
import * as middleware from "./utils/middleware.js";
import forumRouter from "./routes/forum.js";
import authenticationRouter from "./routes/authentication.js";
import { init, Database } from "./utils/db.js";

// dodgy way to allow jest testing to know we are initialise
// when jest esm support is better change this to a top level await
const dbInitialised = init();
export { dbInitialised };

const app = express();

const allowedOrigins = ["http://" + HOST + ":" + PORT];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((_req, _res, next) => {
  RequestContext.create(Database.em, next);
});

app.use(middleware.requestLogger);

app.get("/api/example", (_req, res) => {
  const data: Example = { example: "ster" };
  res.json(data);
});

app.use("/api/forum", forumRouter);
app.use("/api/authentication", authenticationRouter);

// Have Node serve the files for built React app
const frontendPath = path.resolve("..", "frontend/build");
logger.log("Loading react frontend from: " + frontendPath);
app.use(express.static(frontendPath));
app.get("*", function (_req, res) {
  res.sendFile("index.html", {
    root: frontendPath,
  });
});

export default app;
