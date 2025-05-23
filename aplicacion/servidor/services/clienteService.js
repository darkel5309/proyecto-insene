import { query } from "../models/db.js";

export const crear = async (cliente) => {
    const {
        idTrabajador,
        nombre,
        direccion,
        localidad,
        provincia,
        telefono,
        correo,
        modoCaptacion,
        observaciones
    } = cliente;

    await query("START TRANSACTION");

    try {
        const existeTrabajador = await query(
            "SELECT 1 FROM trabajador WHERE id_trabajador = ?",
            [idTrabajador]
        );

        if (existeTrabajador.length === 0) {
            throw new Error("El trabajador no existe");
        }

        const existeCliente = await query(
            "SELECT telefono, correo FROM cliente WHERE telefono = ? OR correo = ?",
            [telefono, correo]
        );

        if (existeCliente.length > 0) {
            const { telefono: tel, correo: mail } = existeCliente[0];
            if (tel === telefono) {
                throw new Error("Ya existe un cliente con ese teléfono");
            }
            if (mail === correo) {
                throw new Error("Ya existe un cliente con ese correo");
            }
        }

        const sqlInsertarCliente = `
            INSERT INTO cliente (
                nombre, 
                telefono, 
                correo, 
                modo_captacion, 
                observaciones_cliente
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const resultadoCliente = await query(sqlInsertarCliente, [
            nombre,
            telefono,
            correo,
            modoCaptacion,
            observaciones
        ]);

        const idCliente = resultadoCliente.insertId;

        const sqlInsertarDomicilio = `
            INSERT INTO domicilio (
                direccion,
                localidad, 
                provincia, 
                id_cliente
            ) VALUES (?, ?, ?, ?)
        `;

        await query(sqlInsertarDomicilio, [
            direccion,
            localidad,
            provincia,
            idCliente
        ]);

        await query("COMMIT");
        return { message: "Cliente registrado correctamente", idCliente };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

export const obtenerPorId = async (idCliente) => {
    const sql = `
        SELECT 
            c.*,
            d.direccion, 
            d.localidad, 
            d.provincia,
            v.estado_venta, 
            v.id_trabajador, 
            v.fecha_firma, 
            v.forma_pago
        FROM cliente c
        LEFT JOIN domicilio d ON c.id_cliente = d.id_cliente
        LEFT JOIN venta v ON c.id_cliente = v.id_cliente
        WHERE c.id_cliente = ?
    `;

    const resultado = await query(sql, [idCliente]);
    return resultado[0];
};

export const obtenerTodos = async () => {
    const sql = `
        SELECT 
            c.*,
            d.*
        FROM cliente c 
        LEFT JOIN domicilio d ON c.id_cliente = d.id_cliente
        ORDER BY c.id_cliente DESC
    `;

    const resultado = await query(sql);
    return resultado;
};

export const actualizar = async (idCliente, cliente) => {
    const {
        nombre,
        telefono,
        correo,
        dni,
        iban,
        modoCaptacion,
        observaciones,
        fechaAlta,
        direccion,
        localidad,
        provincia
    } = cliente;

    const comprobarCliente = `
        SELECT 1 
        FROM cliente 
        WHERE id_cliente = ?
    `;

    const resultado = await query(comprobarCliente, [idCliente]);

    if (resultado.length === 0) {
        throw new Error("El cliente no existe");
    }

    const sqlActualizarCliente = `
        UPDATE cliente SET 
            nombre = ?, 
            telefono = ?, 
            correo = ?, 
            dni = ?, 
            iban = ?, 
            modo_captacion = ?, 
            observaciones_cliente = ?, 
            fecha_alta = ?
        WHERE id_cliente = ?
    `;

    await query(sqlActualizarCliente, [
        nombre,
        telefono,
        correo,
        dni,
        iban,
        modoCaptacion,
        observaciones,
        fechaAlta,
        idCliente
    ]);

    const sqlActualizarDomicilio = `
        UPDATE domicilio SET 
            direccion = ?, 
            localidad = ?, 
            provincia = ?
        WHERE id_cliente = ?
    `;

    await query(sqlActualizarDomicilio, [
        direccion,
        localidad,
        provincia,
        idCliente
    ]);
};

export const eliminar = async (idCliente) => {
    await query("START TRANSACTION");

    try {
        const existeCliente = await query(
            "SELECT 1 FROM cliente WHERE id_cliente = ?",
            [idCliente]
        );

        if (existeCliente.length === 0) {
            throw new Error("El cliente no existe");
        }

        await query(
            "DELETE FROM recibo WHERE id_vivienda IN (SELECT id_vivienda FROM vivienda WHERE id_domicilio IN (SELECT id_domicilio FROM domicilio WHERE id_cliente = ?))",
            [idCliente]
        );

        await query(
            "DELETE FROM visita WHERE id_vivienda IN (SELECT id_vivienda FROM vivienda WHERE id_domicilio IN (SELECT id_domicilio FROM domicilio WHERE id_cliente = ?))",
            [idCliente]
        );

        await query(
            "DELETE FROM instalacion WHERE id_venta IN (SELECT id_venta FROM venta WHERE id_cliente = ?)",
            [idCliente]
        );

        await query(
            "DELETE FROM vivienda WHERE id_domicilio IN (SELECT id_domicilio FROM domicilio WHERE id_cliente = ?)",
            [idCliente]
        );

        await query(
            "DELETE FROM subvencion WHERE id_cliente = ?",
            [idCliente]
        );

        await query(
            "DELETE FROM financiacion WHERE id_cliente = ?",
            [idCliente]
        );

        await query(
            "DELETE FROM venta WHERE id_cliente = ?",
            [idCliente]
        );

        await query(
            "DELETE FROM domicilio WHERE id_cliente = ?",
            [idCliente]
        );

        await query(
            "DELETE FROM cliente WHERE id_cliente = ?",
            [idCliente]
        );

        await query("COMMIT");

        return { message: "Cliente eliminado correctamente" };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};