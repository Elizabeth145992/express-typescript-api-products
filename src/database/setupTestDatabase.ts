import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";

const setupTestDatabase = async () => {
  const dbName = process.env.DB_NAME;

  if (!dbName) {
    throw new Error("DB_NAME no está definido");
  }

  if (dbName !== "ecommerce_db_test") {
    throw new Error("Base de datos incorrecta");
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    await connection.query(`CREATE DATABASE \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    const schema = await readFile("src/database/schema.sql", "utf-8");

    await connection.query(schema);
  } finally {
    await connection.end();
  }
};

export default setupTestDatabase;
