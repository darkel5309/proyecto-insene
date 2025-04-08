import { query } from "../models/db.js";
import bcrypt from "bcrypt";

export const crear = async (trabajador) => {
    const { nombre, contrasena, telefono, rol, equipo, subequipo } = trabajador;

    await query('START TRANSACTION');

    try {
        const comprobarTelefono = 'SELECT 1 FROM trabajador WHERE telefono = ?';
        const resultadoTelefono = await query(comprobarTelefono, [telefono]);
        if (resultadoTelefono.length > 0) {
            throw new Error('El trabajador ya está registrado');
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        const insertarTrabajador = 'INSERT INTO trabajador (nombre, contrasena, telefono, rol, equipo, subequipo) VALUES (?,?,?,?,?,?)';
        const resultadoTrabajador = await query(insertarTrabajador, [nombre, contrasenaEncriptada, telefono, rol, equipo, subequipo]);
        const idTrabajador = resultadoTrabajador.insertId;

        await query('COMMIT');
        return { message: "Trabajador registrado correctamente", idTrabajador, nombreTrabajador: nombre };
    } catch (err) {
        await query('ROLLBACK');
        throw err;
    }
};

export const obtenerPorId = async (id) => {
    const obtenerTrabajador = `
        SELECT id_trabajador, nombre, telefono, rol, equipo, subequipo, fecha_alta, fecha_baja
        FROM trabajador
        WHERE id_trabajador = ?
`;
    const resultado = await query(obtenerTrabajador, [id]);

    if (resultado.length === 0) {
        throw new Error("Trabajador no encontrado");
    }
    return resultado[0];
};

export const actualizar = async (id, trabajador) => {
    const { nombre, contrasena, telefono, rol, equipo, subequipo } = trabajador;

    const comprobarTrabajador = 'SELECT 1 FROM trabajador WHERE id_trabajador = ?';
    const resultadoTrabajador = await query(comprobarTrabajador, [id]);
    if (resultadoTrabajador.length === 0) {
        throw new Error('El trabajador no existe');
    }

    let nuevaContrasena = null;
    if (contrasena && contrasena !== "") {
        nuevaContrasena = await bcrypt.hash(contrasena, 10);
    }

    const actualizarTrabajador = 'UPDATE trabajador SET nombre = ?, contrasena = COALESCE(?, contrasena), telefono = ?, rol = ?, equipo = ?, subequipo = ? WHERE id_trabajador = ?';
    await query(actualizarTrabajador, [nombre, nuevaContrasena, telefono, rol, equipo, subequipo, id]);

    return { message: "Trabajador actualizado correctamente" };
};

export const eliminar = async (id) => {
    const comprobarTrabajador = 'SELECT 1 FROM trabajador WHERE id_trabajador = ?';
    const resultadoTrabajador = await query(comprobarTrabajador, [id]);

    if (resultadoTrabajador.length === 0) {
        throw new Error('El trabajador no existe');
    }

    const eliminarTrabajador = 'DELETE FROM trabajador WHERE id_trabajador = ?';
    await query(eliminarTrabajador, [id]);

    return { message: "Trabajador eliminado correctamente" };
};

export const obtenerTodos = async () => {
    const obtenerTrabajadores = `
        SELECT id_trabajador, nombre, telefono, rol, equipo, subequipo, fecha_alta, fecha_baja
        FROM trabajador
    `;
    const resultado = await query(obtenerTrabajadores);
    if (resultado.length === 0) {
        throw new Error("No hay trabajadores registrados");
    }
    return resultado;
};