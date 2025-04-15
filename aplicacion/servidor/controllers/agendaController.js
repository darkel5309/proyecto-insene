import * as agendaService from '../services/agendaService.js';

// Crear un nuevo evento en la agenda
export const crear = async (req, res) => {
    try {
        // Primero, se validan los datos a través del middleware
        const resultado = await agendaService.crear(req.body);
        res.status(201).json(resultado);  // Retorna el resultado con código 201 si se crea correctamente
    } catch (error) {
        res.status(400).json({ error: error.message });  // Si hay un error, se responde con un error 400
    }
};

// Obtener una agenda por su ID
export const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await agendaService.obtenerPorId(id);

        // Si no se encuentra la agenda
        if (resultado.length === 0) {
            return res.status(404).json({ error: "Agenda no encontrada" });
        }

        res.status(200).json(resultado[0]);  // Si se encuentra la agenda, se retorna con código 200
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });  // Si hay un error interno, se responde con código 500
    }
};

// Obtener todas las agendas
export const obtenerTodos = async (__req, res) => {
    try {
        const resultado = await agendaService.obtenerTodas();

        // Si no hay agendas
        if (resultado.length === 0) {
            return res.status(404).json({ error: "No hay entradas en la agenda" });
        }

        res.status(200).json(resultado);  // Si se encuentran agendas, se retorna con código 200
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });  // Si hay un error interno, se responde con código 500
    }
};

// Actualizar el estado de un evento en la agenda
export const actualizar = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const resultado = await agendaService.actualizar(id, estado);
        res.status(200).json(resultado);  // Si la actualización es exitosa, se responde con el resultado
    } catch (error) {
        res.status(500).json({ error: error.message });  // Si hay un error en la actualización, se responde con código 500
    }
};

// Eliminar un evento de la agenda
export const eliminar = async (req, res) => {
    const { id } = req.params;

    try {
        const agendaExistente = await agendaService.obtenerPorId(id);
        if (agendaExistente.length === 0) {
            return res.status(404).json({ error: "Agenda no encontrada" });  // Si no se encuentra la agenda, se responde con un error 404
        }

        const resultado = await agendaService.eliminar(id);
        res.status(200).json({ message: resultado.message });  // Si la eliminación es exitosa, se responde con un mensaje de éxito
    } catch (error) {
        res.status(500).json({ error: error.message });  // Si hay un error en la eliminación, se responde con un error 500
    }
};
