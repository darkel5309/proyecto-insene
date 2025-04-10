import express from "express";
import { crear, obtenerPorId, obtenerTodos, actualizar, eliminar } from "../controllers/clienteController.js";
import { validarDatosCliente } from "../middlewares/validarDatosCliente.js";

const router = express.Router();

router.post("/clientes", validarDatosCliente, crear);
router.get('/clientes/:id', obtenerPorId);
router.get('/clientes', obtenerTodos);
router.put("/clientes/:id", actualizar);
router.delete('/clientes/:id', eliminar);

export default router;
