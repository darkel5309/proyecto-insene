require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
}).promise();

async function connectDB() {
    try {
        await db.query("SELECT 1");
        console.log("Conexión establecida correctamente con la base de datos.");
    } catch (err) {
        console.error("Error al conectar con la base de datos:", err.message);
        process.exit(1);
    }
}

connectDB();

module.exports = db;
