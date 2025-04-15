export const validarDatosAgenda = (req, res, next) => {
    const { titulo, fechaInicio, fechaFin, idTrabajador, idVivienda, motivo } = req.body;

    // Validación de campos obligatorios
    if (!titulo || !fechaInicio || !fechaFin || !idTrabajador || !idVivienda || !motivo) {
        return res.status(400).json({ error: 'Los campos titulo, fechaInicio, fechaFin, idTrabajador, idVivienda y motivo son obligatorios' });
    }

    // Validación de formato de fecha
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
        return res.status(400).json({ error: 'La fecha de inicio no puede ser mayor o igual que la fecha de fin' });
    }

    // Si todas las validaciones pasan, continuar al siguiente middleware
    next();
};
