import * as ventaService from "../services/ventaService.js";

export const crear = async (req, res) => {
    try {
        const nuevaVenta = await ventaService.crear(req.body);
        res.status(200).json(nuevaVenta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const obtenerTodos = async (_req, res) => {
    try {
        const ventas = await ventaService.obtenerTodos();
        res.status(200).json(ventas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const venta = await ventaService.obtenerPorId(req.params.id);
        res.status(200).json(venta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const actualizar = async (req, res) => {
    try {
        const resultado = await ventaService.actualizar(req.params.id, req.body);
        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const eliminar = async (req, res) => {
    try {
        const resultado = await ventaService.eliminar(req.params.id);
        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
