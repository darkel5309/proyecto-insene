import { query } from "../models/db.js";

export const crear = async (venta) => {
    const {
        id_trabajador,
        id_cliente,
        fecha_firma,
        forma_pago,
        certificado_energetico,
        gestion_subvencion,
        gestion_legalizacion,
        fecha_legalizacion,
        estado_venta
    } = venta;

    const insertarVenta = `
        INSERT INTO venta (
            id_trabajador, 
            id_cliente, 
            fecha_firma, 
            forma_pago,
            certificado_energetico, 
            gestion_subvencion, 
            gestion_legalizacion,
            fecha_legalizacion, 
            estado_venta
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const resultado = await query(insertarVenta, [
        id_trabajador,
        id_cliente,
        fecha_firma,
        forma_pago,
        certificado_energetico,
        gestion_subvencion,
        gestion_legalizacion,
        fecha_legalizacion,
        estado_venta
    ]);

    return {
        message: "Venta registrada correctamente",
        id_venta: resultado.insertId
    };
};

export const obtenerTodos = async () => {
    const sql = `
        SELECT
            v.id_venta,
            v.fecha_firma,
            v.forma_pago,
            v.certificado_energetico,
            v.gestion_subvencion,
            v.gestion_legalizacion,
            v.fecha_legalizacion,
            v.estado_venta,
            c.nombre AS nombre_cliente,
            t.nombre AS nombre_trabajador
        FROM venta v
        JOIN cliente c ON v.id_cliente = c.id_cliente
        JOIN trabajador t ON v.id_trabajador = t.id_trabajador
        ORDER BY v.id_venta DESC
    `;

    return await query(sql);
};

export const obtenerPorId = async (id) => {
    const sql = `
        SELECT
            v.id_venta,
            v.id_trabajador,
            v.id_cliente,
            v.fecha_firma,
            v.forma_pago,
            v.certificado_energetico,
            v.gestion_subvencion,
            v.gestion_legalizacion,
            v.fecha_legalizacion,
            v.estado_venta,
            c.nombre AS nombre_cliente,
            t.nombre AS nombre_trabajador
        FROM venta v
        JOIN cliente c ON v.id_cliente = c.id_cliente
        JOIN trabajador t ON v.id_trabajador = t.id_trabajador
        WHERE v.id_venta = ?
    `;

    const resultado = await query(sql, [id]);

    if (resultado.length === 0) {
        throw new Error("Venta no encontrada");
    }

    return resultado[0];
};

export const actualizar = async (id, venta) => {
    const {
        id_trabajador,
        id_cliente,
        fecha_firma,
        forma_pago,
        certificado_energetico,
        gestion_subvencion,
        gestion_legalizacion,
        fecha_legalizacion,
        estado_venta
    } = venta;

    const sql = `
        UPDATE venta
        SET 
            id_trabajador = ?, 
            id_cliente = ?, 
            fecha_firma = ?, 
            forma_pago = ?,
            certificado_energetico = ?, 
            gestion_subvencion = ?, 
            gestion_legalizacion = ?,
            fecha_legalizacion = ?, 
            estado_venta = ?
        WHERE id_venta = ?
    `;

    await query(sql, [
        id_trabajador,
        id_cliente,
        fecha_firma,
        forma_pago,
        certificado_energetico,
        gestion_subvencion,
        gestion_legalizacion,
        fecha_legalizacion,
        estado_venta,
        id
    ]);

    return { message: "Venta actualizada correctamente" };
};

export const eliminar = async (id) => {
    await query("DELETE FROM instalacion WHERE id_venta = ?", [id]);
    await query("DELETE FROM venta WHERE id_venta = ?", [id]);

    return { message: "Venta eliminada correctamente" };
};