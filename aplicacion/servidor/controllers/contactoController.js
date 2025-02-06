const { query } = require("../models/db");

// creamos la peticion para el formulario
const registrarContacto = async (req, res) => {

    // extraemos los datos recibidos del body
    const { idTrabajador, nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, correoContacto, observacionesContacto } = req.body;

    // iniciamos la transaccion
    await query('START TRANSACTION');

    try {
        // consultamos si el trabajador existe
        const existeTrabajador = await query('SELECT * FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);

        if (existeTrabajador.length === 0) {
            return res.status(400).json({ error: "El ID del trabajador no existe en la base de datos" });
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
        await query(sqlDomicilio, [direccionContacto, localidadContacto, provinciaContacto, idCliente]);

        // confirmamos la transaccion
        await query('COMMIT');

        res.status(200).json({
            message: "Contacto registrado correctamente", idCliente: idCliente
        });

    } catch (err) {
        // en caso de error revertimos la transaccion
        await query('ROLLBACK');
        console.error("Error durante la transacción:", err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};

module.exports = { registrarContacto }