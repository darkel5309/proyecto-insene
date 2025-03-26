const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const sesionRoutes = require("./routes/sesionRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const visitaRoutes = require("./routes/visitaRoutes")
const feedbackRoutes = require("./routes/feedbackRoutes");
const trabajadorRoutes = require("./routes/trabajadorRoutes");

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
app.use("/api", visitaRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", trabajadorRoutes);

app.use((__err, __req, res, __next) => {
    res.status(500).send("Algo salió mal");
});

// puerto
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
    console.log(`Servidor funcionando correctamente en el puerto ${PORT}.`);
});