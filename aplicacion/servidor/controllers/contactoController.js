const { query } = require("../models/db");

const registrarContacto = async (req, res) => {
    const { idTrabajador, nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, correoContacto, modoCaptacion, observacionesContacto } = req.body;

    // iniciamos la transaccion
    await query('START TRANSACTION');

    try {
        const existeTrabajador = await query('SELECT 1 FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El trabajador no existe" });
        }

        const existeCliente = await query('SELECT 1 FROM cliente WHERE telefono = ? OR correo = ?', [telefonoContacto, correoContacto]);

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
        const sqlCliente = 'INSERT INTO cliente (nombre, telefono, correo, modo_captacion, observaciones_cliente) VALUES (?,?,?,?,?)';
        const resultadoCliente = await query(sqlCliente, [nombreContacto, telefonoContacto, correoContacto, modoCaptacion, observacionesContacto]);
        const idCliente = resultadoCliente.insertId;

        // insertamos el domicilio del cliente
        const sqlDomicilio = 'INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES (?, ?, ?, ?)';
        await query(sqlDomicilio, [direccionContacto, localidadContacto, provinciaContacto, idCliente]);

        // confirmamos
        await query('COMMIT');

        res.status(200).json({
            message: "Contacto registrado correctamente", idCliente: idCliente
        });

    } catch (err) {
        // deshacemos cambios
        await query('ROLLBACK');
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

const obtenerContacto = async (req, res) => {
    const { idCliente } = req.params;

    try {
        const sql = `SELECT c.id_cliente, c.nombre, c.telefono, c.correo, c.observaciones_cliente, d.direccion, d.localidad, d.provincia 
            FROM cliente c
            LEFT JOIN domicilio d ON c.id_cliente = d.id_cliente
            WHERE c.id_cliente = ?`;

        const resultado = await query(sql, [idCliente]);

        if (resultado.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.status(200).json(resultado[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerContactosSimplificado = async (req, res) => {
    try {
        const sql = `SELECT id_cliente, nombre, telefono FROM cliente`;
        const resultado = await query(sql);

        if (resultado.length === 0) {
            return res.status(404).json({ error: 'No hay clientes registrados' });
        }

        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { registrarContacto, obtenerContacto, obtenerContactosSimplificado };