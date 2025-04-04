import express from "express";
import { registrarFeedback } from "../controllers/feedbackController.js";
import { validarDatosFeedback } from "../middlewares/validarDatosFeedback.js";

const router = express.Router();

router.post("/registrarFeedback", validarDatosFeedback, registrarFeedback);

export default router;
