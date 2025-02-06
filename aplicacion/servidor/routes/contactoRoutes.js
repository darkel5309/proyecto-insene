const express = require("express");
const router = express.Router();
const { registrarContacto } = require("../controllers/contactoController");
const validarDatosContacto = require("../middlewares/validarDatosContacto");

router.post("/registrarCliente", validarDatosContacto, registrarContacto);

module.exports = router;