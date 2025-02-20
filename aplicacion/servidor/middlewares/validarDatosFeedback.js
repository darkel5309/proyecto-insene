// intermediario para las validaciones de los datos del feedback
const validarDatosFeedback = (req, res, next) => {
    const { idTrabajador, idCliente, fechaVisita, horaVisita, numeroPersonas, numeroDecisores, importeLuz, importeGas, resultadoVisita } = req.body;

    // validaciones de campos obligatorios
    if (!idTrabajador || !idCliente || !fechaVisita || !horaVisita || !resultadoVisita || !numeroDecisores || !resultadoVisita) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    // validaciones de campos que deben ser numeros positivos
    if (idTrabajador < 0 || isNaN(idTrabajador)) {
        return res.status(400).json({ error: "El ID de Trabajador debe ser un número positivo" });
    }

    if (idCliente < 0 || isNaN(idCliente)) {
        return res.status(400).json({ error: "El ID del cliente debe ser un número positivo" });
    }

    if (numeroPersonas < 0 || isNaN(numeroPersonas)) {
        return res.status(400).json({ error: "El número de personas debe ser un número positivo" });
    }

    if (numeroDecisores < 0 || isNaN(numeroDecisores)) {
        return res.status(400).json({ error: "El número de decisores debe ser un número positivo" });
    }

    if (importeLuz < 0 || isNaN(importeLuz)) {
        return res.status(400).json({ error: "El importe de luz debe ser un número positivo" });
    }

    if (importeGas < 0 || isNaN(importeGas)) {
        return res.status(400).json({ error: "El importe de gas debe ser un número positivo" });
    }

    // si todo es correcto, pasa a la siguiente validacion
    next();
};

module.exports = validarDatosFeedback;