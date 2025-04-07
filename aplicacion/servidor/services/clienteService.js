import { query } from "../models/db.js";

export const registrarCliente = async (cliente) => {
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

export const recuperarCliente = async (idCliente) => {
    try {
        const recuperarDatosCliente =
            `SELECT c.id_cliente, c.nombre, c.telefono, c.correo, d.direccion, d.localidad, d.provincia 
            FROM cliente c
            LEFT JOIN domicilio d ON c.id_cliente = d.id_cliente
            WHERE c.id_cliente = ?`;

        const resultado = await query(recuperarDatosCliente, [idCliente]);
        if (resultado.length === 0) {
            throw new Error("Cliente no encontrado");
        }
        return resultado[0];
    } catch (err) {
        throw err;
    }
};

export const obtenerClientesSimplificado = async () => {
    try {
        const obtenerClientes = 'SELECT id_cliente, nombre, telefono FROM cliente';
        const resultado = await query(obtenerClientes);
        if (resultado.length === 0) {
            throw new Error("No hay clientes registrados");
        }
        return resultado;
    } catch (err) {
        throw err;
    }
};

export const obtenerTodosClientes = async () => {
    const obtenerClientes = `SELECT c.*, d.* FROM cliente c lEFT JOIN domicilio d ON c.id_cliente = d.id_cliente`;
    const resultado = await query(obtenerClientes);
    return resultado;
};

export const obtenerInformacionCliente = async (idCliente) => {
    const infoCliente = `
        SELECT 
            c.*, 
            d.direccion, 
            d.localidad, 
            d.provincia,
            v.estado_venta, 
            v.id_trabajador, 
            v.fecha_firma,
            v.forma_pago
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

export const mostrarActualizaciones = async (idCliente) => {
    if (!idCliente || isNaN(idCliente)) {
        throw new Error('El ID del cliente debe ser un número válido');
    }

    const consultaActualizaciones = `
        SELECT fecha_alta AS fecha, 'fecha_alta_cliente' AS ultimas_actualizaciones FROM cliente WHERE id_cliente = ?
        UNION ALL
        SELECT fecha_subvencion AS fecha, 'fecha_subvencion' AS ultimas_actualizaciones FROM subvencion 
        JOIN cliente ON subvencion.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_subvencion IS NOT NULL
        UNION ALL
        SELECT fecha_firma AS fecha, 'fecha_firma_venta' AS ultimas_actualizaciones FROM venta 
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        UNION ALL
        SELECT fecha_legalizacion AS fecha, 'fecha_legalizacion_venta' AS ultimas_actualizaciones FROM venta 
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_legalizacion IS NOT NULL
        UNION ALL
        SELECT fecha_instalacion AS fecha, 'fecha_instalacion' AS ultimas_actualizaciones FROM instalacion
        JOIN venta ON instalacion.id_venta = venta.id_venta
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_instalacion IS NOT NULL
        UNION ALL
        SELECT fecha_terminada AS fecha, 'fecha_instalacion_terminada' AS ultimas_actualizaciones FROM instalacion
        JOIN venta ON instalacion.id_venta = venta.id_venta
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ? AND fecha_terminada IS NOT NULL
        UNION ALL
        SELECT fecha_factura AS fecha, 'fecha_factura' AS ultimas_actualizaciones FROM factura
        JOIN venta ON factura.id_venta = venta.id_venta
        JOIN cliente ON venta.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        UNION ALL
        SELECT fecha AS fecha, 'fecha_visita' AS ultimas_actualizaciones FROM visita
        JOIN vivienda ON visita.id_vivienda = vivienda.id_vivienda
        JOIN domicilio ON vivienda.id_domicilio = domicilio.id_domicilio
        JOIN cliente ON domicilio.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        UNION ALL
        SELECT fecha_registro AS fecha, 'fecha_registro_visita' AS ultimas_actualizaciones FROM visita
        JOIN vivienda ON visita.id_vivienda = vivienda.id_vivienda
        JOIN domicilio ON vivienda.id_domicilio = domicilio.id_domicilio
        JOIN cliente ON domicilio.id_cliente = cliente.id_cliente WHERE cliente.id_cliente = ?
        ORDER BY fecha DESC
    `;

    try {
        const params = Array(9).fill(idCliente);

        const resultados = await query(consultaActualizaciones, params);

        const resultadosFormateados = resultados.map(row => {
            if (row.fecha instanceof Date) {
                return {
                    ...row,
                    fecha: row.fecha.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                };
            }
            return row;
        });

        return resultadosFormateados;
    } catch (err) {
        throw err;
    }
};
