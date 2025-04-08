import * as clienteService from '../services/clienteService.js';

export const registrarCliente = async (req, res) => {
    try {
        const resultado = await clienteService.registrarCliente(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const recuperarCliente = async (req, res) => {
    try {
        const cliente = await clienteService.recuperarCliente(req.params.idCliente);
        res.status(200).json(cliente);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const obtenerClientesSimplificado = async (_req, res) => {
    try {
        const clientes = await clienteService.obtenerClientesSimplificado();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const obtenerTodosClientes = async (__req, res) => {
    try {
        const resultado = await clienteService.obtenerTodosClientes();

        if (resultado.length === 0) {
            return res.status(404).json({ error: "No hay clientes registrados" });
        }

        res.status(200).json(resultado);
    } catch {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const obtenerInformacionCliente = async (req, res) => {
    const { idCliente } = req.params;
    try {
        const clienteResultado = await clienteService.obtenerInformacionCliente(idCliente);

        if (clienteResultado.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.status(200).json(clienteResultado[0]);
    } catch {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const mostrarActualizaciones = async (req, res) => {
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
    } catch {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
