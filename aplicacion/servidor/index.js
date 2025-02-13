const express = require("express");
const cors = require("cors");
const sesionRoutes = require("./routes/sesionRoutes");
const contactoRoutes = require("./routes/contactoRoutes");
const visitaRoutes = require("./routes/visitaRoutes")
const feedbackRoutes = require("./routes/feedbackRoutes");
const trabajadorRoutes = require("./routes/trabajadorRoutes");

const app = express();

// permite que el frontend en localhost:5173 haga solicitudes al backend
app.use(cors({ origin: "http://localhost:5173" }));
// convierte las peticiones en formato .json
app.use(express.json());

app.use("/api", sesionRoutes);
app.use("/api", contactoRoutes);
app.use("/api", visitaRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", trabajadorRoutes);

// verificamos que el backend esta funcionando correctamente y escuchando en el puerto 3001
app.listen(5174, () => {
    console.log("Servidor funcionando correctamente en el puerto 5174.");
});