import express from "express";
import * as logger from "./logger.js";

const requestLogger = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  logger.log("Method:", req.method);
  logger.log("Path:  ", req.url);
  if (typeof req.body === "string")
    logger.log("Body:  ", !req.body ? "No body" : req.body);
  logger.log("---");
  next();
};

const unknownEndpoint = (
  _request: express.Request,
  response: express.Response
) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export { requestLogger, unknownEndpoint };
