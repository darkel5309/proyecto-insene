import express from "express";
import { crear, obtenerPorId, obtenerTodos, actualizar, eliminar } from "../controllers/agendaController.js";
import { validarDatosAgenda } from "../middlewares/validarDatosAgenda.js";
import { extraerIdTrabajador } from "../middlewares/extraerIdTrabajador.js";
import { registrarOperacion } from "../middlewares/registrarOperacion.js";
import * as agendaService from "../services/agendaService.js";

const router = express.Router();

router.post("/agenda", extraerIdTrabajador,
    registrarOperacion((req) => {
        const titulo = req.body.titulo;
        return `Ha registrado el evento: ${titulo}`;
    }),
    validarDatosAgenda, crear
);

router.get('/agenda/:id', obtenerPorId);
router.get('/agenda', obtenerTodos);

router.put("/agenda/:id", extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const evento = await agendaService.obtenerPorId(req.params.id);
        const titulo = evento?.titulo;
        return `Ha actualizado el evento: ${titulo}`;
    }),
    actualizar
);

router.delete('/agenda/:id', extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const evento = await agendaService.obtenerPorId(req.params.id);
        const titulo = evento?.titulo;
        return `Ha eliminado el evento: ${titulo}`;
    }),
    eliminar
);

export default router;
