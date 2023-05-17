import { z as zod } from "zod";
import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "@shadowrun/database/build/utils/databaseConfig.js";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
export interface jwtUsername extends jwt.JwtPayload {
  username: string;
}

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
export const getToken = function (bearerHeader: string) {
  // Split at the space
  const bearer = bearerHeader.split(" ");
  // Get token from array
  const bearerToken = bearer[1];
  return bearerToken;
};

const LoginStatus = zod.discriminatedUnion("loginStatus", [
  zod.object({
    loginStatus: zod.literal(true),
    username: zod.string(),
    isAdmin: zod.boolean(),
  }),
  zod.object({
    loginStatus: zod.literal(false),
  }),
]);

type LoginStatusType = zod.infer<typeof LoginStatus>;

export async function getLoginStatus({
  req,
}: trpcExpress.CreateExpressContextOptions): Promise<LoginStatusType> {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    const token = getToken(bearerHeader);
    if (token) {
      const decoded = jwt.verify(token, TOKEN_SECRET) as jwtUsername;
      if (decoded && decoded.username) {
        const user = await Database.userRepository.findOne({
          username: decoded.username,
        });
        if (user !== null) {
          return {
            loginStatus: true,
            username: decoded.username,
            isAdmin: user.admin,
          };
        } else {
          logger.log(
            `Auth username ${decoded.username} does not exist in database`
          );
        }
      }
    }
  }

  return {
    loginStatus: false,
  };
}
