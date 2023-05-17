import * as trpcExpress from "@trpc/server/adapters/express";
import { TRPCError, initTRPC } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import { getLoginStatus } from "./utils/login.js";
export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  const user = await getLoginStatus({ req, res });
  return {
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

const isLoggedIn = middleware(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user.loginStatus) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      username: ctx.user.username,
      isAdmin: ctx.user.isAdmin,
    },
  });
});

const isAdmin = middleware(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user.loginStatus || !ctx.user.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      username: ctx.user.username,
    },
  });
});

export const privateProcedure = publicProcedure.use(isLoggedIn);
export const adminProcedure = publicProcedure.use(isAdmin);
