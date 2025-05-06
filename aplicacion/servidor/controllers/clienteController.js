import * as clienteService from '../services/clienteService.js';

export const crear = async (req, res) => {
    try {
        const resultado = await clienteService.crear(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const clienteResultado = await clienteService.obtenerPorId(id);

        if (clienteResultado.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.status(200).json(clienteResultado);
    } catch {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const obtenerTodos = async (__req, res) => {
    try {
        const resultado = await clienteService.obtenerTodos();

        if (resultado.length === 0) {
            return res.status(404).json({ error: "No hay clientes registrados" });
        }

        res.status(200).json(resultado);
    } catch {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const actualizar = async (req, res) => {
    const { id } = req.params;
    const cliente = req.body;

    try {
        const resultado = await clienteService.actualizar(id, cliente);
        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const eliminar = async (req, res) => {
    const { id } = req.params;

    try {
        const clienteExistente = await clienteService.obtenerPorId(id);
        if (clienteExistente.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        const resultado = await clienteService.eliminar(id);

        res.status(200).json({ message: resultado.message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};