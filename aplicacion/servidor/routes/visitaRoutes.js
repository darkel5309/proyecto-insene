import express from "express";
import { registrarVisita } from "../controllers/visitaController.js";
import { validarDatosVisita } from "../middlewares/validarDatosVisita.js";

const router = express.Router();

router.post("/registrarVisita", validarDatosVisita, registrarVisita);

export default router;
