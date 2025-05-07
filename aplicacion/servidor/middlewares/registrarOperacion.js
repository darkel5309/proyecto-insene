import * as registroService from '../services/registroService.js';

export const registrarOperacion = (obtenerDescripcion) => {
  return async (req, _res, next) => {
    try {
      const idTrabajador = req.idTrabajador;
      const descripcion =
        typeof obtenerDescripcion === 'function'
          ? await obtenerDescripcion(req)
          : obtenerDescripcion;

      await registroService.crear(idTrabajador, descripcion);
      next();
    } catch (error) {
      console.error('Error en middleware de registro:', error);
      next();
    }
  };
};
