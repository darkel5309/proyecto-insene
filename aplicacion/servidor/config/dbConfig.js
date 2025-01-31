require("dotenv").config();
const mysql = require("mysql");

// creamos la conexion con mysql workbench
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect(err => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err);
        process.exit(1);
    }
    console.log("Conexión establecida correctamente con la base de datos.");
});

module.exports = db;