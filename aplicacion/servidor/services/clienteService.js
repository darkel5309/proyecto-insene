import { query } from "../models/db.js";
import dayjs from "dayjs";

export const crear = async (cliente) => {
    const { idTrabajador, nombre, direccion, localidad, provincia, telefono, correo, modoCaptacion, observaciones } = cliente;

    await query('START TRANSACTION');

    try {
        const existeTrabajador = await query('SELECT 1 FROM trabajador WHERE id_trabajador = ?', [idTrabajador]);
        if (existeTrabajador.length === 0) {
            throw new Error("El trabajador no existe");
        }

        const existeCliente = await query('SELECT telefono, correo FROM cliente WHERE telefono = ? OR correo = ?', [telefono, correo]);
        if (existeCliente.length > 0) {
            const existe = existeCliente[0];
            if (existe.telefono === telefono) {
                throw new Error("Ya existe un cliente con ese teléfono");
            }
            if (existe.correo === correo) {
                throw new Error("Ya existe un cliente con ese correo");
            }
        }

        const insertarCliente = 'INSERT INTO cliente (nombre, telefono, correo, modo_captacion, observaciones_cliente) VALUES (?,?,?,?,?)';
        const resultadoCliente = await query(insertarCliente, [nombre, telefono, correo, modoCaptacion, observaciones]);
        const idCliente = resultadoCliente.insertId;

        const insertarDomicilio = 'INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES (?, ?, ?, ?)';
        await query(insertarDomicilio, [direccion, localidad, provincia, idCliente]);

        await query('COMMIT');
        return { message: "Cliente registrado correctamente", idCliente };
    } catch (err) {
        await query('ROLLBACK');
        throw err;
    }
};

export const obtenerPorId = async (idCliente) => {
    const infoCliente = `
        SELECT 
            c.*, 
            d.direccion, d.localidad, d.provincia,
            v.estado_venta, v.id_trabajador, v.fecha_firma, v.forma_pago
        FROM 
            cliente c
        LEFT JOIN 
            domicilio d ON c.id_cliente = d.id_cliente
        LEFT JOIN 
            venta v ON c.id_cliente = v.id_cliente
        WHERE 
            c.id_cliente = ?`;
    const resultado = await query(infoCliente, [idCliente]);
    return resultado;
};

export const obtenerTodos = async () => {
    const obtenerClientes = `SELECT c.*, d.* FROM cliente c LEFT JOIN domicilio d ON c.id_cliente = d.id_cliente`;
    const resultado = await query(obtenerClientes);
    return resultado;
};

export const actualizar = async (idCliente, cliente) => {
    const {nombre, telefono, correo, dni, iban, modoCaptacion, observaciones, fechaAlta, direccion, localidad, provincia } = cliente;

    const comprobarCliente = 'SELECT 1 FROM cliente WHERE id_cliente = ?';
    const resultadoCliente = await query(comprobarCliente, [idCliente]);

    if (resultadoCliente.length === 0) {
        throw new Error('El cliente no existe');
    }

    const actualizarCliente = `
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

    await query(actualizarCliente, [nombre, telefono, correo, dni, iban, modoCaptacion, observaciones, fechaAlta, idCliente]);

    const actualizarDomicilio = `
        UPDATE domicilio SET 
            direccion = ?, 
            localidad = ?, 
            provincia = ?
        WHERE id_cliente = ?
    `;

    await query(actualizarDomicilio, [direccion, localidad, provincia, idCliente]);
};

export const eliminar = async (idCliente) => {
    await query('START TRANSACTION');
    
    try {
        const existeCliente = await query('SELECT 1 FROM cliente WHERE id_cliente = ?', [idCliente]);
        if (existeCliente.length === 0) {
            throw new Error("El cliente no existe");
        }

        const eliminarRecibos = 'DELETE FROM recibo WHERE id_vivienda IN (SELECT id_vivienda FROM vivienda WHERE id_domicilio IN (SELECT id_domicilio FROM domicilio WHERE id_cliente = ?))';
        await query(eliminarRecibos, [idCliente]);

        const eliminarVisitas = 'DELETE FROM visita WHERE id_vivienda IN (SELECT id_vivienda FROM vivienda WHERE id_domicilio IN (SELECT id_domicilio FROM domicilio WHERE id_cliente = ?))';
        await query(eliminarVisitas, [idCliente]);

        const eliminarInstalaciones = 'DELETE FROM instalacion WHERE id_venta IN (SELECT id_venta FROM venta WHERE id_cliente = ?)';
        await query(eliminarInstalaciones, [idCliente]);

        const eliminarViviendas = 'DELETE FROM vivienda WHERE id_domicilio IN (SELECT id_domicilio FROM domicilio WHERE id_cliente = ?)';
        await query(eliminarViviendas, [idCliente]);

        const eliminarSubvenciones = 'DELETE FROM subvencion WHERE id_cliente = ?';
        await query(eliminarSubvenciones, [idCliente]);

        const eliminarFinanciaciones = 'DELETE FROM financiacion WHERE id_cliente = ?';
        await query(eliminarFinanciaciones, [idCliente]);

        const eliminarVentas = 'DELETE FROM venta WHERE id_cliente = ?';
        await query(eliminarVentas, [idCliente]);

        const eliminarDomicilio = 'DELETE FROM domicilio WHERE id_cliente = ?';
        await query(eliminarDomicilio, [idCliente]);

        const eliminarCliente = 'DELETE FROM cliente WHERE id_cliente = ?';
        await query(eliminarCliente, [idCliente]);

        await query('COMMIT');

        return { message: "Cliente eliminado correctamente" };
    } catch (err) {
        await query('ROLLBACK');
        throw err;
    }
};

export const mostrarActualizaciones = async (idCliente) => {
    if (!idCliente || isNaN(idCliente)) {
        throw new Error('El ID del cliente debe ser un número válido');
    }

    const consultaActualizaciones = `
        SELECT fecha_alta AS fecha, 'alta_cliente' AS ultimas_actualizaciones FROM cliente WHERE id_cliente = ?
        UNION ALL
        SELECT fecha_subvencion AS fecha, 'subvencion' AS ultimas_actualizaciones FROM subvencion 
        JOIN cliente ON subvencion.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_subvencion IS NOT NULL
        UNION ALL
        SELECT fecha_firma AS fecha, 'firma_venta' AS ultimas_actualizaciones FROM venta 
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        UNION ALL
        SELECT fecha_legalizacion AS fecha, 'legalizacion_venta' AS ultimas_actualizaciones FROM venta 
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_legalizacion IS NOT NULL
        UNION ALL
        SELECT fecha_instalacion AS fecha, 'instalacion' AS ultimas_actualizaciones FROM instalacion
        JOIN venta ON instalacion.id_venta = venta.id_venta
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_instalacion IS NOT NULL
        UNION ALL
        SELECT fecha_terminada AS fecha, 'instalacion_terminada' AS ultimas_actualizaciones FROM instalacion
        JOIN venta ON instalacion.id_venta = venta.id_venta
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_terminada IS NOT NULL
        UNION ALL
        SELECT fecha_factura AS fecha, 'factura' AS ultimas_actualizaciones FROM factura
        JOIN venta ON factura.id_venta = venta.id_venta
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        UNION ALL
        SELECT TIMESTAMP(fecha, hora) AS fecha, 'visita' AS ultimas_actualizaciones FROM visita
        JOIN vivienda ON visita.id_vivienda = vivienda.id_vivienda
        JOIN domicilio ON vivienda.id_domicilio = domicilio.id_domicilio
        JOIN cliente ON domicilio.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        UNION ALL
        SELECT fecha_registro AS fecha, 'registro_visita' AS ultimas_actualizaciones FROM visita
        JOIN vivienda ON visita.id_vivienda = vivienda.id_vivienda
        JOIN domicilio ON vivienda.id_domicilio = domicilio.id_domicilio
        JOIN cliente ON domicilio.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        ORDER BY fecha DESC
    `;

    const params = Array(9).fill(idCliente);

    const resultados = await query(consultaActualizaciones, params);

    const resultadosFormateados = resultados.map(row => {
        if (row.fecha instanceof Date) {
            return {
                ...row,
                fecha: dayjs(row.fecha).format('DD/MM/YYYY HH:mm')
            };
        }
        return row;
    });

    return resultadosFormateados;
};