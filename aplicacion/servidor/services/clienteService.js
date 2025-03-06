const { query } = require("../models/db");

const obtenerClientesService = async () => {
    const sql = `SELECT * FROM cliente`;
    const resultado = await query(sql);
    return resultado;
};

const obtenerClienteService = async (idCliente) => {
    const clienteSql = `
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
    const clienteResultado = await query(clienteSql, [idCliente]);
    return clienteResultado;
};

module.exports = { obtenerClientesService, obtenerClienteService };
