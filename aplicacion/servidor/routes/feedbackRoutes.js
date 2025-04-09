import express from "express";
import { crear } from "../controllers/feedbackController.js";
import { validarDatosFeedback } from "../middlewares/validarDatosFeedback.js";

const router = express.Router();

router.post("/feedbacks", validarDatosFeedback, crear);

export default router;
