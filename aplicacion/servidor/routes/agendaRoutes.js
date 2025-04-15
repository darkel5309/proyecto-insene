import express from "express";
import { crear, obtenerPorId, obtenerTodos, actualizar, eliminar } from "../controllers/agendaController.js";
import { validarDatosAgenda } from "../middlewares/validarDatosAgenda.js";

const router = express.Router();

router.post("/agenda", validarDatosAgenda, crear);
router.get('/agenda/:id', obtenerPorId);
router.get('/agenda', obtenerTodos);
router.put("/agenda/:id", actualizar);
router.delete('/agenda/:id', eliminar);

export default router;
