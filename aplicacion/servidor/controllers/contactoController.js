const contactoService = require("../services/contactoService");

const registrarContacto = async (req, res) => {
    try {
        const resultado = await contactoService.registrarContacto(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerContacto = async (req, res) => {
    try {
        const contacto = await contactoService.obtenerContacto(req.params.idContacto);
        res.status(200).json(contacto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const obtenerContactosSimplificado = async (_req, res) => {
    try {
        const contactos = await contactoService.obtenerContactosSimplificado();
        res.status(200).json(contactos);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = { registrarContacto, obtenerContacto, obtenerContactosSimplificado };
