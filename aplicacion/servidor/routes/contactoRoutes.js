const express = require("express");
const router = express.Router();
const { registrarContacto, obtenerContacto } = require("../controllers/contactoController");
const validarDatosContacto = require("../middlewares/validarDatosContacto");

router.post("/registrarCliente", validarDatosContacto, registrarContacto);
router.get('/obtenerContacto/:idCliente', obtenerContacto)

module.exports = router;