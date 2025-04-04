import express from "express";
import { registrarTrabajador, obtenerTrabajadoresSimplificado, obtenerTrabajador, actualizarTrabajador, eliminarTrabajador } from "../controllers/trabajadorController.js";
import { validarDatosTrabajador } from "../middlewares/validarDatosTrabajador.js";

const router = express.Router();

router.post("/registrarTrabajador", validarDatosTrabajador, registrarTrabajador);
router.get("/obtenerTrabajadoresSimplificado", obtenerTrabajadoresSimplificado);
router.get("/trabajadores/:id_trabajador", obtenerTrabajador);
router.put("/trabajadores/:id_trabajador", actualizarTrabajador);
router.delete("/trabajadores/:id_trabajador", eliminarTrabajador);

export default router;
