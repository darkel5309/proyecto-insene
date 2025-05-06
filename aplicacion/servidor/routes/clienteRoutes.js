import express from "express";
import { crear, obtenerPorId, obtenerTodos, actualizar, eliminar, } from "../controllers/clienteController.js";
import { validarDatosCliente } from "../middlewares/validarDatosCliente.js";
import { extraerIdTrabajador } from "../middlewares/extraerIdTrabajador.js";
import { registrarOperacion } from "../middlewares/registrarOperacion.js";
import * as clienteService from "../services/clienteService.js";

const router = express.Router();

router.post("/clientes", extraerIdTrabajador,
    registrarOperacion((req) => {
        const nombre = req.body.nombre || "Cliente desconocido";
        return `Ha creado el cliente: ${nombre}`;
    }),
    validarDatosCliente, crear
);

router.get("/clientes/:id", obtenerPorId);
router.get("/clientes", obtenerTodos);

router.put("/clientes/:id", extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const cliente = await clienteService.obtenerPorId(req.params.id);
        const nombre = cliente?.nombre || "Cliente desconocido";
        return `Ha actualizado el cliente: ${nombre}`;
    }),
    actualizar
);

router.delete("/clientes/:id", extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const cliente = await clienteService.obtenerPorId(req.params.id);
        const nombre = cliente?.nombre || "Cliente desconocido";
        return `Ha eliminado el cliente: ${nombre}`;
    }),
    eliminar
);

export default router;
