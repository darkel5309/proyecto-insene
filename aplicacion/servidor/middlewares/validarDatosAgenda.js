export const validarDatosAgenda = (req, res, next) => {
    const { titulo, descripcion, fechaInicio, fechaFin, idTrabajador, idVivienda } = req.body;

    // obligatorios
    if (!titulo || !descripcion || !fechaInicio || !fechaFin || !idTrabajador || !idVivienda) {
        return res.status(400).json({ error: 'Todos los campos marcados con * son obligatorios.' });
    }

    // expresiones regulares
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
        return res.status(400).json({ error: 'La fecha de inicio no puede ser mayor o igual que la fecha de fin' });
    }

    next();
};
