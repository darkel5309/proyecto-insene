import * as feedbackService from "../services/feedbackService.js";

export const crear = async (req, res) => {
    try {
        const resultado = await feedbackService.crear(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
