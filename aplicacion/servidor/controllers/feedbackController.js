const feedbackService = require("../services/feedbackService");

const registrarFeedback = async (req, res) => {
    try {
        const resultado = await feedbackService.registrarFeedback(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registrarFeedback };

