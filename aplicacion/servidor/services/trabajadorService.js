import { query } from "../models/db.js";
import bcrypt from "bcrypt";

export const crear = async (trabajador) => {
    const { nombre, contrasena, telefono, puesto, departamento, equipo } = trabajador;

    await query('START TRANSACTION');

    try {
        const comprobarTelefono = 'SELECT 1 FROM trabajador WHERE telefono = ?';
        const resultadoTelefono = await query(comprobarTelefono, [telefono]);
        if (resultadoTelefono.length > 0) {
            throw new Error('El trabajador ya está registrado');
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        const insertarTrabajador = 'INSERT INTO trabajador (nombre, contrasena, telefono, puesto, departamento, equipo) VALUES (?,?,?,?,?,?)';
        const resultadoTrabajador = await query(insertarTrabajador, [nombre, contrasenaEncriptada, telefono, puesto, departamento, equipo]);
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
        SELECT id_trabajador, nombre, telefono, puesto, departamento, equipo, fecha_alta, fecha_baja
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
    const { nombre, contrasena, telefono, puesto, departamento, equipo, fechaAlta, fechaBaja } = trabajador;

    const comprobarTrabajador = 'SELECT 1 FROM trabajador WHERE id_trabajador = ?';
    const resultadoTrabajador = await query(comprobarTrabajador, [id]);
    if (resultadoTrabajador.length === 0) {
        throw new Error('El trabajador no existe');
    }

    let nuevaContrasena = null;
    if (contrasena && contrasena !== "") {
        nuevaContrasena = await bcrypt.hash(contrasena, 10);
    }

    const actualizarTrabajador = 'UPDATE trabajador SET nombre = ?, contrasena = COALESCE(?, contrasena), telefono = ?, puesto = ?, departamento = ?, equipo = ?, fecha_alta = ?, fecha_baja = ? WHERE id_trabajador = ?';
    await query(actualizarTrabajador, [nombre, nuevaContrasena, telefono, puesto, departamento, equipo, fechaAlta, fechaBaja, id]);

    return { message: "Trabajador actualizado correctamente" };
};

export const eliminar = async (id) => {
    await query('START TRANSACTION');

    try {
        const comprobarTrabajador = 'SELECT 1 FROM trabajador WHERE id_trabajador = ?';
        const resultadoTrabajador = await query(comprobarTrabajador, [id]);

        if (resultadoTrabajador.length === 0) {
            throw new Error('El trabajador no existe');
        }

        const eliminarAgenda = 'DELETE FROM agenda WHERE id_trabajador = ?';
        await query(eliminarAgenda, [id]);

        const eliminarInstalaciones = 'DELETE FROM instalacion WHERE id_trabajador = ?';
        await query(eliminarInstalaciones, [id]);

        const eliminarVentas = 'DELETE FROM venta WHERE id_trabajador = ?';
        await query(eliminarVentas, [id]);

        const eliminarVisitas = 'DELETE FROM visita WHERE id_trabajador = ?';
        await query(eliminarVisitas, [id]);

        const eliminarTrabajador = 'DELETE FROM trabajador WHERE id_trabajador = ?';
        await query(eliminarTrabajador, [id]);

        await query('COMMIT');
        return { message: "Trabajador y todos los datos relacionados eliminados correctamente" };
    } catch (err) {
        await query('ROLLBACK');
        throw err;
    }
};


export const obtenerTodos = async () => {
    const obtenerTrabajadores = `
        SELECT id_trabajador, nombre, telefono, puesto, departamento, equipo, fecha_alta, fecha_baja
        FROM trabajador
        ORDER BY id_trabajador DESC
    `;
    const resultado = await query(obtenerTrabajadores);
    if (resultado.length === 0) {
        throw new Error("No hay trabajadores registrados");
    }
    return resultado;
};

export const obtenerCoordinadoresActivos = async () => {
    const obtenerCoordinadoresActivos = `
        SELECT id_trabajador, nombre
        FROM trabajador
        WHERE puesto = 'Coordinador' AND fecha_baja IS NULL
        ORDER BY nombre ASC
    `;

    const resultado = await query(obtenerCoordinadoresActivos);
    return resultado;
};