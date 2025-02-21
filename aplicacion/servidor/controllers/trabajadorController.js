const { query } = require("../models/db");
const bcrypt = require("bcrypt");

const registrarTrabajador = async (req, res) => {
    const { nombre, contrasena, telefono, rol, equipo, subequipo } = req.body;

    await query("START TRANSACTION");

    try {
        const comprobarTelefono = 'SELECT 1 FROM trabajador WHERE telefono = ?';
        const result = await query(comprobarTelefono, [telefono]);

        if (result.length > 0) {
            return res.status(400).json({ error: "El trabajador ya está registrado" });
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        // consultas
        const insertarTrabajador = 'INSERT INTO trabajador (nombre, contrasena, telefono, rol, equipo, subequipo) VALUES (?,?,?,?,?,?)';
        const resultadoTrabajador = await query(insertarTrabajador, [nombre, contrasenaEncriptada, telefono, rol, equipo, subequipo]);
        const idTrabajador = resultadoTrabajador.insertId;

        await query('COMMIT');

        res.status(200).json({
            message: "Trabajador registrado correctamente", idTrabajador: idTrabajador, nombreTrabajador: nombre
        });

    } catch (err) {
        await query('ROLLBACK');
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

const obtenerTrabajadoresSimplificado = async (_req, res) => {
    try {
        // consultas
        const obtenerTrabajadores = 'SELECT id_trabajador, nombre, telefono, rol FROM trabajador';
        const resultadoTrabajadores = await query(obtenerTrabajadores);

        if (resultadoTrabajadores.length === 0) {
            return res.status(404).json({ error: "No hay trabajadores registrados" });
        }
        res.status(200).json(resultadoTrabajadores);

    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { registrarTrabajador, obtenerTrabajadoresSimplificado };