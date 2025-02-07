// intermediario para las validaciones de los datos del formulario
const validarDatosVisita = (req, res, next) => {
    const { idTrabajador, nombreContacto, direccionContacto, localidadContacto, provinciaContacto, telefonoContacto, correoContacto, fechaVisita, horaVisita, numeroPersonas, numeroDecisores, importeLuz, importeGas } = req.body;

    // validaciones de campos obligatorios
    if (!idTrabajador || !nombreContacto || !direccionContacto || !localidadContacto || !provinciaContacto || !telefonoContacto || !correoContacto || !fechaVisita || !horaVisita || !numeroDecisores) {
        return res.status(400).json({ error: "Todos los campos marcados con * son obligatorios" });
    }

    // validaciones de campos que deben ser numeros positivos
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

module.exports = validarDatosVisita;