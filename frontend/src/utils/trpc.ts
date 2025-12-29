import type { AppRouter } from "@neon-codex/backend";
import { createTRPCReact } from "@trpc/react-query";
import type { CreateTRPCReact } from "@trpc/react-query";
const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();
export { trpc };
