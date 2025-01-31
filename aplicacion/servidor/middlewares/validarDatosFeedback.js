// intermediario para las validaciones de los datos del feedback
const validarDatosFeedback = (req, res, next) => {
    const { idTrabajador, idVivienda, fechaVisita, horaVisita, tipoVisita, resultadoVisita } = req.body;

    // validaciones de campos obligatorios
    if (!idTrabajador || !idVivienda || !fechaVisita || !horaVisita || !tipoVisita || !resultadoVisita) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    // validaciones de campos que deben ser numeros positivos
    if (idTrabajador < 0 || isNaN(idTrabajador)) {
        return res.status(400).json({ error: "El ID Trabajador debe ser un número positivo" });
    }

    if (idVivienda < 0 || isNaN(idVivienda)) {
        return res.status(400).json({ error: "El Código del Formulario debe ser un número positivo" });
    }

    // si todo es correcto, pasa a la siguiente validacion
    next();
};

module.exports = validarDatosFeedback;