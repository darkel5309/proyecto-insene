const { query } = require("../models/db");

// creamos la peticion para el formulario
const registrarCliente = async (req, res) => {

    // extraemos los datos recibidos del body
    const { idTrabajador, nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, correoContacto, fechaVisita, horaVisita, numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermoElectrico, tienePlacasTermicas, importeLuz, importeGas, observacionesContacto } = req.body;

    // iniciamos la transaccion
    await query('START TRANSACTION');

    try {
        // consultamos si el trabajador existe
        const existeTrabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);

        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El ID del trabajador no existe en la base de datos." });
        }

        // consultamos si ya existe un cliente con el telefono o correo introducidos
        const existeCliente = await query('SELECT * FROM cliente WHERE telefono = ? OR correo = ?', [telefonoContacto, correoContacto]);

        if (existeCliente.length > 0) {
            const existe = existeCliente[0];
            if (existe.telefono === telefonoContacto) {
                return res.status(400).json({ error: "Ya existe un cliente con ese teléfono" });
            }
            if (existe.correo === correoContacto) {
                return res.status(400).json({ error: "Ya existe un cliente con ese correo" });
            }
        }

        // insertamos el cliente
        const sqlCliente = 'INSERT INTO cliente (nombre, telefono, correo, observaciones_cliente) VALUES (?,?,?,?)';
        const resultadoCliente = await query(sqlCliente, [nombreContacto, telefonoContacto, correoContacto, observacionesContacto]);
        const idCliente = resultadoCliente.insertId;

        // insertamos el domicilio del cliente
        const sqlDomicilio = 'INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES (?, ?, ?, ?)';
        const resultadoDomicilio = await query(sqlDomicilio, [direccionContacto, localidadContacto, provinciaContacto, idCliente]);
        const idDomicilio = resultadoDomicilio.insertId;

        // insertamos la vivienda asociada a la direccion
        const sqlVivienda = 'INSERT INTO vivienda (n_personas, n_decisores, tiene_bombona, tiene_gas, tiene_termo_electrico, tiene_placas_termicas, id_domicilio) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const resultadoVivienda = await query(sqlVivienda, [numeroPersonas, numeroDecisores, tieneBombona, tieneGas, tieneTermoElectrico, tienePlacasTermicas, idDomicilio]);
        const idVivienda = resultadoVivienda.insertId;

        // insertamos los recibos de luz y gas asociados a la vivienda
        const sqlRecibo = 'INSERT INTO recibo (importe_luz, importe_gas, id_vivienda) VALUES (?, ?, ?)';
        await query(sqlRecibo, [importeLuz, importeGas, idVivienda]);

        // insertamos la fecha y hora de la visita
        const sqlVisita = 'INSERT INTO visita (fecha, hora, id_vivienda, id_trabajador) VALUES (?, ?, ?, ?)';
        await query(sqlVisita, [fechaVisita, horaVisita, idVivienda, idTrabajador]);

        // confirmamos la transaccion
        await query('COMMIT');

        res.status(200).json({
            message: "Cliente registrado correctamente", idVivienda: idVivienda
        });

    } catch (err) {
        // en caso de error revertimos la transaccion
        await query('ROLLBACK');
        console.error("Error durante la transacción:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

module.exports = { registrarCliente }