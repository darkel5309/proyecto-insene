const clienteService = require('../services/clienteService');

const registrarCliente = async (req, res) => {
    try {
        const resultado = await clienteService.registrarCliente(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const recuperarCliente = async (req, res) => {
    try {
        const cliente = await clienteService.recuperarCliente(req.params.idCliente);
        res.status(200).json(cliente);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const obtenerClientesSimplificado = async (_req, res) => {
    try {
        const clientes = await clienteService.obtenerClientesSimplificado();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const obtenerTodosClientes = async (__req, res) => {
    try {
        const resultado = await clienteService.obtenerTodosClientes();

        if (resultado.length === 0) {
            return res.status(404).json({ error: "No hay clientes registrados" });
        }

        res.status(200).json(resultado);
    } catch (err) {
        console.error("Error al obtener clientes:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const obtenerInformacionCliente = async (req, res) => {
    const { idCliente } = req.params;
    try {
        const clienteResultado = await clienteService.obtenerInformacionCliente(idCliente);

        if (clienteResultado.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.status(200).json(clienteResultado[0]);
    } catch (err) {
        console.error("Error al obtener cliente:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const mostrarActualizaciones = async (req, res) => {
    const { idCliente } = req.params;
    try {
        if (!idCliente || isNaN(idCliente)) {
            return res.status(400).json({ error: "El ID del cliente debe ser un número válido" });
        }

        const actualizaciones = await clienteService.mostrarActualizaciones(idCliente);

        if (actualizaciones.length === 0) {
            return res.status(200).json({ message: "No hay actualizaciones para este cliente", actualizaciones: [] });
        }

        res.status(200).json(actualizaciones);
    } catch (err) {
        console.error("Error al obtener actualizaciones del cliente:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { registrarCliente, recuperarCliente, obtenerClientesSimplificado, obtenerTodosClientes, obtenerInformacionCliente, mostrarActualizaciones };
