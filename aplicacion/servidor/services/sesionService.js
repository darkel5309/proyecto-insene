import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../models/db.js";

export const verificarTrabajadorYContrasena = async (idTrabajador, contrasena) => {
    const trabajador = await query(`
        SELECT * 
        FROM trabajador 
        WHERE id_trabajador = ?
    `, [idTrabajador]);

    if (trabajador.length === 0) {
        return null;
    }

    const contrasenaValida = await bcrypt.compare(contrasena, trabajador[0].contrasena);

    if (!contrasenaValida) {
        return null;
    }

    return trabajador[0];
};

export const generarToken = (idTrabajador, puesto) => {
    return jwt.sign(
        { id: idTrabajador, puesto },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

export const verificarToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};
