const { query } = require("../models/db");

const registrarContacto = async (req, res) => {
    const { idTrabajador, nombre, direccion, localidad, provincia, telefono, correo, modoCaptacion, observaciones } = req.body;

    await query('START TRANSACTION');

    try {
        const existeTrabajador = await query('SELECT 1 FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El trabajador no existe" });
        }

        const existeCliente = await query('SELECT 1 FROM cliente WHERE telefono = ? OR correo = ?', [telefono, correo]);
        if (existeCliente.length > 0) {
            const existe = existeCliente[0];
            if (existe.telefono === telefono) {
                return res.status(400).json({ error: "Ya existe un contacto con ese teléfono" });
            }
            if (existe.correo === correo) {
                return res.status(400).json({ error: "Ya existe un contacto con ese correo" });
            }
        }

        // consultas
        const insertarContacto = 'INSERT INTO cliente (nombre, telefono, correo, modo_captacion, observaciones_cliente) VALUES (?,?,?,?,?)';
        const resultadoContacto = await query(insertarContacto, [nombre, telefono, correo, modoCaptacion, observaciones]);
        const idContacto = resultadoContacto.insertId;

        const insertarDomicilio = 'INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES (?, ?, ?, ?)';
        await query(insertarDomicilio, [direccion, localidad, provincia, idContacto]);

        await query('COMMIT');

        res.status(200).json({
            message: "Contacto registrado correctamente", idContacto: idContacto
        });

    } catch (err) {
        await query('ROLLBACK');
        res.status(500).json({ error: "Error al registrar el contacto" });
    }
};

const obtenerContacto = async (req, res) => {
    const { idContacto } = req.params;

    try {
        // consultas
        const obtenerDatosContacto = `SELECT c.id_cliente, c.nombre, c.telefono, c.correo, c.observaciones_cliente, d.direccion, d.localidad, d.provincia 
            FROM cliente c
            LEFT JOIN domicilio d ON c.id_cliente = d.id_cliente
            WHERE c.id_cliente = ?`;

        const resultadoDatosContacto = await query(obtenerDatosContacto, [idContacto]);

        if (resultadoDatosContacto.length === 0) {
            return res.status(404).json({ error: "Contacto no encontrado" });
        }
        res.status(200).json(resultadoDatosContacto[0]);

    } catch (err) {
        res.status(500).json({ error: "Error al obtener el contacto" });
    }
};

const obtenerContactosSimplificado = async (req, res) => {
    try {
        // consultas
        const obtenerContactos = `SELECT id_cliente, nombre, telefono FROM cliente`;
        const resultadoContactos = await query(obtenerContactos);

        if (resultadoContactos.length === 0) {
            return res.status(404).json({ error: "No hay contactos registrados" });
        }
        res.status(200).json(resultadoContactos);

    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { registrarContacto, obtenerContacto, obtenerContactosSimplificado };