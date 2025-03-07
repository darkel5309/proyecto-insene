const { query } = require("../models/db");

const registrarCliente = async (cliente) => {
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

const recuperarCliente = async (idCliente) => {
    try {
        const recuperarDatosCliente = `SELECT c.id_cliente, c.nombre, c.telefono, c.correo, d.direccion, d.localidad, d.provincia 
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

const obtenerClientesSimplificado = async () => {
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

const obtenerTodosClientes = async () => {
    const obtenerClientes = `SELECT * FROM cliente`;
    const resultado = await query(obtenerClientes);
    return resultado;
};

const obtenerInformacionCliente = async (idCliente) => {
    const infoCliente= `
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

module.exports = { registrarCliente, recuperarCliente, obtenerClientesSimplificado, obtenerTodosClientes, obtenerInformacionCliente };
