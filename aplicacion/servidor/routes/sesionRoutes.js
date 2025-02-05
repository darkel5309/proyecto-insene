const express = require("express");
const router = express.Router();
const { iniciarSesion } = require("../controllers/sesionController");
const validarDatosSesion = require("../middlewares/validarDatosSesion");

router.post("/iniciarSesion", validarDatosSesion, iniciarSesion);

module.exports = router;