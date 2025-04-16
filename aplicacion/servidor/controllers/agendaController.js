import * as agendaService from '../services/agendaService.js';

export const crear = async (req, res) => {
    try {
        const resultado = await agendaService.crear(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await agendaService.obtenerPorId(id);

        if (resultado.length === 0) {
            return res.status(404).json({ error: "Agenda no encontrada" });
        }

        res.status(200).json(resultado[0]);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const obtenerTodos = async (__req, res) => {
    try {
        const resultado = await agendaService.obtenerTodas();

        if (resultado.length === 0) {
            return res.status(404).json({ error: "No hay entradas en la agenda" });
        }

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const actualizar = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const resultado = await agendaService.actualizar(id, estado);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminar = async (req, res) => {
    const { id } = req.params;

    try {
        const agendaExistente = await agendaService.obtenerPorId(id);
        if (agendaExistente.length === 0) {
            return res.status(404).json({ error: "Agenda no encontrada" });
        }

        const resultado = await agendaService.eliminar(id);
        res.status(200).json({ message: resultado.message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
