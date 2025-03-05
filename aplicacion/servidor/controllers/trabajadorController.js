const trabajadorService = require('../services/trabajadorService');

const registrarTrabajador = async (req, res) => {
    try {
        const trabajador = await trabajadorService.registrarTrabajador(req.body);
        res.status(200).json(trabajador);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerTrabajadoresSimplificado = async (_req, res) => {
    try {
        const trabajadores = await trabajadorService.obtenerTrabajadoresSimplificado();
        res.status(200).json(trabajadores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registrarTrabajador, obtenerTrabajadoresSimplificado };
