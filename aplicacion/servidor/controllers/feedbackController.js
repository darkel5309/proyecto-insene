const { query } = require("../models/db");

const registrarFeedback = async (req, res) => {
    const { idTrabajador, idVivienda, fechaVisita, horaVisita, tipoVisita, resultadoVisita, oferta, observacionesVisita } = req.body;

    // iniciamos
    await query('START TRANSACTION');

    try {
        const existeTrabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El trabajador no existe" });
        }

        const existeVivienda = await query('SELECT * FROM vivienda WHERE id_vivienda = ?', [idVivienda]);
        if (existeVivienda.length === 0) {
            return res.status(400).json({ error: "El Código del Formulario no existe en la base de datos" });
        }

        // insertamos el feedback
        const sqlVisita = 'INSERT INTO visita (fecha, hora, tipo, resultado, oferta, observaciones_visita, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await query(sqlVisita, [fechaVisita, horaVisita, tipoVisita, resultadoVisita, oferta, observacionesVisita, idVivienda, idTrabajador]);

        // confirmamos
        await query('COMMIT');
        res.status(200).json({ message: "Feedback creado correctamente" });

    } catch (err) {
        // deshacemos cambios
        await query('ROLLBACK');
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

module.exports = { registrarFeedback };