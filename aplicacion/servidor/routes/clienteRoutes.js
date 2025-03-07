const express = require("express");
const router = express.Router();
const { registrarCliente, recuperarCliente, obtenerClientesSimplificado, obtenerTodosClientes, obtenerInformacionCliente } = require("../controllers/clienteController");
const validarDatosCliente = require("../middlewares/validarDatosCliente");

router.post("/registrarCliente", validarDatosCliente, registrarCliente);
router.get("/recuperarCliente/:idCliente", recuperarCliente);
router.get("/obtenerClientesSimplificado", obtenerClientesSimplificado);
router.get('/obtenerTodosClientes', obtenerTodosClientes);
router.get('/obtenerInformacionCliente/:idCliente', obtenerInformacionCliente);

module.exports = router;