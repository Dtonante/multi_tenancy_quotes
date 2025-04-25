import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export function getTenantConnection(dbName) {
  return new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  });
}
