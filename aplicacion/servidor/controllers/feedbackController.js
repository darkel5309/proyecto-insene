const { query } = require("../models/db");

const registrarFeedback = async (req, res) => {
    const { idTrabajador, idContacto, fecha, hora, numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermo, tienePlacas, importeLuz, importeGas, resultado, oferta, observaciones } = req.body;

    await query('START TRANSACTION');

    try {
        const existeTrabajador = await query('SELECT 1 FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El trabajador no existe" });
        }

        const existeContacto = await query('SELECT 1 FROM cliente WHERE id_cliente = ?', [idContacto]);
        if (existeContacto.length === 0) {
            return res.status(400).json({ error: "El contacto no existe" });
        }

        // consultas
        const obtenerVivienda = 'SELECT id_vivienda FROM vivienda WHERE id_domicilio = ?';
        const resultadoVivienda = await query(obtenerVivienda, [idContacto]);

        let idVivienda;

        if (resultadoVivienda.length === 0) {
            const obtenerDomicilio = 'SELECT * FROM domicilio WHERE id_cliente = ?';
            const resultadoDomicilio = await query(obtenerDomicilio, [idContacto]);

            if (resultadoDomicilio.length === 0) {
                return res.status(400).json({ error: "El contacto no tiene un domicilio registrado." });
            }

            const idDomicilio = resultadoDomicilio[0].id_domicilio;

            const insertarVivienda = 'INSERT INTO vivienda (n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const resultadoVivienda = await query(insertarVivienda, [numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermo, tienePlacas, idDomicilio]);
            idVivienda = resultadoVivienda.insertId;

        } else {
            idVivienda = resultadoVivienda[0].id_vivienda;
        }

        const insertarRecibo = 'INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)';
        await query(insertarRecibo, [importeLuz, importeGas, idVivienda]);

        const insertarVisita = 'INSERT INTO visita (fecha, hora, resultado, oferta, observaciones_visita, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const resultadoVisita = await query(insertarVisita, [fecha, hora, resultado, oferta, observaciones, idVivienda, idTrabajador]);
        const idVisita = resultadoVisita.insertId;

        await query('COMMIT');
        res.status(200).json({ 
            message: "Feedback registrado correctamente", idVisita: idVisita 
        });

    } catch (err) {
        await query('ROLLBACK');
        res.status(500).json({ error: "Error al registrar el feedback" });
    }
};

module.exports = { registrarFeedback };
