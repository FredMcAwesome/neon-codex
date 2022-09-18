import app, { dbInitialised } from "./app.js";
import { PORT } from "./utils/config.js";
import * as logger from "./utils/logger.js";

await dbInitialised;

app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});
