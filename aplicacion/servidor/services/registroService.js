import { query } from '../models/db.js';

export const crear = async (idTrabajador, descripcion) => {
    const sql = await query(`
        INSERT INTO auditoria (
            id_trabajador, 
            descripcion
        ) VALUES (?, ?)
    `, [idTrabajador, descripcion]
    );
    return sql.insertId;
};

export const obtenerTodos = async () => {
    const sql = await query(`
            SELECT 
                r.*, 
                t.nombre
            FROM auditoria r
            LEFT JOIN trabajador t ON r.id_trabajador = t.id_trabajador
            ORDER BY r.fecha DESC
    `);
    return sql;
};