import express from "express";
import { iniciarSesion, verificarSesion, cerrarSesion } from "../controllers/sesionController.js";
import { validarDatosSesion } from "../middlewares/validarDatosSesion.js";

const router = express.Router();

router.post("/iniciarSesion", validarDatosSesion, iniciarSesion);
router.get("/verificarSesion", verificarSesion);
router.post("/cerrarSesion", cerrarSesion);

export default router;
