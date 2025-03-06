const express = require("express");
const router = express.Router();
const { obtenerClientes,obtenerCliente } = require("../controllers/clienteController");

router.get('/obtenerClientes', obtenerClientes);
router.get('/obtenerCliente/:idCliente', obtenerCliente);

module.exports = router;