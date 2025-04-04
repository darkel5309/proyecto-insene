import express from "express";
import { registrarCliente, recuperarCliente, obtenerClientesSimplificado, obtenerTodosClientes, obtenerInformacionCliente, mostrarActualizaciones } from "../controllers/clienteController.js";
import { validarDatosCliente } from "../middlewares/validarDatosCliente.js";

const router = express.Router();

router.post("/registrarCliente", validarDatosCliente, registrarCliente);
router.get("/recuperarCliente/:idCliente", recuperarCliente);
router.get("/obtenerClientesSimplificado", obtenerClientesSimplificado);
router.get('/obtenerTodosClientes', obtenerTodosClientes);
router.get('/obtenerInformacionCliente/:idCliente', obtenerInformacionCliente);
router.get('/mostrarActualizaciones/:idCliente', mostrarActualizaciones);

export default router;
