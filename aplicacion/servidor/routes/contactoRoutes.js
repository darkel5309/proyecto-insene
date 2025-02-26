const express = require("express");
const router = express.Router();
const { registrarContacto, obtenerContacto, obtenerContactosSimplificado } = require("../controllers/contactoController");
const validarDatosContacto = require("../middlewares/validarDatosContacto");

router.post("/registrarContacto", validarDatosContacto, registrarContacto);
router.get("/obtenerContacto/:idContacto", obtenerContacto);
router.get("/obtenerContactosSimplificado", obtenerContactosSimplificado);

module.exports = router;