import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecommerce_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;

/*
createPool() → crea el conjunto de conexiones.
connectionLimit: 10 → permite hasta 10 conexiones simultáneas en este pool.
waitForConnections: true → si todas están ocupadas, una solicitud puede esperar a que haya una disponible.
queueLimit: 0 → no ponemos un límite explícito a las solicitudes que esperan.
*/