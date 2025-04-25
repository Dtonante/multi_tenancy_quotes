import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { createMasterDatabase } from "./createMasterDB.js";

dotenv.config();
await createMasterDatabase();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

await db.authenticate();
console.log("🎉 Conectado a la DB master");

export default db;
