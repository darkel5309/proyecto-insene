import * as metricaService from '../services/metricaService.js';

export const obtenerTodasComercial = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const resultado = await metricaService.obtenerTodasComercial(fechaInicio, fechaFin);

        if (resultado.length === 0) {
            return res.status(404).json({ error: "No hay datos de métricas disponibles" });
        }
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener métricas de ventas" });
    }
};
