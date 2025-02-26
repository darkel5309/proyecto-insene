const validarDatosSesion = (req, res, next) => {
    const { idTrabajador, contrasena } = req.body;

    // obligatorios
    if (!idTrabajador || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    next();
};

module.exports = validarDatosSesion;