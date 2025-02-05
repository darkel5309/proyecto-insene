// intermediario para las validaciones de los datos del login
const validarDatosSesion = (req, res, next) => {
    const { idTrabajador, contrasena } = req.body;

    // validaciones de campos obligatorios
    if (!idTrabajador || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // si todo es correcto, pasa a la siguiente validacion
    next();
};

module.exports = validarDatosSesion;