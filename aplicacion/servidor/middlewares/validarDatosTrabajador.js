// intermediario para las validaciones de los datos del formulario
const validarDatosTrabajador = async (req, res, next) => {
    const { nombreTrabajador, contrasenaTrabajador, telefonoTrabajador, rolTrabajador } = req.body;

    // validaciones de campos obligatorios
    if (!nombreTrabajador || !contrasenaTrabajador || !telefonoTrabajador || !rolTrabajador) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // validacion para el telefono
    if (!/^\d{9}$/.test(telefonoTrabajador)) {
        return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
    }

    // Si todo es correcto, pasamos al siguiente middleware o controlador
    next();
};

module.exports = validarDatosTrabajador;
