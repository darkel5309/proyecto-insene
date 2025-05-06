import express from 'express';
import { extraerIdTrabajador } from '../middlewares/extraerIdTrabajador.js';
import * as registroController from '../controllers/registroController.js';

const router = express.Router();

router.get('/registros', extraerIdTrabajador, registroController.obtenerTodos);

export default router;