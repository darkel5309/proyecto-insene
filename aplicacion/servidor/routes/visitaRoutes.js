const express = require("express");
const router = express.Router();
const { registrarVisita } = require("../controllers/visitaController");
const validarDatosVisita = require("../middlewares/validarDatosVisita");

router.post("/registrarVisita", validarDatosVisita, registrarVisita);

module.exports = router;