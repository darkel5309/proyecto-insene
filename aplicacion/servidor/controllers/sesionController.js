const { query } = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const iniciarSesion = async (req, res) => {
    const { idTrabajador, contrasena } = req.body;

    try {
        // Consultamos si el trabajador existe
        const trabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);

        if (trabajador.length === 0) {
            return res.status(400).json({ error: "El código de trabajador no existe" });
        }

        // Obtenemos la información del trabajador
        const trabajadorInfo = trabajador[0];

        // Comprobamos si la contraseña es válida
        const esValida = await bcrypt.compare(contrasena, trabajadorInfo.contrasena); // Usamos bcrypt para comparar la contraseña cifrada
        if (!esValida) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generamos el JWT
        const token = jwt.sign(
            { id: trabajadorInfo.id_trabajador, rol: trabajadorInfo.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Expiración de 1 hora
        );

        // Enviamos el token como cookie
        res.cookie('token', token, {
            httpOnly: true,  // No accesible desde JavaScript
            secure: process.env.NODE_ENV === 'production', // Solo se envía a través de HTTPS en producción
            sameSite: 'Strict', // Protección contra CSRF
            expires: new Date(Date.now() + 3600000), // Expira en 1 hora
        });

        // Respondemos con el tipo de trabajador
        res.json({
            success: true,
            tipoTrabajador: trabajadorInfo.rol,
        });

    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

const verificarSesion = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'No hay sesión activa' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ id: decoded.id, rol: decoded.rol });
    } catch (err) {
        res.status(401).json({ error: 'Sesión no válida' });
    }
};

module.exports = { iniciarSesion, verificarSesion };
