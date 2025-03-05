const { query } = require("../models/db");
const bcrypt = require("bcrypt");

const registrarTrabajador = async (trabajador) => {
    const { nombre, contrasena, telefono, rol, equipo, subequipo } = trabajador;

    await query('START TRANSACTION');

    try {
        const comprobarTelefono = 'SELECT 1 FROM trabajador WHERE telefono = ?';
        const resultadoTelefono = await query(comprobarTelefono, [telefono]);
        if (resultadoTelefono.length > 0) {
            throw new Error('El trabajador ya está registrado');
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        const insertarTrabajador = 'INSERT INTO trabajador (nombre, contrasena, telefono, rol, equipo, subequipo) VALUES (?,?,?,?,?,?)';
        const resultadoTrabajador = await query(insertarTrabajador, [nombre, contrasenaEncriptada, telefono, rol, equipo, subequipo]);
        const idTrabajador = resultadoTrabajador.insertId;

        await query('COMMIT');
        return { message: "Trabajador registrado correctamente", idTrabajador, nombreTrabajador: nombre };
    } catch (err) {
        await query('ROLLBACK');
        throw err;
    }
};

const obtenerTrabajadoresSimplificado = async () => {
    try {
        const obtenerTrabajadores = 'SELECT id_trabajador, nombre, telefono, rol FROM trabajador';
        const resultado = await query(obtenerTrabajadores);
        if (resultado.length === 0) {
            throw new Error("No hay trabajadores registrados");
        }
        return resultado;
    } catch (err) {
        throw err;
    }
};

module.exports = { registrarTrabajador, obtenerTrabajadoresSimplificado };
