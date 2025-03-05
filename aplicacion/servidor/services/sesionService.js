const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../models/db");

const verificarTrabajador = async (idTrabajador) => {
    const trabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
    return trabajador.length > 0 ? trabajador[0] : null;
};

const comprobarContrasena = async (contrasena, contrasenaHash) => {
    return bcrypt.compare(contrasena, contrasenaHash);
};

const generarToken = (idTrabajador, rol) => {
    return jwt.sign(
        { id: idTrabajador, rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const verificarToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { verificarTrabajador, comprobarContrasena, generarToken, verificarToken };
