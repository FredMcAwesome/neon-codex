import { bootstrap } from "./app.js";
import { PORT } from "@neon-codex/database";
import * as logger from "./utils/logger.js";

const { app, appRouter } = await bootstrap();

app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});

export default app;
export type AppRouter = typeof appRouter;
