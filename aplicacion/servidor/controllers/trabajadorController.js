const { query } = require("../models/db");
const bcrypt = require('bcrypt');

// creamos la peticion para el formulario
const registrarTrabajador = async (req, res) => {

    // extraemos los datos recibidos del body
    const { nombreTrabajador, contrasenaTrabajador, telefonoTrabajador, rolTrabajador } = req.body;

    // iniciamos la transaccion
    await query('START TRANSACTION');

    try {
        const comprobarTelefono = 'SELECT * FROM trabajador WHERE telefono = ?';
        const result = await query(comprobarTelefono, [telefonoTrabajador]);

        if (result.length > 0) {
            return res.status(400).json({ error: "El trabajador ya está registrado" });
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasenaTrabajador, 10);

        // insertamos el trabajador
        const sqlTrabajador = 'INSERT INTO trabajador (nombre, contrasena, telefono, rol) VALUES (?,?,?,?)';
        const resultadoTrabajador = await query(sqlTrabajador, [nombreTrabajador, contrasenaEncriptada, telefonoTrabajador, rolTrabajador]);
        const idTrabajador = resultadoTrabajador.insertId;

        // confirmamos la transaccion
        await query('COMMIT');

        res.status(200).json({
            message: "Trabajador registrado correctamente", idTrabajador: idTrabajador
        });

    } catch (err) {
        // en caso de error revertimos la transaccion
        await query('ROLLBACK');
        console.error("Error durante la transacción:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

const obtenerTrabajadoresSimplificado = async (req, res) => {
    try{
        const sql = 'SELECT id_trabajador, nombre, telefono, rol FROM trabajador';

        const resultado = await query(sql);

        if (resultado.length === 0) {
            return res.status(404).json({ error: 'No hay trabajadores registrados' });
        }
        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { registrarTrabajador, obtenerTrabajadoresSimplificado };