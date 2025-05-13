import express from "express";
import * as ventaController from "../controllers/ventaController.js";
import * as ventaService from "../services/ventaService.js";
import { extraerIdTrabajador } from "../middlewares/extraerIdTrabajador.js";
import { registrarOperacion } from "../middlewares/registrarOperacion.js";

const router = express.Router();

router.post("/ventas", extraerIdTrabajador,
    registrarOperacion((req) => {
        const idCliente = req.body.id_cliente;
        return `Ha registrado una venta al cliente con ID: ${idCliente}`;
    }),
    ventaController.crear
);

router.get("/ventas", ventaController.obtenerTodos);
router.get("/ventas/:id", ventaController.obtenerPorId);

router.put("/ventas/:id", extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const venta = await ventaService.obtenerPorId(req.params.id);
        return `Ha actualizado la venta con ID: ${venta?.id_venta}`;
    }),
    ventaController.actualizar
);

router.delete("/ventas/:id", extraerIdTrabajador,
    registrarOperacion(async (req) => {
        const venta = await ventaService.obtenerPorId(req.params.id);
        return `Ha eliminado la venta con ID: ${venta?.id_venta}`;
    }),
    ventaController.eliminar
);

export default router;
