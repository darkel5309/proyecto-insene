import { query } from "../models/db.js";
import bcrypt from "bcrypt";

export const crear = async (trabajador) => {
    const {
        nombre,
        contrasena,
        telefono,
        puesto,
        departamento,
        equipo
    } = trabajador;

    await query("START TRANSACTION");

    try {
        const comprobarTelefono = `
            SELECT 1 
            FROM trabajador 
            WHERE telefono = ?
        `;
        const [telefonoExistente] = await query(comprobarTelefono, [telefono]);

        if (telefonoExistente) {
            throw new Error("El trabajador ya está registrado");
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        const sqlInsertarTrabajador = `
            INSERT INTO trabajador (
                nombre, 
                contrasena, 
                telefono, 
                puesto, 
                departamento, 
                equipo
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        const resultadoTrabajador = await query(sqlInsertarTrabajador, [
            nombre,
            contrasenaEncriptada,
            telefono,
            puesto,
            departamento,
            equipo
        ]);

        const idTrabajador = resultadoTrabajador.insertId;

        await query("COMMIT");

        return {
            message: "Trabajador registrado correctamente",
            idTrabajador,
            nombreTrabajador: nombre
        };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

export const obtenerPorId = async (id) => {
    const sqlObtenerTrabajador = `
        SELECT 
            id_trabajador, 
            nombre, 
            telefono, 
            puesto, 
            departamento, 
            equipo, 
            fecha_alta, 
            fecha_baja
        FROM trabajador
        WHERE id_trabajador = ?
    `;

    const [trabajador] = await query(sqlObtenerTrabajador, [id]);

    if (!trabajador) {
        throw new Error("Trabajador no encontrado");
    }

    return trabajador;
};

export const actualizar = async (id, trabajador) => {
    const {
        nombre,
        contrasena,
        telefono,
        puesto,
        departamento,
        equipo,
        fechaAlta,
        fechaBaja
    } = trabajador;

    const comprobarTrabajador = `
        SELECT 1 
        FROM trabajador 
        WHERE id_trabajador = ?
    `;
    const [existe] = await query(comprobarTrabajador, [id]);

    if (!existe) {
        throw new Error("El trabajador no existe");
    }

    let nuevaContrasena = null;
    if (contrasena && contrasena.trim() !== "") {
        nuevaContrasena = await bcrypt.hash(contrasena, 10);
    }

    const sqlActualizarTrabajador = `
        UPDATE trabajador 
        SET 
            nombre = ?, 
            contrasena = COALESCE(?, contrasena), 
            telefono = ?, 
            puesto = ?, 
            departamento = ?, 
            equipo = ?, 
            fecha_alta = ?, 
            fecha_baja = ? 
        WHERE id_trabajador = ?
    `;

    await query(sqlActualizarTrabajador, [
        nombre,
        nuevaContrasena,
        telefono,
        puesto,
        departamento,
        equipo,
        fechaAlta,
        fechaBaja,
        id
    ]);

    return { message: "Trabajador actualizado correctamente" };
};

export const eliminar = async (id) => {
    await query("START TRANSACTION");

    try {
        const comprobarTrabajador = `
            SELECT 1 
            FROM trabajador 
            WHERE id_trabajador = ?
        `;
        const [existe] = await query(comprobarTrabajador, [id]);

        if (!existe) {
            throw new Error("El trabajador no existe");
        }

        await query("DELETE FROM agenda WHERE id_trabajador = ?", [id]);
        await query("DELETE FROM instalacion WHERE id_trabajador = ?", [id]);
        await query("DELETE FROM venta WHERE id_trabajador = ?", [id]);
        await query("DELETE FROM visita WHERE id_trabajador = ?", [id]);
        await query("DELETE FROM trabajador WHERE id_trabajador = ?", [id]);

        await query("COMMIT");

        return {
            message: "Trabajador y todos los datos relacionados eliminados correctamente"
        };

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

export const obtenerTodos = async () => {
    const sqlObtenerTrabajadores = `
        SELECT 
            id_trabajador, 
            nombre, 
            telefono, 
            puesto, 
            departamento, 
            equipo, 
            fecha_alta, 
            fecha_baja
        FROM trabajador
        ORDER BY id_trabajador DESC
    `;

    const resultado = await query(sqlObtenerTrabajadores);

    if (resultado.length === 0) {
        throw new Error("No hay trabajadores registrados");
    }

    return resultado;
};

export const obtenerCoordinadoresActivos = async () => {
    const sqlObtenerCoordinadores = `
        SELECT id_trabajador, nombre
        FROM trabajador
        WHERE puesto = 'coordinador' AND fecha_baja IS NULL
        ORDER BY nombre ASC
    `;

    const resultado = await query(sqlObtenerCoordinadores);
    return resultado;
};