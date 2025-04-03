const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../models/db");

const verificarTrabajadorYContrasena = async (idTrabajador, contrasena) => {
    const trabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);

    if (trabajador.length === 0) {
        return null;
    }

    const contrasenaValida = await bcrypt.compare(contrasena, trabajador[0].contrasena);
    
    if (!contrasenaValida) {
        return null;
    }

    return trabajador[0];
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

module.exports = { verificarTrabajadorYContrasena, generarToken, verificarToken };
