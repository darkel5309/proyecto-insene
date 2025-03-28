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

const obtenerTrabajador = async (req, res) => {
    const { id_trabajador } = req.params;

    try {
        const trabajador = await trabajadorService.obtenerTrabajador(id_trabajador);
        res.status(200).json(trabajador);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const actualizarTrabajador = async (req, res) => {
    const { id_trabajador } = req.params;
    const trabajador = req.body;

    try {
        const resultado = await trabajadorService.actualizarTrabajador(id_trabajador, trabajador);
        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const eliminarTrabajador = async (req, res) => {
    const { id_trabajador } = req.params;

    try {
        await trabajadorService.eliminarTrabajador(id_trabajador);
        res.status(200).json({ message: "Trabajador eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registrarTrabajador, obtenerTrabajadoresSimplificado, obtenerTrabajador, actualizarTrabajador, eliminarTrabajador };
