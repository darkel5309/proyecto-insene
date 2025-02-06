// intermediario para las validaciones de los datos del formulario
const validarDatosContacto = (req, res, next) => {
    const { idTrabajador, nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, correoContacto} = req.body;

    // validaciones de campos obligatorios
    if (!idTrabajador || !nombreContacto || !direccionContacto || !localidadContacto || !provinciaContacto || !telefonoContacto || !correoContacto) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    // validaciones con expresiones regulares
    if (!/^\d{9}$/.test(telefonoContacto)) {
        return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
    }

    if (!/\S+@\S+\.\S+/.test(correoContacto)) {
        return res.status(400).json({ error: "El correo no es válido" });
    }

    // si todo es correcto, pasa a la siguiente validacion
    next();
};

module.exports = validarDatosContacto;