import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { test } from "@shadowrun/common/build/index.js";
import type { Example } from "@shadowrun/common/build/types.js";

console.log(test);

const app = express();
const PORT = "3000";

const allowedOrigins = ["http://localhost:" + PORT];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
