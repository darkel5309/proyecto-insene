const { query } = require("../models/db");

// creamos la peticion para el feedback
const registrarFeedback = async (req, res) => {
    const { idTrabajador, idVivienda, fechaVisita, horaVisita, tipoVisita, resultadoVisita, oferta, observacionesVisita } = req.body;

    // iniciamos la transaccion
    await query('START TRANSACTION');

    try {
        // verificamos si el trabajador existe
        const existeTrabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El ID del trabajador no existe en la base de datos." });
        }

        // verificamos si la visita existe
        const existeVivienda = await query('SELECT * FROM vivienda WHERE id_vivienda = ?', [idVivienda]);
        if (existeVivienda.length === 0) {
            return res.status(400).json({ error: "El Código del Formulario no existe en la base de datos" });
        }

        // creacion de la nueva visita
        const sqlVisita = 'INSERT INTO visita (fecha, hora, tipo, resultado, oferta, observaciones_visita, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await query(sqlVisita, [fechaVisita, horaVisita, tipoVisita, resultadoVisita, oferta, observacionesVisita, idVivienda, idTrabajador]);

        // confirmamos la transacción
        await query('COMMIT');
        res.status(200).json({ message: "Feedback creado correctamente" });

    } catch (err) {
        // en caso de error revertimos la transaccion
        await query('ROLLBACK');
        console.error("Error al procesar la solicitud:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

module.exports = { registrarFeedback };