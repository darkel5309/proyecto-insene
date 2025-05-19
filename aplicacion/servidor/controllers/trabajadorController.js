import * as trabajadorService from '../services/trabajadorService.js';

export const crear = async (req, res) => {
    try {
        const trabajador = await trabajadorService.crear(req.body);
        res.status(200).json(trabajador);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const obtenerPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const trabajador = await trabajadorService.obtenerPorId(id);
        res.status(200).json(trabajador);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const actualizar = async (req, res) => {
    const { id } = req.params;
    const trabajador = req.body;

    try {
        const resultado = await trabajadorService.actualizar(id, trabajador);
        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const eliminar = async (req, res) => {
    const { id } = req.params;

    try {
        await trabajadorService.eliminar(id);

        res.status(200).json({ message: "Trabajador eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const obtenerTodos = async (_req, res) => {
    try {
        const trabajadores = await trabajadorService.obtenerTodos();
        res.status(200).json(trabajadores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const obtenerCoordinadoresActivos = async (_req, res) => {
    try {
        const coordinadores = await trabajadorService.obtenerCoordinadoresActivos();
        res.status(200).json(coordinadores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};