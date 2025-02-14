const express = require("express");
const router = express.Router();
const { iniciarSesion, verificarSesion } = require("../controllers/sesionController");
const validarDatosSesion = require("../middlewares/validarDatosSesion");

router.post("/iniciarSesion", validarDatosSesion, iniciarSesion);
router.get("/verificarSesion", verificarSesion);

module.exports = router;