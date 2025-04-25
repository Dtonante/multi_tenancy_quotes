import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export async function createMasterDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  console.log(`✅ DB master '${process.env.DB_NAME}' creada o existente.`);
  await connection.end();
}
