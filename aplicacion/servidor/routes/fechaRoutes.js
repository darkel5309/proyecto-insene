import express from "express";
import { obtenerPorId } from "../controllers/fechaController.js";

const router = express.Router();

router.get("/fechas/:id", obtenerPorId);

export default router;
