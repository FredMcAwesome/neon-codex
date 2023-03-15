import app, { dbInitialised } from "./app.js";
import { PORT } from "@shadowrun/database/build/utils/databaseConfig.js";
import * as logger from "./utils/logger.js";

await dbInitialised;

app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});
