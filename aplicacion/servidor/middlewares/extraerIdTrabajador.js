import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const extraerIdTrabajador = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }

    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.idTrabajador = decodificado.id;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};