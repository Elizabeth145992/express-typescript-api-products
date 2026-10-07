import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
});

const dbName = process.env.DB_NAME;

if (!dbName) {
    throw new Error("DB_NAME no está definido");
}

await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
await connection.query(`USE \`${dbName}\``);

const schema = await readFile("src/database/schema.sql", "utf-8");

await connection.query(schema);