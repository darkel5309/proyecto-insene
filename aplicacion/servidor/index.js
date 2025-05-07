import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import sesionRoutes from "./routes/sesionRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import trabajadorRoutes from "./routes/trabajadorRoutes.js";
import fechaRoutes from "./routes/fechaRoutes.js";
import agendaRoutes from "./routes/agendaRoutes.js";
import registroRoutes from './routes/registroRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// rutas
app.use("/api", sesionRoutes);
app.use("/api", clienteRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", trabajadorRoutes);
app.use("/api", fechaRoutes);
app.use("/api", agendaRoutes);
app.use('/api', registroRoutes);

app.use((_err, _req, res, _next) => {
  res.status(500).send("Algo salió mal");
});

// puerto
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Servidor funcionando correctamente en el puerto ${PORT}.`);
});
