import express from "express";
import { crear } from "../controllers/visitaController.js";
import { validarDatosVisita } from "../middlewares/validarDatosVisita.js";

const router = express.Router();

router.post("/visitas", validarDatosVisita, crear);

export default router;
