const express = require("express");
const router = express.Router();
const { registrarTrabajador } = require("../controllers/trabajadorController");
const validarDatosTrabajador = require("../middlewares/validarDatosTrabajador");

router.post("/registrarTrabajador", validarDatosTrabajador, registrarTrabajador);

module.exports = router;