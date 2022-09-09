import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { test } from "@shadowrun/common/build/index.js";
import type { Example } from "@shadowrun/common/build/types.js";
import * as logger from "./utils/logger.js";
import { HOST, PORT } from "./utils/config.js";
import * as middleware from "./utils/middleware.js";
import forumRouter from "./routes/forum.js";

logger.log(test);

const app = express();

const allowedOrigins = ["http://" + HOST + ":" + PORT];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(middleware.requestLogger);

// Have Node serve the files for built React app
app.use(
  express.static(
    path.resolve(
      dirname(fileURLToPath(import.meta.url)),
      "../../frontend/build"
    )
  )
);

app.get("/api/example", (_req, res) => {
  const data: Example = { example: "ster" };
  res.json(data);
});

app.use("/api/forum", forumRouter);

app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});

export default app;
