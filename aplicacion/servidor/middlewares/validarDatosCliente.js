export const validarDatosCliente = async (req, res, next) => {
    const { idTrabajador, nombre, direccion, localidad, provincia, telefono, correo } = req.body;

    // obligatorios
    if (!idTrabajador || !nombre || !direccion || !localidad || !provincia || !telefono || !correo) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    // expresiones regulares
    if (!/^\d{9}$/.test(telefono)) {
        return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
        return res.status(400).json({ error: "El correo no es válido" });
    }

    next();
};
