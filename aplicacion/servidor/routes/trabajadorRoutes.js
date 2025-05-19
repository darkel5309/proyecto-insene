import express from "express";
import { crear, obtenerPorId, actualizar, eliminar, obtenerTodos, obtenerCoordinadoresActivos } from "../controllers/trabajadorController.js";
import { validarDatosTrabajador } from "../middlewares/validarDatosTrabajador.js";
import { extraerIdTrabajador } from "../middlewares/extraerIdTrabajador.js";
import { registrarOperacion } from "../middlewares/registrarOperacion.js";
import * as trabajadorService from "../services/trabajadorService.js";

const router = express.Router();

router.post("/trabajadores", extraerIdTrabajador,
    registrarOperacion((req) => {
        const nombre = req.body.nombre;
        return `Ha creado el trabajador: ${nombre}`;
    }),
    validarDatosTrabajador, crear
);

router.get("/trabajadores/:id", obtenerPorId);
router.get("/trabajadores", obtenerTodos);

router.put("/trabajadores/:id", extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const trabajador = await trabajadorService.obtenerPorId(req.params.id);
        const nombre = trabajador?.nombre;
        return `Ha actualizado el trabajador: ${nombre}`;
    }),
    actualizar
);

router.delete("/trabajadores/:id", extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const trabajador = await trabajadorService.obtenerPorId(req.params.id);
        const nombre = trabajador?.nombre;
        return `Ha eliminado el trabajador: ${nombre}`;
    }),
    eliminar
);

router.get("/coordinadoresActivos", obtenerCoordinadoresActivos);

export default router;
