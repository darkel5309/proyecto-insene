export const validarDatosTrabajador = async (req, res, next) => {
    const { nombre, contrasena, telefono, rol, equipo, subequipo } = req.body;

    // obligatorios
    if (!nombre || !contrasena || !telefono || !rol || !equipo || !subequipo) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // teléfono
    if (!/^\d{9}$/.test(telefono)) {
        return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
    }
    
    next();
};
