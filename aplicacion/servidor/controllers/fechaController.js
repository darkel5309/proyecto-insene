import * as fechaService from '../services/fechaService.js';

export const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "El ID del cliente debe ser un número válido" });
        }

        const actualizaciones = await fechaService.obtenerPorId(id);

        if (actualizaciones.length === 0) {
            return res.status(200).json({ message: "No hay actualizaciones para este cliente", actualizaciones: [] });
        }

        res.status(200).json(actualizaciones);
    } catch {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};