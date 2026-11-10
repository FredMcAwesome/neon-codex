import express from "express";
import compression from "compression";
import cors from "cors";
import path from "path";
import { RequestContext } from "@mikro-orm/postgresql";
import * as logger from "./utils/logger.js";
import { HOST, PORT } from "@neon-codex/database";
import * as middleware from "./utils/middleware.js";
import { forumRouter } from "./routes/forum.js";
import { authenticationRouter } from "./routes/authentication.js";
import { characterRouter } from "./routes/character.js";
import { init } from "./utils/db.js";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext, router } from "./trpc.js";

type appRouterType = {
  character: typeof characterRouter;
  forum: typeof forumRouter;
  authentication: typeof authenticationRouter;
};
const routes: appRouterType = {
  character: characterRouter,
  forum: forumRouter,
  authentication: authenticationRouter,
};
const appRouter = router(routes);
export type AppRouter = typeof appRouter;

export async function bootstrap(): Promise<{
  app: express.Application;
  appRouter: AppRouter;
}> {
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

  // Compress text responses above 1KB
  app.use(compression({ threshold: 1024 }));

  app.use(
    "/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );

  // Have Node serve the files for built React app
  const frontendPath = path.resolve("..", "frontend/build");
  logger.log("Loading react frontend from: " + frontendPath);
  // Cache policy: immutable for hashed assets, revalidate for json, no-cache for SPA shell
  app.use(
    express.static(frontendPath, {
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (filePath.endsWith(".json")) {
          res.setHeader("Cache-Control", "public, no-cache");
        } else {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );
  app.get("*", function (_req, res) {
    // Never cache the SPA shell: it references hashed assets by name.
    res.set("Cache-Control", "no-cache");
    res.sendFile("index.html", {
      root: frontendPath,
    });
  });

  return { app, appRouter };
}
