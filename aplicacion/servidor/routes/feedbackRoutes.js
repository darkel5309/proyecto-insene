import express from "express";
import { crear } from "../controllers/feedbackController.js";
import { validarDatosFeedback } from "../middlewares/validarDatosFeedback.js";
import { extraerIdTrabajador } from "../middlewares/extraerIdTrabajador.js";
import { registrarOperacion } from "../middlewares/registrarOperacion.js";

const router = express.Router();

router.post("/feedbacks", extraerIdTrabajador,
    registrarOperacion(() => {
        return `Ha registrado una nueva visita`;
    }),
    validarDatosFeedback, crear
);

export default router;
