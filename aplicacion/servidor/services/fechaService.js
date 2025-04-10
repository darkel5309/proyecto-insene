import { query } from "../models/db.js";
import dayjs from "dayjs";

export const obtenerPorId = async (idCliente) => {
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