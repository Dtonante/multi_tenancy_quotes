import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASS } = process.env;

export async function createDatabaseTenant(dbName) {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log(`📁 Base de datos '${dbName}' creada o ya existe.`);
  await connection.end();
}
