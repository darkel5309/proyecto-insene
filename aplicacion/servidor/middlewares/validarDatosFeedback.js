const validarDatosFeedback = (req, res, next) => {
    const { idTrabajador, idContacto, fecha, hora, numeroPersonas, numeroDecisores, importeLuz, importeGas, resultado } = req.body;

    // obligatorios
    if (!idTrabajador || !idContacto || !fecha || !hora || !resultado || !numeroDecisores || !resultado) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    // numeros positivos
    if (numeroPersonas < 0 || isNaN(numeroPersonas)) {
        return res.status(400).json({ error: "El número de personas debe ser mayor a 0" });
    }

    if (numeroDecisores < 0 || isNaN(numeroDecisores)) {
        return res.status(400).json({ error: "El número de decisores debe ser mayor a 0" });
    }

    if (importeLuz < 0 || isNaN(importeLuz)) {
        return res.status(400).json({ error: "El importe de luz debe ser mayor a 0" });
    }

    if (importeGas < 0 || isNaN(importeGas)) {
        return res.status(400).json({ error: "El importe de gas debe ser mayor a 0" });
    }

    next();
};

module.exports = validarDatosFeedback;