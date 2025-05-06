import express from "express";
import { crear } from "../controllers/visitaController.js";
import { validarDatosVisita } from "../middlewares/validarDatosVisita.js";
import { extraerIdTrabajador } from "../middlewares/extraerIdTrabajador.js";
import { registrarOperacion } from "../middlewares/registrarOperacion.js";

const router = express.Router();

router.post("/visitas", extraerIdTrabajador,
    registrarOperacion(() => {
        return `Ha creado una nueva visita`;
    }),
    validarDatosVisita, crear
);

export default router;
