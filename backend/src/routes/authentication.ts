import express from "express";
import bcrypt from "bcrypt";
import { Database } from "../utils/db.js";
import * as logger from "../utils/logger.js";
import { Users } from "../models/models.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../utils/config.js";
import { LoginSchema } from "@shadowrun/common";
import type { LoginType, JwtTokenType } from "@shadowrun/common";
import { Loaded } from "@mikro-orm/core";
const router = express.Router();

const isLoggedIn = [verifyToken, getUsername];

router.post("/login", [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must be at least 1 character")
    .escape(),
  body("password", "Password must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  function (req: express.Request, res: express.Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const parsedRes = LoginSchema.safeParse(req.body);
    if (!parsedRes.success) {
      res.status(400).send("Invalid response body");
      return;
    }
    const requestBody = parsedRes.data;
    Database.userRepository
      .findOne({
        username: requestBody.username,
      })
      .then((user) => {
        if (!user) {
          res.sendStatus(401);
          return;
        }

        processPassword(requestBody, user, res);
      })
      .catch((_err) => {
        res.status(500).send("Database error finding user");
        return;
      });
  },
]);

router.get(
  "/verifyAdminJWT",
  loadAdminStatus,
  function (req: IAuthRequest, res: express.Response) {
    if (req.admin) {
      res.sendStatus(200);
    } else {
      res.status(403).json({ errors: ["User is not admin"] });
    }
  }
);

router.get(
  "/verifyUserJWT",
  isLoggedIn,
  function (_req: IAuthRequest, res: express.Response) {
    res.sendStatus(200);
  }
);

router.post("/signup", loadAdminStatus, [
  body("username", "Username must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  function (
    req: IAuthRequest,
    res: express.Response,
    _next: express.NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    if (!req.body.admin) {
      res.status(403).send("Only admins can create new accounts");
      return;
    }
    const parsedRes = LoginSchema.safeParse(req.body);
    if (!parsedRes.success) {
      res.status(400).send("Invalid response body");
      return;
    }
    const requestBody = parsedRes.data;

    Database.userRepository
      .findOne({
        username: requestBody.username,
      })
      .then(async (user) => {
        if (user) res.sendStatus(400).send("User already exists");
        else {
          const creationSuccessful = await createUser(
            requestBody.username,
            requestBody.password
          );
          if (creationSuccessful) res.sendStatus(200);
          else res.sendStatus(500);
        }
      })
      .catch((_err) => {
        res.sendStatus(500);
      });
  },
]);

function createUser(username: string, password: string) {
  const saltRounds = 10;
  return bcrypt
    .hash(password, saltRounds)
    .then((passwordHash) => {
      return Database.userRepository
        .findAll()
        .then(async (existingUsers) => {
          if (existingUsers.length !== 0) {
            logger.error(
              `Unable to create username: '${username}' already exists in database`
            );
            return false;
          }
          // become admin by manually editting database
          const newUser = new Users(username, passwordHash, false);
          Database.userRepository.persist(newUser);

          await Database.userRepository.flush();
          return true;
        })
        .catch((err) => {
          logger.error(err);
          return false;
        });
    })
    .catch((err) => {
      logger.error(err);
      return false;
    });
}

function processPassword(
  requestBody: LoginType,
  user: Loaded<Users, never>,
  res: express.Response
) {
  bcrypt.compare(
    requestBody.password,
    user.password,
    function (err, correctPW) {
      if (err) return res.status(500).send("Error validating password");
      else if (correctPW) {
        return createAndSendJWT(user.username, res);
      } else {
        res.status(401).send("Incorrect password");
      }
    }
  );
}

function createAndSendJWT(username: string, res: express.Response): void {
  jwt.sign(
    { username: username },
    TOKEN_SECRET,
    { expiresIn: "7d" },
    function (err, token) {
      if (err) return res.status(500).send("Error signing JWT");
      if (typeof token !== "string")
        return res.status(500).send("Token not string");
      const tokenResponse: JwtTokenType = { token };
      return res.json(tokenResponse);
    }
  );
}

interface IAuthRequest extends express.Request {
  // needs to be optional to allow use in place of Request as a parameter
  token?: string;
  username?: string;
  password?: string;
  admin?: boolean;
}

function verifyToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    addTokenToRequest(bearerHeader, req);
    next();
  } else {
    res.status(400).send("Invalid auth header");
  }
}

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
function addTokenToRequest(bearerHeader: string, req: express.Request) {
  // Split at the space
  const bearer = bearerHeader.split(" ");
  // Get token from array
  const bearerToken = bearer[1];
  // This is a dumb way to do add a property to request
  // but as far as I can tell this is necessary with typescript
  // req.token = x is not valid, even after a `req as IAuthRequest`
  (req as IAuthRequest).token = bearerToken;
}

interface jwtUsername extends jwt.JwtPayload {
  username: string;
}

function getUsername(
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.token) {
    return res.status(500).send("Token not passed correctly");
  }
  try {
    const decoded = jwt.verify(req.token, TOKEN_SECRET) as jwtUsername;
    if (decoded && decoded.username) {
      req.username = decoded.username;
      return next();
    } else return res.status(403).send("Token not setup correctly");
  } catch (error: unknown) {
    return next(error);
  }
}

function loadAdminStatus(
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    addTokenToRequest(bearerHeader, req);
    if (req.token) {
      const decoded = jwt.verify(req.token, TOKEN_SECRET) as jwtUsername;
      if (decoded && decoded.username) {
        Database.userRepository
          .findOne({
            username: req.body.username,
          })
          .then((user) => {
            if (!user || !user.admin) {
              req.admin = false;
              return next();
            }
            req.admin = true;
            return next();
          })
          .catch((_err) => {
            res.sendStatus(500);
          });
      }
    }
  } else {
    req.admin = false;
    next();
  }
}

export default router;
export { verifyToken, getUsername, isLoggedIn, loadAdminStatus };
export type { IAuthRequest };
