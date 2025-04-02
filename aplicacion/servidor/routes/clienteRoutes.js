const express = require("express");
const router = express.Router();
const { registrarCliente, recuperarCliente, obtenerClientesSimplificado, obtenerTodosClientes, obtenerInformacionCliente, mostrarActualizaciones } = require("../controllers/clienteController");
const validarDatosCliente = require("../middlewares/validarDatosCliente");

router.post("/registrarCliente", validarDatosCliente, registrarCliente);
router.get("/recuperarCliente/:idCliente", recuperarCliente);
router.get("/obtenerClientesSimplificado", obtenerClientesSimplificado);
router.get('/obtenerTodosClientes', obtenerTodosClientes);
router.get('/obtenerInformacionCliente/:idCliente', obtenerInformacionCliente);
router.get('/mostrarActualizaciones/:idCliente', mostrarActualizaciones);

module.exports = router;