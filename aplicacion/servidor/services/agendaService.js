import { query } from '../models/db.js';

export const crear = async (agenda) => {
    const { fechaInicio, fechaFin, idTrabajador, idVivienda, motivo, estado = 'Pendiente', descripcion = '', fechaAsignacion = new Date() } = agenda;

    const insertar = `
        INSERT INTO agenda (fecha_inicio_agenda, fecha_fin_agenda, id_trabajador, id_vivienda, motivo, estado, descripcion, fecha_asignacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const resultado = await query(insertar, [fechaInicio, fechaFin, idTrabajador, idVivienda, motivo, estado, descripcion, fechaAsignacion]);
    return {
        message: "Entrada en agenda creada correctamente",
        idAgenda: resultado.insertId
    };
};

export const obtenerTodas = async () => {
    const sql = `
        SELECT a.*, t.nombre AS nombre_trabajador, v.id_domicilio
        FROM agenda a
        LEFT JOIN trabajador t ON a.id_trabajador = t.id_trabajador
        LEFT JOIN vivienda v ON a.id_vivienda = v.id_vivienda
    `;
    const resultado = await query(sql);
    return resultado;
};

export const obtenerPorId = async (id) => {
    const sql = `SELECT * FROM agenda WHERE id_agenda = ?`;
    const resultado = await query(sql, [id]);
    return resultado;
};

export const actualizar = async (id, estado) => {
    const sql = `UPDATE agenda SET estado = ? WHERE id_agenda = ?`;
    await query(sql, [estado, id]);
    return { message: "Estado actualizado correctamente" };
};

export const eliminar = async (id) => {
    const sql = `DELETE FROM agenda WHERE id_agenda = ?`;
    await query(sql, [id]);
    return { message: "Agenda eliminada correctamente" };
};
