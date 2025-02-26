const { query } = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const iniciarSesion = async (req, res) => {
    const { idTrabajador, contrasena } = req.body;

    try {
        const comprobarTrabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (comprobarTrabajador.length === 0) {
            return res.status(400).json({ error: "El trabajador no existe" });
        }
        const informacionTrabajador = comprobarTrabajador[0];

        const comprobarContrasena = await bcrypt.compare(contrasena, informacionTrabajador.contrasena);
        if (!comprobarContrasena) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // generamos el JWT
        const token = jwt.sign(
            { id: informacionTrabajador.id_trabajador, rol: informacionTrabajador.rol },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // enviamos el token como cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 3600000),
        });

        res.json({
            success: true,
            tipoTrabajador: informacionTrabajador.rol,
        });

    } catch (err) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

const verificarSesion = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No hay ninguna sesión activa" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ id: decoded.id, rol: decoded.rol });
    } catch (err) {
        res.status(401).json({ error: "La sesión no es válida" });
    }
};

module.exports = { iniciarSesion, verificarSesion };
