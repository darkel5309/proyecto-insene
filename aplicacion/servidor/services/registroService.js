import { query } from '../models/db.js';

export const crear = async (idTrabajador, descripcion) => {
  try {
    const result = await query(
      'INSERT INTO auditoria (id_trabajador, descripcion) VALUES (?, ?)',
      [idTrabajador, descripcion]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error al registrar operación:', error);
    return false;
  }
};

export const obtenerTodos = async () => {
  try {
    const registros = await query(`
      SELECT r.*, t.nombre
      FROM auditoria r
      LEFT JOIN trabajador t ON r.id_trabajador = t.id_trabajador
      ORDER BY r.fecha DESC
    `);
    return registros;
  } catch (error) {
    console.error('Error al obtener registros:', error);
    throw error;
  }
};