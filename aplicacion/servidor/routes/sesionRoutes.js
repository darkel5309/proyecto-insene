const express = require("express");
const router = express.Router();
const { iniciarSesion, verificarSesion, cerrarSesion } = require("../controllers/sesionController");
const validarDatosSesion = require("../middlewares/validarDatosSesion");

router.post("/iniciarSesion", validarDatosSesion, iniciarSesion);
router.get("/verificarSesion", verificarSesion);
router.post("/cerrarSesion", cerrarSesion);

module.exports = router;