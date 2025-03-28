const express = require("express");
const router = express.Router();
const { registrarTrabajador, obtenerTrabajadoresSimplificado, obtenerTrabajador, actualizarTrabajador, eliminarTrabajador } = require("../controllers/trabajadorController");
const validarDatosTrabajador = require("../middlewares/validarDatosTrabajador");

router.post("/registrarTrabajador", validarDatosTrabajador, registrarTrabajador);
router.get("/obtenerTrabajadoresSimplificado", obtenerTrabajadoresSimplificado);
router.get("/trabajadores/:id_trabajador", obtenerTrabajador);
router.put("/trabajadores/:id_trabajador", actualizarTrabajador);
router.delete('/trabajadores/:id_trabajador', eliminarTrabajador);

module.exports = router;