import express from "express";
import { obtenerTodasComercial } from "../controllers/metricaController.js";

const router = express.Router();

router.get("/metricaComercial", obtenerTodasComercial);

export default router;
