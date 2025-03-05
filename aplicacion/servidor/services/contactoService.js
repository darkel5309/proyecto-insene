const { query } = require("../models/db");

const registrarContacto = async (contacto) => {
    const { idTrabajador, nombre, direccion, localidad, provincia, telefono, correo, modoCaptacion, observaciones } = contacto;
    
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
                throw new Error("Ya existe un contacto con ese teléfono");
            }
            if (existe.correo === correo) {
                throw new Error("Ya existe un contacto con ese correo");
            }
        }
        
        const insertarContacto = 'INSERT INTO cliente (nombre, telefono, correo, modo_captacion, observaciones_cliente) VALUES (?,?,?,?,?)';
        const resultadoContacto = await query(insertarContacto, [nombre, telefono, correo, modoCaptacion, observaciones]);
        const idContacto = resultadoContacto.insertId;
        
        const insertarDomicilio = 'INSERT INTO domicilio (direccion, localidad, provincia, id_cliente) VALUES (?, ?, ?, ?)';
        await query(insertarDomicilio, [direccion, localidad, provincia, idContacto]);
        
        await query('COMMIT');
        return { message: "Contacto registrado correctamente", idContacto };
    } catch (err) {
        await query('ROLLBACK');
        throw err;
    }
};

const obtenerContacto = async (idContacto) => {
    try {
        const obtenerDatosContacto = `SELECT c.id_cliente, c.nombre, c.telefono, c.correo, c.observaciones_cliente, d.direccion, d.localidad, d.provincia 
                                      FROM cliente c
                                      LEFT JOIN domicilio d ON c.id_cliente = d.id_cliente
                                      WHERE c.id_cliente = ?`;
        
        const resultado = await query(obtenerDatosContacto, [idContacto]);
        if (resultado.length === 0) {
            throw new Error("Contacto no encontrado");
        }
        return resultado[0];
    } catch (err) {
        throw err;
    }
};

const obtenerContactosSimplificado = async () => {
    try {
        const obtenerContactos = 'SELECT id_cliente, nombre, telefono FROM cliente';
        const resultado = await query(obtenerContactos);
        if (resultado.length === 0) {
            throw new Error("No hay contactos registrados");
        }
        return resultado;
    } catch (err) {
        throw err;
    }
};

module.exports = { registrarContacto, obtenerContacto, obtenerContactosSimplificado };
