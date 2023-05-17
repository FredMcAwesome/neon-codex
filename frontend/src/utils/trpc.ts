import type { AppRouter } from "@shadowrun/backend/build/app.js";
import { createTRPCReact } from "@trpc/react-query";
const trpc = createTRPCReact<AppRouter>();
export { trpc };
