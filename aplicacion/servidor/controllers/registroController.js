import * as registroService from '../services/registroService.js';

export const obtenerTodos = async (_req, res) => {
  try {
    const registros = await registroService.obtenerTodos();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ mensaje: 'Error al obtener la información' });
  }
};