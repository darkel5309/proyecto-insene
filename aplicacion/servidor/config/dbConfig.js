import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: 'utf8mb4',
    connectionLimit: 10,
}).promise();

export async function connectDB() {
    try {
        await db.query("SELECT 1");
        console.log("Conexión establecida correctamente con la base de datos.");
    } catch (err) {
        console.error("Error al conectar con la base de datos:", err.message);
        process.exit(1);
    }
}

connectDB();

export default db;
