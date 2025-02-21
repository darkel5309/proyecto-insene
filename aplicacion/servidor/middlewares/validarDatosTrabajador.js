// intermediario para las validaciones de los datos del formulario
const validarDatosTrabajador = async (req, res, next) => {
    const { nombre, contrasena, telefono, rol, equipo, subequipo } = req.body;

    // validaciones de campos obligatorios
    if (!nombre || !contrasena || !telefono || !rol || !equipo || !subequipo) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // validacion para el telefono
    if (!/^\d{9}$/.test(telefono)) {
        return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
    }

    // Si todo es correcto, pasamos al siguiente middleware o controlador
    next();
};

module.exports = validarDatosTrabajador;
