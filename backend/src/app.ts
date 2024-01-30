import express from "express";
import cors from "cors";
import path from "path";
import { RequestContext } from "@mikro-orm/postgresql";
import * as logger from "./utils/logger.js";
import { HOST, PORT } from "@shadowrun/database/build/utils/databaseConfig.js";
import * as middleware from "./utils/middleware.js";
import { forumRouter } from "./routes/forum.js";
import { authenticationRouter } from "./routes/authentication.js";
import { characterRouter } from "./routes/character.js";
import { init } from "./utils/db.js";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext, router } from "./trpc.js";

const appRouter = router({
  character: characterRouter,
  forum: forumRouter,
  authentication: authenticationRouter,
});
export type AppRouter = typeof appRouter;

export async function bootstrap() {
  const db = await init();

  const app = express();

  const allowedOrigins = [`http://${HOST}:${PORT}`];
  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };
  app.use(cors(options));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use((_req, _res, next) => {
    RequestContext.create(db.em, next);
  });

  app.use(middleware.requestLogger);

  app.use(
    "/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );

  // Have Node serve the files for built React app
  const frontendPath = path.resolve("..", "frontend/build");
  logger.log("Loading react frontend from: " + frontendPath);
  app.use(express.static(frontendPath));
  app.get("*", function (_req, res) {
    res.sendFile("index.html", {
      root: frontendPath,
    });
  });

  return { app, appRouter };
}
