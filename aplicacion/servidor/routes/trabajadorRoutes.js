import express from "express";
import { crear, obtenerPorId, actualizar, eliminar, obtenerTodos } from "../controllers/trabajadorController.js";
import { validarDatosTrabajador } from "../middlewares/validarDatosTrabajador.js";

const router = express.Router();

router.post("/trabajadores", validarDatosTrabajador, crear);
router.get("/trabajadores/:id", obtenerPorId);
router.put("/trabajadores/:id", actualizar);
router.delete("/trabajadores/:id", eliminar);
router.get("/trabajadores", obtenerTodos);

export default router;
