const { obtenerClientesService, obtenerClienteService } = require('../services/clienteService');

const obtenerClientes = async (__req, res) => {
    try {
        const resultado = await obtenerClientesService();

        if (resultado.length === 0) {
            return res.status(404).json({ error: "No hay clientes registrados" });
        }

        res.status(200).json(resultado);
    } catch (err) {
        console.error("Error al obtener clientes:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const obtenerCliente = async (req, res) => {
    const { idCliente } = req.params;
    try {
        const clienteResultado = await obtenerClienteService(idCliente);

        if (clienteResultado.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.status(200).json(clienteResultado[0]);
    } catch (err) {
        console.error("Error al obtener cliente:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { obtenerClientes, obtenerCliente };
