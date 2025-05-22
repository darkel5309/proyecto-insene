export const validarDatosVenta = async (req, res, next) => {
    const { id_trabajador, id_cliente, estado_venta } = req.body;

    // obligatorios
    if (!id_trabajador || !id_cliente || !estado_venta) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    next();
};
