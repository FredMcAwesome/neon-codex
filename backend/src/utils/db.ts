import "dotenv/config";
import { Sequelize } from "sequelize";
import * as logger from "./logger.js";
import { DATABASE_URL } from "./config.js";

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.log("connected to the database");
  } catch (err) {
    logger.error("failed to connect to the database");
    logger.error(err);
    return process.exit(1);
  }

  return null;
};

export { connectToDatabase, sequelize };
