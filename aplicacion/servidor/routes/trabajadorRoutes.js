const express = require("express");
const router = express.Router();
const { registrarTrabajador, obtenerTrabajadoresSimplificado } = require("../controllers/trabajadorController");
const validarDatosTrabajador = require("../middlewares/validarDatosTrabajador");

router.post("/registrarTrabajador", validarDatosTrabajador, registrarTrabajador);
router.get("/obtenerTrabajadoresSimplificado", obtenerTrabajadoresSimplificado);

module.exports = router;