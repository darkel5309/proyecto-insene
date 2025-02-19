const { query } = require("../models/db");

const registrarVisita = async (req, res) => {
    const { idTrabajador, idCliente, fechaVisita, horaVisita, numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermoElectrico, tienePlacasTermicas, importeLuz, importeGas } = req.body;

    // iniciamos
    await query('START TRANSACTION');

    try {
        const existeTrabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El trabajador no existe" });
        }

        const existeContacto = await query('SELECT * FROM cliente WHERE id_cliente = ?', [idCliente]);
        if (existeContacto.length === 0) {
            return res.status(400).json({ error: "El contacto no existe" });
        }

        const sqlDomicilio = 'SELECT * FROM domicilio WHERE id_cliente = ?';
        const resultadoDomicilio = await query(sqlDomicilio, [idCliente]);

        if (resultadoDomicilio.length === 0) {
            return res.status(400).json({ error: "El cliente no tiene un domicilio registrado." });
        }

        const idDomicilio = resultadoDomicilio[0].id_domicilio;

        // insertamos la vivienda asociada al domicilio del cliente
        const sqlVivienda = 'INSERT INTO vivienda (n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const resultadoVivienda = await query(sqlVivienda, [numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermoElectrico, tienePlacasTermicas, idDomicilio]);
        const idVivienda = resultadoVivienda.insertId;

        // insertamos los recibos de luz y gas asociados a la vivienda
        const sqlRecibo = 'INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)';
        await query(sqlRecibo, [importeLuz, importeGas, idVivienda]);

        // insertamos la fecha y hora de la visita
        const sqlVisita = 'INSERT INTO visita (fecha, hora, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?)';
        await query(sqlVisita, [fechaVisita, horaVisita, idVivienda, idTrabajador]);

        // confirmamos
        await query('COMMIT');
        res.status(200).json({
            message: "Visita registrada correctamente", idVivienda: idVivienda
        });

    } catch (err) {
        // deshacemos cambios
        await query('ROLLBACK');
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

module.exports = { registrarVisita }