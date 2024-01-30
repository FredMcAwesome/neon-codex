import type { AppRouter } from "@neon-codex/backend/build/app.js";
import { createTRPCReact } from "@trpc/react-query";
import type { CreateTRPCReact } from "@trpc/react-query";
const trpc: CreateTRPCReact<AppRouter, unknown, null> =
  createTRPCReact<AppRouter>();
export { trpc };
