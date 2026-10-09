import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
import mysql from "mysql2/promise";

const teardownTestDatabase = async () => {
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
  });

  try {
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
  } finally {
    await connection.end();
  }
};

export default teardownTestDatabase;
