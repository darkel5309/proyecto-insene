import * as visitaService from "../services/visitaService.js";

export const registrarVisita = async (req, res) => {
    try {
        const visitaData = req.body;
        const { message, idVisita } = await visitaService.registrarVisita(visitaData);
        res.status(200).json({
            message: message,
            idVisita: idVisita,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
